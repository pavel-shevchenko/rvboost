import {
  Collection,
  EntityRepository,
  FilterQuery,
  IdentifiedReference,
  NotFoundError,
  QueryOrderMap,
  Reference,
  ReferenceType,
  RequiredEntityData,
  wrap
} from '@mikro-orm/core';
import {
  AnyEntity,
  AutoPath,
  EntityData,
  ExcludeFunctions
} from '@mikro-orm/core/typings';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Type } from '@nestjs/common';

import { AbstractFactory } from '../abstract.factory';
import { ENTITY_FILTERS, EntityFilters, QueryParser } from '../providers';
import { FACTORY } from '../symbols';
import { FilterQueryParam, OrderQueryParam, RelationPath } from '../types';
import { MikroCrudService } from './mikro-crud-service.interface';
import { MikroCrudServiceFactoryOptions } from './mikro-crud-service-factory-options.interface';

export class MikroCrudServiceFactory<
  Entity extends AnyEntity<Entity> = any,
  CreateDto extends RequiredEntityData<Entity> = RequiredEntityData<Entity>,
  UpdateDto extends EntityData<Entity> = EntityData<Entity>
> extends AbstractFactory<MikroCrudService<Entity, CreateDto, UpdateDto>> {
  readonly options: MikroCrudServiceFactoryOptions<Entity, CreateDto, UpdateDto>;
  readonly product: Type<MikroCrudService<Entity, CreateDto, UpdateDto>>;

  constructor(
    options: MikroCrudServiceFactoryOptions<Entity, CreateDto, UpdateDto>
  ) {
    super();
    this.options = this.standardizeOptions(options);
    this.product = this.create();
    Reflect.defineMetadata(FACTORY, this, this.product);
  }

  protected standardizeOptions(
    options: MikroCrudServiceFactoryOptions<Entity, CreateDto, UpdateDto>
  ) {
    return options;
  }

  protected create(): Type<MikroCrudService<Entity, CreateDto, UpdateDto>> {
    const { entity: entityClass } = this.options;

    class Service implements MikroCrudService<Entity, CreateDto, UpdateDto> {
      @InjectRepository(entityClass)
      readonly repository!: EntityRepository<Entity>;
      readonly collectionFields: ExcludeFunctions<Entity, any>[] =
        new entityClass()
          // @ts-ignore
          .__helper!.__meta.relations.filter(
            ({ reference, hidden }) =>
              !hidden &&
              (reference == ReferenceType.ONE_TO_MANY ||
                reference == ReferenceType.MANY_TO_MANY)
          )
          .map(({ name }) => name as ExcludeFunctions<Entity, any>);

      @Inject()
      readonly parser!: QueryParser<Entity>;

      @Inject(ENTITY_FILTERS)
      readonly filters!: EntityFilters;

      async list({
        limit,
        offset,
        filter = {} as FilterQuery<Entity>,
        filterQueryParam = [],
        order = {} as QueryOrderMap<Entity>,
        orderQueryParam = [],
        expand = [],
        refresh,
        user
      }: {
        limit?: number;
        offset?: number;
        filter?: FilterQuery<Entity>;
        filterQueryParam?: FilterQueryParam<Entity>[];
        order?: QueryOrderMap<Entity>;
        orderQueryParam?: OrderQueryParam<Entity>[];
        expand?: RelationPath<Entity>[];
        refresh?: boolean;
        user?: any;
      }) {
        const filterQueryParamParsed = await this.parser.parseFilter({
          filterQueryParam
        });
        const [results, total] = await this.repository.findAndCount(
          { $and: [filter, filterQueryParamParsed] } as FilterQuery<Entity>,
          {
            limit,
            offset,
            orderBy: {
              ...order,
              ...(await this.parser.parseOrder({ orderQueryParam }))
            },
            filters: this.filters({ user }),
            populate: [...this.collectionFields, ...expand] as AutoPath<
              Entity,
              RelationPath<Entity>
            >[],
            refresh
          }
        );
        return { total, results };
      }

      async create({ data }: { data: CreateDto; user?: any }): Promise<Entity> {
        const entity = this.repository.create(data);
        this.repository.persist(entity);
        return entity;
      }

      async retrieve({
        conditions = {} as FilterQuery<Entity>,
        expand = [],
        refresh,
        user
      }: {
        conditions: FilterQuery<Entity>;
        expand?: RelationPath<Entity>[];
        refresh?: boolean;
        user?: any;
      }): Promise<Entity> {
        return await this.repository.findOneOrFail(conditions, {
          filters: this.filters({ user }),
          populate: [...this.collectionFields, ...expand] as AutoPath<
            Entity,
            RelationPath<Entity>
          >[],
          refresh
        });
      }

      async replace({
        entity,
        data
      }: {
        entity: Entity;
        data: CreateDto;
        user?: any;
      }): Promise<Entity> {
        return wrap(entity).assign(data, { merge: true });
      }

      async update({
        entity,
        data
      }: {
        entity: Entity;
        data: UpdateDto;
        user?: any;
      }): Promise<Entity> {
        return wrap(entity).assign(data, { merge: true });
      }

      async destroy({ entity }: { entity: Entity; user?: any }): Promise<Entity> {
        this.repository.remove(entity);
        return entity;
      }

      async exists({
        conditions,
        user
      }: {
        conditions: FilterQuery<Entity>;
        user?: any;
      }): Promise<boolean> {
        try {
          await this.retrieve({ conditions, user });
          return true;
        } catch (error) {
          if (error instanceof NotFoundError) return false;
          else throw error;
        }
      }

      async save(): Promise<void> {
        await this.repository.flush();
      }

      /**
       * Mark only the specified relations as populated to shape the JSON response.
       * @param args
       */
      async adjustPopulationStatus({
        entity: rootEntity,
        expand = []
      }: {
        entity: Entity;
        expand?: RelationPath<Entity>[];
      }): Promise<Entity> {
        function digIn(entity: AnyEntity, relationNode?: RelationPath<Entity>) {
          const entityMeta = entity.__helper!.__meta;
          entityMeta.relations.forEach(({ name }) => {
            const value = entity[name];
            const relationPath = (
              relationNode ? `${relationNode}.${name}` : name
            ) as RelationPath<Entity>;
            const shouldPopulate = expand.some((path) =>
              path.startsWith(relationPath)
            );

            // It is possible for a collection/reference/entity which need to be marked as populated to appear
            // multiple times in different places in part of which they need to be marked as unpopulated, so it
            // is neccesary to call `.populated(true)` to ensure they are not be marked as unpopulated in deeper
            // places unexpectedly.
            if (value instanceof Collection) {
              const collection: Collection<AnyEntity> = value;
              if (!shouldPopulate) {
                collection.populated(false);
              } else {
                for (const entity of collection) digIn(entity, relationPath);
                collection.populated(true);
              }
            } else if (value instanceof Reference) {
              const reference: IdentifiedReference<AnyEntity> = value;
              if (!shouldPopulate) {
                reference.populated(false);
              } else {
                digIn(reference.getEntity(), relationPath);
                reference.populated(true);
              }
            } else {
              const entity: AnyEntity<unknown> = value;
              const wrappedEntity = wrap(entity);
              if (!shouldPopulate) {
                wrappedEntity.populated(false);
              } else {
                digIn(entity, relationPath);
                wrappedEntity.populated(true);
              }
            }
          });
          return entity;
        }

        return digIn(rootEntity) as typeof rootEntity;
      }
    }

    return Service;
  }
}

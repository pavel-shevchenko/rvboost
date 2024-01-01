import {
  AnyEntity,
  EntityData,
  FilterQuery,
  RequiredEntityData
} from '@mikro-orm/core';
import {
  Body,
  Delete,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Type,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse
} from '@nestjs/swagger';

import { AbstractFactory, MethodNames } from '../abstract.factory';
import {
  QUERY_DEFAULT_LIMIT,
  QUERY_DEFAULT_OFFSET,
  QUERY_URL_PATH
} from '../constants';
import { ReqUser } from '../decorators';
import { QueryDto, QueryFactory, QueryParams } from '../dto';
import { MikroCrudService, MikroCrudServiceFactory } from '../service';
import { FACTORY, TS_TYPE } from '../symbols';
import { ActionName, LookupableField, PkType, RelationPath } from '../types';
import { MikroCrudController } from './mikro-crud-controller.interface';
import { MikroCrudControllerFactoryOptions } from './mikro-crud-controller-factory-options.interface';

export type ServiceGenerics<Service> = Service extends MikroCrudService<
  infer Entity,
  infer CreateDto,
  infer UpdateDto
>
  ? {
      Entity: Entity;
      CreateDto: CreateDto;
      UpdateDto: UpdateDto;
    }
  : never;

export class MikroCrudControllerFactory<
  Service extends MikroCrudService<
    Entity,
    CreateDto,
    UpdateDto
  > = MikroCrudService<any, any, any>,
  Entity extends AnyEntity<Entity> = ServiceGenerics<Service>['Entity'],
  CreateDto extends
    RequiredEntityData<Entity> = ServiceGenerics<Service>['CreateDto'],
  UpdateDto extends EntityData<Entity> = ServiceGenerics<Service>['UpdateDto'],
  LookupField extends LookupableField<Entity> = LookupableField<Entity>
> extends AbstractFactory<
  MikroCrudController<Entity, CreateDto, UpdateDto, LookupField, Service>
> {
  readonly serviceFactory;
  readonly options: MikroCrudControllerFactoryOptions<
    Entity,
    CreateDto,
    UpdateDto,
    LookupField,
    Service
  >;
  readonly product: Type<
    MikroCrudController<Entity, CreateDto, UpdateDto, LookupField, Service>
  >;
  readonly queryFactory: QueryFactory<Entity>;

  constructor(
    options: MikroCrudControllerFactoryOptions<
      Entity,
      CreateDto,
      UpdateDto,
      LookupField,
      Service
    >
  ) {
    super();

    this.serviceFactory = Reflect.getMetadata(
      FACTORY,
      options.service
    ) as MikroCrudServiceFactory<Entity, CreateDto, UpdateDto>;

    this.options = this.standardizeOptions(options);
    this.queryFactory = new QueryFactory<Entity>(this.options.query ?? {}, {
      service: this.options.service
    });
    this.product = this.create();
    Reflect.defineMetadata(FACTORY, this, this.product);
  }

  protected standardizeOptions(
    options: MikroCrudControllerFactoryOptions<
      Entity,
      CreateDto,
      UpdateDto,
      LookupField,
      Service
    >
  ) {
    const {
      lookup,
      requestUser = { decorator: ReqUser() },
      validationPipeOptions = {}
    } = options;

    return {
      ...options,
      lookup: {
        ...lookup,
        type:
          lookup.type ??
          ((Reflect.getMetadata(
            TS_TYPE,
            this.serviceFactory.options.entity.prototype,
            lookup.field
          ) == Number
            ? 'number'
            : 'uuid') as PkType),
        name: lookup.name ?? 'id'
      },
      requestUser: {
        ...requestUser,
        type: requestUser.type ?? Object
      },
      validationPipeOptions: {
        ...validationPipeOptions,
        transform: true,
        transformOptions: {
          ...validationPipeOptions.transformOptions,
          exposeDefaultValues: true
        }
      }
    };
  }

  protected create(): Type<
    MikroCrudController<Entity, CreateDto, UpdateDto, LookupField, Service>
  > {
    const {
      service,
      lookup: { field: lookupField, type: lookupType, name: lookupParamName },
      requestUser: { type: reqUserType, decorator: reqUserDecorator }
    } = this.options;
    const { queryParams: queryParamsClass, queryDto: queryDtoClass } =
      this.queryFactory.products;

    const {
      dto: { create: createDtoClass, update: updateDtoClass }
    } = this.serviceFactory.options;
    const path = `:${lookupParamName}`;
    const { entity: entityClass } = this.serviceFactory.options;
    const ReqUser = reqUserDecorator;
    const lookupInternalType = lookupType == 'number' ? Number : String;
    const Lookup = Param(
      lookupParamName,
      ...(lookupType == 'number'
        ? [ParseIntPipe]
        : lookupType == 'uuid'
          ? [ParseUUIDPipe]
          : [])
    );

    @UsePipes(new ValidationPipe(this.options.validationPipeOptions))
    class Controller
      implements
        MikroCrudController<Entity, CreateDto, UpdateDto, LookupField, Service>
    {
      @Inject(service)
      readonly service!: Service;

      readonly lookupField = lookupField;

      @ApiOperation({
        summary: `Query ${entityClass.name} with filtering, relations and pagination.`
      })
      @ApiOkResponse({ type: entityClass, isArray: true })
      @HttpCode(200)
      @Get(QUERY_URL_PATH)
      async query(
        // @ts-ignore: Maybe needs `typeof`
        @Query() queryParam: queryParamsClass,
        // @ts-ignore: Maybe needs `typeof`
        @Body() queryDto: queryDtoClass,
        // @ts-ignore: Maybe needs `typeof`
        @ReqUser user: reqUserType
      ): Promise<{ total: number; data: Array<Entity> }> {
        const { filterQueryParam, orderQueryParam } =
          this.standardizeQueryArrayParams(queryParam);
        const { total, results } = await this.service.query({
          limit: queryParam?.limit || queryDto?.limit || QUERY_DEFAULT_LIMIT,
          offset: queryParam?.offset || queryDto?.offset || QUERY_DEFAULT_OFFSET,
          filter: queryDto?.filter,
          filterQueryParam,
          order: queryDto?.order,
          orderQueryParam,
          expand: queryDto?.expand || queryParam?.expand,
          user
        });
        await Promise.all(
          results.map(
            async (entity) =>
              await this.service.adjustPopulationStatus({
                entity,
                expand: queryDto?.expand || queryParam?.expand
              })
          )
        );
        await this.service.save();

        return { total, data: results };
      }

      standardizeQueryArrayParams(queryArgs: typeof queryParamsClass) {
        let filterQueryParam = [];
        if (Array.isArray(queryArgs['filter[]']))
          filterQueryParam = queryArgs['filter[]'];
        else if (queryArgs['filter[]'] && String(queryArgs['filter[]']).length)
          filterQueryParam = [queryArgs['filter[]']];
        let orderQueryParam = [];
        if (Array.isArray(queryArgs['order[]']))
          orderQueryParam = queryArgs['order[]'];
        else if (queryArgs['order[]'] && String(queryArgs['order[]']).length)
          orderQueryParam = [queryArgs['order[]']];

        return { filterQueryParam, orderQueryParam };
      }

      @ApiOperation({
        summary: `Create ${entityClass.name}`
      })
      @ApiCreatedResponse({ type: entityClass })
      @Post()
      async create(
        // @ts-ignore: Maybe needs `typeof`
        @Query() queryParam: queryParamsClass,
        // @ts-ignore: Maybe needs `typeof`
        @Body() data: createDtoClass,
        // @ts-ignore: Maybe needs `typeof`
        @ReqUser user: reqUserType
      ): Promise<unknown> {
        let entity = await this.service.create({ data, user });
        await this.service.save();
        entity = await this.service.retrieve({
          conditions: this.getPrimaryKey(entity) as FilterQuery<Entity>,
          expand: queryParam.expand as RelationPath<Entity>[],
          refresh: true,
          user
        });
        await this.service.adjustPopulationStatus({
          entity,
          expand: queryParam.expand as RelationPath<Entity>[]
        });
        await this.service.save();
        return entity;
      }

      @ApiOperation({
        summary: `Retrieve ${entityClass.name} by id`
      })
      @ApiOkResponse({ type: entityClass })
      @Get(path)
      async retrieve(
        // @ts-ignore: Maybe needs `typeof`
        @Lookup lookup: lookupInternalType,
        // @ts-ignore: Maybe needs `typeof`
        @Query() queryParam: queryParamsClass,
        // @ts-ignore: Maybe needs `typeof`
        @ReqUser user: reqUserType
      ): Promise<unknown> {
        const conditions = {
          [this.lookupField]: lookup
        } as FilterQuery<Entity>;
        const entity = await this.service
          .retrieve({
            conditions,
            expand: queryParam.expand as RelationPath<Entity>[],
            user
          })
          .catch(() => {
            throw new NotFoundException();
          });
        await this.service.adjustPopulationStatus({
          entity,
          expand: queryParam.expand as RelationPath<Entity>[]
        });
        await this.service.save();
        return entity;
      }

      @ApiOperation({
        summary: `Replace whole ${entityClass.name} with new data`
      })
      @ApiOkResponse({ type: entityClass })
      @Put(path)
      async replace(
        // @ts-ignore: Maybe needs `typeof`
        @Lookup lookup: lookupInternalType,
        // @ts-ignore: Maybe needs `typeof`
        @Query() queryParam: queryParamsClass,
        // @ts-ignore: Maybe needs `typeof`
        @Body() data: createDtoClass,
        // @ts-ignore: Maybe needs `typeof`
        @ReqUser user: reqUserType
      ): Promise<unknown> {
        const conditions = {
          [this.lookupField]: lookup
        } as FilterQuery<Entity>;
        let entity = await this.service
          .retrieve({
            conditions,
            expand: queryParam.expand as RelationPath<Entity>[],
            user
          })
          .catch(() => {
            throw new NotFoundException();
          });
        await this.service.replace({ entity, data, user });
        await this.service.save();
        entity = await this.service.retrieve({
          conditions: this.getPrimaryKey(entity) as FilterQuery<Entity>,
          expand: queryParam.expand as RelationPath<Entity>[],
          refresh: true,
          user
        });
        await this.service.adjustPopulationStatus({
          entity,
          expand: queryParam.expand as RelationPath<Entity>[]
        });
        await this.service.save();
        return entity;
      }

      @ApiOperation({
        summary: `Partially update ${entityClass.name}`
      })
      @ApiOkResponse({ type: entityClass })
      @Patch(path)
      async update(
        // @ts-ignore: Maybe needs `typeof`
        @Lookup lookup: lookupInternalType,
        // @ts-ignore: Maybe needs `typeof`
        @Query() queryParam: queryParamsClass,
        // @ts-ignore: Maybe needs `typeof`
        @Body() data: updateDtoClass,
        // @ts-ignore: Maybe needs `typeof`
        @ReqUser user: reqUserType
      ): Promise<unknown> {
        const conditions = {
          [this.lookupField]: lookup
        } as FilterQuery<Entity>;
        let entity = await this.service
          .retrieve({
            conditions,
            expand: queryParam.expand as RelationPath<Entity>[],
            user
          })
          .catch(() => {
            throw new NotFoundException();
          });
        await this.service.update({ entity, data, user });
        await this.service.save();
        entity = await this.service.retrieve({
          conditions: this.getPrimaryKey(entity) as FilterQuery<Entity>,
          expand: queryParam.expand as RelationPath<Entity>[],
          refresh: true,
          user
        });
        await this.service.adjustPopulationStatus({
          entity,
          expand: queryParam.expand as RelationPath<Entity>[]
        });
        await this.service.save();
        return entity;
      }

      @ApiOperation({
        summary: `Hard delete ${entityClass.name}`
      })
      @ApiResponse({
        status: 204,
        type: entityClass
      })
      @Delete(path)
      async destroy(
        // @ts-ignore: Maybe needs `typeof`
        @Lookup lookup: lookupInternalType,
        // @ts-ignore: Maybe needs `typeof`
        @ReqUser user: reqUserType
      ): Promise<unknown> {
        const conditions = {
          [this.lookupField]: lookup
        } as FilterQuery<Entity>;
        const entity = await this.service
          .retrieve({ conditions, user })
          .catch(() => {
            throw new NotFoundException();
          });
        await this.service.destroy({ entity, user });
        await this.service.save();
        return;
      }

      protected getPrimaryKey(entity: AnyEntity) {
        const pkField = entity.__helper!.__meta.primaryKeys[0];
        return { [pkField]: entity[pkField] };
      }
    }

    return Controller;
  }

  applyDecoratorToActions(
    decorator: MethodDecorator,
    actions: ActionName[] = null
  ) {
    const actionsList = actions || this.options.actions;

    for (const method of actionsList) {
      this.applyMethodDecorators(method, decorator);
    }

    return this;
  }
}

import { AnyEntity, EntityData, RequiredEntityData } from '@mikro-orm/core';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  Matches,
  Max,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { AbstractFactory } from '../abstract.factory';
import {
  FILTER_OPERATORS,
  MikroCrudService,
  MikroCrudServiceFactory,
  QUERY_DEFAULT_LIMIT,
  QUERY_DEFAULT_OFFSET,
} from '../index';
import { FACTORY } from '../symbols';
import { OrderQueryParam } from '../types';
import { QueryDto } from './query-dto.interface';
import { QueryFactoryGeneralOptions } from './query-factory-general-options.interface';
import { QueryFactoryProducts } from './query-factory-products.interface';
import { QueryFactorySwaggerOptions } from './query-factory-swagger-options.interface';
import { QueryParams } from './query-params.interface';

const deduplicate = (arr: unknown[]) => [...new Set(arr)];
const isPlainObject = (value) => value?.constructor === Object;
const intersect = (a: any[], b: any[]) => {
  return a.filter(Set.prototype.has, new Set(b));
};

// @TODO: Add nested object keys validation
@ValidatorConstraint()
class IsObjectKeysAllowed implements ValidatorConstraintInterface {
  public async validate(data: object, validationArgs: ValidationArguments) {
    if (!isPlainObject(data)) return false;
    if (!Object.keys(data).length) return true;
    return !!intersect(Object.keys(data), validationArgs.constraints).length;
  }
}

export class QueryFactory<
  Entity extends AnyEntity<Entity> = any,
  CreateDto extends RequiredEntityData<Entity> = RequiredEntityData<Entity>,
  UpdateDto extends EntityData<Entity> = EntityData<Entity>,
  Service extends MikroCrudService<
    Entity,
    CreateDto,
    UpdateDto
  > = MikroCrudService<Entity, CreateDto, UpdateDto>,
> {
  readonly generalOptions: QueryFactoryGeneralOptions<Entity>;
  readonly swaggerOptions: QueryFactorySwaggerOptions<Entity>;
  readonly products: QueryFactoryProducts<Entity>;
  readonly serviceFactory;
  protected subFactories = {} as {
    queryParams: any;
    queryDto: any;
  };

  constructor(
    generalOptions: QueryFactoryGeneralOptions<Entity>,
    swaggerOptions: QueryFactorySwaggerOptions<Entity>,
  ) {
    this.generalOptions = this.standardizeGeneralOptions(generalOptions);
    this.swaggerOptions = swaggerOptions;
    this.serviceFactory = Reflect.getMetadata(
      FACTORY,
      swaggerOptions.service,
    ) as MikroCrudServiceFactory<Entity, CreateDto, UpdateDto>;
    this.products = this.createProductsBySubFactories();
    this.defineValidations();
    this.excludeDisabled();
  }

  protected standardizeGeneralOptions(
    options: QueryFactoryGeneralOptions<Entity>,
  ) {
    const { order } = options;

    return {
      ...options,
      /*
      order: order
        ? {
            ...order,
            in: deduplicate(
              order.in.flatMap((v) =>
                v.includes(':') ? v : [`${v}:asc`, `${v}:desc`],
              ),
            ) as OrderQueryParam<Entity>[],
          }
        : undefined,
      */
    };
  }

  protected createProductsBySubFactories(): QueryFactoryProducts {
    this.subFactories = {
      queryParams: new (this.createQueryParamsFactory())(),
      queryDto: new (this.createQueryDtoFactory())(),
    };
    return {
      queryParams: this.subFactories.queryParams.product,
      queryDto: this.subFactories.queryDto.product,
    };
  }

  protected createQueryParamsFactory() {
    const { limit, offset, order, filter, expand } = this.generalOptions;

    return class QueryParamsFactory extends AbstractFactory<
      QueryParams<Entity>
    > {
      readonly product;

      constructor() {
        super();
        this.product = this.createQueryParams();
        Reflect.defineMetadata(FACTORY, this, this.product);
      }

      createQueryParams() {
        return class QueryParams<Entity> implements QueryParams<Entity> {
          limit? = limit?.default || QUERY_DEFAULT_LIMIT;
          offset? = offset?.default || QUERY_DEFAULT_OFFSET;
          order? = order?.default;
          filter? = filter?.default;
          expand? = expand?.default;
        };
      }
    };
  }

  protected createQueryDtoFactory() {
    const { entity: entityClass } = this.serviceFactory.options;
    const { limit, offset, order, filter, expand } = this.generalOptions;

    return class QueryDtoFactory extends AbstractFactory<QueryDto<Entity>> {
      readonly product;

      constructor() {
        super();
        this.product = this.createQueryDto();
        this.applyApiDecorators();
        Reflect.defineMetadata(FACTORY, this, this.product);
      }

      createQueryDto() {
        return class QueryDto<Entity> implements QueryDto<Entity> {
          limit? = limit?.default || QUERY_DEFAULT_LIMIT;
          offset? = offset?.default || QUERY_DEFAULT_OFFSET;
          order? = order?.default;
          filter? = filter?.default;
          expand? = expand?.default;
        };
      }

      applyApiDecorators() {
        const LimitDecorator = applyDecorators(
          ApiProperty({
            example: 10,
            description: 'Limit',
            type: () => Number,
          }),
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.applyPropertyDecorators('limit', LimitDecorator);

        const OffsetDecorator = applyDecorators(
          ApiProperty({
            example: 20,
            description: 'Offset',
            type: () => Number,
          }),
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.applyPropertyDecorators('offset', OffsetDecorator);

        const ExpandDecorator = applyDecorators(
          ApiProperty({
            example: expand?.in ?? ['book.owner.profile'],
            description: 'For populating relations',
            isArray: true,
            type: () => String,
          }),
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.applyPropertyDecorators('expand', ExpandDecorator);

        const orderType: any = {};
        order?.in?.map((key) => (orderType[key] = 'asc'));
        const OrderDecorator = applyDecorators(
          ApiProperty({
            example: { id: 'asc' },
            description: 'Order',
            type: () => typeof orderType,
          }),
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.applyPropertyDecorators('order', OrderDecorator);

        const FilterDecorator = applyDecorators(
          ApiProperty({
            example: { id: 123 },
            description: 'Filter',
            type: () => entityClass,
          }),
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.applyPropertyDecorators('filter', FilterDecorator);
      }
    };
  }

  protected defineValidations() {
    const { limit, offset, order, filter, expand } = this.generalOptions;

    this.subFactories.queryParams
      .defineType('limit', Number)
      .applyPropertyDecorators(
        'limit',
        Type(() => Number),
        IsOptional(),
        IsNumber(),
      );
    this.subFactories.queryDto
      .defineType('limit', Number)
      .applyPropertyDecorators(
        'limit',
        Type(() => Number),
        IsOptional(),
        IsNumber(),
      );
    if (limit) {
      this.subFactories.queryParams.applyPropertyDecorators(
        'limit',
        Min(1),
        ...(limit.max ? [Max(limit.max)] : []),
      );
      this.subFactories.queryDto.applyPropertyDecorators(
        'limit',
        Min(1),
        ...(limit.max ? [Max(limit.max)] : []),
      );
    }

    this.subFactories.queryParams
      .defineType('offset', Number)
      .applyPropertyDecorators(
        'offset',
        IsOptional(),
        IsNumber(),
        Type(() => Number),
      );
    this.subFactories.queryDto
      .defineType('offset', Number)
      .applyPropertyDecorators(
        'offset',
        IsOptional(),
        IsNumber(),
        Type(() => Number),
      );
    if (offset) {
      this.subFactories.queryParams.applyPropertyDecorators(
        'offset',
        Min(0),
        ...(offset.max ? [Max(offset.max)] : []),
      );
      this.subFactories.queryDto.applyPropertyDecorators(
        'offset',
        Min(0),
        ...(offset.max ? [Max(offset.max)] : []),
      );
    }

    if (order) {
      this.subFactories.queryParams
        .defineType('order', Array)
        .applyPropertyDecorators(
          'order',
          Type(() => String),
          IsOptional(),
          IsArray(),
          IsIn(order.in, { each: true }),
        );
      this.subFactories.queryDto
        .defineType('order', Object)
        .applyPropertyDecorators(
          'order',
          IsOptional(),
          Validate(IsObjectKeysAllowed, order.in, {
            message: `Order keys must be one of ${order.in.join(', ')}`,
          }),
        );
    }

    if (filter) {
      this.subFactories.queryParams
        .defineType('filter', Array)
        .applyPropertyDecorators(
          'filter',
          Type(() => String),
          IsOptional(),
          IsArray(),
          Matches(
            `^(${filter.in.join('|')})\\|(${FILTER_OPERATORS.join('|')}):.*$`,
            undefined,
            { each: true },
          ),
        );
      this.subFactories.queryDto
        .defineType('filter', Object)
        .applyPropertyDecorators(
          'filter',
          IsOptional(),
          Validate(IsObjectKeysAllowed, filter.in, {
            message: `Filter keys must be one of ${filter.in.join(', ')}`,
          }),
        );
    }

    if (expand) {
      this.subFactories.queryParams
        .defineType('expand', Array)
        .applyPropertyDecorators(
          'expand',
          Type(() => String),
          IsOptional(),
          IsArray(),
          IsIn(expand.in, { each: true }),
        );
      this.subFactories.queryDto
        .defineType('expand', Array)
        .applyPropertyDecorators(
          'expand',
          Type(() => String),
          IsOptional(),
          IsArray(),
          IsIn(expand.in, { each: true }),
        );
    }
  }

  protected excludeDisabled() {
    const names: (keyof QueryFactoryGeneralOptions<Entity>)[] = [
      'order',
      'filter',
      'expand',
    ];
    for (const name of names)
      if (!this.generalOptions[name]) {
        this.subFactories.queryParams.applyPropertyDecorators(name, Exclude());
        this.subFactories.queryDto.applyPropertyDecorators(name, Exclude());
      }
  }
}

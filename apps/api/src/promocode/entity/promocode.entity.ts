import { IPromocode } from 'typing';
import { PermissionSubject } from 'casl';
import { BaseEntity } from '../../common/entities/base.entity';
import { Entity, Property } from '@mikro-orm/core';
import { CrudEntityFilter } from '../../common/permissions';

@CrudEntityFilter(PermissionSubject.entityPromocode)
@Entity({
  tableName: 'promocodes'
})
export class Promocode extends BaseEntity<Promocode> implements IPromocode {
  @Property({ nullable: false })
  code: string;

  @Property({ nullable: false, default: false })
  isActivated: boolean;

  @Property({ nullable: true })
  activationDate: Date;

  @Property({ nullable: true })
  locationsCnt: number;
}

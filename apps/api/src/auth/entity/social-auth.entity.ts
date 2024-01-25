import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core';

import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entity';
import { SocialAuthProvider } from '../../common/typing/social_auth.types';

@Entity({
  tableName: 'users_social_auth'
})
export class UserSocialAuth extends BaseEntity<UserSocialAuth> {
  @ManyToOne(() => User)
  user: User;

  @Index()
  @Property({ nullable: false })
  provider: SocialAuthProvider;

  @Index()
  @Property({ nullable: false })
  socialId: string;
}

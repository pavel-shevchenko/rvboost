import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable
} from '@nestjs/common';
import { AuthService } from '../auth';
import { UserDbService } from './user_db.service';
import {
  SocialAuthPayload,
  SocialAuthProvider
} from '../common/typing/social_auth.types';
import { User } from './entity';
import { UserSocialAuth } from '../auth/entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { wrap } from '@mikro-orm/core';
import { OrganizationService } from '../organization';

type CreateUserDto = {
  email: string;
  username: string;
  password?: string;
  passwordHash?: string;
};

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private readonly em: EntityManager,
    private userDbService: UserDbService,
    private orgService: OrganizationService
  ) {}

  async createUser(dto: CreateUserDto) {
    const data: CreateUserDto = {
      email: dto.email,
      username: dto.username
    };
    if (dto.password)
      data.passwordHash = await this.authService.hashPassword(dto.password);

    return this.userDbService.createUserByRequiredEntityDto(data);
  }

  async getPassportUserBySocialId(
    socialProvider: SocialAuthProvider,
    socialAuthPayload: SocialAuthPayload
  ): Promise<User> {
    if (!socialAuthPayload.socialId || !socialAuthPayload.email.trim())
      throw BadRequestException;
    let user: User = await this.userDbService.getPassportUserByEmail(
      socialAuthPayload.email.trim()
    );

    if (user) {
      const socialAuth: UserSocialAuth = user.socialAuths?.find(
        (userSocProvider) =>
          userSocProvider.provider === socialProvider &&
          userSocProvider.socialId === socialAuthPayload.socialId
      );
      if (!socialAuth) {
        await this.authService.addSocialAuth(
          user,
          socialProvider,
          socialAuthPayload.socialId
        );
      }
    } else {
      user = await this.em.findOne(
        User,
        {
          socialAuths: {
            provider: socialProvider,
            socialId: socialAuthPayload.socialId
          }
        },
        { populate: this.userDbService.getPassportUserPopulates() }
      );

      if (!user) {
        let username = socialAuthPayload.firstName;
        if (socialAuthPayload.lastName)
          username += ' ' + socialAuthPayload.lastName;

        const user = await this.createUser({
          email: socialAuthPayload.email,
          username
        });

        await this.authService.addSocialAuth(
          user,
          socialProvider,
          socialAuthPayload.socialId
        );
      }
    }

    return user;
  }

  async getUserInfo(user: User) {
    let isAssignedToOrg: boolean;
    try {
      const org = await this.orgService.getOrganizationByClient(user);
      isAssignedToOrg = true;
    } catch (e) {
      isAssignedToOrg = false;
    }

    return { ...wrap(user).toJSON(), isAssignedToOrg };
  }
}

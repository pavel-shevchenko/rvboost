import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
  forwardRef,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LocalRegistrationDto, ResetPasswordDto } from 'validation';
import { User } from '../user/entity';
import { UserService, UserDbService } from '../user';
import { MailService } from '../mail';
import * as process from 'process';
import { UserSocialAuth } from './entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { SocialAuthProvider } from '../common/typing/social_auth.types';
import { FastifyReply } from 'fastify';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly usersService: UserService,
    @Inject(forwardRef(() => UserDbService))
    private readonly userDbService: UserDbService,
    private readonly jwtService: JwtService,
    private readonly em: EntityManager,
    private readonly mailService: MailService
  ) {}

  hashPassword = async (password: string) => bcrypt.hash(password, 5);

  async registration(userDto: LocalRegistrationDto) {
    if (await this.userDbService.getPassportUserByEmail(userDto.email)) {
      throw new BadRequestException({ email: 'E-mail уже зарегистрирован!' });
    }
    const passwordHash = await this.hashPassword(userDto.password);
    const user: User = await this.userDbService.createUserByRequiredEntityDto({
      passwordHash,
      email: userDto.email,
      username: userDto.username
    });

    this.mailService.sendRegistrationNotify(user.email);

    return this.getAuthTokenWithUser(user);
  }

  getAuthTokenWithUser(user: User) {
    const expirationUnixTime =
      Math.floor(Date.now() / 1000) +
      60 * parseInt(process.env?.JWT_EXPIRES_IN_HOURS);
    const payload = {
      expirationUnixTime,
      sub: user.id,
      email: user.email
    };
    return {
      access_token: this.jwtService.sign(payload),
      user
    };
  }

  async validateUserByEmailAndPass(
    loginOrEmail: string,
    password: string
  ): Promise<User> {
    const user = await this.userDbService.getPassportUserByEmail(loginOrEmail);
    if (!user)
      throw new UnauthorizedException({ login_or_email: 'Email не найден' });

    const oldAndNewPasswordsEquals =
      !!user?.passwordHash &&
      (await bcrypt.compare(password, user?.passwordHash));

    if (user && oldAndNewPasswordsEquals) return user;
    throw new UnauthorizedException({ password: 'Пароль не подходит' });
  }

  async addSocialAuth(
    user: User,
    provider: SocialAuthProvider,
    socialId: string
  ) {
    const socialAuth = this.em.create(UserSocialAuth, {
      user,
      provider,
      socialId
    });
    await this.em.persistAndFlush(socialAuth);

    return socialAuth;
  }

  showSocialAuthSuccess(user: User, res: FastifyReply) {
    const { access_token } = this.getAuthTokenWithUser(user);

    res.header('Content-Type', 'text/html');
    res.send(`
<!DOCTYPE html>
<html>
  <head>
    <title>Authenticated</title>
  </head>
  <body>
    <h2>Authenticated successful!</h2>

    <script type="text/javascript">
      window.opener.socialsAuthCallback('${access_token}');
      window.close();
    </script>
  </body>
</html>
    `);
  }

  async resetPassword(email: string) {
    const user = await this.userDbService.getPassportUserByEmail(email);
    if (!user) throw new BadRequestException({ email: 'Email не найден' });
    this.sendRestorePasswordLink(user);
  }

  async sendRestorePasswordLink(user: User) {
    const randomToken = await bcrypt.hash(new Date().toISOString(), 7);

    user.passwordResetToken = randomToken;
    this.userDbService.saveUser(user);

    this.mailService.sendPasswordRestoreLink(
      user.email,
      `${process.env?.NEXT_PUBLIC_SERVER_URL}${process.env?.NEXT_PASSWORD_RESTORE_PAGE}?email=${user.email}&token=${randomToken}`
    );
  }

  async restorePassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userDbService.getPassportUserByEmail(
      resetPasswordDto.email
    );
    if (!user) throw new BadRequestException({ message: 'E-mail не найден' });

    if (
      user.passwordResetToken &&
      user.passwordResetToken === resetPasswordDto.token
    ) {
      user.passwordHash = await this.hashPassword(resetPasswordDto.newPassword);
      user.passwordResetToken = null;
      this.userDbService.saveUser(user);

      return true;
    } else {
      throw new HttpException('Token incorrect or expired', HttpStatus.FORBIDDEN);
    }
  }
}

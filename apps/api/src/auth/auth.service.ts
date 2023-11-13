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

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly usersService: UserService,
    @Inject(forwardRef(() => UserDbService))
    private readonly userDbService: UserDbService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {}

  async registration(userDto: LocalRegistrationDto) {
    if (await this.userDbService.getPassportUserByEmail(userDto.email)) {
      throw new BadRequestException({ email: 'E-mail занят!' });
    }
    const passwordHash = await bcrypt.hash(userDto.password, 5);
    const user: User = await this.userDbService.createUserByLocalDto({
      ...userDto,
      passwordHash
    });

    this.mailService.sendRegistrationNotify(user.email);

    return this.generateToken(user);
  }

  generateToken(user: User) {
    const expirationUnixTime =
      Math.floor(Date.now() / 1000) + 60 * process.env?.JWT_EXPIRES_IN_HOURS;
    const payload = {
      expirationUnixTime,
      sub: user.id,
      email: user.email
    };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  async validateUserByEmailAndPass(
    loginOrEmail: string,
    password: string
  ): Promise<User> {
    const user = await this.userDbService.getPassportUserByEmail(loginOrEmail);
    if (!user)
      throw new UnauthorizedException({ login_or_email: 'E-mail не найден!' });

    const oldAndNewPasswordsEquals =
      !!user?.passwordHash && (await bcrypt.compare(password, user?.passwordHash));

    if (user && oldAndNewPasswordsEquals) return user;
    throw new UnauthorizedException({ password: 'Пароль не подходит!' });
  }

  async restorePassword(email: string) {
    const user = await this.userDbService.getPassportUserByEmail(email);
    if (!user) throw new BadRequestException({ email: 'E-mail не найден!' });
    this.sendRestorePasswordLink(user);
  }

  async sendRestorePasswordLink(user: User) {
    const randomToken = await bcrypt.hash(new Date().toISOString(), 7);
    /*
    await this.cacheManager.set(
      PASSWORD_RESTORE_TOKEN_CACHE_PREFIX + user.id,
      randomToken
    );
    */
    this.mailService.sendPasswordRestoreLink(
      user.email,
      `${this.config.get('links.restorePassword')}?email=${
        user.email
      }&token=${randomToken}`
    );
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userDbService.getPassportUserByEmail(
      resetPasswordDto.email
    );
    if (!user) throw new BadRequestException({ message: 'E-mail not found' });

    /*
    const storedToken = await this.cacheManager.get(
      PASSWORD_RESTORE_TOKEN_CACHE_PREFIX + user.id
    );
    */
    if (storedToken && storedToken === resetPasswordDto.token) {
      user.passwordHash = await bcrypt.hash(resetPasswordDto.newPassword, 5);
      this.userDbService.saveUser(user);
      // this.cacheManager.del(PASSWORD_RESTORE_TOKEN_CACHE_PREFIX + user.id);

      return this.generateToken(user);
    } else {
      throw new HttpException('Token incorrect or expired', HttpStatus.FORBIDDEN);
    }
  }

  getUserIdFromAuthHeader(authHeader: string): number {
    if (!authHeader?.split) {
      return null;
    }
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      return null;
    }
    return this.getUserIdFromAuthToken(token);
  }

  getUserIdFromAuthToken(token: string): number {
    try {
      const payload: any = this.jwtService.verify(token);
      if (!payload.sub) {
        return null;
      }
      return parseInt(payload.sub);
    } catch (e) {
      return null;
    }
  }
}

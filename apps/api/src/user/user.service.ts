import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../auth';
import { UserDbService } from './user_db.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private userDbService: UserDbService
  ) {}

  async createUser(dto: { email: string; password: string; username: string }) {
    return this.userDbService.createUserByRequiredEntityDto({
      email: dto.email,
      passwordHash: await this.authService.hashPassword(dto.password),
      username: dto.username
    });
  }
}

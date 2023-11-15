import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../auth';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService
  ) {}
}

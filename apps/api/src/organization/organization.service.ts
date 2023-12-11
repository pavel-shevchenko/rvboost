import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user';
import { OrganizationDbService } from './organization_db.service';

@Injectable()
export class OrganizationService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private orgDbService: OrganizationDbService
  ) {}
}

import { User } from '../../user/entity';
import { EntityFilterContext } from '../../nestjs-crud';

export interface CrudEntityFilterContext extends EntityFilterContext {
  user: User;
}

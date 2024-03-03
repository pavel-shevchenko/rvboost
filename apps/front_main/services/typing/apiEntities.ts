import {
  IReview,
  ICard,
  ILocation,
  ISubscription,
  IOrganization,
  IUser,
  IEvent
} from 'typing';

// Справочник ответов от API:
export type User = IUser & {
  id: number;
  password?: string;
  isAssignedToOrg?: boolean;
  organizations?: Organization[];
};
export type Organization = IOrganization & {
  id: number;
  locations?: Location[];
  subscriptions?: Subscription[];
  feedbackSettings?: any;
};
export type Subscription = ISubscription & { id: number };
export type Location = ILocation & { id: number; card?: Card };
export type Event = IEvent & { id: number; card?: number };
export type Card = ICard & { id: number };
export type Review = IReview & { id: number };

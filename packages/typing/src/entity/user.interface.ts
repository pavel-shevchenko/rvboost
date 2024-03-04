export interface IUser {
  email: string;
  username: string;
  isAdmin: boolean | null;
  promoRegedCode?: string;
  promoRegedCountry?: string;
  promoRegedCity?: string;
  promoRegedAddress?: string;
  promoRegedZip?: string;
  promoRegedName?: string;
  promoRegedSurname?: string;
  promoRegedPhone?: string;
}

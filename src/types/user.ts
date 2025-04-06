export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    userType: 'CUSTOMER' | 'PARTNER';
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
}

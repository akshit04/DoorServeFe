import { Service } from './service';

export interface CartItem {
    id: number;
    service: Service;
    quantity: number;
    price: number;
    createdAt: string;
    updatedAt?: string;
}

export interface AddToCartRequest {
    serviceId: number;
    quantity?: number;
}
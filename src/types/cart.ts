import { Service } from './service';

// For now, keep the existing structure but add provider info
export interface CartItem {
    id: number;
    service: Service; // This will be the service template
    provider: {
        id: number;
        name: string;
        rating: number;
        experienceYears: number;
    };
    title: string; // Provider's custom title
    quantity: number;
    price: number;
    duration: number;
    createdAt: string;
    updatedAt?: string;
}

export interface AddToCartRequest {
    partnerServiceId: number;
    quantity?: number;
}
import { Service } from './service';

// Cart item structure matching backend DTO
export interface CartItem {
    id: number;
    partnerServiceId: number; // ID of the partner service
    service?: {
        id: number;
        name: string;
        description: string;
        category: string;
        imageUrl?: string;
    };
    provider?: {
        id: number;
        name: string;
        rating: number;
        experienceYears: number;
    };
    title?: string; // Provider's custom title
    quantity: number;
    price: number;
    duration?: number;
    createdAt: string;
    updatedAt?: string;
}

export interface AddToCartRequest {
    partnerServiceId: number;
    quantity?: number;
}
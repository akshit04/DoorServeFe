export interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    duration: number; // in minutes
    category: string;
    providerId: number;
    available: boolean;
    featured?: boolean;
    rating?: number;
    imageUrl?: string;
}

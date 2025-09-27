export interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number; // in minutes
    category: string;
    providerId: string;
    available: boolean;
    featured?: boolean;
    rating?: number;
    imageUrl?: string;
}

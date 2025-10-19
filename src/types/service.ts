export interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    duration: number; // in minutes
    category: string;
    available: boolean;
    featured?: boolean;
    rating?: number;
    imageUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

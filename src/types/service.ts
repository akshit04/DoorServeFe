// Service Template (type of service, no pricing - that's per provider)
export interface ServiceTemplate {
    id: number;
    name: string;
    description: string;
    baseDuration?: number; // suggested duration in minutes
    category: string;
    available: boolean;
    featured?: boolean;
    imageUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Provider's Service Offering (actual service with pricing and ratings)
export interface ProviderServiceOffering {
    id: number;
    providerId: number;
    providerName: string;
    serviceTemplateId: number;
    title: string; // Provider's custom title
    price: number;
    duration: number;
    description?: string; // Provider's custom description
    available: boolean;
    experienceYears: number;
    rating: number;
    totalJobs: number;
}

// For backward compatibility, keep Service as ServiceTemplate
export type Service = ServiceTemplate;

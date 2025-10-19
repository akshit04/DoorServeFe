import { Service } from './service';

export interface PartnerServiceInfo {
  id: number;
  partnerId: number;
  partnerName: string;
  partnerEmail: string;
  price: number;
  duration: number;
  description: string;
  experienceYears: number;
  rating: number;
  totalJobs: number;
  available: boolean;
}

export interface ServiceDetails {
  service: Service;
  availablePartners: PartnerServiceInfo[];
  minPrice: number;
  maxPrice: number;
  totalPartners: number;
  averageRating: number;
}
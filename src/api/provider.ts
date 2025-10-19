import axiosInstance from './axios';

export interface ProviderProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface PartnerServiceDetails {
  id: number;
  partnerId: number;
  serviceCatalogId: number;
  price: number;
  duration: number;
  description?: string;
  available: boolean;
  experienceYears: number;
  rating: number;
  totalJobs: number;
}

export interface OtherService {
  serviceId: number;
  serviceName: string;
  category: string;
  price: number;
  duration: number;
}

export interface ProviderServiceDetailsResponse {
  provider: ProviderProfile;
  partnerService: PartnerServiceDetails;
  otherServices: OtherService[];
}

export const providerApi = {
  /**
   * Get provider details for a specific service
   */
  getProviderServiceDetails: async (serviceId: number, partnerId: number) => {
    const response = await axiosInstance.get<ProviderServiceDetailsResponse>(
      `/providers/${partnerId}/services/${serviceId}`
    );
    return response.data;
  },

  /**
   * Get all services offered by a provider
   */
  getProviderServices: async (partnerId: number) => {
    const response = await axiosInstance.get<OtherService[]>(`/providers/${partnerId}/services`);
    return response.data;
  },

  /**
   * Get provider profile
   */
  getProviderProfile: async (partnerId: number) => {
    const response = await axiosInstance.get<ProviderProfile>(`/providers/${partnerId}`);
    return response.data;
  }
};
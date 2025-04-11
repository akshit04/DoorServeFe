export interface PartnerProfile {
    id: string;
    userId: number;
    businessName: string;
    description: string;
    categories: string[];
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    phone: string;
    email: string;
    website?: string;
    logoUrl?: string;
    rating?: number;
}
  
export interface PartnerStats {
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    averageRating: number;
    bookingsByDay: {
      date: string;
      count: number;
    }[];
    revenueByDay: {
      date: string;
      amount: number;
    }[];
}
  
export interface PartnerAvailability {
    id: string;
    partnerId: number;
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
    available: boolean;
}
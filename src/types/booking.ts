import { User } from './user';
import { Service } from './service';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
    id: string;
    customerId: string;
    serviceId: string;
    providerId: string;
    bookingStartDateTime: string; // HH:MM format
    bookingDuration: number;
    status: BookingStatus;
    notes?: string;
    totalPrice: number;
    createdAt: string; // ISO date string
    // Additional properties for UI display
    customer?: {
        firstName: string;
        lastName: string;
    };
    service?: {
        name: string;
    };
    date?: string;
    startTime?: string;
    endTime?: string;
}

export interface BookingRequest {
    partnerId: number;
    serviceId: number;
    bookingDate: string; // ISO date string
    startTime: string; // ISO date string
}

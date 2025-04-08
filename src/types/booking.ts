import { User } from './user';
import { Service } from './service';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
    id: number;
    customer: User;
    service: Service;
    providerId: number;
    date: string; // ISO date string
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
    status: BookingStatus;
    notes?: string;
    totalPrice: number;
    createdAt: string; // ISO date string
}

export interface BookingRequest {
    partnerId: number;
    serviceId: number;
    bookingDate: string; // ISO date string
    startTime: string; // ISO date string
}

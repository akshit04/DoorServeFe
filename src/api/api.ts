import { serviceApi } from './service';
import { bookingApi } from './booking';
import { userApi } from './user';
import { partnerApi } from './partner';

export const api = {
  service: serviceApi,
  booking: bookingApi,
  user: userApi,
  partner: partnerApi,
};

export default api;

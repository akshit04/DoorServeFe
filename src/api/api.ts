import { serviceApi } from './service';
import { bookingApi } from './booking';
import { userApi } from './user';
import { partnerApi } from './partner';
import { categoryApi } from './categories';

export const api = {
  service: serviceApi,
  booking: bookingApi,
  user: userApi,
  partner: partnerApi,
  categories: categoryApi,
};

export default api;

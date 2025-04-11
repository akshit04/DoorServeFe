import { serviceApi } from './service';
import { bookingApi } from './booking';
import { userApi } from './user';
import { partnerApi } from './partner';
import { categoryApi } from './category';

export const api = {
  service: serviceApi,
  booking: bookingApi,
  user: userApi,
  partner: partnerApi,
  category: categoryApi,
};

export default api;

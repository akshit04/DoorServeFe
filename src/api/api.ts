import { serviceApi } from './service';
import { bookingApi } from './booking';
import { userApi } from './user';
import { partnerApi } from './partner';
import { categoryApi } from './category';
import { cartApi } from './cart';

export const api = {
  service: serviceApi,
  booking: bookingApi,
  user: userApi,
  partner: partnerApi,
  category: categoryApi,
  cart: cartApi,
};

export default api;

import { serviceApi } from './service';
import { bookingApi } from './booking';
import { userApi } from './user';
import { partnerApi } from './partner';
import { categoryApi } from './category';
import { cartApi } from './cart';
import { reviewApi } from './review';
import { providerApi } from './provider';

export const api = {
  service: serviceApi,
  booking: bookingApi,
  user: userApi,
  partner: partnerApi,
  category: categoryApi,
  cart: cartApi,
  review: reviewApi,
  provider: providerApi,
};

export default api;

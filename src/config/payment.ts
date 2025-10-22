// Payment configuration
export const paymentConfig = {
  // Toggle this to switch between mock and real payments
  mockPayment: true,
  
  // Stripe configuration
  stripePublishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '',
};
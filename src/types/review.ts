export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  customer: {
    id: number;
    firstName: string;
    lastName: string;
  };
  booking: {
    id: number;
    serviceCatalog: {
      name: string;
    };
  };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
}
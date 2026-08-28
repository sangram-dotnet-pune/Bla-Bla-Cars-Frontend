import api from "./apiClient";

export const submitReview = async (payload) => {
  const res = await api.post("/api/reviews", payload);
  return res.data;
};

export const getUserReviews = async (userId) => {
  const res = await api.get(`/api/users/${userId}/reviews`);
  return res.data;
};

export const getRideReviewStatus = async (rideId) => {
  const res = await api.get(`/api/reviews/ride/${rideId}`);
  return res.data;
};

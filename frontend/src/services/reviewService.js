import api from './api';

const BASE = (productId) => `/products/${productId}/reviews`;

export const reviewService = {
    // Get all reviews for a product (paginated)
    getProductReviews: async (productId, params = {}) => {
        const response = await api.get(BASE(productId), { params });
        return response.data;
    },

    // Get the logged-in user's review for a product
    getMyReview: async (productId) => {
        const response = await api.get(`${BASE(productId)}/my-review`);
        return response.data;
    },

    // Create a new review
    createReview: async (productId, reviewData) => {
        const response = await api.post(BASE(productId), reviewData);
        return response.data;
    },

    // Update an existing review
    updateReview: async (productId, reviewId, reviewData) => {
        const response = await api.put(`${BASE(productId)}/${reviewId}`, reviewData);
        return response.data;
    },

    // Delete a review
    deleteReview: async (productId, reviewId) => {
        const response = await api.delete(`${BASE(productId)}/${reviewId}`);
        return response.data;
    },

    // Toggle helpful vote
    toggleHelpful: async (productId, reviewId) => {
        const response = await api.put(`${BASE(productId)}/${reviewId}/helpful`);
        return response.data;
    },
};

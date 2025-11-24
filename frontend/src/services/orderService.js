import api from './api';

export const orderService = {
    // Create order
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    // Get user orders
    getUserOrders: async () => {
        const response = await api.get('/orders');
        return response.data;
    },

    // Get single order
    getOrder: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    // Get all orders (Admin)
    getAllOrders: async () => {
        const response = await api.get('/orders/all');
        return response.data;
    },

    // Update order status (Admin)
    updateOrderStatus: async (id, status) => {
        const response = await api.put(`/orders/${id}/status`, { status });
        return response.data;
    },

    // Mark WhatsApp sent
    markWhatsAppSent: async (id) => {
        const response = await api.put(`/orders/${id}/whatsapp`);
        return response.data;
    },
};

import apiClient from './axios.js';

export const getTodos = async () => {
    try {
        const response = await apiClient.get('/todo');
        return response.data?.data ?? [];
    } catch (error) {
        if (error.response?.status === 400) {
            return [];
        }

        throw error;
    }
};

export const createTodo = (payload) => apiClient.post('/todo', payload);
export const updateTodo = (todoId, payload) => apiClient.patch(`/todo/${todoId}`, payload);
export const deleteTodo = (todoId) => apiClient.delete(`/todo/${todoId}`);

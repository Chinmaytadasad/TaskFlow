import api from './api';

export const taskService = {
    // Get all tasks with optional search and filter
    getTasks: async (search = '', statusFilter = '') => {
        const params = {};
        if (search) params.search = search;
        if (statusFilter) params.status_filter = statusFilter;

        const response = await api.get('/api/tasks', { params });
        return response.data;
    },

    // Get single task
    getTask: async (taskId) => {
        const response = await api.get(`/api/tasks/${taskId}`);
        return response.data;
    },

    // Create new task
    createTask: async (taskData) => {
        const response = await api.post('/api/tasks', taskData);
        return response.data;
    },

    // Update task
    updateTask: async (taskId, taskData) => {
        const response = await api.put(`/api/tasks/${taskId}`, taskData);
        return response.data;
    },

    // Delete task
    deleteTask: async (taskId) => {
        const response = await api.delete(`/api/tasks/${taskId}`);
        return response.data;
    },
};

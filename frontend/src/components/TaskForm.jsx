import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TaskForm = ({ task, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'todo',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                status: task.status || 'todo',
            });
        }
    }, [task]);

    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length > 200) {
            newErrors.title = 'Title must be less than 200 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            onSubmit(formData);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
            <div className="card max-w-md w-full p-4 sm:p-6 animate-slide-down max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
                        {task ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-all duration-200"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="label">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`input ${errors.title ? 'input-error' : ''}`}
                            placeholder="Enter task title"
                        />
                        {errors.title && <p className="error-text">{errors.title}</p>}
                    </div>

                    <div>
                        <label htmlFor="description" className="label">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="input resize-none"
                            placeholder="Enter task description (optional)"
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="label">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="input appearance-none cursor-pointer"
                        >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button type="submit" className="btn btn-primary flex-1">
                            {task ? 'Update Task' : 'Create Task'}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;

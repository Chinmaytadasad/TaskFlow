import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { Plus, Search, Filter, ListTodo, AlertCircle } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchTasks();
    }, [searchQuery, statusFilter]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await taskService.getTasks(searchQuery, statusFilter);
            setTasks(data);
            setError('');
        } catch (err) {
            setError('Failed to load tasks. Please try again.');
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (taskData) => {
        try {
            await taskService.createTask(taskData);
            setShowForm(false);
            fetchTasks();
        } catch (err) {
            console.error('Error creating task:', err);
            alert('Failed to create task. Please try again.');
        }
    };

    const handleUpdateTask = async (taskData) => {
        try {
            const idToUpdate = editingTask.id ?? editingTask._id;
            await taskService.updateTask(idToUpdate, taskData);
            setShowForm(false);
            setEditingTask(null);
            fetchTasks();
        } catch (err) {
            console.error('Error updating task:', err);
            alert('Failed to update task. Please try again.');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            await taskService.deleteTask(taskId);
            fetchTasks();
        } catch (err) {
            console.error('Error deleting task:', err);
            alert('Failed to delete task. Please try again.');
        }
    };

    const handleEditClick = (task) => {
        setEditingTask(task);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingTask(null);
    };

    const getTaskStats = () => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const inProgress = tasks.filter(t => t.status === 'in_progress').length;
        const todo = tasks.filter(t => t.status === 'todo').length;

        return { total, completed, inProgress, todo };
    };

    const stats = getTaskStats();

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-6 sm:mb-8 animate-fade-in">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100 mb-2">
                        Welcome back, <span className="text-blue-400">{user?.username}</span>!
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base">Manage your tasks and stay productive</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
                    <div className="card p-4 sm:p-6 animate-slide-up">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-xs sm:text-sm mb-1">Total Tasks</p>
                                <p className="text-2xl sm:text-3xl font-bold text-slate-100">{stats.total}</p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <ListTodo className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="card p-4 sm:p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-xs sm:text-sm mb-1">To Do</p>
                                <p className="text-2xl sm:text-3xl font-bold text-blue-400">{stats.todo}</p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className="card p-4 sm:p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-xs sm:text-sm mb-1">In Progress</p>
                                <p className="text-2xl sm:text-3xl font-bold text-yellow-400">{stats.inProgress}</p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className="card p-4 sm:p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-xs sm:text-sm mb-1">Completed</p>
                                <p className="text-2xl sm:text-3xl font-bold text-green-400">{stats.completed}</p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-11 w-full"
                        />
                    </div>

                    {/* Filter */}
                    <div className="relative sm:w-48">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="input pl-11 w-full appearance-none cursor-pointer"
                        >
                            <option value="">All Status</option>
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    {/* Create Button */}
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn btn-primary whitespace-nowrap flex items-center justify-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        <span className="hidden sm:inline">New Task</span>
                        <span className="sm:hidden">Add</span>
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Tasks Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-12 sm:py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-slate-800 rounded-full mb-4">
                            <ListTodo className="h-8 w-8 sm:h-10 sm:w-10 text-slate-600" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-slate-300 mb-2">No tasks found</h3>
                        <p className="text-slate-500 text-sm sm:text-base mb-6 px-4">
                            {searchQuery || statusFilter
                                ? 'Try adjusting your search or filter'
                                : 'Create your first task to get started'}
                        </p>
                        {!searchQuery && !statusFilter && (
                            <button onClick={() => setShowForm(true)} className="btn btn-primary inline-flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                Create Task
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id ?? task._id}
                                task={task}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteTask}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Task Form Modal */}
            {showForm && (
                <TaskForm
                    task={editingTask}
                    onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                    onCancel={handleCloseForm}
                />
            )}
        </div>
    );
};

export default Dashboard;

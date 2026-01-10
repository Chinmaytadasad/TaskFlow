import { Edit2, Trash2, Clock } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete }) => {
    const getStatusBadge = (status) => {
        const badges = {
            todo: 'badge-info',
            in_progress: 'badge-warning',
            completed: 'badge-success',
        };

        const labels = {
            todo: 'To Do',
            in_progress: 'In Progress',
            completed: 'Completed',
        };

        return (
            <span className={`badge ${badges[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="card p-4 sm:p-6 animate-slide-up hover:border-slate-700 transition-all duration-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3">
                <h3 className="text-base sm:text-lg font-semibold text-slate-100 pr-2">{task.title}</h3>
                <div className="flex-shrink-0">
                    {getStatusBadge(task.status)}
                </div>
            </div>

            {task.description && (
                <p className="text-slate-300 text-sm mb-4 line-clamp-2">{task.description}</p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="h-3 w-3 flex-shrink-0" />
                    <span>{formatDate(task.created_at)}</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 hover:bg-blue-500/10 text-blue-400 rounded-lg transition-all duration-200"
                        title="Edit task"
                        aria-label="Edit task"
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(task.id ?? task._id)}
                        className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-all duration-200"
                        title="Delete task"
                        aria-label="Delete task"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;

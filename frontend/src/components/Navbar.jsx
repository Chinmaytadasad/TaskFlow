import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <LayoutDashboard className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                        <span className="text-lg sm:text-xl font-bold text-slate-100">TaskFlow</span>
                    </Link>

                    {/* User Menu */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-slate-100 truncate max-w-[120px]">{user?.username}</p>
                                <p className="text-xs text-slate-400 truncate max-w-[120px]">{user?.email}</p>
                            </div>
                            <div className="sm:hidden">
                                <p className="text-xs font-medium text-slate-200 truncate max-w-[80px]">{user?.username}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg border border-red-600/30 transition-all duration-200"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

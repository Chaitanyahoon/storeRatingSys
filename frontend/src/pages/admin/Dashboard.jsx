import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import api from '../../api/axios';
import { Users, Store, Star, LogOut, Key, ArrowRight, ShieldAlert } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/admin/stats');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch admin stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-500 h-500 bg-indigo-500/5 rounded-full blur-120 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-500 h-500 bg-purple-500/5 rounded-full blur-120 pointer-events-none"></div>

      {/* Header */}
      <header className="border-b border-slate-800-80 bg-slate-900-40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500-10 border border-indigo-500-20 text-indigo-400 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Admin Console</h1>
              <p className="text-xs text-slate-400 font-medium">Store Rating Management Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-300 hidden md:block">
              Welcome, <span className="text-indigo-400 font-semibold">{user?.name}</span>
            </span>
            <Link
              to="/change-password"
              className="p-2.5 hover:bg-slate-800-60 text-slate-400 hover:text-white rounded-xl transition-all border border-transparent hover:border-slate-800"
              title="Change Password"
            >
              <Key className="w-5 h-5" />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2.5 hover:bg-rose-500-10 text-slate-400 hover:text-rose-400 rounded-xl transition-all border border-transparent hover:border-rose-500-20"
              title="Log Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 relative z-10">
        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-rose-500-10 border border-rose-500-20 text-rose-300 text-sm">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-slate-900-40 border border-slate-800-60 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-900-40 border border-slate-800-80 p-6 rounded-3xl relative overflow-hidden group hover:border-indigo-500-30 transition-all duration-300">
              <div className="absolute right-6 top-6 p-3 bg-indigo-500-10 border border-indigo-500-20 text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">Total Users</span>
              <h3 className="text-4xl font-extrabold text-white mt-2 mb-1">{stats.totalUsers}</h3>
              <p className="text-xs text-slate-500">Registered customers, admins & owners</p>
            </div>

            <div className="bg-slate-900-40 border border-slate-800-80 p-6 rounded-3xl relative overflow-hidden group hover:border-purple-500-30 transition-all duration-300">
              <div className="absolute right-6 top-6 p-3 bg-purple-500-10 border border-purple-500-20 text-purple-400 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Store className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">Total Stores</span>
              <h3 className="text-4xl font-extrabold text-white mt-2 mb-1">{stats.totalStores}</h3>
              <p className="text-xs text-slate-500">Active store profiles registered</p>
            </div>

            <div className="bg-slate-900-40 border border-slate-800-80 p-6 rounded-3xl relative overflow-hidden group hover:border-amber-500-30 transition-all duration-300">
              <div className="absolute right-6 top-6 p-3 bg-amber-500-10 border border-amber-500-20 text-amber-400 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Star className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">Total Ratings</span>
              <h3 className="text-4xl font-extrabold text-white mt-2 mb-1">{stats.totalRatings}</h3>
              <p className="text-xs text-slate-500">Reviews submitted by shoppers</p>
            </div>
          </div>
        )}

        {/* Quick Links Section */}
        <h2 className="text-lg font-bold text-white mb-6">Management Utilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/users"
            className="group flex items-center justify-between p-6 bg-gradient-to-r from-slate-900-80 to-slate-900-20 border border-slate-800 hover:border-slate-700-80 rounded-3xl shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500-10 border border-indigo-500-20 text-indigo-400 rounded-2xl group-hover:bg-indigo-500-20 transition-all">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-md font-bold text-white group-hover:text-indigo-400 transition-colors">User Profiles Directory</h4>
                <p className="text-xs text-slate-400 mt-1">Review registrations, assign owner accounts, create admins</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/admin/stores"
            className="group flex items-center justify-between p-6 bg-gradient-to-r from-slate-900-80 to-slate-900-20 border border-slate-800 hover:border-slate-700-80 rounded-3xl shadow-xl hover:shadow-purple-500/5 hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500-10 border border-purple-500-20 text-purple-400 rounded-2xl group-hover:bg-purple-500-20 transition-all">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-md font-bold text-white group-hover:text-purple-400 transition-colors">Store Management</h4>
                <p className="text-xs text-slate-400 mt-1">Create new store locations and assign owner accounts</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

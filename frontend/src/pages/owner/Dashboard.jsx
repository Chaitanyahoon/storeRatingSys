import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import api from '../../api/axios';
import SortableTable from '../../components/SortableTable';
import StarRating from '../../components/StarRating';
import { Store, Star, LogOut, Key, FileText, LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState({ store: null, avgRating: 0, ratings: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Local sorting state for raters table
  const [sorting, setSorting] = useState([{ id: 'userName', desc: false }]);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/owner/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Locally sort the ratings list whenever the sorting state changes
  const sortedRatings = useMemo(() => {
    const ratings = dashboardData.ratings || [];
    if (!sorting.length) return ratings;

    const { id, desc } = sorting[0];
    
    return [...ratings].sort((a, b) => {
      let valA = a[id];
      let valB = b[id];

      // Convert to strings for case-insensitive comparison if they are strings
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return desc ? 1 : -1;
      if (valA > valB) return desc ? -1 : 1;
      return 0;
    });
  }, [dashboardData.ratings, sorting]);

  // Table columns definition (Name and Email are mapped to userName, userEmail)
  const columns = useMemo(
    () => [
      {
        accessorKey: 'userName',
        header: 'Shopper Name',
        cell: (info) => <div className="font-semibold text-white">{info.getValue()}</div>
      },
      {
        accessorKey: 'userEmail',
        header: 'Shopper Email',
        cell: (info) => <div className="text-slate-300">{info.getValue()}</div>
      },
      {
        accessorKey: 'score',
        header: 'Rating score',
        cell: (info) => {
          const score = info.getValue();
          return (
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{score} Stars</span>
            </div>
          );
        }
      }
    ],
    []
  );

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
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Owner Dashboard</h1>
              <p className="text-xs text-slate-400 font-medium">Manage and review your storefront rating</p>
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 relative z-10 space-y-8">
        {error && (
          <div className="p-4 rounded-xl bg-rose-500-10 border border-rose-500-20 text-rose-300 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900-20 border border-slate-800-80 rounded-3xl">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <span className="text-slate-400 text-sm font-semibold">Loading storefront metrics...</span>
          </div>
        ) : !dashboardData.store ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900-40 border border-dashed border-slate-800 rounded-3xl text-center p-6">
            <Store className="w-16 h-16 text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Store Assigned</h3>
            <p className="text-slate-400 text-sm max-w-md">
              Your owner profile has not been linked to an active store location yet. Please contact the administrator to assign you a store storefront.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Store Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900-40 border border-slate-800-80 p-6 rounded-3xl md:col-span-2 space-y-4">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Storefront Location Info</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{dashboardData.store.name}</h2>
                  <p className="text-sm text-slate-400 mt-1">{dashboardData.store.address}</p>
                </div>
                <div className="border-t border-slate-800-60 pt-4 flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Contact: {dashboardData.store.email}</span>
                  <span>ID: {dashboardData.store.id}</span>
                </div>
              </div>

              <div className="bg-slate-900-40 border border-slate-800-80 p-6 rounded-3xl flex flex-col items-center justify-center text-center">
                <Star className="w-10 h-10 text-amber-400 fill-amber-400/20 mb-3" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Rating Score</span>
                <span className="text-5xl font-extrabold text-white mt-2 mb-1">
                  {dashboardData.avgRating.toFixed(2)}
                </span>
                <span className="text-mini text-slate-500">Based on {dashboardData.ratings.length} total shoppers</span>
              </div>
            </div>

            {/* Raters Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Shopper Reviews list
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  {dashboardData.ratings.length} Shopper entries
                </span>
              </div>

              <SortableTable
                columns={columns}
                data={sortedRatings}
                sorting={sorting}
                setSorting={setSorting}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

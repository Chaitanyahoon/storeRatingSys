import React, { useEffect, useState, useMemo, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import api from '../../api/axios';
import SortableTable from '../../components/SortableTable';
import StarRating from '../../components/StarRating';
import { Store, Search, Filter, LogOut, Key, Star, X, AlertCircle, Award } from 'lucide-react';

const StoreList = () => {
  const { user, logout } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Filters & Sorting
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);

  // Rating Modal state
  const [selectedStore, setSelectedStore] = useState(null);
  const [userScore, setUserScore] = useState(0);
  const [ratingError, setRatingError] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  // Fetch stores list
  const fetchStores = async () => {
    setLoading(true);
    try {
      const sortBy = sorting[0]?.id || 'name';
      const order = sorting[0]?.desc ? 'desc' : 'asc';

      const queryParams = new URLSearchParams({
        sortBy,
        order,
        name: filters.name,
        address: filters.address
      });

      const response = await api.get(`/api/stores?${queryParams.toString()}`);
      if (response.data.success) {
        setStores(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch stores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [filters, sorting]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openRatingModal = (store) => {
    setSelectedStore(store);
    setUserScore(store.my_rating || 0);
    setRatingError('');
  };

  const handleRatingSubmit = async () => {
    if (userScore < 1 || userScore > 5) {
      setRatingError('Please select a rating between 1 and 5 stars.');
      return;
    }

    setRatingError('');
    setSubmittingRating(true);
    try {
      const response = await api.post('/api/ratings', {
        storeId: selectedStore.id,
        score: userScore
      });

      if (response.data.success) {
        setSelectedStore(null);
        fetchStores(); // Refresh to recalculate averages & my_rating
      }
    } catch (err) {
      setRatingError(err.response?.data?.message || err.message || 'Failed to submit rating.');
    } finally {
      setSubmittingRating(false);
    }
  };

  // Columns definition for TanStack Table
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Store Name',
        cell: (info) => <div className="font-bold text-white">{info.getValue()}</div>
      },
      {
        accessorKey: 'address',
        header: 'Location Address',
        cell: (info) => <div className="text-slate-300 whitespace-normal">{info.getValue()}</div>
      },
      {
        accessorKey: 'avg_rating',
        header: 'Average Score',
        cell: (info) => {
          const rating = info.getValue();
          return (
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-amber-400">
                {rating ? rating.toFixed(2) : '0.00'}
              </span>
              <span className="text-slate-600 text-xs font-semibold">/ 5</span>
            </div>
          );
        }
      },
      {
        accessorKey: 'my_rating',
        header: 'Your Rating',
        cell: (info) => {
          const rating = info.getValue();
          return rating ? (
            <div className="flex items-center gap-1 text-indigo-400 font-bold">
              <Star className="w-4 h-4 fill-indigo-400/20" />
              <span>{rating} Stars</span>
            </div>
          ) : (
            <span className="text-slate-600 italic text-xs">Not rated yet</span>
          );
        }
      },
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: (info) => {
          const store = info.row.original;
          const hasRated = store.my_rating !== null;
          return (
            <button
              onClick={() => openRatingModal(store)}
              className={`inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-xl transition-all border ${
                hasRated
                  ? 'bg-indigo-500-10 hover:bg-indigo-500/20 text-indigo-400 border-indigo-500-20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              {hasRated ? 'Edit Rating' : 'Submit Rating'}
            </button>
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
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Store Rating Hub</h1>
              <p className="text-xs text-slate-400 font-medium">Rate and browse stores</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-300 hidden md:block">
              Shopper: <span className="text-indigo-400 font-semibold">{user?.name}</span>
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 relative z-10 space-y-6">
        {/* Filters */}
        <div className="bg-slate-900-40 border border-slate-800-80 p-5 rounded-3xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800-60 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              Browse & Filter Stores
            </h3>
            {(filters.name || filters.address) && (
              <button
                onClick={() => setFilters({ name: '', address: '' })}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-mini font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Store Name Search
              </label>
              <input
                type="text"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                placeholder="Search by store name..."
                className="w-full px-4 py-2.5 bg-slate-950-60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-mini font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Location Address Search
              </label>
              <input
                type="text"
                name="address"
                value={filters.address}
                onChange={handleFilterChange}
                placeholder="Search by address..."
                className="w-full px-4 py-2.5 bg-slate-950-60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Store Grid Table */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500-10 border border-rose-500-20 text-rose-300 text-sm">
            {error}
          </div>
        )}

        {loading && stores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900-20 border border-slate-800-80 rounded-3xl">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <span className="text-slate-400 text-sm font-semibold">Scanning stores...</span>
          </div>
        ) : (
          <SortableTable columns={columns} data={stores} sorting={sorting} setSorting={setSorting} />
        )}
      </main>

      {/* Star Rating Modal Overlay */}
      {selectedStore && (
        <div className="fixed inset-0 bg-slate-950-80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-fade-in space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400/25" />
                Submit Score
              </h3>
              <button
                onClick={() => setSelectedStore(null)}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5 text-center py-2">
              <h4 className="text-md font-bold text-white uppercase tracking-tight">{selectedStore.name}</h4>
              <p className="text-xs text-slate-400 font-medium">{selectedStore.address}</p>
            </div>

            {ratingError && (
              <div className="p-3.5 rounded-xl bg-rose-500-10 border border-rose-500-20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{ratingError}</span>
              </div>
            )}

            <div className="flex flex-col items-center justify-center gap-4 py-4 bg-slate-950-50 rounded-2xl border border-slate-800-60">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Choose Rating Score</span>
              <StarRating rating={userScore} onChange={setUserScore} />
              <span className="text-xs font-semibold text-slate-500">
                {userScore > 0 ? `${userScore} out of 5 stars` : 'Hover and click to select'}
              </span>
            </div>

            <div className="flex items-center gap-4 border-t border-slate-800 pt-4">
              <button
                onClick={() => setSelectedStore(null)}
                className="flex-1 py-3 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRatingSubmit}
                disabled={submittingRating || userScore === 0}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                {submittingRating ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <span>Submit Rating</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreList;

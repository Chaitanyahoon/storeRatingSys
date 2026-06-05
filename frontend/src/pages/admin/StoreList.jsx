import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';
import SortableTable from '../../components/SortableTable';
import { Store, Search, Filter, Plus, ArrowLeft, X, AlertCircle, Sparkles } from 'lucide-react';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering & Sorting State
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sorting, setSorting] = useState([{ id: 'name', desc: false }]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [creating, setCreating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors }
  } = useForm();

  // Fetch all stores
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

  // Fetch owners to populate selection dropdown
  const fetchOwners = async () => {
    try {
      // Get all users with role = owner
      const response = await api.get('/api/users?role=owner');
      if (response.data.success) {
        setOwners(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch owners:', err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [filters, sorting]);

  useEffect(() => {
    if (isModalOpen) {
      fetchOwners();
    }
  }, [isModalOpen]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitStore = async (data) => {
    setFormError('');
    setFormSuccess('');
    setCreating(true);
    try {
      const response = await api.post('/api/stores', data);
      if (response.data.success) {
        setFormSuccess('Store created and owner assigned successfully!');
        reset();
        fetchStores();
        setTimeout(() => {
          setIsModalOpen(false);
          setFormSuccess('');
        }, 1500);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to create store.');
    } finally {
      setCreating(false);
    }
  };

  // Columns definition for TanStack Table
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Store Name',
        cell: (info) => <div className="font-semibold text-white">{info.getValue()}</div>
      },
      {
        accessorKey: 'email',
        header: 'Contact Email',
        cell: (info) => <div className="text-slate-300">{info.getValue()}</div>
      },
      {
        accessorKey: 'address',
        header: 'Address Location',
        cell: (info) => (
          <div className="max-w-200 truncate text-slate-400" title={info.getValue()}>
            {info.getValue()}
          </div>
        )
      },
      {
        accessorKey: 'ownerName',
        header: 'Assigned Owner',
        cell: (info) => (
          <span className="text-sm font-semibold text-indigo-400">
            {info.getValue() || 'Unassigned'}
          </span>
        )
      },
      {
        accessorKey: 'avg_rating',
        header: 'Rating (AVG)',
        cell: (info) => {
          const rating = info.getValue();
          return (
            <div className="flex items-center gap-1.5 font-bold text-amber-400">
              <span className="px-2 py-0.5 rounded bg-amber-500-10 border border-amber-500-20">
                {rating ? rating.toFixed(2) : '0.00'}
              </span>
            </div>
          );
        }
      }
    ],
    []
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-500 h-500 bg-indigo-500/5 rounded-full blur-120 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/dashboard"
              className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-full flex-shrink-0 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Store className="w-6 h-6 text-purple-400" />
                Store Management
              </h1>
              <p className="text-xs text-slate-400">Register new storefront locations and associate owner profiles</p>
            </div>
          </div>
          <button
            onClick={() => {
              reset();
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-102 active:scale-98"
          >
            <Plus className="w-5 h-5" />
            <span>Create Store</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-slate-900-40 border border-slate-800-80 p-5 rounded-3xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800-60 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              Filter Stores
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
                placeholder="Search store name..."
                className="w-full px-4 py-2.5 bg-slate-950-60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-mini font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Store Address Search
              </label>
              <input
                type="text"
                name="address"
                value={filters.address}
                onChange={handleFilterChange}
                placeholder="Search address..."
                className="w-full px-4 py-2.5 bg-slate-950-60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Table representation */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500-10 border border-rose-500-20 text-rose-300 text-sm">
            {error}
          </div>
        )}

        {loading && stores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900-20 border border-slate-800-80 rounded-3xl">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <span className="text-slate-400 text-sm font-semibold">Loading stores...</span>
          </div>
        ) : (
          <SortableTable columns={columns} data={stores} sorting={sorting} setSorting={setSorting} />
        )}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950-80 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 p-8 h-full overflow-y-auto flex flex-col justify-between shadow-2xl animate-slide-in">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Store className="w-5 h-5 text-indigo-400" />
                  Add New Store
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500-10 border border-rose-500-20 text-rose-300 text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500-10 border border-emerald-500-20 text-emerald-300 text-sm">
                  {formSuccess}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmitStore)} className="space-y-5">
                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Store Name (min 20, max 60 chars)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter store name..."
                    className="w-full px-4 py-3 bg-slate-950-60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    {...register('name', {
                      required: 'Store name is required',
                      minLength: { value: 20, message: 'Store name must be at least 20 characters' },
                      maxLength: { value: 60, message: 'Store name cannot exceed 60 characters' }
                    })}
                  />
                  {formErrors.name && (
                    <span className="text-rose-400 text-xs mt-1 block">{formErrors.name.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Store Contact Email
                  </label>
                  <input
                    type="email"
                    placeholder="contact@store.com"
                    className="w-full px-4 py-3 bg-slate-950-60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    {...register('email', {
                      required: 'Store email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Valid email format required'
                      }
                    })}
                  />
                  {formErrors.email && (
                    <span className="text-rose-400 text-xs mt-1 block">{formErrors.email.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Assign Owner Account
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-slate-950-60 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
                    {...register('ownerId', { required: 'Please assign an owner' })}
                  >
                    <option value="">Select an Owner...</option>
                    {owners.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name} ({owner.email})
                      </option>
                    ))}
                  </select>
                  {formErrors.ownerId && (
                    <span className="text-rose-400 text-xs mt-1 block">{formErrors.ownerId.message}</span>
                  )}
                  {owners.length === 0 && (
                    <span className="text-slate-500 text-mini mt-1.5 block">
                      Note: Create an Owner account first in User Profiles Directory before configuring a store.
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Store Address (max 400 chars)
                  </label>
                  <textarea
                    placeholder="Enter store location address..."
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-950-60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    {...register('address', {
                      required: 'Store address is required',
                      maxLength: { value: 400, message: 'Address cannot exceed 400 characters' }
                    })}
                  />
                  {formErrors.address && (
                    <span className="text-rose-400 text-xs mt-1 block">{formErrors.address.message}</span>
                  )}
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 px-4 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {creating ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span>Create Store</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreList;

import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';
import SortableTable from '../../components/SortableTable';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  ArrowLeft,
  X,
  Plus,
  ChevronRight,
  Eye,
  AlertCircle
} from 'lucide-react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering & Sorting State
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
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

  // Fetch users from API with sorting and filters
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const sortBy = sorting[0]?.id || 'name';
      const order = sorting[0]?.desc ? 'desc' : 'asc';
      
      const queryParams = new URLSearchParams({
        sortBy,
        order,
        name: filters.name,
        email: filters.email,
        address: filters.address,
        role: filters.role
      });

      const response = await api.get(`/api/users?${queryParams.toString()}`);
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters, sorting]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ name: '', email: '', address: '', role: '' });
  };

  const onSubmitUser = async (data) => {
    setFormError('');
    setFormSuccess('');
    setCreating(true);
    try {
      const response = await api.post('/api/users', data);
      if (response.data.success) {
        setFormSuccess('User created successfully!');
        reset();
        fetchUsers();
        setTimeout(() => {
          setIsModalOpen(false);
          setFormSuccess('');
        }, 1500);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to create user.');
    } finally {
      setCreating(false);
    }
  };

  // TanStack Table columns definition
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => (
          <div className="font-semibold text-white">{info.getValue()}</div>
        )
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => <div className="text-slate-300">{info.getValue()}</div>
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: (info) => {
          const role = info.getValue();
          const badgeClass =
            role === 'admin'
              ? 'bg-rose-500-10 text-rose-400 border border-rose-500-20'
              : role === 'owner'
              ? 'bg-purple-500-10 text-purple-400 border border-purple-500-20'
              : 'bg-indigo-500-10 text-indigo-400 border border-indigo-500-20';
          return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${badgeClass}`}>
              {role}
            </span>
          );
        }
      },
      {
        accessorKey: 'address',
        header: 'Address',
        cell: (info) => (
          <div className="max-w-200 truncate text-slate-400" title={info.getValue()}>
            {info.getValue() || <span className="text-slate-600 italic">No address</span>}
          </div>
        )
      },
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: (info) => (
          <Link
            to={`/admin/users/${info.row.original.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all border border-slate-700"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </Link>
        )
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
                <Users className="w-6 h-6 text-indigo-400" />
                User Profiles Directory
              </h1>
              <p className="text-xs text-slate-400">View and manage registered user credentials and roles</p>
            </div>
          </div>
          <button
            onClick={() => {
              reset();
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600-10 hover:shadow-indigo-600-20 transition-all duration-200 transform hover:scale-102 active:scale-98"
          >
            <UserPlus className="w-5 h-5" />
            <span>Create User</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-slate-900-40 border border-slate-800-80 p-5 rounded-3xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800-60 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              Filter Records
            </h3>
            {(filters.name || filters.email || filters.address || filters.role) && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-mini font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Name Search
              </label>
              <input
                type="text"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                placeholder="Search name..."
                className="w-full px-4 py-2.5 bg-slate-950-60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-mini font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Search
              </label>
              <input
                type="text"
                name="email"
                value={filters.email}
                onChange={handleFilterChange}
                placeholder="Search email..."
                className="w-full px-4 py-2.5 bg-slate-950-60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-mini font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Address Search
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
            <div>
              <label className="block text-mini font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                User Role
              </label>
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 bg-slate-950-60 border border-slate-800 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* User Table */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500-10 border border-rose-500-20 text-rose-300 text-sm">
            {error}
          </div>
        )}

        {loading && users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900-20 border border-slate-800-80 rounded-3xl">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <span className="text-slate-400 text-sm font-semibold">Loading directory...</span>
          </div>
        ) : (
          <SortableTable columns={columns} data={users} sorting={sorting} setSorting={setSorting} />
        )}
      </div>

      {/* Creation Sliding Panel / Drawer (Simulating Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950-80 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 p-8 h-full overflow-y-auto flex flex-col justify-between shadow-2xl animate-slide-in">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-400" />
                  Add New User Profile
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

              <form onSubmit={handleSubmit(onSubmitUser)} className="space-y-5">
                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Full Name (min 3, max 60 chars)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter name..."
                    className="w-full px-4 py-3 bg-slate-950-60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    {...register('name', {
                      required: 'Full name is required',
                      minLength: { value: 3, message: 'Name must be at least 3 characters' },
                      maxLength: { value: 60, message: 'Name cannot exceed 60 characters' }
                    })}
                  />
                  {formErrors.name && (
                    <span className="text-rose-400 text-xs mt-1 block">{formErrors.name.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="user@storerating.com"
                    className="w-full px-4 py-3 bg-slate-950-60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    {...register('email', {
                      required: 'Email address is required',
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
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-950-60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Password must be 8 to 16 characters' },
                      maxLength: { value: 16, message: 'Password must be 8 to 16 characters' },
                      validate: {
                        hasUppercase: (v) => /[A-Z]/.test(v) || 'Requires 1 uppercase letter',
                        hasSpecial: (v) => /[!@#$%^&*]/.test(v) || 'Requires 1 special character (!@#$%^&*)'
                      }
                    })}
                  />
                  {formErrors.password && (
                    <span className="text-rose-400 text-xs mt-1 block">{formErrors.password.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Role Category
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-slate-950-60 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
                    {...register('role', { required: 'Please select a role' })}
                  >
                    <option value="user">User (Shopper)</option>
                    <option value="owner">Owner (Store Owner)</option>
                    <option value="admin">Admin (System Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Physical Address (max 400 chars)
                  </label>
                  <textarea
                    placeholder="Enter physical address..."
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-950-60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    {...register('address', {
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
                        <span>Create Profile</span>
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

export default UserList;

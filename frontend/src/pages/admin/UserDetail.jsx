import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowLeft, User, Mail, MapPin, Shield, Calendar, Store, Star, AlertTriangle } from 'lucide-react';

const UserDetail = () => {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await api.get(`/api/users/${id}`);
        if (response.data.success) {
          setUserInfo(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch user details.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center justify-center">
        <div className="p-6 max-w-md bg-rose-500-10 border border-rose-500-20 text-rose-300 rounded-3xl text-center space-y-4">
          <AlertTriangle className="w-12 h-12 mx-auto text-rose-400" />
          <h3 className="text-lg font-bold">Error Loading Profile</h3>
          <p className="text-sm">{error}</p>
          <Link
            to="/admin/users"
            className="inline-block px-5 py-2.5 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-500 h-500 bg-indigo-500/5 rounded-full blur-120 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {/* Top Header */}
        <div className="flex items-center gap-4">
          <Link
            to="/admin/users"
            className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-full flex-shrink-0 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Profile Details</h1>
            <p className="text-xs text-slate-400">Detailed overview of user registrations and stores</p>
          </div>
        </div>

        {/* User Card */}
        <div className="bg-slate-900-40 border border-slate-800-85 rounded-3xl p-8 backdrop-blur-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-full text-slate-300 flex-shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{userInfo.name}</h2>
                <span className="text-xs font-semibold text-slate-500">USER ID: {userInfo.id}</span>
              </div>
            </div>
            <div>
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  userInfo.role === 'admin'
                    ? 'bg-rose-500-10 text-rose-400 border-rose-500-20'
                    : userInfo.role === 'owner'
                    ? 'bg-purple-500-10 text-purple-400 border-purple-500-20'
                    : 'bg-indigo-500-10 text-indigo-400 border-indigo-500-20'
                }`}
              >
                {userInfo.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="detail-item">
              <div className="detail-icon-wrapper">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</h4>
                <p className="text-md text-white mt-1.5 font-semibold">{userInfo.email}</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon-wrapper">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Physical Address</h4>
                <p className="text-md text-white mt-1.5 font-semibold">
                  {userInfo.address || <span className="text-slate-600 italic">No physical address specified</span>}
                </p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon-wrapper">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Created</h4>
                <p className="text-md text-white mt-1.5 font-semibold">
                  {new Date(userInfo.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon-wrapper">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Last Updated</h4>
                <p className="text-md text-white mt-1.5 font-semibold">
                  {new Date(userInfo.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Store Card (If user is Owner) */}
        {userInfo.role === 'owner' && (
          <div className="bg-slate-900-40 border border-slate-800-85 rounded-3xl p-8 backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
              <Store className="w-5 h-5 text-purple-400" />
              Store Owner Affiliation
            </h3>

            {userInfo.store ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Store Name</h4>
                    <p className="text-lg font-bold text-white mt-1">{userInfo.store.name}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Store Contact</h4>
                    <p className="text-sm text-slate-300 mt-1">{userInfo.store.email}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Store Address</h4>
                    <p className="text-sm text-slate-300 mt-1">{userInfo.store.address}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-6 bg-slate-950-40 border border-slate-800-80 rounded-2xl">
                  <Star className="w-12 h-12 text-amber-400 fill-amber-400/20 star-glow-2 mb-3 animate-pulse" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Customer Rating</span>
                  <span className="text-5xl font-extrabold text-white mt-2 mb-1">
                    {userInfo.avg_rating !== null ? userInfo.avg_rating.toFixed(2) : '0.00'}
                  </span>
                  <span className="text-xs text-slate-500">Computed via shopper scores (1-5 stars)</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 bg-slate-950-20 border border-dashed border-slate-800 rounded-2xl text-center">
                <Store className="w-10 h-10 text-slate-600 mb-3" />
                <p className="text-slate-400 font-semibold">No store assigned to this owner</p>
                <p className="text-xs text-slate-500 mt-1">
                  You can register a store location and assign it to this owner in the{' '}
                  <Link to="/admin/stores" className="text-indigo-400 hover:underline">
                    Stores Management
                  </Link>{' '}
                  page.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;

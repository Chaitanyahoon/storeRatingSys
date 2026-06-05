import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Lock, Save, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const ChangePassword = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setSuccess(false);
    setSubmitting(true);
    try {
      const response = await api.patch('/api/users/me/password', {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      });

      if (response.data.success) {
        setSuccess(true);
        reset();
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to change password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500-10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-slate-900-40 border border-slate-800-80 p-8 rounded-3xl shadow-2xl backdrop-blur-xl relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/"
            className="p-2 bg-slate-800-60 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full flex-shrink-0 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-xl font-bold text-white">Change Password</h2>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500-10 border border-rose-500-20 text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500-10 border border-emerald-500-20 text-emerald-300 text-sm flex items-center gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 animate-bounce" />
            <span>Password updated successfully! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-950-60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                {...register('oldPassword', {
                  required: 'Current password is required'
                })}
              />
            </div>
            {errors.oldPassword && (
              <span className="text-rose-400 text-xs mt-1 block">{errors.oldPassword.message}</span>
            )}
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-950-60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: {
                    value: 8,
                    message: 'New password must be at least 8 characters'
                  },
                  maxLength: {
                    value: 16,
                    message: 'New password cannot exceed 16 characters'
                  },
                  validate: {
                    hasUppercase: (v) => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
                    hasSpecial: (v) => /[!@#$%^&*]/.test(v) || 'Password must contain at least one special character (!@#$%^&*)'
                  }
                })}
              />
            </div>
            {errors.newPassword && (
              <span className="text-rose-400 text-xs mt-1 block">{errors.newPassword.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || success}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-102 active:scale-98 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-lg shadow-indigo-600-20"
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Password</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';
import { User, Mail, Lock, MapPin, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

const Register = () => {
  const { login, user, loading } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setSubmitting(true);
    try {
      // 1. Call registration API
      const regResponse = await api.post('/api/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        address: data.address
      });

      if (regResponse.data.success) {
        setSuccess(true);
        // 2. Auto login
        await login(data.email, data.password);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Decorative gradient glowing circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500-10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-lg bg-slate-900-40 border border-slate-800-80 p-8 rounded-3xl shadow-2xl backdrop-blur-xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-slate-400 text-sm">Join the Store Rating Hub community</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500-10 border border-rose-500-20 text-rose-300 text-sm flex items-center gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500-10 border border-emerald-500-20 text-emerald-300 text-sm flex items-center gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 animate-bounce" />
            <span>Registration successful! Logging you in...</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Full Name (min 3, max 60 chars)
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Johnathan Fitzgerald Doe Jr."
                className="w-full pl-11 pr-4 py-3 bg-slate-950-60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                {...register('name', {
                  required: 'Full name is required',
                  minLength: {
                    value: 3,
                    message: 'Name must be at least 3 characters long'
                  },
                  maxLength: {
                    value: 60,
                    message: 'Name cannot exceed 60 characters'
                  }
                })}
              />
            </div>
            {errors.name && (
              <span className="text-rose-400 text-xs mt-1 block">{errors.name.message}</span>
            )}
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-950-60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please provide a valid email address'
                  }
                })}
              />
            </div>
            {errors.email && (
              <span className="text-rose-400 text-xs mt-1 block">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-950-60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  },
                  maxLength: {
                    value: 16,
                    message: 'Password cannot exceed 16 characters'
                  },
                  validate: {
                    hasUppercase: (v) => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
                    hasSpecial: (v) => /[!@#$%^&*]/.test(v) || 'Password must contain at least one special character (!@#$%^&*)'
                  }
                })}
              />
            </div>
            {errors.password && (
              <span className="text-rose-400 text-xs mt-1 block">{errors.password.message}</span>
            )}
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Physical Address (max 400 chars)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
              <textarea
                placeholder="1234 Main St, Apt 101, Seattle, WA 98101"
                rows="2"
                className="w-full pl-11 pr-4 py-3 bg-slate-950-60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                {...register('address', {
                  maxLength: {
                    value: 400,
                    message: 'Address cannot exceed 400 characters'
                  }
                })}
              ></textarea>
            </div>
            {errors.address && (
              <span className="text-rose-400 text-xs mt-1 block">{errors.address.message}</span>
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
                <UserPlus className="w-5 h-5" />
                <span>Register</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-800-60 pt-6">
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

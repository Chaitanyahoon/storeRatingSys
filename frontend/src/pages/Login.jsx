import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, Sparkles, Shield, User, Store } from 'lucide-react';

const Login = () => {
  const { login, user, loading } = useContext(AuthContext);
  const [error, setError] = useState('');
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
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setSubmitting(true);
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillCredentials = (email, password) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Decorative gradient glowing circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500-10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md login-card p-8 rounded-3xl backdrop-blur-xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Store Rating Hub
          </h1>
          <p className="text-slate-400 text-sm">Sign in to access your account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500-10 border border-rose-500-20 text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 premium-input rounded-xl text-white placeholder-slate-500 focus:outline-none transition-colors"
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
                className="w-full pl-11 pr-4 py-3 premium-input rounded-xl text-white placeholder-slate-500 focus:outline-none transition-colors"
                {...register('password', {
                  required: 'Password is required'
                })}
              />
            </div>
            {errors.password && (
              <span className="text-rose-400 text-xs mt-1 block">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-102 active:scale-98 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-lg shadow-indigo-600-20"
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-800-60 pt-6">
          <p className="text-slate-400 text-sm">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </div>

        {/* Demo Accounts Panel */}
        <div className="mt-6 border-t border-slate-800-60 pt-5">
          <div className="text-center mb-3">
            <span className="text-mini font-semibold text-slate-500 uppercase tracking-wider">
              Quick Demo Login
            </span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', width: '100%' }}>
            {/* System Admin */}
            <div
              onClick={() => fillCredentials('admin@storerating.com', 'Password123!')}
              className="cursor-pointer p-2 bg-slate-950-40 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-center transition-all group"
              style={{ minWidth: 0 }}
              title="Click to fill: admin@storerating.com"
            >
              <div className="text-xs font-bold text-slate-300 group-hover:text-rose-400 transition-colors">Admin</div>
              <div className="text-[10px] text-slate-600 truncate mt-0.5">admin@storerating.com</div>
            </div>

            {/* Store Owner */}
            <div
              onClick={() => fillCredentials('owner1@storerating.com', 'Password123!')}
              className="cursor-pointer p-2 bg-slate-950-40 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-center transition-all group"
              style={{ minWidth: 0 }}
              title="Click to fill: owner1@storerating.com"
            >
              <div className="text-xs font-bold text-slate-300 group-hover:text-purple-400 transition-colors">Owner</div>
              <div className="text-[10px] text-slate-600 truncate mt-0.5">owner1@storerating.com</div>
            </div>

            {/* Normal User */}
            <div
              onClick={() => fillCredentials('user1@storerating.com', 'Password123!')}
              className="cursor-pointer p-2 bg-slate-950-40 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-center transition-all group"
              style={{ minWidth: 0 }}
              title="Click to fill: user1@storerating.com"
            >
              <div className="text-xs font-bold text-slate-300 group-hover:text-indigo-400 transition-colors">Shopper</div>
              <div className="text-[10px] text-slate-600 truncate mt-0.5">user1@storerating.com</div>
            </div>
          </div>
          
          <div className="text-center mt-3">
            <span className="text-[10px] text-slate-600 font-medium">
              Demo Password: <code className="text-slate-500 font-mono">Password123!</code>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;

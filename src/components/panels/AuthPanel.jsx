import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { GlassCard } from '../ui/GlassCard';
import { LogIn, UserPlus, Loader2, AlertCircle } from 'lucide-react';

export const AuthPanel = () => {
  const { login, register, authError, authLoading } = useAppStore();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    if (isLogin) {
      await login(username.trim(), password);
    } else {
      await register(username.trim(), password);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <GlassCard className="p-8">
          {/* Logo / Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Clariflo
            </h1>
            <p className="text-white/50 text-sm mt-2">
              {isLogin ? 'Welcome back! Sign in to continue.' : 'Create an account to get started.'}
            </p>
          </div>

          {/* Error */}
          {authError && (
            <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              <AlertCircle size={16} />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                autoFocus
                disabled={authLoading}
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                disabled={authLoading}
              />
            </div>

            <button
              type="submit"
              disabled={authLoading || !username.trim() || !password.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn size={18} />
                  <span>Sign In</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="text-center mt-6">
            <button
              onClick={() => { setIsLogin(!isLogin); }}
              className="text-white/40 hover:text-white/70 text-sm transition-colors duration-300"
              disabled={authLoading}
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

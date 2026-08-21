import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, UserPlus, LogIn, Sparkles, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../../components/BrandLogo';
import { SEO } from '../../components/SEO';

export function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin, registerAdmin, loginWithGoogle, isAdmin } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        await loginAdmin(email, password);
      } else {
        await registerAdmin(email, password);
      }
      navigate('/admin');
    } catch (err: any) {
      console.error('Admin Auth Error:', err);
      const code = err.code || '';
      
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
        setError('Invalid credentials. If this is your first time, switch to "Create Admin Account" below.');
      } else if (code === 'auth/user-not-found') {
        setError('No account found with this email. Switch to "Create Admin Account" to set up your password.');
      } else if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Switch to "Sign In" mode.');
      } else if (code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.');
      } else if (code === 'auth/operation-not-allowed') {
        setError('Email/Password provider is not enabled in Firebase Console. You can use "Sign in with Google" or enable Email/Password in Firebase Authentication > Sign-in method.');
      } else if (code === 'auth/unauthorized-domain') {
        setError('This domain is not in your Firebase Authorized Domains list. Please add your Netlify/custom domain in Firebase Console > Authentication > Settings > Authorized domains.');
      } else {
        setError(err.message || 'Authentication failed. Please check your credentials or try Google Sign-In.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/admin');
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign in cancelled: Google popup was closed before completing.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError(`Domain not authorized by Firebase: "${currentHost}". In Firebase Console > Authentication > Settings > Authorized domains, click "Add domain" and add exactly: ${currentHost}`);
      } else {
        setError(err.message || 'Google sign-in failed. Please try again or use Email/Password.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEO title="Admin Portal Login - Skilldotpy" description="Secure educator login for managing notes and test series." />

      {/* Decorative gradient orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-2">
        <div className="flex justify-center mb-2">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl">
            <BrandLogo size="lg" />
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Restricted Educator Access</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Admin Portal
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Authorized educators only. Manage syllabus notes, CBT mock tests & practical sets.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
          
          {/* Quick 1-Click Google Sign In */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer border border-slate-200"
            >
              {googleLoading ? (
                <span className="text-slate-600">Connecting Google...</span>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>1-Click Sign in with Google</span>
                </>
              )}
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-800 w-full"></div>
              <span className="bg-slate-900 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Or with Email
              </span>
              <div className="border-t border-slate-800 w-full"></div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-5">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === 'register'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="space-y-1">
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@skilldotpy.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>{mode === 'login' ? 'Authenticating...' : 'Creating Admin User...'}</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Admin Dashboard' : 'Create & Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Setup tips toggle */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 w-full text-center"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHelp ? 'Hide Login Help' : 'Trouble logging in? Click for quick help'}</span>
            </button>

            {showHelp && (
              <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-2 leading-relaxed">
                <p className="font-semibold text-slate-300">Quick Tips for Admin Access:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li><strong>First time?</strong> Click <span className="text-blue-300 font-bold">1-Click Sign in with Google</span> or select <span className="text-blue-300 font-bold">Create Account</span> above to register your password.</li>
                  <li><strong>Hosted on Netlify?</strong> Go to <span className="text-slate-300">Firebase Console &gt; Authentication &gt; Settings &gt; Authorized domains</span> and make sure your Netlify domain (e.g. <code className="text-emerald-400">your-site.netlify.app</code>) is listed.</li>
                  <li><strong>Email/Password disabled?</strong> In Firebase Console &gt; Authentication &gt; Sign-in method, ensure <span className="text-slate-300">Email/Password</span> and <span className="text-slate-300">Google</span> are enabled.</li>
                </ul>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <a
              href="/"
              className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
            >
              ← Back to Main Website
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}


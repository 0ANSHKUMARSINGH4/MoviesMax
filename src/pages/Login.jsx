import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Film, ArrowRight, AlertCircle } from 'lucide-react';
import { loginUser, registerUser } from '../utils/movieApi';
import { GlobalContext } from '../context/GlobalState';
import { motionPageTransition } from '../utils/motion';

const InputField = ({ icon: Icon, type, placeholder, value, onChange, disabled, rightElement }) => (
  <div className="relative">
    <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full bg-[#111827] border border-white/10 rounded-full px-4 py-3 pl-10 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 transition-all"
    />
    {rightElement && (
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</div>
    )}
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(GlobalContext);

  const [tab, setTab] = useState('signin'); // 'signin' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sign In state
  const [siEmail, setSiEmail] = useState('');
  const [siPassword, setSiPassword] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  const switchTab = (t) => {
    setTab(t);
    setError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await loginUser({ email: siEmail, password: siPassword });
      await login(token, user);
      navigate('/');
    } catch (err) {
      setError(err?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (regPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (regPassword !== regConfirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const { token, user } = await registerUser({ name: regName, email: regEmail, password: regPassword });
      await login(token, user);
      navigate('/');
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const PasswordToggle = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className="text-gray-500 hover:text-gray-300 transition-colors"
      tabIndex={-1}
    >
      {show ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );

  return (
    <motion.div
      {...motionPageTransition}
      className="min-h-screen bg-dark-main flex flex-col items-center justify-center px-4 py-12"
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[120px]" />
      </div>

      {/* Auth Card */}
      <div className="relative w-full max-w-md bg-dark-card border border-white/10 rounded-3xl shadow-2xl p-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <Film size={22} className="text-blue-400" />
          </div>
          <h1 className="text-2xl font-black font-display bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent tracking-tight">
            MoviesMax
          </h1>
          <p className="text-gray-500 text-xs text-center">Your cinematic universe, personalized.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-6">
          <button
            onClick={() => switchTab('signin')}
            className={`flex-1 pb-3 text-sm font-semibold transition-all ${
              tab === 'signin'
                ? 'text-white border-b-2 border-blue-500 -mb-px'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => switchTab('register')}
            className={`flex-1 pb-3 text-sm font-semibold transition-all ${
              tab === 'register'
                ? 'text-white border-b-2 border-blue-500 -mb-px'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Sign In Form */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} className="flex flex-col gap-3">
            <InputField
              icon={Mail}
              type="email"
              placeholder="Email address"
              value={siEmail}
              onChange={(e) => setSiEmail(e.target.value)}
              disabled={loading}
            />
            <InputField
              icon={Lock}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={siPassword}
              onChange={(e) => setSiPassword(e.target.value)}
              disabled={loading}
              rightElement={
                <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
              }
            />

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        )}

        {/* Register Form */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="flex flex-col gap-3">
            <InputField
              icon={User}
              type="text"
              placeholder="Full name"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              disabled={loading}
            />
            <InputField
              icon={Mail}
              type="email"
              placeholder="Email address"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              disabled={loading}
            />
            <InputField
              icon={Lock}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (8+ characters)"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              disabled={loading}
              rightElement={
                <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
              }
            />
            <InputField
              icon={Lock}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={regConfirm}
              onChange={(e) => setRegConfirm(e.target.value)}
              disabled={loading}
              rightElement={
                <PasswordToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
              }
            />

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}

        {/* Guest link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors group"
          >
            Continue browsing without an account
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;

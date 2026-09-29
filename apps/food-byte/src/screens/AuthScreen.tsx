import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface AuthScreenProps {
  onSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const { theme } = useTheme();
  const { login, signup, verifyOtp, isLoading } = useAuth();
  const isDark = theme === 'dark';

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex@foodbytes.app');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['3', '5', '3', '3', '9', '3']);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'signup') {
        await signup(email, 'CONSUMER');
        setShowOtpModal(true);
      } else {
        await login(email, 'CONSUMER');
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    try {
      await verifyOtp(email, otpCode);
      setShowOtpModal(false);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid OTP code');
    }
  };

  return (
    <div className={`flex flex-col min-h-full ${isDark ? 'bg-[#131315]' : 'bg-[#fcf9f8]'}`}>
      {/* Top Vibrant Crimson Hero Backdrop */}
      <div
        className={`relative w-full h-64 overflow-hidden rounded-b-[2.5rem] shadow-lg flex flex-col justify-center items-center text-center p-6 ${
          isDark
            ? 'bg-gradient-to-b from-[#bd001a] via-[#8d0013] to-[#131315]'
            : 'bg-gradient-to-br from-[#bb0021] via-[#ea002c] to-[#bf0022]'
        }`}
      >
        {/* Culinary Pattern Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC0BrQJnHogARFj9bM8kAaDNAoFcp1BgVutFfEnA-QmDCEuvl0wqn3yKCODopyLGc7TEqIrrcJkZdyyr8wzCwKaJNB4o6bHRZB8ypNIfl5cxLdq2N-h9e33r4EzY1g1hoMfFA2UX6zgKJTqNEByNPJRagUya7ApaObVkJ1OjyzB85Clx74dQPPY_UUuEeft_tlm6gRuJSyzOMTWn6UrBls0-xEoM0e9g6md71s1_SFoR2KY6nBWxfs')",
          }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md mb-2 shadow-sm text-white">
            <span className="material-symbols-outlined text-[15px] icon-filled">restaurant</span>
            <span className="text-[11px] font-bold tracking-widest uppercase">Gourmet Delivery</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-sm flex items-center gap-1">
            FOOD BYTE
          </h1>
          <p className="text-xs text-white/90 tracking-wider font-bold uppercase mt-1">
            Never Feel Hungry
          </p>
        </div>
      </div>

      {/* Floating Authentication Card */}
      <div className="relative z-20 -mt-10 mx-4 mb-8">
        <div
          className={`w-full rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col ${
            isDark
              ? 'bg-[#1b1b1d] border border-white/[0.08] text-white shadow-black/60'
              : 'bg-white border border-black/[0.04] text-[#1c1b1b] shadow-surface-variant/40'
          }`}
        >
          {/* Segmented Pill Auth Switcher */}
          <div
            className={`w-full p-1 rounded-full flex items-center mb-6 ${
              isDark ? 'bg-[#252528]' : 'bg-[#f0edec]'
            }`}
          >
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-full text-xs font-bold text-center transition-all duration-300 ${
                mode === 'login'
                  ? isDark
                    ? 'bg-[#ff1e38] text-white shadow-md'
                    : 'bg-[#bb0021] text-white shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 rounded-full text-xs font-bold text-center transition-all duration-300 ${
                mode === 'signup'
                  ? isDark
                    ? 'bg-[#ff1e38] text-white shadow-md'
                    : 'bg-[#bb0021] text-white shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold opacity-80 px-1">Full Name</label>
                <div
                  className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                    isDark ? 'bg-[#201f21] border border-white/10' : 'bg-[#f6f3f2]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] opacity-60 mr-2">badge</span>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    required
                    className="w-full bg-transparent border-0 outline-none text-sm placeholder:opacity-40"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold opacity-80 px-1">Email Address</label>
              <div
                className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                  isDark ? 'bg-[#201f21] border border-white/10' : 'bg-[#f6f3f2]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] opacity-60 mr-2">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="alex@foodbytes.app"
                  required
                  className="w-full bg-transparent border-0 outline-none text-sm placeholder:opacity-40"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-bold opacity-80">Password</label>
                {mode === 'login' && (
                  <button type="button" className="text-[11px] font-bold text-[#bb0021] dark:text-[#ff1e38]">
                    Forgot?
                  </button>
                )}
              </div>
              <div
                className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                  isDark ? 'bg-[#201f21] border border-white/10' : 'bg-[#f6f3f2]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] opacity-60 mr-2">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-transparent border-0 outline-none text-sm placeholder:opacity-40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="opacity-60 hover:opacity-100"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-full font-bold text-sm tracking-wide text-white transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-2 ${
                isDark
                  ? 'bg-[#ff1e38] shadow-[#ff1e38]/30 hover:bg-[#ff344c]'
                  : 'bg-[#bb0021] shadow-[#bb0021]/30 hover:bg-[#d60026]'
              }`}
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Food Byte' : 'Create Free Account'}</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Social Logins */}
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-black/10 dark:border-white/10" />
            <span className="flex-shrink mx-4 text-[11px] font-bold uppercase tracking-wider opacity-50">
              Or continue with
            </span>
            <div className="flex-grow border-t border-black/10 dark:border-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                login('google.user@foodbytes.app');
                onSuccess();
              }}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all hover:scale-102 ${
                isDark ? 'border-white/10 bg-[#252528] text-white' : 'border-black/10 bg-white text-[#1c1b1b]'
              }`}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => {
                login('apple.user@foodbytes.app');
                onSuccess();
              }}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all hover:scale-102 ${
                isDark ? 'border-white/10 bg-[#252528] text-white' : 'border-black/10 bg-white text-[#1c1b1b]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">phone_iphone</span>
              <span>Apple</span>
            </button>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200 ${
              isDark ? 'bg-[#1b1b1d] text-white border border-white/10' : 'bg-white text-[#1c1b1b]'
            }`}
          >
            <div className="w-14 h-14 rounded-full bg-rose-500/10 text-[#bb0021] dark:text-[#ff1e38] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[28px]">mark_email_read</span>
            </div>
            <h3 className="font-extrabold text-lg">Verify Email OTP</h3>
            <p className="text-xs opacity-70 mt-1 mb-6">
              Enter the 6-digit verification code sent to <span className="font-bold">{email}</span>
            </p>

            <div className="flex gap-2 mb-6">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => {
                    const next = [...otp];
                    next[idx] = e.target.value;
                    setOtp(next);
                  }}
                  className={`w-10 h-12 text-center text-lg font-extrabold rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#bb0021] dark:focus:ring-[#ff1e38] ${
                    isDark ? 'bg-[#252528] border-white/10 text-white' : 'bg-[#f6f3f2] border-black/10 text-black'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isLoading}
              className="w-full py-3 rounded-full font-bold text-sm text-white bg-[#bb0021] dark:bg-[#ff1e38] shadow-md active:scale-95"
            >
              {isLoading ? 'Verifying...' : 'Confirm & Complete Registration'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

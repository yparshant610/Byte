import React, { useState } from 'react';
import { useMerchant } from '../context/MerchantContext';

export const MerchantAuthView: React.FC = () => {
  const { login, requestOtp, verifyOtpSignup, authLoading, authError } = useMerchant();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [signupStep, setSignupStep] = useState<1 | 2>(1);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('tony@tonyspizza.com');
  const [signInPassword, setSignInPassword] = useState('SecurePassword123!');

  // Sign Up Form State
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpRestaurantName, setSignUpRestaurantName] = useState('');
  const [signUpOwnerName, setSignUpOwnerName] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('+1 555-010-1002');
  const [signUpOtp, setSignUpOtp] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // Success / Info feedback message
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoMessage(null);
    try {
      await login(signInEmail, signInPassword);
    } catch {}
  };

  const handleQuickDemoFill = () => {
    setSignInEmail('tony@tonyspizza.com');
    setSignInPassword('SecurePassword123!');
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpEmail) return;
    setInfoMessage(null);
    try {
      await requestOtp(signUpEmail, signUpRestaurantName, signUpOwnerName);
      setInfoMessage(
        `Verification code dispatched to ${signUpEmail}. Please check your inbox and enter the 6-digit code below.`,
      );
      setSignUpOtp(''); // Require manual entry
      setSignupStep(2);
    } catch {}
  };

  const handleVerifySignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoMessage(null);
    try {
      await verifyOtpSignup({
        email: signUpEmail,
        otp: signUpOtp,
        password: signUpPassword,
        fullName: signUpOwnerName,
        phone: signUpPhone,
        restaurantName: signUpRestaurantName,
      });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans text-on-surface">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-xl border border-surface-container-high p-8 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/25 mb-3">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-on-surface">Food Byters</h1>
          <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mt-1">
            Merchant Kitchen & Menu Operations
          </p>
          <div className="flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-surface-container-low text-xs text-primary font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Supabase Cloud & Live API Connected</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-surface-container rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setInfoMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signin'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Sign In (Password)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setSignupStep(1);
              setInfoMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Partner Sign Up (OTP)
          </button>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{authError}</span>
          </div>
        )}

        {/* Info / Success Alert */}
        {infoMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{infoMessage}</span>
          </div>
        )}

        {/* MODE 1: SIGN IN */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Merchant Email Address
              </label>
              <div className="relative flex items-center">
                <svg className="w-5 h-5 absolute left-3.5 text-on-surface-variant pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  required
                  value={signInEmail}
                  onChange={e => setSignInEmail(e.target.value)}
                  placeholder="tony@tonyspizza.com"
                  className="w-full bg-surface-container-low text-on-surface text-xs font-semibold pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Password
                </label>
                <span className="text-[10px] text-primary font-bold">Standard Security</span>
              </div>
              <div className="relative flex items-center">
                <svg className="w-5 h-5 absolute left-3.5 text-on-surface-variant pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type="password"
                  required
                  value={signInPassword}
                  onChange={e => setSignInPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-surface-container-low text-on-surface text-xs font-semibold pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {authLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign In to Kitchen Portal</span>
                </>
              )}
            </button>

            {/* Quick Demo Pre-fill */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="text-xs text-on-surface-variant hover:text-primary transition-colors underline underline-offset-4 font-semibold"
              >
                Pre-fill Tony's Pizza credentials (Demo)
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: SIGN UP WITH OTP */}
        {mode === 'signup' && (
          <div>
            {signupStep === 1 ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Restaurant / Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={signUpRestaurantName}
                    onChange={e => setSignUpRestaurantName(e.target.value)}
                    placeholder="e.g. Tony's Artisan Pizza"
                    className="w-full bg-surface-container-low text-on-surface text-xs font-medium px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Head Chef / Owner Name
                  </label>
                  <input
                    type="text"
                    required
                    value={signUpOwnerName}
                    onChange={e => setSignUpOwnerName(e.target.value)}
                    placeholder="e.g. Tony Romano"
                    className="w-full bg-surface-container-low text-on-surface text-xs font-medium px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Official Email (OTP Verification)
                  </label>
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={e => setSignUpEmail(e.target.value)}
                    placeholder="partner@restaurant.com"
                    className="w-full bg-surface-container-low text-on-surface text-xs font-medium px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-[10px] text-on-surface-variant mt-1">
                    A real 6-digit OTP will be dispatched to this inbox via Gmail SMTP.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {authLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Send Verification Code (OTP)</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifySignup} className="space-y-4">
                <div className="p-3 bg-surface-container-low rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-on-surface-variant block text-[10px]">Code dispatched to:</span>
                    <strong className="text-on-surface">{signUpEmail}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSignupStep(1)}
                    className="text-primary text-[11px] font-bold hover:underline"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={signUpOtp}
                    onChange={e => setSignUpOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-surface-container-low text-center text-on-surface text-xl font-mono tracking-widest font-black py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Create Merchant Password
                  </label>
                  <input
                    type="password"
                    required
                    value={signUpPassword}
                    onChange={e => setSignUpPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-surface-container-low text-on-surface text-xs font-medium px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={signUpPhone}
                    onChange={e => setSignUpPhone(e.target.value)}
                    placeholder="+1 555-010-1002"
                    className="w-full bg-surface-container-low text-on-surface text-xs font-medium px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {authLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying & Setting Up...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Verify OTP & Launch Kitchen</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-surface-container text-center">
          <p className="text-[11px] text-on-surface-variant">
            Food Byters Partner Portal • Powered by PostgreSQL + PostGIS & Redis
          </p>
        </div>
      </div>
    </div>
  );
};

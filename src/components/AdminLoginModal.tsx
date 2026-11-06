import React, { useState } from 'react';
import { Lock, Shield, Eye, EyeOff, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('robinzood48@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [retryAfterSec, setRetryAfterSec] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);

  const { adminLogin } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setRemainingAttempts(null);
    setRetryAfterSec(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your admin email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your admin password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setErrorMessage(data.error || 'Too many failed attempts. Temporary lockout active.');
        setRetryAfterSec(data.retryAfterSec || 900);
        setRemainingAttempts(0);
        return;
      }

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Authentication failed. Please verify credentials.');
        if (data.remaining !== undefined) {
          setRemainingAttempts(data.remaining);
        }
        return;
      }

      // Success
      setSuccess(true);
      if (data.token) {
        localStorage.setItem('riwaaz_admin_token', data.token);
      }
      if (adminLogin) {
        adminLogin(data.user, data.token);
      }

      setTimeout(() => {
        setSuccess(false);
        setPassword('');
        onClose();
        if (onSuccess) onSuccess();
      }, 700);
    } catch (err: any) {
      setErrorMessage('Network error during authentication. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#D4C6B7] overflow-hidden text-[#25201C]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-[#25201C] text-[#FAF7F2] px-6 py-5 flex items-center justify-between border-b border-[#3D2D24]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#BFA069]/20 border border-[#BFA069]/40 flex items-center justify-center text-[#BFA069]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg tracking-wide text-[#FAF7F2]">
                Admin Sanctuary Portal
              </h3>
              <p className="text-[10px] text-[#A69888] tracking-widest uppercase font-mono">
                RBAC • Scrypt • HMAC Token
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#A69888] hover:text-[#FAF7F2] transition-colors p-1 rounded-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {success ? (
            <div className="py-8 flex flex-col items-center text-center">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mb-3 animate-bounce" />
              <h4 className="font-serif text-xl font-medium text-[#25201C]">
                Authentication Verified
              </h4>
              <p className="text-xs text-[#785A44] mt-1">
                Redirecting to RIWAAZ Curator Sanctuary...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Security Shield Banner */}
              <div className="p-3 rounded-xl bg-[#EDE5DA]/60 border border-[#D4C6B7] flex items-start gap-2.5 text-xs text-[#523F32]">
                <Shield className="w-4 h-4 text-[#BFA069] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-semibold text-[#25201C]">Restricted Access:</span> Secure session authentication protected by cryptographic password hashing, sliding-window rate limiting, and role-based permissions.
                </div>
              </div>

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{errorMessage}</p>
                    {remainingAttempts !== null && remainingAttempts > 0 && (
                      <p className="text-[11px] text-red-600 mt-0.5">
                        {remainingAttempts} attempt{remainingAttempts > 1 ? 's' : ''} remaining before temporary IP lockout.
                      </p>
                    )}
                    {retryAfterSec && (
                      <p className="text-[11px] text-red-700 mt-0.5">
                        Please wait {Math.ceil(retryAfterSec / 60)} minute(s) before attempting again.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-xs font-medium text-[#523F32] mb-1.5 uppercase tracking-wider">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="robinzood48@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#D4C6B7] text-[#25201C] text-sm focus:outline-none focus:border-[#BFA069] focus:ring-1 focus:ring-[#BFA069] transition-all"
                  autoComplete="email"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-medium text-[#523F32] mb-1.5 uppercase tracking-wider">
                  Admin Master Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-white border border-[#D4C6B7] text-[#25201C] text-sm focus:outline-none focus:border-[#BFA069] focus:ring-1 focus:ring-[#BFA069] transition-all"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E8F80] hover:text-[#25201C] transition-colors p-0.5"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg border border-[#D4C6B7] text-xs font-medium text-[#785A44] hover:bg-[#EDE5DA] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg bg-[#25201C] text-[#FAF7F2] hover:bg-[#BFA069] hover:text-[#25201C] text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shadow-md disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#FAF7F2] border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock Sanctuary</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security Footer Note */}
        <div className="bg-[#F5EFEB] px-6 py-3 border-t border-[#EDE5DA] flex items-center justify-between text-[11px] text-[#8A7969]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            256-bit TLS Protected
          </span>
          <span>Zero Credential Exposure</span>
        </div>
      </div>
    </div>
  );
};

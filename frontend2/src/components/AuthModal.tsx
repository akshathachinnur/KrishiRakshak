import React, { useState } from 'react';
import { loginWithGoogle, loginAnonymously } from '../lib/firebase';
import { X, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await loginAnonymously();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in as guest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-[#141e18] border border-[#2d3731] p-6 md:p-8 shadow-2xl flex flex-col gap-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#18221c] text-[#869582] hover:text-[#dae5dc] flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 text-[#5bf06c] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Agri-ID Authentication</span>
          </div>
          <h3 className="text-2xl font-bold text-[#dae5dc] tracking-tight">
            {currentUser ? 'Farmer Bio-ID Profile' : 'Access Field Vault'}
          </h3>
          <p className="text-sm text-[#bccbb6]">
            Synchronize your crop disease telemetry, leaf diagnostic history, and soil formulations in real-time across your mobile and tractor devices.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] text-xs">
            {error}
          </div>
        )}

        {currentUser ? (
          <div className="p-4 rounded-2xl bg-[#18221c] border border-[#2d3731] flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#39d353]/20 border border-[#5bf06c]/40 text-[#5bf06c] flex items-center justify-center font-bold text-lg">
                {currentUser.displayName ? currentUser.displayName[0] : 'K'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#dae5dc]">
                  {currentUser.displayName || (currentUser.isAnonymous ? 'Guest Farmer' : 'Verified Agronomist')}
                </span>
                <span className="text-xs text-[#869582]">
                  {currentUser.email || `ID: ${currentUser.uid.slice(0, 10)}...`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#5bf06c] font-medium pt-1">
              <span className="w-2 h-2 rounded-full bg-[#5bf06c] animate-pulse"></span>
              <span>Firestore Real-Time Sync Active</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-12 rounded-xl bg-white text-gray-900 font-semibold text-sm flex items-center justify-center gap-3 shadow hover:bg-gray-100 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              <span>{loading ? 'Authenticating...' : 'Sign In with Google'}</span>
            </button>

            <button
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#222c26] hover:bg-[#2d3731] border border-[#3d4a3b] text-[#dae5dc] font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4 text-[#5bf06c]" />
              <span>{loading ? 'Connecting...' : 'Instant Guest Farmer Mode'}</span>
            </button>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-[#869582] pt-2 border-t border-[#222c26]">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#5bf06c]" /> Zero data lock-in
          </span>
          <span>ICAR Security Standard</span>
        </div>
      </div>
    </div>
  );
};

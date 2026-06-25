import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordProps {
  onNavigate: (path: string) => void;
}

export default function ForgotPassword({ onNavigate }: ForgotPasswordProps) {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setResetToken(null);
    try {
      const res = await forgotPassword(email);
      setSuccess(res.message || 'Password reset request processed.');
      if (res.token) {
        setResetToken(res.token);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process password reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0c10] text-slate-100 p-4 relative overflow-hidden">
      {/* Background ambient glowing blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[420px] glass glass-border shadow-glow rounded-2xl p-8 relative z-10 space-y-6 animate-fade-in-up">
        {/* Back Link */}
        <button
          onClick={() => onNavigate('/signin')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </button>

        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-white">Reset Password</h2>
          <p className="text-xs text-slate-400">
            Enter your email address and we'll generate a recovery token to reset your password.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Reset Failed</p>
              <p className="opacity-90">{error}</p>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Request Sent</p>
              <p className="opacity-90">{success}</p>
            </div>
          </div>
        )}

        {/* Dev helper token box */}
        {resetToken && (
          <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-3">
            <div className="space-y-1">
              <p className="font-bold text-indigo-300">Sandbox Environment Token Detected:</p>
              <p className="text-[10px] text-slate-400 font-mono select-all bg-[#0a0c10]/50 p-2 rounded border border-white/[0.04] break-all">
                {resetToken}
              </p>
            </div>
            <button
              onClick={() => onNavigate(`/reset-password?token=${resetToken}`)}
              className="w-full h-8 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded font-semibold text-[11px] flex items-center justify-center gap-1 transition-all"
            >
              Go to Reset Form with this Token
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {!resetToken && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="w-[15px] h-[15px]" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full bg-[#12141c] border border-white/[0.08] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 transition-all outline-none"
                  placeholder="developer@retrotask.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/35 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Generate Reset Token
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

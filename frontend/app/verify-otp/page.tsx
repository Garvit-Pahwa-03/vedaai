'use client';
import { useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { verifyOTP, isLoading } = useAuthStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    try {
      await verifyOTP(email, code);
      router.replace('/assignments');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ebebeb] px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-9 h-9 bg-gradient-to-b from-amber-500 via-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <img
              src="https://framerusercontent.com/images/lbpUIfvyh4wK5fzYeLgNIYSWSo.png?width=461&height=461"
              className="w-5 h-5 object-contain mix-blend-lighten"
              alt="VedaAI"
            />
          </div>
          <span className="font-bold text-2xl text-gray-800">VedaAI</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Verify your email</h1>
          <p className="text-sm text-gray-400 mb-2">
            We sent a 6-digit OTP to
          </p>
          <p className="text-sm font-medium text-gray-800 mb-6">{email}</p>

          <form onSubmit={handleSubmit}>
            <div className="flex gap-2 justify-center mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  maxLength={1}
                  className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50"
                />
              ))}
            </div>

            {error && (
              <p className="text-xs text-red-500 text-center mb-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl text-white text-sm font-medium disabled:opacity-50 transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#1a1a1a' }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : 'Verify OTP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense>
      <VerifyOTPContent />
    </Suspense>
  );
}
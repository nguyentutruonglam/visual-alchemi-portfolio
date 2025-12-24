import React, { useState } from 'react';
import { signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Button } from './ui/Button';
import { Lock, ShieldCheck, Key } from 'lucide-react';

interface LoginProps {
  onSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'login' | '2fa'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // LƯU Ý BẢO MẬT: Đây chỉ là demo.
  // Trong thực tế, KHÔNG lưu PIN ở đây. Hãy gọi API xác thực lên server.
  const SECURITY_PIN = "123456"; 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Đăng nhập thành công, chuyển sang bước 2FA
      setStep('2fa');
    } catch (err: any) {
      console.error(err);
      // Xử lý thông báo lỗi chi tiết hơn
      const firebaseError = err as AuthError;
      if (firebaseError.code === 'auth/invalid-credential' || firebaseError.code === 'auth/user-not-found') {
          setError('Email hoặc mật khẩu không chính xác.');
      } else if (firebaseError.code === 'auth/too-many-requests') {
          setError('Đăng nhập thất bại quá nhiều lần. Vui lòng thử lại sau.');
      } else {
          setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handle2FA = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic này chỉ an toàn ở mức độ giao diện người dùng bình thường
    if (pin === SECURITY_PIN) {
        onSuccess();
    } else {
        setError('Mã PIN bảo mật không chính xác.');
        setPin(''); // Reset pin để nhập lại
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-lg shadow-2xl">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-700 ${step === 'login' ? 'bg-zinc-800' : 'bg-green-900/20'}`}>
             {step === 'login' ? <Lock className="text-amber-500" size={24} /> : <ShieldCheck className="text-green-500" size={24} />}
          </div>
          <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider">CMS Access</h2>
          <p className="text-zinc-500 text-sm mt-2">{step === 'login' ? 'Xác thực định danh quản trị viên' : 'Xác thực 2 lớp (2FA)'}</p>
        </div>

        {error && (
            <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-3 rounded mb-6 text-sm text-center animate-pulse">
                {error}
            </div>
        )}

        {step === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Admin Email</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 p-3 rounded text-white focus:border-amber-500 focus:outline-none transition-colors"
                    placeholder="admin@example.com"
                    required
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Password</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    // ĐÃ SỬA LỖI TYPO Ở ĐÂY: bf-zinc-950 -> bg-zinc-950
                    className="w-full bg-zinc-950 border border-zinc-700 p-3 rounded text-white focus:border-amber-500 focus:outline-none transition-colors"
                    placeholder="••••••••"
                    required
                />
            </div>
            <Button type="submit" className="w-full py-4 mt-2" disabled={loading}>
                {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
            </Button>
            <p className="text-center text-xs text-zinc-600 mt-4">
               Lưu ý: Bạn cần tạo tài khoản trong Firebase Console &gt; Authentication trước.
            </p>
            </form>
        ) : (
            <form onSubmit={handle2FA} className="space-y-6">
                <div className="text-center">
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-4">Nhập mã PIN bảo mật (Security Key)</label>
                    <div className="relative">
                        <Key className="absolute left-3 top-3.5 text-zinc-600" size={18} />
                        <input 
                            type="password" 
                            value={pin}
                            onChange={e => setPin(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-700 p-3 pl-10 rounded text-center text-2xl tracking-[0.5em] text-white focus:border-green-500 focus:outline-none transition-colors font-display"
                            placeholder="••••••"
                            maxLength={6}
                            autoFocus // Tự động focus khi chuyển qua bước này
                            required
                        />
                    </div>
                    <p className="text-xs text-zinc-600 mt-2">Mã mặc định: 123456</p>
                </div>
                <Button type="submit" className="w-full py-4 bg-green-600 hover:bg-green-500 text-white border-none">
                    Xác nhận
                </Button>
                <button type="button" onClick={() => setStep('login')} className="w-full text-zinc-500 text-xs hover:text-white transition-colors">
                    Quay lại đăng nhập
                </button>
            </form>
        )}
      </div>
    </div>
  );
};
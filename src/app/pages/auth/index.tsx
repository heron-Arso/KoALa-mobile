import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { Mail, Lock, User, Check } from 'lucide-react';
import { login, signup } from '@/api/auth';
import SocialLogin from '@/app/components/Auth/SocialLogin';

type Mode = 'login' | 'signup';

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<Mode>(
    location.pathname === '/signup' ? 'signup' : 'login'
  );
  // 전환 방향: 1 = 오른쪽으로(login→signup), -1 = 왼쪽으로(signup→login)
  const [slideDir, setSlideDir] = useState<1 | -1>(1);
  const [transitioning, setTransitioning] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 로그인 필드
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  // 회원가입 필드
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState('');

  const switchMode = (next: Mode) => {
    if (next === mode || transitioning) return;
    const dir = next === 'signup' ? 1 : -1;
    setSlideDir(dir);
    setError('');
    setTransitioning(true);
    setTimeout(() => {
      setMode(next);
      setTransitioning(false);
    }, 180);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoginSuccess('');
    setLoading(true);
    try {
      // 백엔드가 HttpOnly 쿠키로 토큰을 자동 설정 — localStorage 저장 불필요
      await login({ email: loginEmail, password: loginPassword });
      setLoginSuccess('로그인이 완료되었습니다. 홈으로 이동합니다.');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSignupSuccess('');
    if (signupPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{8,}$/;
    if (!passwordRegex.test(signupPassword)) {
      setError('비밀번호는 8자 이상이며, 영문·숫자·특수문자(@$!%*#?&^)를 각각 포함해야 합니다.');
      return;
    }
    if (!agreed) {
      setError('이용약관에 동의해주세요.');
      return;
    }
    setLoading(true);
    try {
      // 백엔드가 HttpOnly 쿠키로 토큰을 자동 설정 — localStorage 저장 불필요
      await signup({
        name,
        email: signupEmail,
        phone: signupPhone,
        password: signupPassword
      });
      setSignupSuccess('회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 전환 중: 나가는 방향으로 밀려나며 사라짐
  // 전환 후: 반대편에서 들어오며 나타남 (CSS transition이 없는 순간 반대 위치에 세팅)
  const formStyle: React.CSSProperties = {
    transform: transitioning
      ? `translateX(${slideDir * -16}px)`
      : 'translateX(0)',
    opacity: transitioning ? 0 : 1,
    transition: transitioning
      ? 'transform 0.18s ease-in, opacity 0.18s ease-in'
      : 'transform 0.22s ease-out, opacity 0.22s ease-out',
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center">
      <div className="px-8 py-12">
        <div className="max-w-md mx-auto">

          {/* 헤더 */}
          <div className="text-center mb-10">
            <h1 className="text-4xl tracking-tight mb-2">KoALa</h1>
            <p className="text-sm text-gray-400">Korean Art Laboratory</p>
          </div>

          {/* 슬라이딩 pill 토글 */}
          <div className="relative flex bg-gray-100 rounded-2xl p-1 mb-8">
            {/* 슬라이딩 배경 */}
            <div
              className="absolute top-1 bottom-1 rounded-xl bg-white shadow-sm"
              style={{
                width: 'calc(50% - 4px)',
                transform: mode === 'signup' ? 'translateX(calc(100% + 8px))' : 'translateX(0)',
                transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`relative z-10 flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                mode === 'login' ? 'text-black' : 'text-gray-500'
              }`}
            >
              로그인
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`relative z-10 flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                mode === 'signup' ? 'text-black' : 'text-gray-500'
              }`}
            >
              회원가입
            </button>
          </div>

          {/* 폼 카드 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 overflow-hidden">

            {/* 에러 */}
            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-500">
                {error}
              </div>
            )}

            {/* 성공 메시지 */}
            {mode === 'login' && loginSuccess && (
              <div className="mb-5 p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-600 flex items-center gap-2">
                <Check className="w-4 h-4" /> {loginSuccess}
              </div>
            )}

            {mode === 'signup' && signupSuccess && (
              <div className="mb-5 p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-600 flex items-center gap-2">
                <Check className="w-4 h-4" /> {signupSuccess}
              </div>
            )}

            {/* 슬라이드 + 페이드 전환 */}
            <div style={formStyle}>
              {mode === 'login' ? (
                <form className="space-y-5" onSubmit={handleLogin}>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">이메일</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-700">비밀번호</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        placeholder="비밀번호 입력"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <Link
                        to="/forgot-password"
                        className="text-xs text-gray-400 hover:text-black transition-colors"
                      >
                        비밀번호를 잊으셨나요?
                      </Link>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50 font-medium"
                  >
                    {loading ? '로그인 중...' : '로그인'}
                  </button>
                </form>
              ) : (
                <form className="space-y-5" onSubmit={handleSignup}>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">이름</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="이름 입력"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-700">이메일</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-700">전화번호</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="010-1234-5678"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-700">비밀번호</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        placeholder="8자 이상, 영문·숫자·특수문자 포함"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-700">비밀번호 확인</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        placeholder="비밀번호 재입력"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      id="agree-terms"
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-gray-300 flex-shrink-0 cursor-pointer"
                    />
                    <label htmlFor="agree-terms" className="text-xs text-gray-600 leading-relaxed cursor-pointer select-none">
                      <Link
                        to="/terms"
                        className="text-black underline underline-offset-2"
                        onClick={(e) => e.stopPropagation()}
                      >이용약관</Link>
                      {' '}및{' '}
                      <Link
                        to="/privacy"
                        className="text-black underline underline-offset-2"
                        onClick={(e) => e.stopPropagation()}
                      >개인정보 처리방침</Link>
                      에 동의합니다
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50 font-medium"
                  >
                    {loading ? '가입 중...' : '회원가입'}
                  </button>
                </form>
              )}
            </div>

            <SocialLogin isSignup={mode === 'signup'} />
          </div>

        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { Mail, Lock, User } from 'lucide-react';
import { login, signup, loginWithKakao, loginWithNaver } from '../../api/auth';

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

  // 회원가입 필드
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

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
    setLoading(true);
    try {
      await login({ email: loginEmail, password: loginPassword });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
      await signup({ name, email: signupEmail, password: signupPassword });
      navigate('/onboarding');
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

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-gray-300 flex-shrink-0"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      <Link to="/terms" className="text-black hover:underline">이용약관</Link>
                      {' '}및{' '}
                      <Link to="/privacy" className="text-black hover:underline">개인정보 처리방침</Link>
                      에 동의합니다
                    </span>
                  </label>

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

            {/* 구분선 */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-gray-400">소셜 로그인</span>
              </div>
            </div>

            {/* 소셜 로그인 */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => loginWithKakao()}
                className="w-full flex items-center justify-center gap-3 py-3 bg-[#FEE500] rounded-xl hover:bg-[#FDD800] transition-colors"
              >
                <span className="text-sm font-medium text-black">카카오로 계속하기</span>
              </button>
              <button
                type="button"
                onClick={() => loginWithNaver()}
                className="w-full flex items-center justify-center gap-3 py-3 bg-[#03C75A] rounded-xl hover:bg-[#02b350] transition-colors"
              >
                <span className="text-sm font-medium text-white">네이버로 계속하기</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

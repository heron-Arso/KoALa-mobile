import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { appLogin } from '@apps-in-toss/web-framework';
import { loginWithKakao, loginWithNaver, tossAppLogin } from '@/api/auth';

interface SocialLoginProps {
  isSignup: boolean;
}

export default function SocialLogin({ isSignup }: SocialLoginProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 앱인토스 토스 로그인 (토스 미니앱 환경에서만 동작)
  async function handleTossLogin() {
    try {
      // 1) 토스 SDK가 인가코드 발급 (10분 일회성)
      const { authorizationCode, referrer } = await appLogin();
      // 2) 서버로 즉시 전달 → mTLS 토큰교환 + 사용자정보 복호화 + 쿠키 발급
      await tossAppLogin(authorizationCode, referrer);
      // 3) 성공 → 홈으로
      navigate('/');
    } catch (e) {
      // 토스 앱 밖(일반 브라우저)에서는 appLogin이 실패
      console.error('토스 로그인 실패:', e);
    }
  }

  return (
    <>
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-4 bg-white text-gray-400">{t('auth.common.orContinueWith')}</span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleTossLogin}
          className="w-full flex items-center justify-center gap-3 py-3 bg-[#0064FF] rounded-xl hover:bg-[#0055DB] transition-colors"
        >
          <span className="text-sm font-medium text-white">토스로 계속하기</span>
        </button>
        <button
          type="button"
          onClick={() => loginWithKakao()}
          className="w-full flex items-center justify-center gap-3 py-3 bg-[#FEE500] rounded-xl hover:bg-[#FDD800] transition-colors"
        >
          <span className="text-sm font-medium text-black">
            {isSignup ? t('auth.signup.kakaoAlt') : t('auth.login.kakaoAlt')}
          </span>
        </button>
        <button
          type="button"
          onClick={() => loginWithNaver()}
          className="w-full flex items-center justify-center gap-3 py-3 bg-[#03C75A] rounded-xl hover:bg-[#02b350] transition-colors"
        >
          <span className="text-sm font-medium text-white">
            {isSignup ? t('auth.signup.naverAlt') : t('auth.login.naverAlt')}
          </span>
        </button>
      </div>
    </>
  );
}

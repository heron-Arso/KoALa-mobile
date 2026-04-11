import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function OAuth2Callback() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const error = searchParams.get('error');

    if (error) {
      // 백엔드가 ?error=oauth2_failed 로 리다이렉트
      navigate('/login');
      return;
    }

    // 백엔드가 HttpOnly 쿠키로 토큰을 이미 설정했으므로
    // withCredentials: true 인 axios가 자동으로 쿠키를 포함해 요청
    navigate('/');
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-[#FAFAFA]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">{t('auth.oauth.processing')}</p>
      </div>
    </div>
  );
}

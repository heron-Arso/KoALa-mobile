import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OAuth2Callback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const error = searchParams.get('error');
        if (error) {
            alert('소셜 로그인 실패');
            navigate('/login');
            return;
        }
        // 토큰은 서버가 HttpOnly 쿠키로 설정 — 별도 저장 불필요
        navigate('/');
    }, []);

    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-gray-500">로그인 처리 중...</p>
        </div>
    );
}

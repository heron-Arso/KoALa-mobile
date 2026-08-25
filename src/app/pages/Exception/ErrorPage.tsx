import { useNavigate, useRouteError } from 'react-router';
import { AlertCircle } from 'lucide-react';

export default function ErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError() as { status?: number; statusText?: string; message?: string } | null;

  const is404 = error?.status === 404;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <AlertCircle className="w-14 h-14 text-gray-200 mb-6" />

      <p className="text-xs text-gray-400 tracking-widest uppercase mb-3">
        {is404 ? '404 Not Found' : 'Error'}
      </p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {is404 ? '페이지를 찾을 수 없어요' : '문제가 발생했어요'}
      </h1>
      <p className="text-sm text-gray-400 mb-10 leading-relaxed">
        {is404
          ? '요청하신 페이지가 존재하지 않거나\n삭제되었을 수 있습니다.'
          : error?.message ?? '일시적인 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.'}
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => navigate('/')}
          className="w-full py-4 bg-koala-navy text-white rounded-2xl font-bold text-sm active:scale-[0.98] transition-transform"
        >
          홈으로 돌아가기
        </button>
        <button
          onClick={() => navigate(-1)}
          className="w-full py-4 border border-gray-200 rounded-2xl font-bold text-sm text-gray-600 active:scale-[0.98] transition-transform"
        >
          이전 페이지
        </button>
      </div>
    </div>
  );
}

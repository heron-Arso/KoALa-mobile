import { useNavigate } from 'react-router';
import { ArrowLeft, KeyRound, LogOut, Trash2, ChevronRight } from 'lucide-react';
import { logout } from '@/api/auth';
import { useDialog } from '@/mobile/hooks/useDialog';

export default function Settings() {
  const navigate = useNavigate();
  const { confirm } = useDialog();

  const handleLogout = async () => {
    const ok = await confirm('로그아웃 하시겠습니까?');
    if (!ok) return;
    try {
      await logout();
    } catch {
      // 서버 오류여도 로컬 세션 정리
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      {/* 헤더 */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-10">
        <div className="flex items-center gap-4 px-5 py-4">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-base font-bold text-gray-900">설정</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* 보안 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 pt-4 pb-2">
            <p className="text-xs font-semibold text-gray-400 tracking-wide uppercase">보안</p>
          </div>
          <button
            onClick={() => navigate('/forgot-password')}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors active:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <KeyRound className="w-4 h-4 text-gray-400" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800">비밀번호 변경</p>
                <p className="text-xs text-gray-400 mt-0.5">이메일로 재설정 링크를 보내드립니다</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        </div>

        {/* 세션 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 pt-4 pb-2">
            <p className="text-xs font-semibold text-gray-400 tracking-wide uppercase">세션</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors active:bg-gray-100 text-left"
          >
            <LogOut className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-800">로그아웃</p>
              <p className="text-xs text-gray-400 mt-0.5">현재 기기에서 로그아웃합니다</p>
            </div>
          </button>
        </div>

        {/* 위험 구역 */}
        <div className="bg-white rounded-2xl shadow-sm border border-red-50 overflow-hidden">
          <div className="px-5 pt-4 pb-2">
            <p className="text-xs font-semibold text-red-400 tracking-wide uppercase">위험 구역</p>
          </div>
          <button
            disabled
            className="w-full flex items-center justify-between px-5 py-4 opacity-40 cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-4 h-4 text-red-400" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800">회원 탈퇴</p>
                <p className="text-xs text-gray-400 mt-0.5">계정과 모든 데이터가 삭제됩니다 (준비 중)</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, KeyRound, LogOut, Trash2, ChevronRight, FileText, Shield } from 'lucide-react';
import { logout, withdraw } from '@/api/auth';
import { useDialog } from '@/mobile/hooks/useDialog';

export default function Settings() {
  const navigate = useNavigate();
  const { confirm, alert } = useDialog();
  const [withdrawing, setWithdrawing] = useState(false);

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

  const handleWithdraw = async () => {
    if (withdrawing) return;
    const ok = await confirm(
      '정말 탈퇴하시겠습니까?\n계정과 모든 데이터가 삭제되며 복구할 수 없습니다.',
      '회원 탈퇴',
    );
    if (!ok) return;
    setWithdrawing(true);
    try {
      await withdraw();
      await alert('회원 탈퇴가 완료되었습니다.');
      navigate('/login');
    } catch {
      await alert('탈퇴 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setWithdrawing(false);
    }
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

        {/* 약관 및 정책 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 pt-4 pb-2">
            <p className="text-xs font-semibold text-gray-400 tracking-wide uppercase">약관 및 정책</p>
          </div>
          <button
            onClick={() => navigate('/terms')}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors active:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-gray-400" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800">이용약관</p>
                <p className="text-xs text-gray-400 mt-0.5">서비스 이용약관을 확인합니다</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
          <button
            onClick={() => navigate('/privacy')}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors active:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-gray-400" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800">개인정보처리방침</p>
                <p className="text-xs text-gray-400 mt-0.5">개인정보 수집 및 이용 안내</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        </div>

        {/* 위험 구역 */}
        <div className="bg-white rounded-2xl shadow-sm border border-red-50 overflow-hidden">
          <div className="px-5 pt-4 pb-2">
            <p className="text-xs font-semibold text-red-400 tracking-wide uppercase">위험 구역</p>
          </div>
          <button
            onClick={handleWithdraw}
            disabled={withdrawing}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-red-50/50 transition-colors active:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-4 h-4 text-red-400" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800">회원 탈퇴</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {withdrawing ? '처리 중...' : '계정과 모든 데이터가 삭제됩니다'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
}

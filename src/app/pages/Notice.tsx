import { useNavigate } from 'react-router';
import { ArrowLeft, Bell } from 'lucide-react';

export default function Notice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 헤더 */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-10">
        <div className="flex items-center gap-4 px-5 py-4">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-base font-bold text-gray-900">공지사항</h1>
        </div>
      </div>

      {/* 공지 없음 상태 */}
      <div className="flex flex-col items-center justify-center py-32 text-center px-6">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Bell className="w-6 h-6 text-gray-300" />
        </div>
        <p className="text-gray-400 text-sm">아직 등록된 공지사항이 없습니다.</p>
      </div>
    </div>
  );
}

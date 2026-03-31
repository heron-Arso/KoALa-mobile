import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getMyProfile } from '../../api/user';

export default function AccountAddresses() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getMyProfile().then((res) => setUser(res.data.data)).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="pt-8 pb-16 px-4">
        <div className="mb-8">
          <h1 className="text-2xl tracking-tight mb-1">배송지 관리</h1>
          <p className="text-sm text-gray-400">배송지를 관리하세요</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg">저장된 배송지</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors text-sm">
            <Plus className="w-4 h-4" /> 배송지 추가
          </button>
        </div>

        {/* 추후 백엔드 연동 예정 */}
        <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200">
          <Plus className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">저장된 배송지가 없습니다.</p>
          <p className="text-sm text-gray-300">결제 시 배송지를 입력하시면 자동으로 저장됩니다.</p>
        </div>
      </div>
    </div>
  );
}

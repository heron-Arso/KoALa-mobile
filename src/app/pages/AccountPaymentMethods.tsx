import { CreditCard, Plus, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getMyProfile } from '../../api/user';

const paymentOptions = [
  { id: 'toss', name: '토스페이', icon: '💙', description: '토스 앱 간편 결제', color: 'bg-blue-50 border-blue-100' },
  { id: 'kakao', name: '카카오페이', icon: '💛', description: '카카오톡 간편 결제', color: 'bg-yellow-50 border-yellow-100' },
  { id: 'naver', name: '네이버페이', icon: '💚', description: '네이버 포인트 적립', color: 'bg-green-50 border-green-100' },
  { id: 'card', name: '신용/체크카드', icon: '💳', description: '일반 카드 직접 입력', color: 'bg-gray-50 border-gray-100' },
];

export default function AccountPaymentMethods() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getMyProfile()
      .then((res) => setUser(res.data.data))
      .catch(() => navigate('/login'));
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="pt-8 pb-16 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-1">결제 수단</h1>
          <p className="text-xs text-gray-400">결제 수단을 관리하세요.</p>
        </div>

        {/* 지원 결제 수단 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {paymentOptions.map((method) => (
            <div
              key={method.id}
              className={`bg-white rounded-2xl p-4 border ${method.color} flex items-center gap-3`}
            >
              <div className="text-3xl">{method.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{method.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{method.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 저장된 카드 — 추후 토스 연동 예정 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold">저장된 카드</h3>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors">
              <Plus className="w-3.5 h-3.5" /> 카드 추가
            </button>
          </div>
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl">
            <CreditCard className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm mb-1">저장된 카드가 없습니다.</p>
            <p className="text-xs text-gray-300">토스 페이먼츠 연동 후 카드를 등록할 수 있습니다.</p>
          </div>
        </div>

        {/* 보안 안내 */}
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold mb-1 text-blue-900 text-sm">안전한 결제 시스템</h3>
              <p className="text-xs text-blue-700 leading-relaxed">
                모든 결제 정보는 토스 페이먼츠의 PCI-DSS 인증 보안 시스템으로 암호화되어 보호됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

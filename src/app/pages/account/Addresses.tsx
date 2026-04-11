import { Plus, Edit2, Trash2, Badge } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getMyProfile, getMyAddresses, deleteAddress } from '@/api/user';
import { useDialog } from '@/mobile/hooks/useDialog';
import AddressModal from '@/app/components/modals/AddressModal';

export default function AccountAddresses() {
  const navigate = useNavigate();
  const { alert, confirm } = useDialog();
  const [user, setUser] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const fetchData = async () => {
    try {
      const profileRes = await getMyProfile();
      setUser(profileRes?.data?.data);

      const addressRes = await getMyAddresses();
      setAddresses(addressRes?.data?.data || []);
    } catch (e) {
      console.error('데이터 로딩 실패:', e);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddClick = () => {
    setModalMode('create');
    setSelectedAddress(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (address: any) => {
    setModalMode('edit');
    setSelectedAddress(address);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (address: any) => {
    const confirmed = await confirm(`'${address.label}' 배송지를 삭제하시겠습니까?`);
    if (!confirmed) return;

    try {
      await deleteAddress(address.id);
      setAddresses((prev) => prev.filter((a) => a.id !== address.id));
      await alert('배송지가 삭제되었습니다.');
    } catch (e: any) {
      await alert(e.response?.data?.message || '배송지 삭제에 실패했습니다.');
    }
  };

  const handleModalSuccess = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <div className="pt-8 pb-16 px-4 animate-pulse">
          <div className="h-10 bg-gray-100 rounded w-1/3 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-1/4 mb-8" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="pt-8 pb-16 px-4">
        <div className="mb-8">
          <h1 className="text-2xl tracking-tight mb-1">배송지 관리</h1>
          <p className="text-sm text-gray-400">배송지를 관리하세요</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg">저장된 배송지 ({addresses.length})</h2>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> 배송지 추가
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200">
            <Plus className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">저장된 배송지가 없습니다.</p>
            <p className="text-sm text-gray-300">배송지를 추가하여 빠르게 주문하세요.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium">{address.label}</h3>
                      {address.isDefault && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                          <Badge className="w-3 h-3" /> 기본
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{address.recipientName}</p>
                    <p className="text-sm text-gray-500">{address.recipientPhone}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(address)}
                      className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(address)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    {address.zipCode} {address.address1}
                  </p>
                  {address.address2 && (
                    <p className="text-sm text-gray-500">{address.address2}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 주소 관리 모달 */}
      <AddressModal
        isOpen={isModalOpen}
        mode={modalMode}
        address={selectedAddress}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}

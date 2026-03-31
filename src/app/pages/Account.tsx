import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { getMyProfile, updateMyProfile } from '../../api/user';
import { getMyOrders } from '../../api/order';
import { getWishlist } from '../../api/wishlist';
import { useDialog } from '../../mobile/hooks/useDialog';

export default function Account() {
  const navigate = useNavigate();
  const { alert } = useDialog();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [stats, setStats] = useState({ orders: 0, wishlist: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, ordersRes, wishlistRes] = await Promise.all([
          getMyProfile(),
          getMyOrders(0, 1),
          getWishlist(0, 1),
        ]);
        const profile = profileRes.data.data;
        setUser(profile);
        setForm({ name: profile.name ?? '', phone: profile.phone ?? '' });
        setStats({
          orders: ordersRes.data.data.totalElements ?? 0,
          wishlist: wishlistRes.data.data.totalElements ?? 0,
        });
      } catch (e) {
        console.error('프로필 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateMyProfile(form);
      setUser(res.data.data);
      await alert('저장되었습니다.');
    } catch (e) {
      await alert('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] pt-8 px-4 animate-pulse">
        <div className="h-80 bg-white rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="pt-8 pb-16 px-4">
        <div className="mb-8">
          <h1 className="text-2xl tracking-tight mb-1">My Account</h1>
          <p className="text-sm text-gray-400">Manage your KoALa account and preferences</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl mb-6">프로필 정보</h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-2 text-gray-700">이름</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">이메일</label>
              <input
                type="email"
                value={user?.email ?? ''}
                readOnly
                className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">이메일은 변경할 수 없습니다.</p>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">전화번호</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="01012345678"
                className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50"
              >
                {saving ? '저장 중...' : '변경사항 저장'}
              </button>
              <button
                type="button"
                onClick={() => setForm({ name: user?.name ?? '', phone: user?.phone ?? '' })}
                className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <p className="text-3xl font-light mb-1">{stats.orders}</p>
            <p className="text-xs text-gray-400">Total Orders</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <p className="text-3xl font-light mb-1">{stats.wishlist}</p>
            <p className="text-xs text-gray-400">Wishlist Items</p>
          </div>
        </div>
      </div>
    </div>
  );
}

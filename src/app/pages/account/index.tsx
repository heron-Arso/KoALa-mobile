import { useNavigate, Link } from 'react-router';
import { useEffect, useState } from 'react';
import {
  ChevronRight,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  User,
} from 'lucide-react';
import { getMyProfile, updateMyProfile } from '@/api/user';
import { getMyOrders } from '@/api/order';
import { getWishlist } from '@/api/wishlist';
import { logout } from '@/api/auth';
import { useDialog } from '@/mobile/hooks/useDialog';

const menuItems = [
  { icon: Package,    label: '주문 내역',   path: '/account/orders' },
  { icon: Heart,      label: '위시리스트',  path: '/account/wishlist' },
  { icon: MapPin,     label: '배송지 관리', path: '/account/addresses' },
  { icon: CreditCard, label: '결제 수단',   path: '/account/payment-methods' },
  { icon: Settings,   label: '설정',        path: '/account/settings' },
];

export default function Account() {
  const navigate = useNavigate();
  const { alert, confirm } = useDialog();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ orders: 0, wishlist: 0 });
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let redirecting = false;
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
      } catch {
        redirecting = true;
        navigate('/login');
      } finally {
        if (!redirecting) setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateMyProfile(form);
      setUser(res.data.data);
      setEditOpen(false);
      await alert('저장되었습니다.');
    } catch {
      await alert('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (!await confirm('로그아웃 하시겠습니까?')) return;
    try {
      await logout();
    } catch {
      // 쿠키 만료 등 실패해도 프론트에서 로그인 화면으로
    }
    navigate('/login');
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] pt-8 px-4 animate-pulse space-y-4">
        <div className="h-32 bg-white rounded-3xl" />
        <div className="h-20 bg-white rounded-3xl" />
        <div className="h-64 bg-white rounded-3xl" />
      </div>
    );
  }

  // 인증 실패 — navigate 호출 후 잠깐 렌더링되는 것 방지
  if (!user) return null;

  // 이름 이니셜 (아바타 대체)
  const initials = user.name?.slice(0, 1)?.toUpperCase() ?? '?';

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="pt-8 pb-24 px-4 space-y-4">

        {/* 프로필 헤더 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-koala-navy text-white flex items-center justify-center text-xl font-medium flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-lg truncate">{user.name}</p>
              <p className="text-sm text-gray-400 truncate">{user.email}</p>
            </div>
            <button
              onClick={() => setEditOpen((v) => !v)}
              className="p-2 rounded-xl hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              <User className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* 인라인 프로필 수정 */}
          {editOpen && (
            <form className="mt-5 space-y-4 border-t border-gray-100 pt-5" onSubmit={handleSave}>
              <div>
                <label className="block text-sm mb-1.5 text-gray-700">이름</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#F4F4F4] rounded-xl focus:outline-none focus:border-gray-300 border border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm mb-1.5 text-gray-700">전화번호</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="01012345678"
                  className="w-full px-4 py-3 bg-[#F4F4F4] rounded-xl focus:outline-none focus:border-gray-300 border border-transparent transition-colors"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-koala-navy text-white rounded-xl text-sm font-medium disabled:opacity-50"
                >
                  {saving ? '저장 중...' : '저장'}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditOpen(false); setForm({ name: user.name ?? '', phone: user.phone ?? '' }); }}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-sm"
                >
                  취소
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/account/orders" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center active:bg-gray-50">
            <p className="text-3xl font-light mb-1">{stats.orders}</p>
            <p className="text-xs text-gray-400">주문 내역</p>
          </Link>
          <Link to="/account/wishlist" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center active:bg-gray-50">
            <p className="text-3xl font-light mb-1">{stats.wishlist}</p>
            <p className="text-xs text-gray-400">위시리스트</p>
          </Link>
        </div>

        {/* 메뉴 리스트 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {menuItems.map(({ icon: Icon, label, path }, idx) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-4 px-5 py-4 active:bg-gray-50 transition-colors ${
                idx < menuItems.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <Icon className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <span className="flex-1 text-sm">{label}</span>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </Link>
          ))}
        </div>

        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 text-sm text-red-400 active:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>

      </div>
    </div>
  );
}

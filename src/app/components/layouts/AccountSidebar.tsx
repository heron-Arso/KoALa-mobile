import { Link, useNavigate } from 'react-router';
import { User, MapPin, CreditCard, Package, Heart, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const menuItems = [
  { icon: User, key: 'account.sidebar.profile', path: '/account' },
  { icon: Package, key: 'account.sidebar.order', path: '/account/orders' },
  { icon: MapPin, key: 'account.sidebar.address', path: '/account/addresses' },
  { icon: CreditCard, key: 'account.sidebar.payment', path: '/account/payment-methods' },
  { icon: Heart, key: 'account.sidebar.wishlist', path: '/account/wishlist' },
];

interface Props {
  currentPath: string;
  user: any;
}

export default function AccountSidebar({ currentPath, user }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.dispatchEvent(new Event('cart-updated'));
    navigate('/login');
  };

  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'KA';
  const displayName = user?.name ?? t('account.sidebar.defaultUsere');

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {initials}
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-gray-900 text-sm">
            {t('account.sidebar.greeting', { name: displayName })}
          </p>
          <p className="text-[10px] text-gray-400 font-mono truncate">{user?.email ?? ''}</p>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all whitespace-nowrap flex-shrink-0 ${
                isActive ? 'bg-black text-white' : 'text-gray-400 hover:text-black hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px]">{t(item.key)}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2.5 mt-3 w-full text-gray-400 hover:text-red-500 transition-colors border-t border-gray-100 pt-4"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-xs">{t('account.sidebar.logout')}</span>
      </button>
    </div>
  );
}

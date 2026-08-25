import { Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NOTIFICATION_KEYS = ['newReleases', 'priceDrops', 'newsletter'] as const;
type NotiKeys = typeof NOTIFICATION_KEYS[number];

interface Props {
  notifications: Record<NotiKeys, boolean>;
  onChange: (notis: Record<NotiKeys, boolean>) => void;
  onNext: () => void;
}

export default function NotificationsStep({ notifications, onChange, onNext }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in slide-in-from-right-4 duration-500">
      <div className="w-14 h-14 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mb-5">
        <Bell className="w-7 h-7 text-gray-400" />
      </div>
      <h2 className="text-2xl font-medium tracking-tight mb-2">{t('auth.onboarding.notifications.title')}</h2>
      <p className="text-gray-400 mb-6 text-sm">{t('auth.onboarding.notifications.desc')}</p>

      <div className="space-y-3 mb-7">
        {NOTIFICATION_KEYS.map((key) => (
          <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-[#F4F4F4]">
            <div className="flex-1 mr-4">
              <div className="font-semibold text-sm text-gray-900">
                {t(`auth.onboarding.notifications.items.${key}.label`)}
              </div>
              <div className="text-xs text-gray-400">
                {t(`auth.onboarding.notifications.items.${key}.desc`)}
              </div>
            </div>
            <label className="relative inline-block w-11 h-6 flex-shrink-0 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications[key]}
                onChange={(e) => onChange({ ...notifications, [key]: e.target.checked })}
                className="sr-only peer"
              />
              <span className="absolute inset-0 bg-gray-300 rounded-full transition-colors peer-checked:bg-koala-navy" />
              <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full py-4 bg-koala-navy text-white rounded-xl hover:bg-koala-navy-hover transition-all font-semibold"
      >
        {t('auth.onboarding.notifications.start')}
      </button>
      <p className="text-xs text-gray-400 text-center mt-3">
        {t('auth.onboarding.notifications.changeAnytime')}
      </p>
    </div>
  );
}

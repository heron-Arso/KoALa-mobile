import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  address: any;
  onChange: (address: any) => void;
  onNext: () => void;
  onSkip: () => void;
}

export default function AddressStep({ address, onChange, onNext, onSkip }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in slide-in-from-right-4 duration-500">
      <div className="w-14 h-14 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mb-5">
        <MapPin className="w-7 h-7 text-gray-400" />
      </div>
      <h2 className="text-2xl font-medium tracking-tight mb-2">{t('auth.onboarding.address.title')}</h2>
      <p className="text-gray-400 mb-6 text-sm">{t('auth.onboarding.address.desc')}</p>

      <div className="space-y-3 mb-7">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder={t('auth.onboarding.address.fullName')}
            value={address.fullName}
            onChange={(e) => onChange({ ...address, fullName: e.target.value })}
            className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 text-sm"
          />
          <input
            type="tel"
            placeholder={t('auth.onboarding.address.phone')}
            value={address.phone}
            onChange={(e) => onChange({ ...address, phone: e.target.value })}
            className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 text-sm"
          />
        </div>
        <input
          type="text"
          placeholder={t('auth.onboarding.address.zipCode')}
          value={address.zipCode}
          onChange={(e) => onChange({ ...address, zipCode: e.target.value })}
          className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 text-sm"
        />
        <input
          type="text"
          placeholder={t('auth.onboarding.address.address1')}
          value={address.address1}
          onChange={(e) => onChange({ ...address, address1: e.target.value })}
          className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 text-sm"
        />
        <input
          type="text"
          placeholder={t('auth.onboarding.address.address2')}
          value={address.address2}
          onChange={(e) => onChange({ ...address, address2: e.target.value })}
          className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 text-sm"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onSkip}
          className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm"
        >
          {t('auth.onboarding.address.later')}
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          {t('auth.onboarding.address.save')}
        </button>
      </div>
    </div>
  );
}

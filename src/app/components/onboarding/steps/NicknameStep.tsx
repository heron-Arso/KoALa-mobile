import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  nickname: string;
  onChange: (val: string) => void;
  onNext: () => void;
}

export default function NicknameStep({ nickname, onChange, onNext }: Props) {
  const { t } = useTranslation();

  const handleNextClick = () => {
    if (!nickname.trim()) {
      alert(t('auth.onboarding.nickname.validation'));
      return;
    }
    onNext();
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in slide-in-from-right-4 duration-500">
      <div className="w-14 h-14 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mb-5">
        <User className="w-7 h-7 text-gray-400" />
      </div>
      <h2 className="text-2xl font-medium tracking-tight mb-2">{t('auth.onboarding.nickname.title')}</h2>
      <p className="text-gray-400 mb-6 text-sm">{t('auth.onboarding.nickname.desc')}</p>

      <div className="mb-7">
        <label className="block text-sm font-medium mb-2 text-gray-700">{t('auth.onboarding.nickname.label')}</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('auth.onboarding.nickname.placeholder')}
          className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors text-base"
          autoFocus
        />
        <p className="text-xs text-gray-400 mt-2">{t('auth.onboarding.nickname.hint')}</p>
      </div>
      <button
        onClick={handleNextClick}
        className="w-full py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all font-medium"
      >
        {t('auth.onboarding.nickname.next')}
      </button>
    </div>
  );
}

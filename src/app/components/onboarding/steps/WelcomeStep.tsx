import { User, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function WelcomeStep({ onNext }: { onNext: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-16 h-16 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mx-auto mb-5">
        <User className="w-8 h-8 text-gray-400" />
      </div>
      <h1 className="text-2xl font-medium tracking-tight mb-3">{t('auth.onboarding.welcome.title')}</h1>
      <p className="text-gray-400 leading-relaxed mb-7 text-sm">{t('auth.onboarding.welcome.desc')}</p>
      <button
        onClick={onNext}
        className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all active:scale-95"
      >
        {t('auth.onboarding.welcome.start')}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

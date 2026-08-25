import { Heart, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PREFERENCE_KEYS = ['artworks', 'designToys', 'limitedEditions', 'collaborations'] as const;
type PrefKeys = typeof PREFERENCE_KEYS[number];

interface Props {
  preferences: Record<PrefKeys, boolean>;
  onChange: (prefs: Record<PrefKeys, boolean>) => void;
  onNext: () => void;
  onSkip: () => void;
}

export default function PreferencesStep({ preferences, onChange, onNext, onSkip }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in slide-in-from-right-4 duration-500">
      <div className="w-14 h-14 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mb-5">
        <Heart className="w-7 h-7 text-gray-400" />
      </div>
      <h2 className="text-2xl font-medium tracking-tight mb-2">{t('auth.onboarding.preferences.title')}</h2>
      <p className="text-gray-400 mb-6 text-sm">{t('auth.onboarding.preferences.desc')}</p>

      <div className="space-y-2 mb-7">
        {PREFERENCE_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => onChange({ ...preferences, [key]: !preferences[key] })}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              preferences[key] ? 'border-black bg-black/5' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm text-gray-900">
                  {t(`auth.onboarding.preferences.items.${key}.label`)}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {t(`auth.onboarding.preferences.items.${key}.desc`)}
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                preferences[key] ? 'border-black bg-koala-navy' : 'border-gray-200'
              }`}>
                {preferences[key] && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onSkip}
          className="flex-1 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm"
        >
          {t('auth.onboarding.preferences.skip')}
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-3 bg-koala-navy text-white rounded-xl hover:bg-koala-navy-hover transition-colors text-sm font-medium"
        >
          {t('auth.onboarding.preferences.next')}
        </button>
      </div>
    </div>
  );
}

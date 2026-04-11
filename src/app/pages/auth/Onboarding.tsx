import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useFirstLaunch } from '@/mobile/hooks/useFirstLaunch';
import { useDialog } from '@/mobile/hooks/useDialog';
import ProgressBar from '@/app/components/onboarding/ProgressBar';
import WelcomeStep from '@/app/components/onboarding/steps/WelcomeStep';
import NicknameStep from '@/app/components/onboarding/steps/NicknameStep';
import AddressStep from '@/app/components/onboarding/steps/AddressStep';
import PreferencesStep from '@/app/components/onboarding/steps/PreferencesStep';
import NotificationsStep from '@/app/components/onboarding/steps/NotificationsStep';

type OnboardingStep = 'welcome' | 'nickname' | 'address' | 'preferences' | 'notifications';

export default function Onboarding() {
  const navigate = useNavigate();
  const { markOnboardingComplete } = useFirstLaunch();
  const { alert } = useDialog();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [formData, setFormData] = useState({
    nickname: '',
    address: { fullName: '', phone: '', zipCode: '', address1: '', address2: '', city: '', country: '대한민국' },
    preferences: { artworks: false, designToys: false, limitedEditions: false, collaborations: false },
    notifications: { newReleases: true, priceDrops: true, newsletter: false },
  });

  const finish = () => {
    markOnboardingComplete();
    navigate('/');
  };

  const handleSkip = () => {
    if (currentStep === 'welcome') setCurrentStep('nickname');
    else if (currentStep === 'nickname') finish();
    else if (currentStep === 'address') setCurrentStep('preferences');
    else if (currentStep === 'preferences') setCurrentStep('notifications');
    else finish();
  };

  const handleNext = async () => {
    if (currentStep === 'welcome') {
      setCurrentStep('nickname');
    } else if (currentStep === 'nickname') {
      if (!formData.nickname.trim()) { await alert('닉네임을 입력해 주세요.'); return; }
      setCurrentStep('address');
    } else if (currentStep === 'address') {
      setCurrentStep('preferences');
    } else if (currentStep === 'preferences') {
      setCurrentStep('notifications');
    } else {
      finish();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-start justify-center px-4 py-8 pb-10">
      <div className="w-full max-w-lg">
        <ProgressBar currentStep={currentStep} onSkip={handleSkip} />

        {currentStep === 'welcome' && <WelcomeStep onNext={handleNext} />}

        {currentStep === 'nickname' && (
          <NicknameStep
            nickname={formData.nickname}
            onChange={(val) => setFormData({ ...formData, nickname: val })}
            onNext={handleNext}
          />
        )}

        {currentStep === 'address' && (
          <AddressStep
            address={formData.address}
            onChange={(address) => setFormData({ ...formData, address })}
            onNext={handleNext}
            onSkip={handleSkip}
          />
        )}

        {currentStep === 'preferences' && (
          <PreferencesStep
            preferences={formData.preferences}
            onChange={(preferences) => setFormData({ ...formData, preferences })}
            onNext={handleNext}
            onSkip={handleSkip}
          />
        )}

        {currentStep === 'notifications' && (
          <NotificationsStep
            notifications={formData.notifications}
            onChange={(notifications) => setFormData({ ...formData, notifications })}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
}

import { useTranslation } from 'react-i18next';

export default function ArtistLabHero() {
  const { t } = useTranslation();

  return (
    <section className="pt-6 pb-8 px-5">
      <div className="text-[10px] text-gray-400 tracking-[0.2em] mb-3 uppercase font-bold">
        {t('artistLab.hero.badge')}
      </div>
      <h1 className="text-3xl mb-2 tracking-tight font-bold leading-[1.2]">
        {t('artistLab.hero.title1')}
      </h1>
      <h1 className="text-3xl mb-4 tracking-tight font-bold leading-[1.2]">
        {t('artistLab.hero.title2')}
      </h1>
      <p className="text-sm text-gray-500 leading-relaxed break-keep">
        {t('artistLab.hero.description')}
      </p>
    </section>
  );
}

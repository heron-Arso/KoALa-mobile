import { useTranslation } from 'react-i18next';

export default function StoreHero() {
  const { t } = useTranslation();

  return (
    <section className="pt-6 pb-6 px-5">
      <div className="text-[10px] text-gray-400 tracking-[0.2em] mb-3 uppercase font-bold">
        {t('store.hero.badge')}
      </div>
      <h1 className="text-3xl mb-3 tracking-tight font-bold leading-[1.1]">
        {t('store.hero.title')}
      </h1>
      <p className="text-sm text-gray-500 leading-relaxed break-keep">
        {t('store.hero.description')}
      </p>
    </section>
  );
}

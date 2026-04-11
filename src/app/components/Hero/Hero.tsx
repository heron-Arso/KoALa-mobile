import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="px-4 pt-4">
      <div className="relative bg-gray-900 rounded-2xl overflow-hidden group">
        <div className="relative w-full" style={{ paddingBottom: '125%' }}>
          <div className="absolute inset-0 w-full h-full">
            <img
              src="https://cdn.iusm.co.kr/news/photo/202501/1048414_600697_3834.jpg"
              alt="Featured Art"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
            <div className="z-10 text-white">
              <div className="inline-block px-3 py-1 bg-white text-black text-[10px] font-bold tracking-wider uppercase rounded-full mb-4">
                {t('home.hero.badge')}
              </div>
              <h1 className="text-3xl mb-4 tracking-tight font-bold leading-[1.2]">
                {t('home.hero.defaultTitle')}
                <br />
                {t('home.hero.defaultSubtitle')}
              </h1>
              <p className="text-sm text-gray-200 leading-relaxed mb-6 opacity-90 break-keep">
                {t('home.hero.description')}
              </p>
              <Link
                to="/smart-store"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full hover:bg-gray-100 transition-all font-semibold text-sm"
              >
                {t('home.hero.shopNow')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

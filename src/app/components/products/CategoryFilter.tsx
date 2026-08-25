import { Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <Filter className="w-4 h-4 text-gray-400 shrink-0" />
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap border flex-shrink-0 ${
              selectedCategory === category
                ? 'bg-koala-red text-white border-koala-red'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-900'
            }`}
          >
            {t(`store.categories.${category}`)}
          </button>
        ))}
      </div>
    </div>
  );
}

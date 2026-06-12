import { Minus, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CartItemProps {
  item: any;
  onUpdateQuantity: (itemId: number, currentQty: number, delta: number) => void;
  onRemove: (itemId: number) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={item.primaryImageUrl ?? '/placeholder.svg'}
            alt={item.skuName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-sm leading-tight truncate">{item.skuName}</h3>
            <button
              onClick={() => onRemove(item.id)}
              className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-1">
            ₩{item.unitPrice.toLocaleString()} / {t('cart.item.perItem')}
          </p>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity, -1)}
                className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity, 1)}
                className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <p className="font-bold text-sm">₩{item.lineAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

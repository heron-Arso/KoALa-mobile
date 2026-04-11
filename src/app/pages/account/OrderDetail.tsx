import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
  ArrowLeft, Package, MapPin, CreditCard, Box,
  ChevronRight, Truck, CheckCircle, Clock, XCircle,
} from 'lucide-react';
import { getOrder, cancelOrder } from '@/api/order';
import { useDialog } from '@/mobile/hooks/useDialog';

const STATUS_INFO: Record<string, { label: string; color: string }> = {
  PENDING_PAYMENT: { label: '결제 대기', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
  PAID: { label: '결제 완료', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  PREPARING: { label: '상품 준비 중', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
  SHIPPED: { label: '배송 중', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  DELIVERED: { label: '배송 완료', color: 'bg-green-50 text-green-600 border-green-100' },
  CANCELLED: { label: '주문 취소', color: 'bg-gray-50 text-gray-500 border-gray-100' },
};

const STEPS = ['PENDING_PAYMENT', 'PAID', 'PREPARING', 'SHIPPED', 'DELIVERED'] as const;

function OrderStatusStepper({ status }: { status: string }) {
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-3 px-4 py-4 bg-gray-50 rounded-2xl">
        <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className="text-sm font-bold text-gray-500">주문이 취소되었습니다.</span>
      </div>
    );
  }

  const currentIdx = STEPS.indexOf(status as any);

  return (
    <div className="flex items-start gap-0">
      {STEPS.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        const label = STATUS_INFO[step]?.label ?? step;
        return (
          <div key={step} className="flex-1 flex flex-col items-center">
            <div className="flex items-center w-full">
              {idx > 0 && (
                <div className={`flex-1 h-0.5 mt-0 ${done || active ? 'bg-black' : 'bg-gray-200'}`} />
              )}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                active ? 'border-black bg-black' : done ? 'border-black bg-black' : 'border-gray-200 bg-white'
              }`}>
                {done || active ? (
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                )}
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 ${done ? 'bg-black' : 'bg-gray-200'}`} />
              )}
            </div>
            <span className={`text-[9px] mt-1.5 font-bold text-center leading-tight px-0.5 ${
              active ? 'text-black' : done ? 'text-gray-500' : 'text-gray-300'
            }`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function OrderDetail() {
  const { orderNo } = useParams<{ orderNo: string }>();
  const navigate = useNavigate();
  const { confirm, alert } = useDialog();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!orderNo) return;
    getOrder(orderNo)
      .then((res) => setOrder(res.data.data))
      .catch(() => navigate('/account/orders'))
      .finally(() => setLoading(false));
  }, [orderNo]);

  const handleCancel = async () => {
    if (!await confirm('정말로 주문을 취소하시겠습니까?')) return;
    setCancelling(true);
    try {
      await cancelOrder(orderNo!);
      setOrder((prev: any) => ({ ...prev, orderStatus: 'CANCELLED' }));
    } catch (e: any) {
      await alert(e.response?.data?.message || '주문 취소에 실패했습니다.');
    } finally {
      setCancelling(false);
    }
  };

  const statusInfo = order ? (STATUS_INFO[order.orderStatus] ?? STATUS_INFO['PAID']) : null;
  const canCancel = order && ['PENDING_PAYMENT', 'PAID', 'PREPARING'].includes(order.orderStatus);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-28">

      {/* 상단 헤더 */}
      <div className="sticky top-0 z-10 bg-[#FAFAFA]/95 backdrop-blur-sm px-4 pt-12 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/account/orders')}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-gray-700" />
        </button>
        <h1 className="text-lg font-black tracking-tight">주문 상세</h1>
      </div>

      <div className="px-4 pt-2 space-y-4">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="bg-white rounded-2xl h-32" />
            <div className="bg-white rounded-2xl h-48" />
            <div className="bg-white rounded-2xl h-36" />
          </div>
        ) : order ? (
          <>
            {/* 주문 요약 + 스텝퍼 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-start gap-2">
                <div className="space-y-2 min-w-0">
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase font-bold mb-0.5">주문 번호</p>
                    <p className="text-xs font-black text-gray-900 truncate">{order.orderNo}</p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase font-bold mb-0.5">주문 일자</p>
                      <p className="text-xs font-bold text-gray-700">
                        {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase font-bold mb-0.5">결제 금액</p>
                      <p className="text-xs font-black text-black">
                        ₩{Number(order.totalAmount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                {statusInfo && (
                  <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black border ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                )}
              </div>

              {/* 스텝퍼 */}
              <div className="px-5 py-6">
                <OrderStatusStepper status={order.orderStatus} />
              </div>
            </div>

            {/* 주문 상품 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-5">
                <Package className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-bold text-gray-900">주문 상품</h3>
              </div>

              <div className="space-y-4">
                {(order.items ?? []).map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex-shrink-0 border border-gray-50 flex items-center justify-center">
                      <Package className="w-7 h-7 text-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 line-clamp-2">
                        {item.skuName}
                      </p>
                      {item.artistName && (
                        <p className="text-xs text-gray-400 mt-0.5">{item.artistName}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">수량 {item.quantity}개</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-black text-gray-900">
                        ₩{Number(item.lineTotalAmount).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        ₩{Number(item.unitPrice).toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 금액 요약 */}
              <div className="mt-5 pt-5 border-t border-gray-50 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">상품 금액</span>
                  <span className="font-medium">₩{Number(order.productAmount ?? order.totalAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">배송비</span>
                  <span className="font-medium">
                    {Number(order.shippingAmount ?? 0) === 0 ? '무료' : `₩${Number(order.shippingAmount).toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
                  <span className="text-sm font-bold text-gray-900">총 결제 금액</span>
                  <span className="text-lg font-black text-black tracking-tighter">
                    ₩{Number(order.totalAmount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 배송지 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-bold text-gray-900">배송지 정보</h3>
              </div>
              {order.shipment ? (
                <div className="space-y-1 text-sm">
                  <p className="font-bold text-gray-900">
                    {order.shipment.recipientName}
                    <span className="font-normal text-gray-400 ml-2 text-xs">{order.shipment.recipientPhone}</span>
                  </p>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    [{order.shipment.zipCode}] {order.shipment.address1}
                    {order.shipment.address2 && ` ${order.shipment.address2}`}
                  </p>
                  {order.shipment.deliveryRequest && (
                    <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 mt-1">
                      {order.shipment.deliveryRequest}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400">배송지 정보 없음</p>
              )}
            </div>

            {/* 결제 수단 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-bold text-gray-900">결제 수단</h3>
              </div>
              <p className="text-sm font-bold text-gray-900">{order.paymentMethod ?? '결제 완료'}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(order.createdAt).toLocaleString('ko-KR')}
              </p>
            </div>

            {/* 액션 버튼 */}
            <div className="flex flex-col gap-3 pt-2">
              {order.orderStatus === 'SHIPPED' && (
                <button className="flex items-center justify-center gap-2 w-full py-4 bg-black text-white rounded-2xl font-bold text-sm active:scale-[0.98] transition-transform">
                  <Truck className="w-4 h-4" /> 배송 조회
                </button>
              )}
              {canCancel && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex items-center justify-center gap-2 w-full py-4 border border-red-200 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-50 active:scale-[0.98] transition-transform disabled:opacity-50"
                >
                  {cancelling ? '취소 중...' : '주문 취소'}
                </button>
              )}
              <Link
                to="/store"
                className="flex items-center justify-center gap-2 w-full py-4 border border-gray-200 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-50 active:scale-[0.98] transition-transform"
              >
                쇼핑 계속하기 <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

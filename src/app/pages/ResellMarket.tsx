import { Filter, TrendingUp, Shield, Globe, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';

const filters = ['전체', '아트 토이', '조각', '세라믹', '리미티드 에디션'];

const resellItems = [
  {
    id: '1',
    name: '하모니 스피릿',
    artist: '박지영',
    category: '프리미엄 아트 토이',
    originalPrice: 450000,
    currentPrice: 680000,
    priceChange: 51,
    image: 'https://images.unsplash.com/photo-1771515221699-dd1b7a2f86f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    edition: '125/500',
    condition: '미사용 신품 (Mint)',
    hasBlockchain: true,
  },
  {
    id: '2',
    name: '고요한 형상',
    artist: '이민호',
    category: '장식용 오브제',
    originalPrice: 890000,
    currentPrice: 1250000,
    priceChange: 40,
    image: 'https://images.unsplash.com/photo-1688673375205-fc457c8516bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    edition: '45/100',
    condition: '상태 우수 (Excellent)',
    hasBlockchain: true,
  },
  {
    id: '3',
    name: '미래의 유산',
    artist: '정우성',
    category: '리미티드 에디션',
    originalPrice: 1250000,
    currentPrice: 1890000,
    priceChange: 51,
    image: 'https://images.unsplash.com/photo-1764333785980-69a5dc4e514d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    edition: '12/50',
    condition: '미사용 신품 (Mint)',
    hasBlockchain: true,
  },
  {
    id: '4',
    name: '세라믹 드림',
    artist: '최혜원',
    category: '하이엔드 아트 액세서리',
    originalPrice: 320000,
    currentPrice: 425000,
    priceChange: 33,
    image: 'https://images.unsplash.com/photo-1706821856764-4e85de5482d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    edition: '210/300',
    condition: '상태 우수 (Excellent)',
    hasBlockchain: false,
  },
];

export default function ResellMarket() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('전체');

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-8 pb-24 px-4">
        {/* 헤더 */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 tracking-widest uppercase mb-2">Resell Market</p>
          <h1 className="text-2xl font-bold tracking-tight mb-1">프리미엄 아트 리셀</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            인증된 아트 굿즈와 블록체인 검증을 통한 신뢰할 수 있는 마켓플레이스
          </p>
        </div>

        {/* 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-6">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1.5" />
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all flex-shrink-0 ${
                selectedFilter === filter ? 'bg-koala-navy text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* 아이템 목록 */}
        <div className="space-y-4">
          {resellItems.map((item) => (
            <Link key={item.id} to={`/product/${item.id}`} className="block bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm active:scale-[0.98] transition-transform">
              <div className="flex gap-4 p-4">
                {/* 이미지 */}
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {item.hasBlockchain && (
                    <div className="absolute bottom-1 left-1">
                      <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-white/90 shadow-sm">
                        <Shield className="w-2.5 h-2.5 text-green-500" />
                        <span className="text-[8px] font-bold text-green-600">인증</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 정보 */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">{item.category}</p>
                  <h3 className="text-sm font-bold truncate mb-0.5">{item.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{item.artist}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black">₩{item.currentPrice.toLocaleString()}</span>
                    <span className="flex items-center gap-0.5 text-xs text-green-600 font-bold">
                      <TrendingUp className="w-3 h-3" />+{item.priceChange}%
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">발매가: ₩{item.originalPrice.toLocaleString()}</p>
                </div>
              </div>

              <div className="px-4 pb-4 flex items-center gap-4 text-xs text-gray-400">
                <span className="font-medium">{item.edition}</span>
                <span>•</span>
                <span>{item.condition}</span>
                <span className="ml-auto flex items-center gap-1"><Globe className="w-3 h-3" />전세계 배송</span>
              </div>
            </Link>
          ))}
        </div>

        {/* 신뢰 섹션 */}
        <div className="mt-8 p-6 bg-gray-50 rounded-3xl">
          <h2 className="text-lg font-bold mb-4 text-center">안심하고 거래하세요</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Shield className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <p className="text-xs font-bold mb-1">블록체인 검증</p>
              <p className="text-[10px] text-gray-400">100% 정품 인증</p>
            </div>
            <div>
              <Globe className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-xs font-bold mb-1">글로벌 배송</p>
              <p className="text-[10px] text-gray-400">전세계 특송</p>
            </div>
            <div>
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <p className="text-xs font-bold mb-1">마켓 인사이트</p>
              <p className="text-[10px] text-gray-400">실시간 시세</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

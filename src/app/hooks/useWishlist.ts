import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWishlist, addWishlist, removeWishlist, checkWishlist } from '@/api/wishlist';
import type { WishlistItem } from '@/api/types';

// 위시리스트 목록 훅
export function useWishlistItems(page = 0, size = 20) {
  const { data, isLoading, refetch } = useQuery<WishlistItem[]>({
    queryKey: ['wishlist', page],
    queryFn: async () => {
      const res = await getWishlist(page, size);
      return res.data.data.content ?? res.data.data ?? [];
    },
    retry: false,
  });

  return { items: data ?? [], isLoading, refetch };
}

// 개별 상품 위시리스트 상태 + 토글 훅
export function useWishlist(skuCode: string | undefined) {
  const queryClient = useQueryClient();
  const [optimistic, setOptimistic] = useState<boolean | null>(null);

  const { data: isWishlisted = false, isLoading } = useQuery<boolean>({
    queryKey: ['wishlist', 'check', skuCode],
    queryFn: async () => {
      const res = await checkWishlist(skuCode!);
      return res.data.data ?? false;
    },
    enabled: !!skuCode,
    retry: false,
  });

  const current = optimistic !== null ? optimistic : isWishlisted;

  const toggle = useCallback(async () => {
    if (!skuCode) return;
    const next = !current;
    setOptimistic(next);
    try {
      if (next) {
        await addWishlist(skuCode);
      } else {
        await removeWishlist(skuCode);
      }
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    } catch {
      setOptimistic(!next); // 롤백
    }
  }, [skuCode, current, queryClient]);

  return { isWishlisted: current, isLoading, toggle };
}

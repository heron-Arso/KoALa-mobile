import { Dialog } from '@capacitor/dialog';
import { Capacitor } from '@capacitor/core';

/**
 * 앱 다이얼로그 훅
 *
 * [왜 필요한가?]
 * 웹의 window.alert() / window.confirm()은 모바일 앱에서 동작은 하지만
 * 브라우저 스타일 팝업이 뜨기 때문에 앱스럽지 않음.
 * Capacitor Dialog를 쓰면 iOS/Android 네이티브 다이얼로그가 표시됨.
 * 웹 브라우저에서는 자동으로 window.alert/confirm으로 폴백.
 */
export function useDialog() {
  const alert = async (message: string, title?: string) => {
    if (Capacitor.isNativePlatform()) {
      await Dialog.alert({ title: title ?? 'KoALa', message });
    } else {
      window.alert(message);
    }
  };

  const confirm = async (message: string, title?: string): Promise<boolean> => {
    if (Capacitor.isNativePlatform()) {
      const { value } = await Dialog.confirm({ title: title ?? 'KoALa', message });
      return value;
    } else {
      return window.confirm(message);
    }
  };

  return { alert, confirm };
}

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Pin } from 'lucide-react';
import { getNotice, type NoticeItem } from '@/api/notice';

export default function NoticeDetail() {
  const { noticeCode } = useParams<{ noticeCode: string }>();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<NoticeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!noticeCode) return;
    getNotice(noticeCode)
      .then((res) => setNotice(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [noticeCode]);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 헤더 */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-10">
        <div className="flex items-center gap-4 px-5 py-4">
          <button onClick={() => navigate('/notice')} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-base font-bold text-gray-900 truncate">
            {notice?.title ?? '공지사항'}
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
      ) : notFound || !notice ? (
        <div className="flex flex-col items-center justify-center py-32 text-center px-6">
          <p className="text-gray-400 text-sm mb-4">존재하지 않는 공지사항입니다.</p>
          <button
            onClick={() => navigate('/notice')}
            className="text-sm text-black underline"
          >
            목록으로 돌아가기
          </button>
        </div>
      ) : (
        <div className="px-5 py-6">
          {/* 제목 영역 */}
          <div className="mb-6 pb-4 border-b border-gray-100">
            {notice.isPinned && (
              <span className="inline-flex items-center gap-1 text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full mb-3">
                <Pin className="w-3 h-3" />
                중요
              </span>
            )}
            <h2 className="text-lg font-bold text-gray-900 leading-snug mb-2">
              {notice.title}
            </h2>
            <p className="text-xs text-gray-400">
              {new Date(notice.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* 본문 */}
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {notice.content}
          </div>
        </div>
      )}
    </div>
  );
}

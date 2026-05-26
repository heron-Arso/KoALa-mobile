import instance from './instance';

// 아티스트 목록
export const getArtists = (page = 0, size = 20) =>
  instance.get('/api/v1/artists', { params: { page, size } });

// 아티스트 상세 (followCount, isFollowing 포함)
export const getArtist = (artistCode: string) =>
  instance.get(`/api/v1/artists/${artistCode}`);

// 팔로우 / 언팔로우
export const followArtist = (artistCode: string) =>
  instance.post(`/api/v1/artists/${artistCode}/follow`);

export const unfollowArtist = (artistCode: string) =>
  instance.delete(`/api/v1/artists/${artistCode}/follow`);

// 팔로우 상태 조회 (인증 엔드포인트 — 토큰 만료 시 401 → 자동 갱신)
export const getArtistFollowStatus = (artistCode: string) =>
  instance.get<{ data: boolean }>(`/api/v1/artists/${artistCode}/following`);

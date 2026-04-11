import instance from './instance';

// 내 정보 조회
export const getMyProfile = () =>
    instance.get('/api/v1/users/me');

// 내 정보 수정
export const updateMyProfile = (data) =>
    instance.patch('/api/v1/users/me', data);

// 내 배송지 목록 조회
export const getMyAddresses = () =>
    instance.get('/api/v1/users/addresses');

// 배송지 추가
export const createAddress = (data) =>
    instance.post('/api/v1/users/addresses', data);

// 배송지 수정
export const updateAddress = (addressId, data) =>
    instance.patch(`/api/v1/users/addresses/${addressId}`, data);

// 기본 배송지 설정
export const setDefaultAddress = (addressId) =>
    instance.patch(`/api/v1/users/addresses/${addressId}/default`);

// 배송지 삭제
export const deleteAddress = (addressId) =>
    instance.delete(`/api/v1/users/addresses/${addressId}`);
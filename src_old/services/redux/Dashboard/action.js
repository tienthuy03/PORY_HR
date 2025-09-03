export const HRDB001_LAY_DU_LIEU_THONG_KE = 'HRDB001_LAY_DU_LIEU_THONG_KE';
export const HRDB001_LAY_DU_LIEU_THONG_KE_S = 'HRDB001_LAY_DU_LIEU_THONG_KE_S';
export const HRDB001_LAY_DU_LIEU_THONG_KE_F = 'HRDB001_LAY_DU_LIEU_THONG_KE_F';
export const HRDB001_LAY_DU_LIEU_HOAT_DONG = 'HRDB001_LAY_DU_LIEU_HOAT_DONG';
export const HRDB001_LAY_DU_LIEU_HOAT_DONG_S =
  'HRDB001_LAY_DU_LIEU_HOAT_DONG_S';
export const HRDB001_LAY_DU_LIEU_HOAT_DONG_F =
  'HRDB001_LAY_DU_LIEU_HOAT_DONG_F';
export const HRDB001_LAY_DU_LIEU_LUONG = 'HRDB001_LAY_DU_LIEU_LUONG';
export const HRDB001_LAY_DU_LIEU_LUONG_S = 'HRDB001_LAY_DU_LIEU_LUONG_S';
export const HRDB001_LAY_DU_LIEU_LUONG_F = 'HRDB001_LAY_DU_LIEU_LUONG_F';

export const HRDB001LayDuLieuThongKe = () => {
  return {
    type: HRDB001_LAY_DU_LIEU_THONG_KE,
  };
};
export const HRDB001LayDuLieuThongKeS = (DuLieuThongKe) => {
  return {
    type: HRDB001_LAY_DU_LIEU_THONG_KE_S,
    DuLieuThongKe,
  };
};
export const HRDB001LayDuLieuThongKeF = () => {
  return {
    type: HRDB001_LAY_DU_LIEU_THONG_KE_F,
  };
};

export const HRDB001LayDuLieuHoatDong = () => {
  return {
    type: HRDB001_LAY_DU_LIEU_HOAT_DONG,
  };
};
export const HRDB001LayDuLieuHoatDongS = (DuLieuHoatDong) => {
  return {
    type: HRDB001_LAY_DU_LIEU_HOAT_DONG_S,
    DuLieuHoatDong,
  };
};
export const HRDB001LayDuLieuHoatDongF = () => {
  return {
    type: HRDB001_LAY_DU_LIEU_HOAT_DONG_F,
  };
};

export const HRDB001LayDuLieuLuong = () => {
  return {
    type: HRDB001_LAY_DU_LIEU_LUONG,
  };
};
export const HRDB001LayDuLieuLuongS = (DuLieuLuong) => {
  return {
    type: HRDB001_LAY_DU_LIEU_LUONG_S,
    DuLieuLuong,
  };
};
export const HRDB001LayDuLieuLuongF = () => {
  return {
    type: HRDB001_LAY_DU_LIEU_LUONG_F,
  };
};
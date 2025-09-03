export const HRTK004_LAY_DANH_SACH_PHONG_BAN =
  'HRTK004_LAY_DANH_SACH_PHONG_BAN';
export const HRTK004_LAY_DANH_SACH_PHONG_BAN_S =
  'HRTK004_LAY_DANH_SACH_PHONG_BAN_S';
export const HRTK004_LAY_DANH_SACH_PHONG_BAN_F =
  'HRTK004_LAY_DANH_SACH_PHONG_BAN_F';
export const HRTK004_SHOW_POPUP_PHONG_BAN = 'HRTK004_SHOW_POPUP_PHONG_BAN';
export const HRTK004_HIDE_POPUP_PHONG_BAN = 'HRTK004_HIDE_POPUP_PHONG_BAN';
export const HRTK004_CHON_PHONG_BAN = 'HRTK004_CHON_PHONG_BAN';
export const HRTK004_LAY_DU_LIEU = 'HRTK004_LAY_DU_LIEU';
export const HRTK004_LAY_DU_LIEU_S = 'HRTK004_LAY_DU_LIEU_S';
export const HRTK004_LAY_DU_LIEU_F = 'HRTK004_LAY_DU_LIEU_F';
export const HRTK004_CHON_NGAY = 'HRTK004_CHON_NGAY';
export const HRTK004ChonNgay = (ChonNgay) => {
  return {
    type: HRTK004_CHON_NGAY,
    ChonNgay,
  };
};
export const HRTK004LayDuLieu = () => {
  return {
    type: HRTK004_LAY_DU_LIEU,
  };
};

export const HRTK004LayDuLieuS = (DuLieuLaoDong) => {
  return {
    type: HRTK004_LAY_DU_LIEU_S,
    DuLieuLaoDong,
  };
};

export const HRTK004LayDuLieuF = () => {
  return {
    type: HRTK004_LAY_DU_LIEU_F,
  };
};

export const HRTK004ChonPhongBan = (ChonPhongBan) => {
  return {
    type: HRTK004_CHON_PHONG_BAN,
    ChonPhongBan,
  };
};
export const HRTK004LayDanhSachPhongBan = () => {
  return {
    type: HRTK004_LAY_DANH_SACH_PHONG_BAN,
  };
};

export const HRTK004LayDanhSachPhongBanS = (DanhSachPhongBan) => {
  return {
    type: HRTK004_LAY_DANH_SACH_PHONG_BAN_S,
    DanhSachPhongBan,
  };
};

export const HRTK004LayDanhSachPhongBanF = () => {
  return {
    type: HRTK004_LAY_DANH_SACH_PHONG_BAN_F,
  };
};

export const HRTK004ShowPopupPhongBan = () => {
  return {
    type: HRTK004_SHOW_POPUP_PHONG_BAN,
  };
};
export const HRTK004HidePopupPhongBan = () => {
  return {
    type: HRTK004_HIDE_POPUP_PHONG_BAN,
  };
};

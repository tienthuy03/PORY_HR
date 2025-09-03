export const HRTK002_LAY_DANH_SACH_PHONG_BAN =
  'HRTK002_LAY_DANH_SACH_PHONG_BAN';
export const HRTK002_LAY_DANH_SACH_PHONG_BAN_S =
  'HRTK002_LAY_DANH_SACH_PHONG_BAN_S';
export const HRTK002_LAY_DANH_SACH_PHONG_BAN_F =
  'HRTK002_LAY_DANH_SACH_PHONG_BAN_F';
export const HRTK002_SHOW_POPUP_PHONG_BAN = 'HRTK002_SHOW_POPUP_PHONG_BAN';
export const HRTK002_HIDE_POPUP_PHONG_BAN = 'HRTK002_HIDE_POPUP_PHONG_BAN';
export const HRTK002_SHOW_POPUP_YEAR = 'HRTK002_SHOW_POPUP_YEAR';
export const HRTK002_HIDE_POPUP_YEAR = 'HRTK002_HIDE_POPUP_YEAR';
export const HRTK002_CHON_PHONG_BAN = 'HRTK002_CHON_PHONG_BAN';
export const HRTK002_CHON_NAM = 'HRTK002_CHON_NAM';
export const HRTK002_LAY_DU_LIEU = 'HRTK002_LAY_DU_LIEU';
export const HRTK002_LAY_DU_LIEU_S = 'HRTK002_LAY_DU_LIEU_S';
export const HRTK002_LAY_DU_LIEU_F = 'HRTK002_LAY_DU_LIEU_F';

export const HRTK002LayDuLieu = () => {
  return {
    type: HRTK002_LAY_DU_LIEU,
  };
};

export const HRTK002LayDuLieuS = (DuLieuLuong) => {
  return {
    type: HRTK002_LAY_DU_LIEU_S,
    DuLieuLuong,
  };
};

export const HRTK002LayDuLieuF = () => {
  return {
    type: HRTK002_LAY_DU_LIEU_F,
  };
};

export const HRTK002ChonPhongBan = (ChonPhongBan) => {
  return {
    type: HRTK002_CHON_PHONG_BAN,
    ChonPhongBan,
  };
};
export const HRTK002ChonNam = (ChonNam) => {
  return {
    type: HRTK002_CHON_NAM,
    ChonNam,
  };
};
export const HRTK002LayDanhSachPhongBan = () => {
  return {
    type: HRTK002_LAY_DANH_SACH_PHONG_BAN,
  };
};

export const HRTK002LayDanhSachPhongBanS = (DanhSachPhongBan) => {
  return {
    type: HRTK002_LAY_DANH_SACH_PHONG_BAN_S,
    DanhSachPhongBan,
  };
};

export const HRTK002LayDanhSachPhongBanF = () => {
  return {
    type: HRTK002_LAY_DANH_SACH_PHONG_BAN_F,
  };
};

export const HRTK002ShowPopupPhongBan = () => {
  return {
    type: HRTK002_SHOW_POPUP_PHONG_BAN,
  };
};
export const HRTK002HidePopupPhongBan = () => {
  return {
    type: HRTK002_HIDE_POPUP_PHONG_BAN,
  };
};
export const HRTK002ShowPopupYear = () => {
  return {
    type: HRTK002_SHOW_POPUP_YEAR,
  };
};
export const HRTK002HidePopupYear = () => {
  return {
    type: HRTK002_HIDE_POPUP_YEAR,
  };
};

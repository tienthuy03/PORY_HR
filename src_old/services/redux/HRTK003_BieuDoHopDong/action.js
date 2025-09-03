export const HRTK003_LAY_DANH_SACH_PHONG_BAN =
  'HRTK003_LAY_DANH_SACH_PHONG_BAN';
export const HRTK003_LAY_DANH_SACH_PHONG_BAN_S =
  'HRTK003_LAY_DANH_SACH_PHONG_BAN_S';
export const HRTK003_LAY_DANH_SACH_PHONG_BAN_F =
  'HRTK003_LAY_DANH_SACH_PHONG_BAN_F';
export const HRTK003_SHOW_POPUP_PHONG_BAN = 'HRTK003_SHOW_POPUP_PHONG_BAN';
export const HRTK003_HIDE_POPUP_PHONG_BAN = 'HRTK003_HIDE_POPUP_PHONG_BAN';
export const HRTK003_CHON_PHONG_BAN = 'HRTK003_CHON_PHONG_BAN';
export const HRTK003_LAY_DU_LIEU = 'HRTK003_LAY_DU_LIEU';
export const HRTK003_LAY_DU_LIEU_S = 'HRTK003_LAY_DU_LIEU_S';
export const HRTK003_LAY_DU_LIEU_F = 'HRTK003_LAY_DU_LIEU_F';

export const HRTK003LayDuLieu = () => {
  return {
    type: HRTK003_LAY_DU_LIEU,
  };
};

export const HRTK003LayDuLieuS = (DuLieuHopDong) => {
  return {
    type: HRTK003_LAY_DU_LIEU_S,
    DuLieuHopDong,
  };
};

export const HRTK003LayDuLieuF = () => {
  return {
    type: HRTK003_LAY_DU_LIEU_F,
  };
};

export const HRTK003ChonPhongBan = (ChonPhongBan) => {
  return {
    type: HRTK003_CHON_PHONG_BAN,
    ChonPhongBan,
  };
};
export const HRTK003LayDanhSachPhongBan = () => {
  return {
    type: HRTK003_LAY_DANH_SACH_PHONG_BAN,
  };
};

export const HRTK003LayDanhSachPhongBanS = (DanhSachPhongBan) => {
  return {
    type: HRTK003_LAY_DANH_SACH_PHONG_BAN_S,
    DanhSachPhongBan,
  };
};

export const HRTK003LayDanhSachPhongBanF = () => {
  return {
    type: HRTK003_LAY_DANH_SACH_PHONG_BAN_F,
  };
};

export const HRTK003ShowPopupPhongBan = () => {
  return {
    type: HRTK003_SHOW_POPUP_PHONG_BAN,
  };
};
export const HRTK003HidePopupPhongBan = () => {
  return {
    type: HRTK003_HIDE_POPUP_PHONG_BAN,
  };
};

export const HRTI004_LOAD_DANH_SACH_NHAN_VIEN =
  'HRTI004_LOAD_DANH_SACH_NHAN_VIEN';
export const HRTI004_LOAD_DANH_SACH_NHAN_VIEN_S =
  'HRTI004_LOAD_DANH_SACH_NHAN_VIEN_S';
export const HRTI004_LOAD_DANH_SACH_NHAN_VIEN_F =
  'HRTI004_LOAD_DANH_SACH_NHAN_VIEN_F';
export const HRTI004_CHON_PHONG_BAN = 'HRTI004_CHON_PHONG_BAN';
export const HRTI004_ON_REFRESH = 'HRTI004_ON_REFRESH';
export const HRTI004_LOAD_DU_LIEU_PHONG_BAN = 'HRTI004_LOAD_DU_LIEU_PHONG_BAN';
export const HRTI004_LOAD_DU_LIEU_PHONG_BAN_S =
  'HRTI004_LOAD_DU_LIEU_PHONG_BAN_S';
export const HRTI004_LOAD_DU_LIEU_PHONG_BAN_F =
  'HRTI004_LOAD_DU_LIEU_PHONG_BAN_F';
export const HRTI004_SET_CHECK_ALL = 'HRTI004_SET_CHECK_ALL';
export const HRTI004_LOAD_DANH_SACH_MAY_CHAM_CONG =
  'HRTI004_LOAD_DANH_SACH_MAY_CHAM_CONG';
export const HRTI004_LOAD_DANH_SACH_MAY_CHAM_CONG_S =
  'HRTI004_LOAD_DANH_SACH_MAY_CHAM_CONG_S';
export const HRTI004_LOAD_DANH_SACH_MAY_CHAM_CONG_F =
  'HRTI004_LOAD_DANH_SACH_MAY_CHAM_CONG_F';

export const HRTI004_SHOW_POPUP_MAY_CHAM_CONG =
  'HRTI004_SHOW_POPUP_MAY_CHAM_CONG';
export const HRTI004_SHOW_POPUP_DANG_KY_KHUON_MAT =
  'HRTI004_SHOW_POPUP_DANG_KY_KHUON_MAT';

export const HRTI004_CHON_NHAN_VIEN = 'HRTI004_CHON_NHAN_VIEN';
export const HRTI004_LOAI_DANG_KY = 'HRTI004_LOAI_DANG_KY';

export const HRTI004ChonNhanVien = (ChonNhanVien) => {
  return {
    type: HRTI004_CHON_NHAN_VIEN,
    ChonNhanVien,
  };
};
export const HRTI004LoaiDangKy = (LoaiDangKy) => {
  return {
    type: HRTI004_LOAI_DANG_KY,
    LoaiDangKy,
  };
};
export const HRTI004ShowPopupDangKyKhuonMat = (ShowPopupDangKyKhuonMat) => {
  return {
    type: HRTI004_SHOW_POPUP_DANG_KY_KHUON_MAT,
    ShowPopupDangKyKhuonMat,
  };
};

export const HRTI004ShowPopupMayChamCong = (ShowPopupMayChamCong) => {
  return {
    type: HRTI004_SHOW_POPUP_MAY_CHAM_CONG,
    ShowPopupMayChamCong,
  };
};

export const HRTI004LoadDanhSachMayChamCongS = (DanhSachMayChamCong) => {
  return {
    type: HRTI004_LOAD_DANH_SACH_MAY_CHAM_CONG_S,
    DanhSachMayChamCong,
  };
};

export const HRTI004LoadDanhSachMayChamCongF = () => {
  return {
    type: HRTI004_LOAD_DANH_SACH_MAY_CHAM_CONG_F,
  };
};

export const HRTI004SetCheckAll = (CheckAll) => {
  return {
    type: HRTI004_SET_CHECK_ALL,
    CheckAll,
  };
};

export const HRTI004OnRefresh = (OnRefresh) => {
  return {
    type: HRTI004_ON_REFRESH,
    OnRefresh,
  };
};

export const HRTI004ChonPhongBan = (ChonPhongBan) => {
  return {
    type: HRTI004_CHON_PHONG_BAN,
    ChonPhongBan,
  };
};
export const HRTI004LoadDanhSachNhanVien = ({rf}) => {
  return {
    type: HRTI004_LOAD_DANH_SACH_NHAN_VIEN,
    rf,
  };
};
export const HRTI004LoadDanhSachNhanVienS = (DanhSachNhanVien) => {
  return {
    type: HRTI004_LOAD_DANH_SACH_NHAN_VIEN_S,
    DanhSachNhanVien,
  };
};
export const HRTI004LoadDanhSachNhanVienF = () => {
  return {
    type: HRTI004_LOAD_DANH_SACH_NHAN_VIEN_F,
  };
};
export const HRTI004LoadDuLieuPhongBan = () => {
  return {
    type: HRTI004_LOAD_DU_LIEU_PHONG_BAN,
  };
};
export const HRTI004LoadDuLieuPhongBanS = (DanhSachPhongBan) => {
  return {
    type: HRTI004_LOAD_DU_LIEU_PHONG_BAN_S,
    DanhSachPhongBan,
  };
};
export const HRTI004LoadDuLieuPhongBanF = () => {
  return {
    type: HRTI004_LOAD_DU_LIEU_PHONG_BAN_F,
  };
};

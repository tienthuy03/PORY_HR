export const HRTI005_LOAD_DANH_SACH_NHAN_VIEN =
  'HRTI005_LOAD_DANH_SACH_NHAN_VIEN';
export const HRTI005_LOAD_DANH_SACH_NHAN_VIEN_S =
  'HRTI005_LOAD_DANH_SACH_NHAN_VIEN_S';
export const HRTI005_LOAD_DANH_SACH_NHAN_VIEN_F =
  'HRTI005_LOAD_DANH_SACH_NHAN_VIEN_F';
export const HRTI005_CHON_PHONG_BAN = 'HRTI005_CHON_PHONG_BAN';
export const HRTI005_ON_REFRESH = 'HRTI005_ON_REFRESH';
export const HRTI005_LOAD_DU_LIEU_PHONG_BAN = 'HRTI005_LOAD_DU_LIEU_PHONG_BAN';
export const HRTI005_LOAD_DU_LIEU_PHONG_BAN_S =
  'HRTI005_LOAD_DU_LIEU_PHONG_BAN_S';
export const HRTI005_LOAD_DU_LIEU_PHONG_BAN_F =
  'HRTI005_LOAD_DU_LIEU_PHONG_BAN_F';
export const HRTI005_SET_CHECK_ALL = 'HRTI005_SET_CHECK_ALL';
export const HRTI005_LOAD_DANH_SACH_MAY_CHAM_CONG =
  'HRTI005_LOAD_DANH_SACH_MAY_CHAM_CONG';
export const HRTI005_LOAD_DANH_SACH_MAY_CHAM_CONG_S =
  'HRTI005_LOAD_DANH_SACH_MAY_CHAM_CONG_S';
export const HRTI005_LOAD_DANH_SACH_MAY_CHAM_CONG_F =
  'HRTI005_LOAD_DANH_SACH_MAY_CHAM_CONG_F';

export const HRTI005_SHOW_POPUP_MAY_CHAM_CONG =
  'HRTI005_SHOW_POPUP_MAY_CHAM_CONG';
export const HRTI005_SHOW_POPUP_DANG_KY_KHUON_MAT =
  'HRTI005_SHOW_POPUP_DANG_KY_KHUON_MAT';

export const HRTI005_CHON_NHAN_VIEN = 'HRTI005_CHON_NHAN_VIEN';
export const HRTI005_LOAI_DANG_KY = 'HRTI005_LOAI_DANG_KY';

export const HRTI005ChonNhanVien = ChonNhanVien => {
  return {
    type: HRTI005_CHON_NHAN_VIEN,
    ChonNhanVien,
  };
};
export const HRTI005LoaiDangKy = LoaiDangKy => {
  return {
    type: HRTI005_LOAI_DANG_KY,
    LoaiDangKy,
  };
};
export const HRTI005ShowPopupDangKyKhuonMat = ShowPopupDangKyKhuonMat => {
  return {
    type: HRTI005_SHOW_POPUP_DANG_KY_KHUON_MAT,
    ShowPopupDangKyKhuonMat,
  };
};

export const HRTI005ShowPopupMayChamCong = ShowPopupMayChamCong => {
  return {
    type: HRTI005_SHOW_POPUP_MAY_CHAM_CONG,
    ShowPopupMayChamCong,
  };
};

export const HRTI005LoadDanhSachMayChamCongS = DanhSachMayChamCong => {
  return {
    type: HRTI005_LOAD_DANH_SACH_MAY_CHAM_CONG_S,
    DanhSachMayChamCong,
  };
};

export const HRTI005LoadDanhSachMayChamCongF = () => {
  return {
    type: HRTI005_LOAD_DANH_SACH_MAY_CHAM_CONG_F,
  };
};

export const HRTI005SetCheckAll = CheckAll => {
  return {
    type: HRTI005_SET_CHECK_ALL,
    CheckAll,
  };
};

export const HRTI005OnRefresh = OnRefresh => {
  return {
    type: HRTI005_ON_REFRESH,
    OnRefresh,
  };
};

export const HRTI005ChonPhongBan = ChonPhongBan => {
  return {
    type: HRTI005_CHON_PHONG_BAN,
    ChonPhongBan,
  };
};
export const HRTI005LoadDanhSachNhanVien = ({rf}) => {
  return {
    type: HRTI005_LOAD_DANH_SACH_NHAN_VIEN,
    rf,
  };
};
export const HRTI005LoadDanhSachNhanVienS = DanhSachNhanVien => {
  return {
    type: HRTI005_LOAD_DANH_SACH_NHAN_VIEN_S,
    DanhSachNhanVien,
  };
};
export const HRTI005LoadDanhSachNhanVienF = () => {
  return {
    type: HRTI005_LOAD_DANH_SACH_NHAN_VIEN_F,
  };
};
export const HRTI005LoadDuLieuPhongBan = () => {
  return {
    type: HRTI005_LOAD_DU_LIEU_PHONG_BAN,
  };
};
export const HRTI005LoadDuLieuPhongBanS = DanhSachPhongBan => {
  return {
    type: HRTI005_LOAD_DU_LIEU_PHONG_BAN_S,
    DanhSachPhongBan,
  };
};
export const HRTI005LoadDuLieuPhongBanF = () => {
  return {
    type: HRTI005_LOAD_DU_LIEU_PHONG_BAN_F,
  };
};

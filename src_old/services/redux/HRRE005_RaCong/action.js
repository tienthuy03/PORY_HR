export const action = {
  HRRE005_LOAD_LY_DO_RA_CONG: 'HRRE005_LOAD_LY_DO_RA_CONG',
  HRRE005_LOAD_LY_DO_RA_CONG_S: 'HRRE005_LOAD_LY_DO_RA_CONG_S',
  HRRE005_LOAD_LY_DO_RA_CONG_F: 'HRRE005_LOAD_LY_DO_RA_CONG_F',
  HRRE005_LOAD_DATA_RA_CONG: 'HRRE005_LOAD_DATA_RA_CONG',
  HRRE005_LOAD_DATA_RA_CONG_S: 'HRRE005_LOAD_DATA_RA_CONG_S',
  HRRE005_LOAD_DATA_RA_CONG_F: 'HRRE005_LOAD_DATA_RA_CONG_F',
  HRRE005_SET_DANH_SACH_TO_TRUONG: 'HRRE005_SET_DANH_SACH_TO_TRUONG',
  HRRE005_SET_DANH_SACH_TRUONG_BO_PHAN: 'HRRE005_SET_DANH_SACH_TRUONG_BO_PHAN',
  HRRE005_SET_LY_DO_RA_CONG: 'HRRE005_SET_LY_DO_RA_CONG',
  HRRE005_SHOW_POPUP_LYDO: 'HRRE005_SHOW_POPUP_LYDO',
  HRRE005_HIDE_POPUP_LYDO: 'HRRE005_HIDE_POPUP_LYDO',
  HRRE005_SHOW_POPUP_NGUOIPHEDUYET: 'HRRE005_SHOW_POPUP_NGUOIPHEDUYET',
  HRRE005_HIDE_POPUP_NGUOIPHEDUYET: 'HRRE005_HIDE_POPUP_NGUOIPHEDUYET',
  HRRE005_SHOW_NGUOIPHEDUYET: 'HRRE005_SHOW_NGUOIPHEDUYET',
  HRRE005_HIDE_NGUOIPHEDUYET: 'HRRE005_HIDE_NGUOIPHEDUYET',
  HRRE005_CHON_TO_TRUONG: 'HRRE005_CHON_TO_TRUONG',
  HRRE005_CHON_TRUONG_BO_PHAN: 'HRRE005_CHON_TRUONG_BO_PHAN',
  HRRE005_DS_NGAY_BAT_DAU: 'HRRE005_DS_NGAY_BAT_DAU',
  HRRE005_DS_NGAY_KET_THUC: 'HRRE005_DS_NGAY_KET_THUC',
  HRRE005_DS_NGUOI_PHE_DUYET: 'HRRE005_DS_NGUOI_PHE_DUYET',
  HRRE005_TINH_TRANG_PHE_DUYET: 'HRRE005_TINH_TRANG_PHE_DUYET',
  HRRE005_SET_VE_VIEC: 'HRRE005_SET_VE_VIEC',
  HRRE005_SELECTED_VE_VIEC: 'HRRE005_SELECTED_VE_VIEC',
  HRRE005_SHOW_POPUP_VE_VIEC: 'HRRE005_SHOW_POPUP_VE_VIEC',
  HRRE005_SET_START_TIME: 'HRRE005_SET_START_TIME',
  HRRE005_SET_END_TIME: 'HRRE005_SET_END_TIME',
  HRRE005_SET_WORK_DATE: 'HRRE005_SET_WORK_DATE',
  HRRE005_SET_DESCRIPTION: 'HRRE005_SET_DESCRIPTION',
};
export const HRRE005SetStartTime = (startTime) => {
  return {
    type: action.HRRE005_SET_START_TIME,
    startTime,
  };
};
export const HRRE005SetEndTime = (endTime) => {
  return {
    type: action.HRRE005_SET_END_TIME,
    endTime,
  };
};
export const HRRE005SetVeViec = (dataVeViec) => {
  return {
    type: action.HRRE005_SET_VE_VIEC,
    dataVeViec,
  };
};

export const HRRE005ShowPopupVeViec = (ShowPopupVeViec) => {
  return {
    type: action.HRRE005_SHOW_POPUP_VE_VIEC,
    ShowPopupVeViec,
  };
};

export const HRRE005SelectedVeViec = (VeViec) => {
  return {
    type: action.HRRE005_SELECTED_VE_VIEC,
    VeViec,
  };
};
export const HRRE005TinhTrangPheDuyet = (TinhTrangPheDuyet) => {
  return {
    type: action.HRRE005_TINH_TRANG_PHE_DUYET,
    TinhTrangPheDuyet,
  };
};
export const HRRE005DSNguoiPheDuyet = (DanhSachNguoiPheDuyet) => {
  return {
    type: action.HRRE005_DS_NGUOI_PHE_DUYET,
    DanhSachNguoiPheDuyet,
  };
};

export const HRRE005LoadLyDoRaCong = () => {
  return {
    type: action.HRRE005_LOAD_LY_DO_RA_CONG,
  };
};
export const HRRE005LoadLyDoRaCongS = (LyDoRaCong) => {
  return {
    type: action.HRRE005_LOAD_LY_DO_RA_CONG_S,
    LyDoRaCong,
  };
};
export const HRRE005LoadLyDoRaCongF = () => {
  return {
    type: action.HRRE005_LOAD_LY_DO_RA_CONG_F,
  };
};

export const HRRE005SetLyDoRaCong = (SelectLyDoRaCong) => {
  return {
    type: action.HRRE005_SET_LY_DO_RA_CONG,
    SelectLyDoRaCong,
  };
};
export const HRRE005ShowPopupLyDo = () => {
  return {
    type: action.HRRE005_SHOW_POPUP_LYDO,
  };
};
export const HRRE005HidePopupLyDo = () => {
  return {
    type: action.HRRE005_HIDE_POPUP_LYDO,
  };
};

export const HRRE005ShowPopupNguoiPheDuyet = (type) => {
  return {
    type: action.HRRE005_SHOW_POPUP_NGUOIPHEDUYET,
    typeA: type,
  };
};
export const HRRE005HidePopupNguoiPheDuyet = () => {
  return {
    type: action.HRRE005_HIDE_POPUP_NGUOIPHEDUYET,
  };
};

export const HRRE005LoadDataRaCong = () => {
  return {
    type: action.HRRE005_LOAD_DATA_RA_CONG,
  };
};
export const HRRE005LoadDataRaCongS = (DataRaCong) => {
  return {
    type: action.HRRE005_LOAD_DATA_RA_CONG_S,
    DataRaCong,
  };
};
export const HRRE005LoadDataRaCongF = () => {
  return {
    type: action.HRRE005_LOAD_DATA_RA_CONG_F,
  };
};

export const HRRE005SetDanhSachToTruong = (DanhSachToTruong) => {
  return {
    type: action.HRRE005_SET_DANH_SACH_TO_TRUONG,
    DanhSachToTruong,
  };
};
export const HRRE005SetDanhSachTruongBoPhan = (DanhSachTruongBoPhan) => {
  return {
    type: action.HRRE005_SET_DANH_SACH_TRUONG_BO_PHAN,
    DanhSachTruongBoPhan,
  };
};
export const HRRE005ChonToTruong = (ChonToTruong) => {
  return {
    type: action.HRRE005_CHON_TO_TRUONG,
    ChonToTruong,
  };
};
export const HRRE005ChonTruongBoPhan = (ChonTruongBoPhan) => {
  return {
    type: action.HRRE005_CHON_TRUONG_BO_PHAN,
    ChonTruongBoPhan,
  };
};

export const HRRE005DSNgayBatDau = (DSNgayBatDau) => {
  return {
    type: action.HRRE005_DS_NGAY_BAT_DAU,
    DSNgayBatDau,
  };
};

export const HRRE005DSNgayKetThuc = (DSNgayKetThuc) => {
  return {
    type: action.HRRE005_DS_NGAY_KET_THUC,
    DSNgayKetThuc,
  };
};
export const HRRE005SetWorkDate = (workdate) => {
  return {
    type: action.HRRE005_SET_WORK_DATE,
    workdate,
  };
};

export const HRRE005SetDescription = (description) => {
  return {
    type: action.HRRE005_SET_DESCRIPTION,
    description,
  };
};

export const HRRE005_SET_LIMIT_DATE = "HRRE005_SET_LIMIT_DATE";
export const HRRE005SetLimitDate = (limitDate) => {
  return {
    type: HRRE005_SET_LIMIT_DATE,
    limitDate,
  };
};

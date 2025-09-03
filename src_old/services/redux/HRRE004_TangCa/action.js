export const action = {
  HRRE004_LOAD_DATA_TANG_CA: 'HRRE004_LOAD_DATA_TANG_CA',
  HRRE004_LOAD_DATA_TANG_CA_S: 'HRRE004_LOAD_DATA_TANG_CA_S',
  HRRE004_LOAD_DATA_TANG_CA_F: 'HRRE004_LOAD_DATA_TANG_CA_F',
  HRRE004_SET_DANH_SACH_TO_TRUONG: 'HRRE004_SET_DANH_SACH_TO_TRUONG',
  HRRE004_SET_DANH_SACH_TRUONG_BO_PHAN: 'HRRE004_SET_DANH_SACH_TRUONG_BO_PHAN',

  HRRE004_SHOW_POPUP_NGUOIPHEDUYET: 'HRRE004_SHOW_POPUP_NGUOIPHEDUYET',
  HRRE004_HIDE_POPUP_NGUOIPHEDUYET: 'HRRE004_HIDE_POPUP_NGUOIPHEDUYET',
  HRRE004_SHOW_NGUOIPHEDUYET: 'HRRE004_SHOW_NGUOIPHEDUYET',
  HRRE004_HIDE_NGUOIPHEDUYET: 'HRRE004_HIDE_NGUOIPHEDUYET',
  HRRE004_CHON_TO_TRUONG: 'HRRE004_CHON_TO_TRUONG',
  HRRE004_CHON_TRUONG_BO_PHAN: 'HRRE004_CHON_TRUONG_BO_PHAN',
  HRRE004_DS_NGAY_BAT_DAU: 'HRRE004_DS_NGAY_BAT_DAU',
  HRRE004_DS_NGAY_KET_THUC: 'HRRE004_DS_NGAY_KET_THUC',
  HRRE004_DS_NGUOI_PHE_DUYET: 'HRRE004_DS_NGUOI_PHE_DUYET',
  HRRE004_TINH_TRANG_PHE_DUYET: 'HRRE004_TINH_TRANG_PHE_DUYET',
  HRRE004_SET_START_TIME: 'HRRE004_SET_START_TIME',
  HRRE004_SET_END_TIME: 'HRRE004_SET_END_TIME',
  HRRE004_SET_WORK_DATE: 'HRRE004_SET_WORK_DATE',
  HRRE004_SET_DESCRIPTION: 'HRRE004_SET_DESCRIPTION',
};
export const HRRE004SetStartTime = startTime => {
  return {
    type: action.HRRE004_SET_START_TIME,
    startTime,
  };
};
export const HRRE004SetEndTime = endTime => {
  return {
    type: action.HRRE004_SET_END_TIME,
    endTime,
  };
};

export const HRRE004TinhTrangPheDuyet = TinhTrangPheDuyet => {
  return {
    type: action.HRRE004_TINH_TRANG_PHE_DUYET,
    TinhTrangPheDuyet,
  };
};
export const HRRE004DSNguoiPheDuyet = DanhSachNguoiPheDuyet => {
  return {
    type: action.HRRE004_DS_NGUOI_PHE_DUYET,
    DanhSachNguoiPheDuyet,
  };
};

export const HRRE004ShowPopupNguoiPheDuyet = type => {
  return {
    type: action.HRRE004_SHOW_POPUP_NGUOIPHEDUYET,
    typeA: type,
  };
};
export const HRRE004HidePopupNguoiPheDuyet = () => {
  return {
    type: action.HRRE004_HIDE_POPUP_NGUOIPHEDUYET,
  };
};

export const HRRE004LoadDataTangCa = () => {
  return {
    type: action.HRRE004_LOAD_DATA_TANG_CA,
  };
};
export const HRRE004LoadDataTangCaS = DataTangCa => {
  return {
    type: action.HRRE004_LOAD_DATA_TANG_CA_S,
    DataTangCa,
  };
};
export const HRRE004LoadDataTangCaF = () => {
  return {
    type: action.HRRE004_LOAD_DATA_TANG_CA_F,
  };
};

export const HRRE004SetDanhSachToTruong = DanhSachToTruong => {
  return {
    type: action.HRRE004_SET_DANH_SACH_TO_TRUONG,
    DanhSachToTruong,
  };
};
export const HRRE004SetDanhSachTruongBoPhan = DanhSachTruongBoPhan => {
  return {
    type: action.HRRE004_SET_DANH_SACH_TRUONG_BO_PHAN,
    DanhSachTruongBoPhan,
  };
};
export const HRRE004ChonToTruong = ChonToTruong => {
  return {
    type: action.HRRE004_CHON_TO_TRUONG,
    ChonToTruong,
  };
};
export const HRRE004ChonTruongBoPhan = ChonTruongBoPhan => {
  return {
    type: action.HRRE004_CHON_TRUONG_BO_PHAN,
    ChonTruongBoPhan,
  };
};

export const HRRE004DSNgayBatDau = DSNgayBatDau => {
  return {
    type: action.HRRE004_DS_NGAY_BAT_DAU,
    DSNgayBatDau,
  };
};

export const HRRE004DSNgayKetThuc = DSNgayKetThuc => {
  return {
    type: action.HRRE004_DS_NGAY_KET_THUC,
    DSNgayKetThuc,
  };
};
export const HRRE004SetWorkDate = workdate => {
  return {
    type: action.HRRE004_SET_WORK_DATE,
    workdate,
  };
};

export const HRRE004SetDescription = description => {
  return {
    type: action.HRRE004_SET_DESCRIPTION,
    description,
  };
};

export const HRRE004_SET_LIMIT_DATE = 'HRRE004_SET_LIMIT_DATE';
export const HRRE004SetLimitDate = limitDate => {
  return {
    type: HRRE004_SET_LIMIT_DATE,
    limitDate,
  };
};

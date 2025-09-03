export const action = {
  HRRE006_LOAD_DATA_CONG_TAC: 'HRRE006_LOAD_DATA_CONG_TAC',
  HRRE006_LOAD_DATA_CONG_TAC_S: 'HRRE006_LOAD_DATA_CONG_TAC_S',
  HRRE006_LOAD_DATA_CONG_TAC_F: 'HRRE006_LOAD_DATA_CONG_TAC_F',
  HRRE006_SET_DANH_SACH_TO_TRUONG: 'HRRE006_SET_DANH_SACH_TO_TRUONG',
  HRRE006_SET_DANH_SACH_TRUONG_BO_PHAN: 'HRRE006_SET_DANH_SACH_TRUONG_BO_PHAN',

  HRRE006_SHOW_POPUP_NGUOIPHEDUYET: 'HRRE006_SHOW_POPUP_NGUOIPHEDUYET',
  HRRE006_HIDE_POPUP_NGUOIPHEDUYET: 'HRRE006_HIDE_POPUP_NGUOIPHEDUYET',
  HRRE006_SHOW_NGUOIPHEDUYET: 'HRRE006_SHOW_NGUOIPHEDUYET',
  HRRE006_HIDE_NGUOIPHEDUYET: 'HRRE006_HIDE_NGUOIPHEDUYET',
  HRRE006_CHON_TO_TRUONG: 'HRRE006_CHON_TO_TRUONG',
  HRRE006_CHON_TRUONG_BO_PHAN: 'HRRE006_CHON_TRUONG_BO_PHAN',
  HRRE006_DS_NGAY_BAT_DAU: 'HRRE006_DS_NGAY_BAT_DAU',
  HRRE006_DS_NGAY_KET_THUC: 'HRRE006_DS_NGAY_KET_THUC',
  HRRE006_DS_NGUOI_PHE_DUYET: 'HRRE006_DS_NGUOI_PHE_DUYET',
  HRRE006_TINH_TRANG_PHE_DUYET: 'HRRE006_TINH_TRANG_PHE_DUYET',
  HRRE006_SET_START_TIME: 'HRRE006_SET_START_TIME',
  HRRE006_SET_END_TIME: 'HRRE006_SET_END_TIME',
  HRRE006_SET_WORK_DATE: 'HRRE006_SET_WORK_DATE',
  HRRE006_SET_DESCRIPTION: 'HRRE006_SET_DESCRIPTION',
};
export const HRRE006SetStartTime = startTime => {
  return {
    type: action.HRRE006_SET_START_TIME,
    startTime,
  };
};
export const HRRE006SetEndTime = endTime => {
  return {
    type: action.HRRE006_SET_END_TIME,
    endTime,
  };
};

export const HRRE006TinhTrangPheDuyet = TinhTrangPheDuyet => {
  return {
    type: action.HRRE006_TINH_TRANG_PHE_DUYET,
    TinhTrangPheDuyet,
  };
};
export const HRRE006DSNguoiPheDuyet = DanhSachNguoiPheDuyet => {
  return {
    type: action.HRRE006_DS_NGUOI_PHE_DUYET,
    DanhSachNguoiPheDuyet,
  };
};

export const HRRE006ShowPopupNguoiPheDuyet = type => {
  return {
    type: action.HRRE006_SHOW_POPUP_NGUOIPHEDUYET,
    typeA: type,
  };
};
export const HRRE006HidePopupNguoiPheDuyet = () => {
  return {
    type: action.HRRE006_HIDE_POPUP_NGUOIPHEDUYET,
  };
};

export const HRRE006LoadDataCongTac = () => {
  return {
    type: action.HRRE006_LOAD_DATA_CONG_TAC,
  };
};
export const HRRE006LoadDataCongTacS = DataCongTac => {
  return {
    type: action.HRRE006_LOAD_DATA_CONG_TAC_S,
    DataCongTac,
  };
};
export const HRRE006LoadDataCongTacF = () => {
  return {
    type: action.HRRE006_LOAD_DATA_CONG_TAC_F,
  };
};

export const HRRE006SetDanhSachToTruong = DanhSachToTruong => {
  return {
    type: action.HRRE006_SET_DANH_SACH_TO_TRUONG,
    DanhSachToTruong,
  };
};
export const HRRE006SetDanhSachTruongBoPhan = DanhSachTruongBoPhan => {
  return {
    type: action.HRRE006_SET_DANH_SACH_TRUONG_BO_PHAN,
    DanhSachTruongBoPhan,
  };
};
export const HRRE006ChonToTruong = ChonToTruong => {
  return {
    type: action.HRRE006_CHON_TO_TRUONG,
    ChonToTruong,
  };
};
export const HRRE006ChonTruongBoPhan = ChonTruongBoPhan => {
  return {
    type: action.HRRE006_CHON_TRUONG_BO_PHAN,
    ChonTruongBoPhan,
  };
};

export const HRRE006DSNgayBatDau = DSNgayBatDau => {
  return {
    type: action.HRRE006_DS_NGAY_BAT_DAU,
    DSNgayBatDau,
  };
};

export const HRRE006DSNgayKetThuc = DSNgayKetThuc => {
  return {
    type: action.HRRE006_DS_NGAY_KET_THUC,
    DSNgayKetThuc,
  };
};
export const HRRE006SetWorkDate = workdate => {
  return {
    type: action.HRRE006_SET_WORK_DATE,
    workdate,
  };
};

export const HRRE006SetDescription = description => {
  return {
    type: action.HRRE006_SET_DESCRIPTION,
    description,
  };
};

export const HRRE006_SET_LIMIT_DATE = 'HRRE006_SET_LIMIT_DATE';
export const HRRE006SetLimitDate = limitDate => {
  return {
    type: HRRE006_SET_LIMIT_DATE,
    limitDate,
  };
};

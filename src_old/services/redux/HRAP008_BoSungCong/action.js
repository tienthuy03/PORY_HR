export const action = {
  HRAP008_LOAD_DATA: 'HRAP008_LOAD_DATA',
  HRAP008_LOAD_DATA_S: 'HRAP008_LOAD_DATA_S',
};

//HRAP008_LOAD_DATA
export const HRAP008LoadData = () => {
  return {
    type: action.HRAP008_LOAD_DATA,
  };
};

//HRAP008_LOAD_DATA_S
export const HRAP008LoadDataS = (data) => {
  return {
    type: action.HRAP008_LOAD_DATA_S,
    data,
  };
};
export const HRAP008_SET_APPROVE_INFO = 'HRAP008_SET_APPROVE_INFO';
export const HRAP008SetApproveInfo = (ApproveInfo) => {
  return {
    type: HRAP008_SET_APPROVE_INFO,
    ApproveInfo,
  };
};

export const HRAP008_SET_NGAY_BAT_DAU = 'HRAP008_SET_NGAY_BAT_DAU';
export const HPRA008SetNgayBatDau = (NgayBatDau) => {
  return {
    type: HRAP008_SET_NGAY_BAT_DAU,
    NgayBatDau,
  };
};
export const HRAP008_SET_NGAY_KET_THUC = 'HRAP008_SET_NGAY_KET_THUC';
export const HPRA008SetNgayKetThuc = (NgayKetThuc) => {
  return {
    type: HRAP008_SET_NGAY_KET_THUC,
    NgayKetThuc,
  };
};

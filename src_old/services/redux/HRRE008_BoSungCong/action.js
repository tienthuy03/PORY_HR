export const HRRE008_LOAD_DATA = 'HRRE008_LOAD_DATA';
export const HRRE008_LOAD_DATA_SS = 'HRRE008_LOAD_DATA_SS';
export const HRRE008_SET_DS_PHE_DUYET = 'HRRE008_SET_DS_PHE_DUYET';
export const HRRE008_SET_DS_NGUOI_PHE_DUYET = 'HRRE008_SET_DS_NGUOI_PHE_DUYET';
export const HRRE008_SET_DS_LY_DO = 'HRRE008_SET_DS_LY_DO';
export const HRRE008_START_DATE = 'HRRE008_START_DATE';
export const HRRE008_END_DATE = 'HRRE008_END_DATE';
export const HRRE008LoadData = (param) => {
  return {
    type: HRRE008_LOAD_DATA,
    param,
  };
};
export const HRRE008StartDate = (StartDate) => {
  return {
    type: HRRE008_START_DATE,
    StartDate,
  };
};
export const HRRE008EndDate = (EndDate) => {
  return {
    type: HRRE008_END_DATE,
    EndDate,
  };
};
export const HRRE008SetDSPheDuyet = (DanhSachPheDuyet) => {
  return {
    type: HRRE008_SET_DS_PHE_DUYET,
    DanhSachPheDuyet,
  };
};

export const HRRE008SetDSLyDo = (DanhSachLyDo) => {
  return {
    type: HRRE008_SET_DS_LY_DO,
    DanhSachLyDo,
  };
};

export const HRRE008SetDSNguoiPheDuyet = (DanhSachNguoiPheDuyet) => {
  return {
    type: HRRE008_SET_DS_NGUOI_PHE_DUYET,
    DanhSachNguoiPheDuyet,
  };
};
export const HRRE008LoadDataSS = (DanhSachBoSungCong) => {
  return {
    type: HRRE008_LOAD_DATA_SS,
    DanhSachBoSungCong,
  };
};


export const HRRE008_SET_LIMIT_DATE = "HRRE008_SET_LIMIT_DATE";
export const HRRE008SetLimitDate = (limitDate) => {
  return {
    type: HRRE008_SET_LIMIT_DATE,
    limitDate,
  };
};

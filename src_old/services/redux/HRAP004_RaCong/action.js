export const action = {
  HRAP004_LOAD_DATA_RA_CONG: 'HRAP004_LOAD_DATA_RA_CONG',
  HRAP004_LOAD_DATA_RA_CONG1_S: 'HRAP004_LOAD_DATA_RA_CONG1_S',
  HRAP004_LOAD_DATA_RA_CONG1_F: 'HRAP004_LOAD_DATA_RA_CONG1_F',
  HRAP004_LOAD_DATA_RA_CONG2_S: 'HRAP004_LOAD_DATA_RA_CONG2_S',
  HRAP004_LOAD_DATA_RA_CONG2_F: 'HRAP004_LOAD_DATA_RA_CONG2_F',
  HRAP004_LOAD_DATA_RA_CONG3_S: 'HRAP004_LOAD_DATA_RA_CONG3_S',
  HRAP004_LOAD_DATA_RA_CONG3_F: 'HRAP004_LOAD_DATA_RA_CONG3_F',
  HRAP004_DS_NGAY_BAT_DAU: 'HRAP004_DS_NGAY_BAT_DAU',
  HRAP004_DS_NGAY_KET_THUC: 'HRAP004_DS_NGAY_KET_THUC',
  HRAP004_DS_DEM_CHO_DUYET: 'HRAP004_DS_DEM_CHO_DUYET',
  HRAP004_DS_DEM_DA_DUYET: 'HRAP004_DS_DEM_DA_DUYET',
  HRAP004_DS_DEM_KHONG_DUYET: 'HRAP004_DS_DEM_KHONG_DUYET',
  HRAP004_UPDATE_APPROVE_STATUS: 'HRAP004_UPDATE_APPROVE_STATUS', //action for update approve status
};

//function return the acion update approve status
//HRAP004_UPDATE_APPROVE_STATUS
export const HRAP004UpdateApproveStatus = (oneRecord) => {
  return {
    type: action.HRAP004_UPDATE_APPROVE_STATUS,
    oneRecord,
  };
};

export const HRAP004LoadDataRaCong = () => {
  return {
    type: action.HRAP004_LOAD_DATA_RA_CONG,
  };
};
export const HRAP004LoadDataRaCong1S = (DataChoDuyet) => {
  return {
    type: action.HRAP004_LOAD_DATA_RA_CONG1_S,
    DataChoDuyet,
  };
};
export const HRAP004LoadDataRaCong1F = () => {
  return {
    type: action.HRAP004_LOAD_DATA_RA_CONG1_F,
  };
};

export const HRAP004LoadDataRaCong2S = (DataDaDuyet) => {
  return {
    type: action.HRAP004_LOAD_DATA_RA_CONG2_S,
    DataDaDuyet,
  };
};
export const HRAP004LoadDataRaCong2F = () => {
  return {
    type: action.HRAP004_LOAD_DATA_RA_CONG2_F,
  };
};

export const HRAP004LoadDataRaCong3S = (DataKhongDuyet) => {
  return {
    type: action.HRAP004_LOAD_DATA_RA_CONG3_S,
    DataKhongDuyet,
  };
};
export const HRAP004LoadDataRaCong3F = () => {
  return {
    type: action.HRAP004_LOAD_DATA_RA_CONG3_F,
  };
};
export const HRAP004DSNgayBatDau = (DSNgayBatDau) => {
  return {
    type: action.HRAP004_DS_NGAY_BAT_DAU,
    DSNgayBatDau,
  };
};

export const HRAP004DSNgayKetThuc = (DSNgayKetThuc) => {
  return {
    type: action.HRAP004_DS_NGAY_KET_THUC,
    DSNgayKetThuc,
  };
};
export const HRAP004DemChoDuyet = (DemChoDuyet) => {
  return {
    type: action.HRAP004_DS_DEM_CHO_DUYET,
    DemChoDuyet,
  };
};
export const HRAP004DemDaDuyet = (DemDaDuyet) => {
  return {
    type: action.HRAP004_DS_DEM_DA_DUYET,
    DemDaDuyet,
  };
};
export const HRAP004DemKhongDuyet = (DemKhongDuyet) => {
  return {
    type: action.HRAP004_DS_DEM_KHONG_DUYET,
    DemKhongDuyet,
  };
};
export const HRAP004_SET_APPROVE_INFO = 'HRAP004_SET_APPROVE_INFO';
export const HRAP004SetApproveInfo = (ApproveInfo) => {
  return {
    type: HRAP004_SET_APPROVE_INFO,
    ApproveInfo,
  };
};

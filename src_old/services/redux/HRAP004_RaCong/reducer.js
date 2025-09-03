import {action, HRAP004_SET_APPROVE_INFO} from './action';
const initialState = {
  DataChoDuyet: [],
  DataDaDuyet: [],
  DataKhongDuyet: [],
  DSNgayBatDau: null,
  DSNgayKetThuc: null,
  DemChoDuyet: 0,
  DemDaDuyet: 0,
  DemKhongDuyet: 0,
  ApproveInfo: [],
};

const reducer = (state = initialState, act) => {
  switch (act.type) {
    case HRAP004_SET_APPROVE_INFO:
      return {
        ...state,
        ApproveInfo: act.ApproveInfo,
      };
    case action.HRAP004_DS_DEM_CHO_DUYET:
      return {
        ...state,
        DemChoDuyet: act.DemChoDuyet,
      };
    case action.HRAP004_DS_DEM_DA_DUYET:
      return {
        ...state,
        DemDaDuyet: act.DemDaDuyet,
      };
    case action.HRAP004_DS_DEM_KHONG_DUYET:
      return {
        ...state,
        DemKhongDuyet: act.DemKhongDuyet,
      };
    case action.HRAP004_LOAD_DATA_RA_CONG1_S:
      return {
        ...state,
        DataChoDuyet: act.DataChoDuyet,
      };
    case action.HRAP004_LOAD_DATA_RA_CONG1_F:
      return {
        ...state,
        DataChoDuyet: [],
      };
    case action.HRAP004_LOAD_DATA_RA_CONG2_S:
      return {
        ...state,
        DataDaDuyet: act.DataDaDuyet,
      };
    case action.HRAP004_LOAD_DATA_RA_CONG2_F:
      return {
        ...state,
        DataDaDuyet: [],
      };
    case action.HRAP004_LOAD_DATA_RA_CONG3_S:
      return {
        ...state,
        DataKhongDuyet: act.DataKhongDuyet,
      };
    case action.HRAP004_LOAD_DATA_RA_CONG3_F:
      return {
        ...state,
        DataKhongDuyet: [],
      };
    case action.HRAP004_DS_NGAY_BAT_DAU:
      return {
        ...state,
        DSNgayBatDau: act.DSNgayBatDau,
      };
    case action.HRAP004_DS_NGAY_KET_THUC:
      return {
        ...state,
        DSNgayKetThuc: act.DSNgayKetThuc,
      };
    default:
      return state;
  }
};
export default reducer;

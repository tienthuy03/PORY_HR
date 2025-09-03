import * as action from "./action";
import moment from "moment";
const initialState = {
  DsCXN: [],
  DsDXN: [],
  DsVP1: [],
  DsVP2: [],
  DsNPD: [],
  DsApprove: [],
  From_dt: moment(new Date()).format("YYYYMM01"),
  To_dt: moment(new Date()).format("YYYYMMDD"),
  isLoading: false,
};

const reducer = (state = initialState, act) => {
  switch (act.type) {
    case action.HRRI011_LAY_DANH_SACH_CXN_S:
      return {
        ...state,
        DsCXN: act.DsCXN,
        DsNPD: act.DsNPD,
      };
    case action.HRRI011_LAY_DANH_SACH_CXN_F:
      return {
        ...state,
        DsCXN: [],
      };
    case action.HRRI011_LAY_DANH_SACH_DXN_S:
      return {
        ...state,
        DsDXN: act.DsDXN,
        DsApprove: act.DsApprove,
      };
    case action.HRRI011_LAY_DANH_SACH_DXN_F:
      return {
        ...state,
        DsDXN: [],
      };
    case action.HRRI011_LAY_DANH_SACH_VP1_S:
      return {
        ...state,
        DsVP1: act.DsVP1,
      };
    case action.HRRI011_LAY_DANH_SACH_VP1_F:
      return {
        ...state,
        DsVP1: [],
      };
    case action.HRRI011_LAY_DANH_SACH_VP2_S:
      return {
        ...state,
        DsVP2: act.DsVP2,
      };
    case action.HRRI011_LAY_DANH_SACH_VP2_F:
      return {
        ...state,
        DsVP2: [],
      };
    case action.HRRI011_FROM_DT:
      return {
        ...state,
        From_dt: act.From_dt,
      };
    case action.HRRI011_TO_DT:
      return {
        ...state,
        To_dt: act.To_dt,
      };
    default:
      return state;
  }
};
export default reducer;

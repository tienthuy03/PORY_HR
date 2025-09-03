import * as action from "./action";
import moment from "moment";
const initialState = {
  DanhSachDangKy: [],
  ViPhamCom: [],
  DanhSachNhaAnCoDinh: [],
  From_dt: moment(new Date()).format("YYYYMM01"),
  To_dt: moment(new Date()).format("YYYYMMDD"),
  isLoading: false,
};

const reducer = (state = initialState, act) => {
  switch (act.type) {
    case action.HRRI000_LAY_DANH_SACH_DANG_KY_S:
      return {
        ...state,
        DanhSachDangKy: act.DanhSachDangKy,
      };
    case action.HRRI000_LAY_DANH_SACH_DANG_KY_F:
      return {
        ...state,
        DanhSachDangKy: [],
      };
    case action.HRRI000_LAY_DANH_SACH_NHA_AN_S:
      return {
        ...state,
        DanhSachNhaAnCoDinh: act.DanhSachNhaAnCoDinh,
      };
    case action.HRRI000_LAY_DANH_SACH_NHA_AN_F:
      return {
        ...state,
        DanhSachNhaAnCoDinh: [],
      };
    case action.HRRI000_LAY_DU_LIEU_VI_PHAM_COM_S:
      return {
        ...state,
        ViPhamCom: act.ViPhamCom,
      };
    case action.HRRI000_LAY_DU_LIEU_VI_PHAM_COM_F:
      return {
        ...state,
        ViPhamCom: [],
      };
    case action.HRRI000_FROM_DT:
      return {
        ...state,
        From_dt: act.From_dt,
      };
    case action.HRRI000_TO_DT:
      return {
        ...state,
        To_dt: act.To_dt,
      };
    default:
      return state;
  }
};
export default reducer;

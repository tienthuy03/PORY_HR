import moment from 'moment';
import {action, HRRE006_SET_LIMIT_DATE} from './action';
const initialState = {
  ShowPopupNguoiPheDuyet: {isShow: false, type: 1},
  DataCongTac: [],
  DanhSachTruongBoPhan: [],
  DanhSachToTruong: [],
  DanhSachNguoiPheDuyet: [],
  ChonToTruong: {
    emp_pk: null,
    level_type: null,
    pk: null,
    stt: null,
    value: null,
  },
  ChonTruongBoPhan: {
    emp_pk: null,
    level_type: null,
    pk: null,
    stt: null,
    value: null,
  },
  ShowNguoiPheDuyet: false,
  DSNgayBatDau: moment(new Date()).format('YYYYMM01'),
  DSNgayKetThuc: moment(new Date()).format('YYYYMMDD'),
  TinhTrangPheDuyet: [],
  startTime: {
    isShow: false,
    time: 'hh:mm',
  },
  endTime: {
    isShow: false,
    time: 'hh:mm',
  },
  workdate: 'dd/mm/yyyy',
  description: '',
  limitDate: {
    note: '',
  },
};

const reducer = (state = initialState, act) => {
  switch (act.type) {
    case HRRE006_SET_LIMIT_DATE:
      return {
        ...state,
        limitDate: act.limitDate,
      };
    case action.HRRE006_SET_WORK_DATE:
      return {
        ...state,
        workdate: act.workdate,
      };
    case action.HRRE006_SET_DESCRIPTION:
      return {
        ...state,
        description: act.description,
      };
    case action.HRRE006_SET_START_TIME:
      return {
        ...state,
        startTime: act.startTime,
      };
    case action.HRRE006_SET_END_TIME:
      return {
        ...state,
        endTime: act.endTime,
      };

    case action.HRRE006_TINH_TRANG_PHE_DUYET:
      return {
        ...state,
        TinhTrangPheDuyet: act.TinhTrangPheDuyet,
      };
    case action.HRRE006_DS_NGUOI_PHE_DUYET:
      return {
        ...state,
        DanhSachNguoiPheDuyet: act.DanhSachNguoiPheDuyet,
      };

    case action.HRRE006_LOAD_DATA_CONG_TAC_S:
      return {
        ...state,
        DataCongTac: act.DataCongTac,
      };
    case action.HRRE006_LOAD_DATA_CONG_TAC_F:
      return {
        ...state,
        DataCongTac: [],
      };
    case action.HRRE006_SET_DANH_SACH_TO_TRUONG:
      return {
        ...state,
        DanhSachToTruong: act.DanhSachToTruong,
      };
    case action.HRRE006_SET_DANH_SACH_TRUONG_BO_PHAN:
      return {
        ...state,
        DanhSachTruongBoPhan: act.DanhSachTruongBoPhan,
      };

    case action.HRRE006_SHOW_POPUP_NGUOIPHEDUYET:
      return {
        ...state,
        ShowPopupNguoiPheDuyet: {isShow: true, type: act.typeA},
      };
    case action.HRRE006_HIDE_POPUP_NGUOIPHEDUYET:
      return {
        ...state,
        ShowPopupNguoiPheDuyet: {isShow: false, type: 1},
      };
    case action.HRRE006_SHOW_NGUOIPHEDUYET:
      return {
        ...state,
        ShowNguoiPheDuyet: true,
      };
    case action.HRRE006_HIDE_NGUOIPHEDUYET:
      return {
        ...state,
        ShowNguoiPheDuyet: false,
      };
    case action.HRRE006_CHON_TRUONG_BO_PHAN:
      return {
        ...state,
        ChonTruongBoPhan: act.ChonTruongBoPhan,
      };
    case action.HRRE006_CHON_TO_TRUONG:
      return {
        ...state,
        ChonToTruong: act.ChonToTruong,
      };
    case action.HRRE006_DS_NGAY_BAT_DAU:
      return {
        ...state,
        DSNgayBatDau: act.DSNgayBatDau,
      };
    case action.HRRE006_DS_NGAY_KET_THUC:
      return {
        ...state,
        DSNgayKetThuc: act.DSNgayKetThuc,
      };
    default:
      return state;
  }
};
export default reducer;

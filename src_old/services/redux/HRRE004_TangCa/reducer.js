import moment from 'moment';
import {action, HRRE004_SET_LIMIT_DATE} from './action';
const initialState = {
  ShowPopupNguoiPheDuyet: {isShow: false, type: 1},
  DataTangCa: [],
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
    case HRRE004_SET_LIMIT_DATE:
      return {
        ...state,
        limitDate: act.limitDate,
      };
    case action.HRRE004_SET_WORK_DATE:
      return {
        ...state,
        workdate: act.workdate,
      };
    case action.HRRE004_SET_DESCRIPTION:
      return {
        ...state,
        description: act.description,
      };
    case action.HRRE004_SET_START_TIME:
      return {
        ...state,
        startTime: act.startTime,
      };
    case action.HRRE004_SET_END_TIME:
      return {
        ...state,
        endTime: act.endTime,
      };

    case action.HRRE004_TINH_TRANG_PHE_DUYET:
      return {
        ...state,
        TinhTrangPheDuyet: act.TinhTrangPheDuyet,
      };
    case action.HRRE004_DS_NGUOI_PHE_DUYET:
      return {
        ...state,
        DanhSachNguoiPheDuyet: act.DanhSachNguoiPheDuyet,
      };

    case action.HRRE004_LOAD_DATA_TANG_CA_S:
      return {
        ...state,
        DataTangCa: act.DataTangCa,
      };
    case action.HRRE004_LOAD_DATA_TANG_CA_F:
      return {
        ...state,
        DataTangCa: [],
      };
    case action.HRRE004_SET_DANH_SACH_TO_TRUONG:
      return {
        ...state,
        DanhSachToTruong: act.DanhSachToTruong,
      };
    case action.HRRE004_SET_DANH_SACH_TRUONG_BO_PHAN:
      return {
        ...state,
        DanhSachTruongBoPhan: act.DanhSachTruongBoPhan,
      };

    case action.HRRE004_SHOW_POPUP_NGUOIPHEDUYET:
      return {
        ...state,
        ShowPopupNguoiPheDuyet: {isShow: true, type: act.typeA},
      };
    case action.HRRE004_HIDE_POPUP_NGUOIPHEDUYET:
      return {
        ...state,
        ShowPopupNguoiPheDuyet: {isShow: false, type: 1},
      };
    case action.HRRE004_SHOW_NGUOIPHEDUYET:
      return {
        ...state,
        ShowNguoiPheDuyet: true,
      };
    case action.HRRE004_HIDE_NGUOIPHEDUYET:
      return {
        ...state,
        ShowNguoiPheDuyet: false,
      };
    case action.HRRE004_CHON_TRUONG_BO_PHAN:
      return {
        ...state,
        ChonTruongBoPhan: act.ChonTruongBoPhan,
      };
    case action.HRRE004_CHON_TO_TRUONG:
      return {
        ...state,
        ChonToTruong: act.ChonToTruong,
      };
    case action.HRRE004_DS_NGAY_BAT_DAU:
      return {
        ...state,
        DSNgayBatDau: act.DSNgayBatDau,
      };
    case action.HRRE004_DS_NGAY_KET_THUC:
      return {
        ...state,
        DSNgayKetThuc: act.DSNgayKetThuc,
      };
    default:
      return state;
  }
};
export default reducer;

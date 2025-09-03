import moment from 'moment';
import {action, HRRE005_SET_LIMIT_DATE} from './action';
const initialState = {
  ShowPopupLyDo: false,
  ShowPopupNguoiPheDuyet: {isShow: false, type: 1},
  LyDoRaCong: null,
  SelectLyDoRaCong: {code_nm: 'Chọn lý do ra cổng', code: '0'},
  DataRaCong: [],
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
  dataVeViec: [],
  SelectedVeViec: {
    code: '0',
    code_nm: 'Chọn về việc',
  },
  ShowPopupVeViec: false,
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
    case HRRE005_SET_LIMIT_DATE:
      return {
        ...state,
        limitDate: act.limitDate,
      };
    case action.HRRE005_SET_WORK_DATE:
      return {
        ...state,
        workdate: act.workdate,
      };
    case action.HRRE005_SET_DESCRIPTION:
      return {
        ...state,
        description: act.description,
      };
    case action.HRRE005_SET_START_TIME:
      return {
        ...state,
        startTime: act.startTime,
      };
    case action.HRRE005_SET_END_TIME:
      return {
        ...state,
        endTime: act.endTime,
      };
    case action.HRRE005_SET_VE_VIEC:
      return {
        ...state,
        dataVeViec: act.dataVeViec,
      };
    case action.HRRE005_SHOW_POPUP_VE_VIEC:
      return {
        ...state,
        ShowPopupVeViec: act.ShowPopupVeViec,
      };
    case action.HRRE005_SELECTED_VE_VIEC:
      return {
        ...state,
        SelectedVeViec: act.VeViec,
      };
    case action.HRRE005_TINH_TRANG_PHE_DUYET:
      return {
        ...state,
        TinhTrangPheDuyet: act.TinhTrangPheDuyet,
      };
    case action.HRRE005_DS_NGUOI_PHE_DUYET:
      return {
        ...state,
        DanhSachNguoiPheDuyet: act.DanhSachNguoiPheDuyet,
      };
    case action.HRRE005_LOAD_LY_DO_RA_CONG_S:
      return {
        ...state,
        LyDoRaCong: act.LyDoRaCong,
      };
    case action.HRRE005_LOAD_LY_DO_RA_CONG_F:
      return {
        ...state,
        LyDoRaCong: null,
      };
    case action.HRRE005_LOAD_DATA_RA_CONG_S:
      return {
        ...state,
        DataRaCong: act.DataRaCong,
      };
    case action.HRRE005_LOAD_DATA_RA_CONG_F:
      return {
        ...state,
        DataRaCong: [],
      };
    case action.HRRE005_SET_DANH_SACH_TO_TRUONG:
      return {
        ...state,
        DanhSachToTruong: act.DanhSachToTruong,
      };
    case action.HRRE005_SET_DANH_SACH_TRUONG_BO_PHAN:
      return {
        ...state,
        DanhSachTruongBoPhan: act.DanhSachTruongBoPhan,
      };
    case action.HRRE005_SET_LY_DO_RA_CONG:
      return {
        ...state,
        SelectLyDoRaCong: act.SelectLyDoRaCong,
      };
    case action.HRRE005_SHOW_POPUP_LYDO:
      return {
        ...state,
        ShowPopupLyDo: true,
      };
    case action.HRRE005_HIDE_POPUP_LYDO:
      return {
        ...state,
        ShowPopupLyDo: false,
      };
    case action.HRRE005_SHOW_POPUP_NGUOIPHEDUYET:
      return {
        ...state,
        ShowPopupNguoiPheDuyet: {isShow: true, type: act.typeA},
      };
    case action.HRRE005_HIDE_POPUP_NGUOIPHEDUYET:
      return {
        ...state,
        ShowPopupNguoiPheDuyet: {isShow: false, type: 1},
      };
    case action.HRRE005_SHOW_NGUOIPHEDUYET:
      return {
        ...state,
        ShowNguoiPheDuyet: true,
      };
    case action.HRRE005_HIDE_NGUOIPHEDUYET:
      return {
        ...state,
        ShowNguoiPheDuyet: false,
      };
    case action.HRRE005_CHON_TRUONG_BO_PHAN:
      return {
        ...state,
        ChonTruongBoPhan: act.ChonTruongBoPhan,
      };
    case action.HRRE005_CHON_TO_TRUONG:
      return {
        ...state,
        ChonToTruong: act.ChonToTruong,
      };
    case action.HRRE005_DS_NGAY_BAT_DAU:
      return {
        ...state,
        DSNgayBatDau: act.DSNgayBatDau,
      };
    case action.HRRE005_DS_NGAY_KET_THUC:
      return {
        ...state,
        DSNgayKetThuc: act.DSNgayKetThuc,
      };
    default:
      return state;
  }
};
export default reducer;

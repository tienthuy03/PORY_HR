import * as action from "./action";
import moment from "moment";
const initialState = {
  isLoading: false,
  JobName: "",
  Description: "",
  SelectCodeJobType: "",
  SelectNameJobType: "Chọn loại công việc",
  SelectCodeCustomer: "",
  SelectNameCustomer: "Chọn dự án/khách hàng",
  SelectCodeProject: "",
  SelectNameProject: "Chọn công việc",
  SelectCodePriority: "",
  SelectNamePriority: "Chọn",
  SelectDate: "dd/mm/yyyy",
  SelectTime: "hh:mm",

  ListLoaiCongViec: [],
  ListDuAn: [],
  ListProject: [],
  ListUuTien: [],

  ListNguoiGiaoViec: [],
  ListNguoiGiaoViecSelected: [],
  ListNguoiGiaoViecDefault: [],

  ListNguoiThucHien: [],
  ListNguoiThucHienSelected: [],

  ListNguoiTheoDoi: [],
  ListNguoiTheoDoiSelected: [],

  DanhSachCongViec: [],
};

const reducer = (state = initialState, act) => {
  switch (act.type) {
    case action.HRWO001_FETCH_DATA:
      return {
        ...state,
        isLoading: true,
      };

    case action.HRWO001_DONE_STATE:
      return {
        ...state,
        isLoading: false,
      };
    //Loai cong viec
    case action.HRWO001_LAY_DANH_SACH_LOAI_CONG_VIEC_S:
      return {
        ...state,
        ListLoaiCongViec: act.ListLoaiCongViec,
      };
    case action.HRWO001_LAY_DANH_SACH_LOAI_CONG_VIEC_F:
      return {
        ...state,
        ListLoaiCongViec: [],
      };
    //Du an khach hang
    case action.HRWO001_LAY_DANH_SACH_DU_AN_S:
      return {
        ...state,
        ListDuAn: act.ListDuAn,
      };
    case action.HRWO001_LAY_DANH_SACH_DU_AN_F:
      return {
        ...state,
        ListDuAn: [],
      };
    //

    case action.HRWO001_LAY_DANH_SACH_CONG_VIEC_S:
      return {
        ...state,
        ListProject: act.ListProject,
      };
    case action.HRWO001_LAY_DANH_SACH_CONG_VIEC_F:
      return {
        ...state,
        ListProject: [],
      };

    //Uu tien
    case action.HRWO001_LAY_DANH_SACH_UU_TIEN_S:
      return {
        ...state,
        ListUuTien: act.ListUuTien,
      };
    case action.HRWO001_LAY_DANH_SACH_UU_TIEN_F:
      return {
        ...state,
        ListUuTien: [],
      };
    //Nguoi giao viec
    case action.HRWO001_LAY_DANH_NGUOI_GIAO_VIEC_S:
      return {
        ...state,
        ListNguoiGiaoViec: act.ListNguoiGiaoViec,
      };
    case action.HRWO001_LAY_DANH_NGUOI_GIAO_VIEC_F:
      return {
        ...state,
        ListNguoiGiaoViec: [],
      };
    case action.HRWO001_LAY_DANH_NGUOI_GIAO_VIEC_DEFAULT_S:
      return {
        ...state,
        ListNguoiGiaoViecDefault: act.ListNguoiGiaoViecDefault,
      };
    case action.HRWO001_LAY_DANH_NGUOI_GIAO_VIEC_DEFAULT_F:
      return {
        ...state,
        ListNguoiGiaoViecDefault: [],
      };

    case action.HRWO001_DANH_SACH_CHON_NGUOI_GIAO_VIEC:
      return {
        ...state,
        ListNguoiGiaoViecSelected: act.ListNguoiGiaoViecSelected,
      };
    //Nguoi thuc hien
    case action.HRWO001_LAY_DANH_NGUOI_THUC_HIEN_S:
      return {
        ...state,
        ListNguoiThucHien: act.ListNguoiThucHien,
      };
    case action.HRWO001_LAY_DANH_NGUOI_THUC_HIEN_F:
      return {
        ...state,
        ListNguoiThucHien: [],
      };
    case action.HRWO001_DANH_SACH_CHON_NGUOI_THUC_HIEN:
      return {
        ...state,
        ListNguoiThucHienSelected: act.ListNguoiThucHienSelected,
      };
    //Nguoi theo doi
    case action.HRWO001_LAY_DANH_NGUOI_THEO_DOI_S:
      return {
        ...state,
        ListNguoiTheoDoi: act.ListNguoiTheoDoi,
      };
    case action.HRWO001_LAY_DANH_NGUOI_THEO_DOI_F:
      return {
        ...state,
        ListNguoiTheoDoi: [],
      };

    case action.HRWO001_DANH_SACH_CHON_NGUOI_THEO_DOI:
      return {
        ...state,
        ListNguoiTheoDoiSelected: act.ListNguoiTheoDoiSelected,
      };
    //input control
    case action.HRWO001_RESET_ALL_DATA:
      return {
        ...state,
        JobName: "",
        Description: "",
        SelectCodeJobType: "",
        SelectNameJobType: "Chọn loại công việc",
        SelectCodeCustomer: "",
        SelectNameCustomer: "Chọn dự án/khách hàng",
        SelectCodePriority: "",
        SelectNamePriority: "Chọn",
        SelectDate: "dd/mm/yyyy",
        SelectTime: "hh:mm",
        ListNguoiThucHienSelected: [],
        ListNguoiTheoDoiSelected: [],
        ListNguoiGiaoViecSelected: act.ListNguoiGiaoViecSelected,
      };

    case action.HRWO001_INPUT_JOB_NAME:
      return {
        ...state,
        JobName: act.JobName,
      };
    case action.HRWO001_INPUT_DESCRIPTION:
      return {
        ...state,
        Description: act.Description,
      };
    case action.HRWO001_CHON_CODE_JOB_TYPE:
      return {
        ...state,
        SelectCodeJobType: act.SelectCodeJobType,
      };
    case action.HRWO001_CHON_NAME_JOB_TYPE:
      return {
        ...state,
        SelectNameJobType: act.SelectNameJobType,
      };

    case action.HRWO001_CHON_CODE_CUSTOMER:
      return {
        ...state,
        SelectCodeCustomer: act.SelectCodeCustomer,
      };
    case action.HRWO001_CHON_NAME_CUSTOMER:
      return {
        ...state,
        SelectNameCustomer: act.SelectNameCustomer,
      };

    case action.HRWO001_CHON_CODE_PRIORITY:
      return {
        ...state,
        SelectCodePriority: act.SelectCodePriority,
      };
    case action.HRWO001_CHON_NAME_PRIORITY:
      return {
        ...state,
        SelectNamePriority: act.SelectNamePriority,
      };

    case action.HRWO001_CHON_DATE:
      return {
        ...state,
        SelectDate: act.SelectDate,
      };
    case action.HRWO001_CHON_TIME:
      return {
        ...state,
        SelectTime: act.SelectTime,
      };

    default:
      return state;
  }
};
export default reducer;

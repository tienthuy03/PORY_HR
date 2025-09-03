export const HRWO001_LAY_DANH_SACH_LIST_CONTROL =
  "HRWO001_LAY_DANH_SACH_LIST_CONTROL";

export const HRWO001_LAY_DANH_SACH_LOAI_CONG_VIEC =
  "HRWO001_LAY_DANH_SACH_LOAI_CONG_VIEC";
export const HRWO001_LAY_DANH_SACH_LOAI_CONG_VIEC_S =
  "HRWO001_LAY_DANH_SACH_LOAI_CONG_VIEC_S";
export const HRWO001_LAY_DANH_SACH_LOAI_CONG_VIEC_F =
  "HRWO001_LAY_DANH_SACH_LOAI_CONG_VIEC_F";

export const HRWO001_LAY_DANH_SACH_DU_AN = "HRWO001_LAY_DANH_SACH_DU_AN";
export const HRWO001_LAY_DANH_SACH_DU_AN_S = "HRWO001_LAY_DANH_SACH_DU_AN_S";
export const HRWO001_LAY_DANH_SACH_DU_AN_F = "HRWO001_LAY_DANH_SACH_DU_AN_F";

export const HRWO001_LAY_DANH_SACH_CONG_VIEC =
  "HRWO001_LAY_DANH_SACH_CONG_VIEC";
export const HRWO001_LAY_DANH_SACH_CONG_VIEC_S =
  "HRWO001_LAY_DANH_SACH_CONG_VIEC_S";
export const HRWO001_LAY_DANH_SACH_CONG_VIEC_F =
  "HRWO001_LAY_DANH_SACH_CONG_VIEC_F";

export const HRWO001_LAY_DANH_SACH_UU_TIEN = "HRWO001_LAY_DANH_SACH_UU_TIEN";
export const HRWO001_LAY_DANH_SACH_UU_TIEN_S =
  "HRWO001_LAY_DANH_SACH_UU_TIEN_S";
export const HRWO001_LAY_DANH_SACH_UU_TIEN_F =
  "HRWO001_LAY_DANH_SACH_UU_TIEN_F";

export const HRWO001_DANH_SACH_CHON_NGUOI_GIAO_VIEC =
  "HRWO001_DANH_SACH_CHON_NGUOI_GIAO_VIEC";
export const HRWO001_LAY_DANH_NGUOI_GIAO_VIEC =
  "HRWO001_LAY_DANH_NGUOI_GIAO_VIEC";
export const HRWO001_LAY_DANH_NGUOI_GIAO_VIEC_S =
  "HRWO001_LAY_DANH_NGUOI_GIAO_VIEC_S";
export const HRWO001_LAY_DANH_NGUOI_GIAO_VIEC_F =
  "HRWO001_LAY_DANH_NGUOI_GIAO_VIEC_F";

export const HRWO001_LAY_DANH_NGUOI_GIAO_VIEC_DEFAULT =
  "HRWO001_LAY_DANH_NGUOI_GIAO_VIEC_DEFAULT";
export const HRWO001_LAY_DANH_NGUOI_GIAO_VIEC_DEFAULT_S =
  "HRWO001_LAY_DANH_NGUOI_GIAO_VIEC_DEFAULT_S";
export const HRWO001_LAY_DANH_NGUOI_GIAO_VIEC_DEFAULT_F =
  "HRWO001_LAY_DANH_NGUOI_GIAO_VIEC_DEFAULT_F";

export const HRWO001_DANH_SACH_CHON_NGUOI_THUC_HIEN =
  "HRWO001_DANH_SACH_CHON_NGUOI_THUC_HIEN";
export const HRWO001_LAY_DANH_NGUOI_THUC_HIEN =
  "HRWO001_LAY_DANH_NGUOI_THUC_HIEN";
export const HRWO001_LAY_DANH_NGUOI_THUC_HIEN_S =
  "HRWO001_LAY_DANH_NGUOI_THUC_HIEN_S";
export const HRWO001_LAY_DANH_NGUOI_THUC_HIEN_F =
  "HRWO001_LAY_DANH_NGUOI_THUC_HIEN_F";

export const HRWO001_DANH_SACH_CHON_NGUOI_THEO_DOI =
  "HRWO001_DANH_SACH_CHON_NGUOI_THEO_DOI";
export const HRWO001_LAY_DANH_NGUOI_THEO_DOI =
  "HRWO001_LAY_DANH_NGUOI_THEO_DOI";
export const HRWO001_LAY_DANH_NGUOI_THEO_DOI_S =
  "HRWO001_LAY_DANH_NGUOI_THEO_DOI_S";
export const HRWO001_LAY_DANH_NGUOI_THEO_DOI_F =
  "HRWO001_LAY_DANH_NGUOI_THEO_DOI_F";

export const HRWO001_RESET_ALL_DATA = "HRWO001_RESET_ALL_DATA";

export const HRWO001_INPUT_JOB_NAME = "HRWO001_INPUT_JOB_NAME";
export const HRWO001_INPUT_DESCRIPTION = "HRWO001_INPUT_DESCRIPTION";
export const HRWO001_CHON_DATE = "HRWO001_CHON_DATE";
export const HRWO001_CHON_TIME = "HRWO001_CHON_TIME";

export const HRWO001_CHON_CODE_JOB_TYPE = "HRWO001_CHON_CODE_JOB_TYPE";
export const HRWO001_CHON_NAME_JOB_TYPE = "HRWO001_CHON_NAME_JOB_TYPE";

export const HRWO001_CHON_CODE_CUSTOMER = "HRWO001_CHON_CODE_CUSTOMER";
export const HRWO001_CHON_NAME_CUSTOMER = "HRWO001_CHON_NAME_CUSTOMER";

export const HRWO001_CHON_CODE_PRIORITY = "HRWO001_CHON_CODE_PRIORITY";
export const HRWO001_CHON_NAME_PRIORITY = "HRWO001_CHON_NAME_PRIORITY";

export const HRWO001_FETCH_DATA = "HRWO001_FETCH_DATA";
export const HRWO001_DONE_STATE = "HRWO001_DONE_STATE";

//Loading
export const HRWO001Loading = () => {
  return {
    type: HRWO001_FETCH_DATA,
  };
};
//End loading
export const HRWO001EndLoading = () => {
  return {
    type: HRWO001_DONE_STATE,
  };
};

//Get all data
export const HRWO001LayDanhSachListControl = () => {
  return {
    type: HRWO001_LAY_DANH_SACH_LIST_CONTROL,
  };
};
//Loai cong viec
export const HRWO001LayDanhSachLoaiCongViec = () => {
  return {
    type: HRWO001_LAY_DANH_SACH_LOAI_CONG_VIEC,
  };
};
export const HRWO001LayDanhSachLoaiCongViecS = (ListLoaiCongViec) => {
  return {
    type: HRWO001_LAY_DANH_SACH_LOAI_CONG_VIEC_S,
    ListLoaiCongViec,
  };
};
export const HRWO001LayDanhSachLoaiCongViecF = () => {
  return {
    type: HRWO001_LAY_DANH_SACH_LOAI_CONG_VIEC_F,
  };
};
//Du an khach hang
export const HRWO001LayDanhSachDuAn = () => {
  return {
    type: HRWO001_LAY_DANH_SACH_DU_AN,
  };
};
export const HRWO001LayDanhSachDuAnS = (ListDuAn) => {
  return {
    type: HRWO001_LAY_DANH_SACH_DU_AN_S,
    ListDuAn,
  };
};
export const HRWO001LayDanhSachDuAnF = () => {
  return {
    type: HRWO001_LAY_DANH_SACH_DU_AN_F,
  };
};
//
export const HRWO001LayDanhSachCongViec = () => {
  return {
    type: HRWO001_LAY_DANH_SACH_CONG_VIEC,
  };
};
export const HRWO001LayDanhSachCongViecS = (ListProject) => {
  return {
    type: HRWO001_LAY_DANH_SACH_CONG_VIEC_S,
    ListProject,
  };
};
export const HRWO001LayDanhSachCongViecF = () => {
  return {
    type: HRWO001_LAY_DANH_SACH_CONG_VIEC_F,
  };
};
//Uu tien
export const HRWO001LayDanhSachUuTien = () => {
  return {
    type: HRWO001_LAY_DANH_SACH_UU_TIEN,
  };
};
export const HRWO001LayDanhSachUuTienS = (ListUuTien) => {
  return {
    type: HRWO001_LAY_DANH_SACH_UU_TIEN_S,
    ListUuTien,
  };
};
export const HRWO001LayDanhSachUuTienF = () => {
  return {
    type: HRWO001_LAY_DANH_SACH_UU_TIEN_F,
  };
};
//Nguoi giao viec
export const HRWO001LayDanhSachNguoiGiaoViec = () => {
  return {
    type: HRWO001_LAY_DANH_NGUOI_GIAO_VIEC,
  };
};
export const HRWO001LayDanhSachNguoiGiaoViecS = (ListNguoiGiaoViec) => {
  return {
    type: HRWO001_LAY_DANH_NGUOI_GIAO_VIEC_S,
    ListNguoiGiaoViec,
  };
};
export const HRWO001LayDanhSachNguoiGiaoViecF = () => {
  return {
    type: HRWO001_LAY_DANH_NGUOI_GIAO_VIEC_F,
  };
};

export const HRWO001ChonNguoiGiaoViec = (ListNguoiGiaoViecSelected) => {
  return {
    type: HRWO001_DANH_SACH_CHON_NGUOI_GIAO_VIEC,
    ListNguoiGiaoViecSelected,
  };
};

export const HRWO001LayDanhSachNguoiGiaoViecDefault = () => {
  return {
    type: HRWO001_LAY_DANH_NGUOI_GIAO_VIEC_DEFAULT,
  };
};
export const HRWO001LayDanhSachNguoiGiaoViecDefaultS = (
  ListNguoiGiaoViecDefault
) => {
  return {
    type: HRWO001_LAY_DANH_NGUOI_GIAO_VIEC_DEFAULT_S,
    ListNguoiGiaoViecDefault,
  };
};
export const HRWO001LayDanhSachNguoiGiaoViecDefaultF = () => {
  return {
    type: HRWO001_LAY_DANH_NGUOI_GIAO_VIEC_DEFAULT_F,
  };
};

//Nguoi thuc hien
export const HRWO001LayDanhSachNguoiThucHien = () => {
  return {
    type: HRWO001_LAY_DANH_NGUOI_THUC_HIEN,
  };
};
export const HRWO001LayDanhSachNguoiThucHienS = (ListNguoiThucHien) => {
  return {
    type: HRWO001_LAY_DANH_NGUOI_THUC_HIEN_S,
    ListNguoiThucHien,
  };
};
export const HRWO001LayDanhSachNguoiThucHienF = () => {
  return {
    type: HRWO001_LAY_DANH_NGUOI_THUC_HIEN_F,
  };
};
export const HRWO001ChonNguoiThucHien = (ListNguoiThucHienSelected) => {
  return {
    type: HRWO001_DANH_SACH_CHON_NGUOI_THUC_HIEN,
    ListNguoiThucHienSelected,
  };
};
//Nguoi theo doi
export const HRWO001LayDanhSachNguoiTheoDoi = () => {
  return {
    type: HRWO001_LAY_DANH_NGUOI_THEO_DOI,
  };
};
export const HRWO001LayDanhSachNguoiTheoDoiS = (ListNguoiTheoDoi) => {
  return {
    type: HRWO001_LAY_DANH_NGUOI_THEO_DOI_S,
    ListNguoiTheoDoi,
  };
};
export const HRWO001LayDanhSachNguoiTheoDoiF = () => {
  return {
    type: HRWO001_LAY_DANH_NGUOI_THEO_DOI_F,
  };
};
export const HRWO001ChonNguoiTheoDoi = (ListNguoiTheoDoiSelected) => {
  return {
    type: HRWO001_DANH_SACH_CHON_NGUOI_THEO_DOI,
    ListNguoiTheoDoiSelected,
  };
};

export const HRWO001ResetAllData = (ListNguoiGiaoViecSelected) => {
  return {
    type: HRWO001_RESET_ALL_DATA,
    ListNguoiGiaoViecSelected,
  };
};

export const HRWO001InputJobName = (SelectCodeJobType) => {
  return {
    type: HRWO001_CHON_CODE_JOB_TYPE,
    SelectCodeJobType,
  };
};
export const HRWO001InputDescription = (Description) => {
  return {
    type: HRWO001_INPUT_DESCRIPTION,
    Description,
  };
};
export const HRWO001InputDate = (SelectDate) => {
  return {
    type: HRWO001_CHON_DATE,
    SelectDate,
  };
};
export const HRWO001InputTime = (SelectTime) => {
  return {
    type: HRWO001_CHON_TIME,
    SelectTime,
  };
};

export const HRWO001ChonCodeJobType = (JobName) => {
  return {
    type: HRWO001_INPUT_JOB_NAME,
    JobName,
  };
};
export const HRWO001ChonNameJobType = (SelectNameJobType) => {
  return {
    type: HRWO001_CHON_NAME_JOB_TYPE,
    SelectNameJobType,
  };
};
export const HRWO001ChonCodeCustomer = (SelectCodeCustomer) => {
  return {
    type: HRWO001_CHON_CODE_CUSTOMER,
    SelectCodeCustomer,
  };
};
export const HRWO001ChonNameCustomer = (SelectNameCustomer) => {
  return {
    type: HRWO001_CHON_NAME_CUSTOMER,
    SelectNameCustomer,
  };
};
export const HRWO001ChonCodePriority = (SelectCodePriority) => {
  return {
    type: HRWO001_CHON_CODE_PRIORITY,
    SelectCodePriority,
  };
};
export const HRWO001ChonNamePriority = (SelectNamePriority) => {
  return {
    type: HRWO001_CHON_NAME_PRIORITY,
    SelectNamePriority,
  };
};

export const HRWO001_RELOAD_DANHSACH = "HRWO001_RELOAD_DANHSACH";
export const HRWO001ReloadList = () => {
  return {
    type: HRWO001_RELOAD_DANHSACH,
  };
};

export const HRWO001_RELOAD_SUCCESS = "HRWO001_RELOAD_SUCCESS";
export const HRWO001ReloadListSuccess = () => {
  return {
    type: HRWO001_RELOAD_SUCCESS,
  };
};
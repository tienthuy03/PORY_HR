export const HRRI000_LAY_DANH_SACH_DANG_KY = "HRRI000_LAY_DANH_SACH_DANG_KY";
export const HRRI000_LAY_DANH_SACH_DANG_KY_S =
  "HRRI000_LAY_DANH_SACH_DANG_KY_S";
export const HRRI000_LAY_DANH_SACH_DANG_KY_F =
  "HRRI000_LAY_DANH_SACH_DANG_KY_F";
export const HRRI000_LAY_DU_LIEU_VI_PHAM_COM =
  "HRRI000_LAY_DU_LIEU_VI_PHAM_COM";
export const HRRI000_LAY_DU_LIEU_VI_PHAM_COM_S =
  "HRRI000_LAY_DU_LIEU_VI_PHAM_COM_S";
export const HRRI000_LAY_DU_LIEU_VI_PHAM_COM_F =
  "HRRI000_LAY_DU_LIEU_VI_PHAM_COM_F";
export const HRRI000_FROM_DT = "HRRI000_FROM_DT";
export const HRRI000_TO_DT = "HRRI000_TO_DT";

export const HRRI000_LAY_DANH_SACH_NHA_AN = "HRRI000_LAY_DANH_SACH_NHA_AN";
export const HRRI000_LAY_DANH_SACH_NHA_AN_S = "HRRI000_LAY_DANH_SACH_NHA_AN_S";
export const HRRI000_LAY_DANH_SACH_NHA_AN_F = "HRRI000_LAY_DANH_SACH_NHA_AN_F";

export const HRRI000LayDanhSachDangKy = () => {
  return {
    type: HRRI000_LAY_DANH_SACH_DANG_KY,
  };
};
export const HRRI000LayDanhSachDangKyS = (DanhSachDangKy) => {
  return {
    type: HRRI000_LAY_DANH_SACH_DANG_KY_S,
    DanhSachDangKy,
  };
};
export const HRRI000LayDanhSachDangKyF = () => {
  return {
    type: HRRI000_LAY_DANH_SACH_DANG_KY_F,
  };
};

export const HRRI000LayDanhSachNhaAn = () => {
  return {
    type: HRRI000_LAY_DANH_SACH_NHA_AN,
  };
};
export const HRRI000LayDanhSachNhaAnS = (DanhSachNhaAnCoDinh) => {
  return {
    type: HRRI000_LAY_DANH_SACH_NHA_AN_S,
    DanhSachNhaAnCoDinh,
  };
};
export const HRRI000LayDanhSachNhaAnF = () => {
  return {
    type: HRRI000_LAY_DANH_SACH_NHA_AN_F,
  };
};

export const HRRI000LayDuLieuViPhamCom = () => {
  return {
    type: HRRI000_LAY_DU_LIEU_VI_PHAM_COM,
  };
};
export const HRRI000LayDuLieuViPhamComS = (ViPhamCom) => {
  return {
    type: HRRI000_LAY_DU_LIEU_VI_PHAM_COM_S,
    ViPhamCom,
  };
};
export const HRRI000LayDuLieuViPhamComF = () => {
  return {
    type: HRRI000_LAY_DU_LIEU_VI_PHAM_COM_F,
  };
};

export const HRRI000FromDt = (From_dt) => {
  return {
    type: HRRI000_FROM_DT,
    From_dt,
  };
};

export const HRRI000ToDt = (To_dt) => {
  return {
    type: HRRI000_TO_DT,
    To_dt,
  };
};

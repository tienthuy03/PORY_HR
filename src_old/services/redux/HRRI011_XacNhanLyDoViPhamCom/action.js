export const HRRI011_LAY_DANH_SACH_XN = "HRRI011_LAY_DANH_SACH_XN";

export const HRRI011_LAY_DANH_SACH_CXN = "HRRI011_LAY_DANH_SACH_CXN";
export const HRRI011_LAY_DANH_SACH_CXN_S = "HRRI011_LAY_DANH_SACH_CXN_S";
export const HRRI011_LAY_DANH_SACH_CXN_F = "HRRI011_LAY_DANH_SACH_CXN_F";

export const HRRI011_LAY_DANH_SACH_DXN = "HRRI011_LAY_DANH_SACH_DXN";
export const HRRI011_LAY_DANH_SACH_DXN_S = "HRRI011_LAY_DANH_SACH_DXN_S";
export const HRRI011_LAY_DANH_SACH_DXN_F = "HRRI011_LAY_DANH_SACH_DXN_F";

export const HRRI011_LAY_DANH_SACH_VP1 = "HRRI011_LAY_DANH_SACH_VP1";
export const HRRI011_LAY_DANH_SACH_VP1_S = "HRRI011_LAY_DANH_SACH_VP1_S";
export const HRRI011_LAY_DANH_SACH_VP1_F = "HRRI011_LAY_DANH_SACH_VP1_F";

export const HRRI011_LAY_DANH_SACH_VP2 = "HRRI011_LAY_DANH_SACH_VP2";
export const HRRI011_LAY_DANH_SACH_VP2_S = "HRRI011_LAY_DANH_SACH_VP2_S";
export const HRRI011_LAY_DANH_SACH_VP2_F = "HRRI011_LAY_DANH_SACH_VP2_F";

export const HRRI011_FROM_DT = "HRRI011_FROM_DT";
export const HRRI011_TO_DT = "HRRI011_TO_DT";
//
export const HRRI011LayDanhSachXN = () => {
  return {
    type: HRRI011_LAY_DANH_SACH_XN,
  };
};
//
export const HRRI011LayDanhSachCXN = () => {
  return {
    type: HRRI011_LAY_DANH_SACH_CXN,
  };
};
export const HRRI011LayDanhSachCXNS = (DsCXN, DsNPD) => {
  return {
    type: HRRI011_LAY_DANH_SACH_CXN_S,
    DsCXN,
    DsNPD,
  };
};
export const HRRI011LayDanhSachCXNF = () => {
  return {
    type: HRRI011_LAY_DANH_SACH_CXN_F,
  };
};
//
export const HRRI011LayDanhSachDXN = () => {
  return {
    type: HRRI011_LAY_DANH_SACH_DXN,
  };
};
export const HRRI011LayDanhSachDXNS = (DsDXN, DsApprove) => {
  return {
    type: HRRI011_LAY_DANH_SACH_DXN_S,
    DsDXN,
    DsApprove, 
  };
};
export const HRRI011LayDanhSachDXNF = () => {
  return {
    type: HRRI011_LAY_DANH_SACH_DXN_F,
  };
};
//
export const HRRI011LayDanhSachVP1 = () => {
  return {
    type: HRRI011_LAY_DANH_SACH_VP1,
  };
};
export const HRRI011LayDanhSachVP1S = (DsVP1) => {
  return {
    type: HRRI011_LAY_DANH_SACH_VP1_S,
    DsVP1,
  };
};
export const HRRI011LayDanhSachVP1F = () => {
  return {
    type: HRRI011_LAY_DANH_SACH_VP1_F,
  };
};
//
export const HRRI011LayDanhSachVP2 = () => {
  return {
    type: HRRI011_LAY_DANH_SACH_VP2,
  };
};
export const HRRI011LayDanhSachVP2S = (DsVP2) => {
  return {
    type: HRRI011_LAY_DANH_SACH_VP2_S,
    DsVP2,
  };
};
export const HRRI011LayDanhSachVP2F = () => {
  return {
    type: HRRI011_LAY_DANH_SACH_VP2_F,
  };
};
// Date control
export const HRRI011FromDt = (From_dt) => {
  return {
    type: HRRI011_FROM_DT,
    From_dt,
  };
};

export const HRRI011ToDt = (To_dt) => {
  return {
    type: HRRI011_TO_DT,
    To_dt,
  };
};

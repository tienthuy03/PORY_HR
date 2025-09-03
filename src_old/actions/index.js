import {
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  LOGIN_USER,
  FETCH_LANGUAGE,
  FETCH_LANGUAGE_SUCCESS,
  FETCH_LANGUAGE_FAILED,
  FETCH_MENU,
  FETCH_MENU_FAILED,
  FETCH_MENU_SUCCESS,
  FETCH_TTCN,
  FETCH_TTCN_SUCCESS,
  FETCH_TTCN_FAILED,
  FETCH_WORKING_DAILY,
  FETCH_WORKING_DAILY_FAILED,
  FETCH_WORKING_DAILY_SUCCESS,
  FETCH_WORKING_MONTHLY,
  FETCH_WORKING_MONTHLY_FAILED,
  FETCH_WORKING_MONTHLY_SUCCESS,
  FETCH_SALARY_MONTH,
  FETCH_SALARY_MONTH_SUCCESS,
  FETCH_SALARY_MONTH_FAILED,
  FETCH_ABSENCE_INFORMATION,
  FETCH_ABSENCE_INFORMATION_SUCCESS,
  FETCH_ABSENCE_INFORMATION_FAILED,
  FETCH_ATTENDANCE_HISTORY,
  FETCH_ATTENDANCE_HISTORY_SUCCESS,
  FETCH_ATTENDANCE_HISTORY_FAILED,
  FETCH_XNTC,
  FETCH_XNTC_SUCCESS,
  FETCH_XNTC_FAILED,
  FETCH_NPD,
  FETCH_NPD_SUCCESS,
  FETCH_NPD_FAILED,
  FETCH_DKV,
  FETCH_DKV_SUCCESS,
  FETCH_DKV_FAILED,
  DELETE_DKV,
  FETCH_DKVV2,
  FETCH_DKVV2_SUCCESS,
  FETCH_DKVV2_FAILED,
  DELETE_DKVV2,
  FETCH_DKDT_VS,
  FETCH_DKDT_VS_SUCCESS,
  FETCH_DKDT_VS_FAILED,
  POST_XNTC,
  POST_XNTC_SUCCESS,
  POST_XNTC_FAILED,
  UPDATE_USER,
  UPDATE_USER_SUCCESS,
  CLEAR_USER,
  FETCH_NOTI,
  FETCH_NOTI_SUCCESS,
  FETCH_NOTI_FAILED,
  FETCH_PDDT_VS,
  FETCH_PDDT_VS_SUCCESS,
  FETCH_PDDT_VS_FAILED,
  FETCH_PD_TC,
  FETCH_PDTC_SUCCESS,
  FETCH_PDTC_FAILED,
  FETCH_VPCC,
  FETCH_VPCC_SUCCESS,
  FETCH_VPCC_FAILED,

  ITEM_QR_DEFAULT,
  ITEM_QR_DEFAULT_SUCCESS,
  ITEM_QR_DEFAULT_FAILED,

} from './actionType';


export const itemQRDefaultAction = (payload) => {
  return {
    type: ITEM_QR_DEFAULT,
    payload: payload,
  };
}

export const itemQRDefaultSuccessAction = payload => {
  return {
    type: ITEM_QR_DEFAULT_SUCCESS,
    payload: payload,
  };
}

export const itemQRDefaultFailedAction = payload => {
  return {
    type: ITEM_QR_DEFAULT_FAILED,
    payload: payload,
  };
}


//Login
export const fetchLoginAction = credentials => {
  return {
    type: LOGIN_USER,
    payload: credentials,
  };
};

export const fetchLoginSuccessAction = user => {
  return {
    type: LOGIN_SUCCESS,
    payload: user,
  };
};

export const fetchLoginFailedAction = error => {
  return {
    type: LOGIN_FAILED,
    payload: error,
  };
};

export const logOutAction = () => {
  return {
    type: CLEAR_USER,
  };
};

//Update user
export const updateUserAction = params => {
  return {
    type: UPDATE_USER,
    payload: params,
  };
};

//get data language
export const fetchLanguageAction = params => {
  return {
    type: FETCH_LANGUAGE,
    payload: params,
  };
};

export const fetchLanguageSuccessAction = data => {
  return {
    type: FETCH_LANGUAGE_SUCCESS,
    payload: data,
  };
};

export const fetchLanguageFailedAction = error => {
  return {
    type: FETCH_LANGUAGE_FAILED,
    payload: error,
  };
};

//get data menu
export const fetchMenuAction = params => {
  return {
    type: FETCH_MENU,
    payload: params,
  };
};

export const fetchMenuSuccessAction = data => {
  return {
    type: FETCH_MENU_SUCCESS,
    payload: data,
  };
};

export const fetchMenuFailedAction = error => {
  return {
    type: FETCH_MENU_FAILED,
    payload: error,
  };
};

//get data noti
export const fetchNotiAction = params => {
  return {
    type: FETCH_NOTI,
    payload: params,
  };
};

export const fetchNotiSuccessAction = data => {
  return {
    type: FETCH_NOTI_SUCCESS,
    payload: data,
  };
};

export const fetchNotiFailedAction = error => {
  return {
    type: FETCH_NOTI_FAILED,
    payload: error,
  };
};

//get data TTCN
export const fetchTTCNAction = params => {
  return {
    type: FETCH_TTCN,
    payload: params,
  };
};

export const fetchTTCNSuccessAction = data => {
  return {
    type: FETCH_TTCN_SUCCESS,
    payload: data,
  };
};

export const fetchTTCNFailedAction = error => {
  return {
    type: FETCH_TTCN_FAILED,
    payload: error,
  };
};

//get data WORKING DAILY
export const fetchWokingDailyAction = params => {
  return {
    type: FETCH_WORKING_DAILY,
    payload: params,
  };
};

export const fetchWokingDailySuccessAction = data => {
  return {
    type: FETCH_WORKING_DAILY_SUCCESS,
    payload: data,
  };
};

export const fetchWokingDailyFailedAction = error => {
  return {
    type: FETCH_WORKING_DAILY_FAILED,
    payload: error,
  };
};
//get data VPCC
export const fetchVPCCAction = params => {
  return {
    type: FETCH_VPCC,
    payload: params,
  };
};

export const fetchVPCCSuccessAction = data => {
  return {
    type: FETCH_VPCC_SUCCESS,
    payload: data,
  };
};

export const fetchVPCCFailedAction = error => {
  return {
    type: FETCH_VPCC_FAILED,
    payload: error,
  };
};

// //get data WORKING MONTHLY
// export const fetchWokingMonthlyAction = (params) => {
//   return {
//     type: FETCH_WORKING_MONTHLY,
//     payload: params,
//   };
// };

// export const fetchWokingMonthlySuccessAction = (data) => {
//   return {
//     type: FETCH_WORKING_MONTHLY_SUCCESS,
//     payload: data,
//   };
// };

// export const fetchWokingMonthlyFailedAction = (error) => {
//   return {
//     type: FETCH_WORKING_MONTHLY_FAILED,
//     payload: error,
//   };
// };

//get data WORKING MONTHLY
export const fetchSalaryMonthAction = params => {
  return {
    type: FETCH_SALARY_MONTH,
    payload: params,
  };
};

export const fetchSalaryMonthSuccessAction = data => {
  return {
    type: FETCH_SALARY_MONTH_SUCCESS,
    payload: data,
  };
};

export const fetchSalaryMonthFailedAction = error => {
  return {
    type: FETCH_SALARY_MONTH_FAILED,
    payload: error,
  };
};

//get data Absence Information
export const fetchAbsenceInformationAction = params => {
  return {
    type: FETCH_ABSENCE_INFORMATION,
    payload: params,
  };
};

export const fetchAbsenceInformationSuccessAction = data => {
  return {
    type: FETCH_ABSENCE_INFORMATION_SUCCESS,
    payload: data,
  };
};

export const fetchAbsenceInformationFailedAction = error => {
  return {
    type: FETCH_ABSENCE_INFORMATION_FAILED,
    payload: error,
  };
};

//get data Attendance History
export const fetchAttendanceAction = params => {
  return {
    type: FETCH_ATTENDANCE_HISTORY,
    payload: params,
  };
};

export const fetchAttendanceSuccessAction = data => {
  return {
    type: FETCH_ATTENDANCE_HISTORY_SUCCESS,
    payload: data,
  };
};

export const fetchAttendanceFailedAction = error => {
  return {
    type: FETCH_ATTENDANCE_HISTORY_FAILED,
    payload: error,
  };
};

//get data XNTC
export const fetchXntcAction = params => {
  return {
    type: FETCH_XNTC,
    payload: params,
  };
};

export const fetchXntcSuccessAction = data => {
  return {
    type: FETCH_XNTC_SUCCESS,
    payload: data,
  };
};

export const fetchXntcFailedAction = error => {
  return {
    type: FETCH_XNTC_FAILED,
    payload: error,
  };
};

//post XNTC
export const postXntcAction = params => {
  return {
    type: POST_XNTC,
    payload: params,
  };
};

export const postXntcSuccessAction = data => {
  return {
    type: POST_XNTC_SUCCESS,
    payload: data,
  };
};

export const postXntcFailedAction = error => {
  return {
    type: POST_XNTC_FAILED,
    payload: error,
  };
};

//get data NPD
export const fetchNpdAction = params => {
  return {
    type: FETCH_NPD,
    payload: params,
  };
};

export const fetchNpdSuccessAction = data => {
  return {
    type: FETCH_NPD_SUCCESS,
    payload: data,
  };
};

export const fetchNpdFailedAction = error => {
  return {
    type: FETCH_NPD_FAILED,
    payload: error,
  };
};

//get data DKV
export const fetchDkvAction = params => {
  return {
    type: FETCH_DKV,
    payload: params,
  };
};

export const fetchDkvSuccessAction = data => {
  return {
    type: FETCH_DKV_SUCCESS,
    payload: data,
  };
};

export const fetchDkvFailedAction = error => {
  return {
    type: FETCH_DKV_FAILED,
    payload: error,
  };
};
export const deleteDataDKV = () => {
  return {
    type: DELETE_DKV,
  };
};

export const deleteDataDKVV2 = () => {
  return {
    type: DELETE_DKVV2,
  };
};
//get data DKDT-VS
export const fetchDTVSAction = params => {
  return {
    type: FETCH_DKDT_VS,
    payload: params,
  };
};

export const fetchDTVSSuccessAction = data => {
  return {
    type: FETCH_DKDT_VS_SUCCESS,
    payload: data,
  };
};

export const fetchDTVSFailedAction = error => {
  return {
    type: FETCH_DKDT_VS_FAILED,
    payload: error,
  };
};

//get data PDDT-VS
export const fetchPDDT_VSAction = params => {
  return {
    type: FETCH_PDDT_VS,
    payload: params,
  };
};

export const fetchPDDT_VS_SuccessAction = data => {
  return {
    type: FETCH_PDDT_VS_SUCCESS,
    payload: data,
  };
};

export const fetchPDDT_VS_FailedAction = error => {
  return {
    type: FETCH_PDDT_VS_FAILED,
    payload: error,
  };
};

//get data PDTC
export const fetchPDTCAction = params => {
  return {
    type: FETCH_PD_TC,
    payload: params,
  };
};

export const fetchPDTCSuccessAction = data => {
  return {
    type: FETCH_PDTC_SUCCESS,
    payload: data,
  };
};

export const fetchPDTCFailedAction = error => {
  return {
    type: FETCH_PDTC_FAILED,
    payload: error,
  };
};

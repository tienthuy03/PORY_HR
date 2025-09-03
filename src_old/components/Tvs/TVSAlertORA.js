import { Alert } from "react-native";

export const showAlert = (oraError) => {
  let checkORA = oraError.indexOf("ORA-", 0);
  let checkORA1 = oraError.indexOf("ORA-", 1);
  let raiseError = "";
  if (checkORA >= 0) {
    raiseError = oraError.substring(oraError.indexOf(":") + 1, checkORA1);
  } else {
    raiseError = oraError;
  }
  Alert.alert("Thông báo", raiseError);
};

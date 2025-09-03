import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  FlatList,
} from "react-native";
import { Color } from "../../../../../colors/colortv";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as AMT from "react-native-animatable";
import TVSButton from "../../../../../components/Tvs/Button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
axios.defaults.timeout = 60000;
axios.defaults.timeoutErrorMessage = "requestTimeout";
import sysFetch from "../../../../../services/fetch_v1";
import { updateUserAction } from "../../../../../actions";
import Button from "../../../../../components/Button";
import RNRestart from "react-native-restart";
import { APP_VERSION } from "../../../../../config/Pro";
const defaultAvatar =
  "data:image/png;base64,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";

const styles = StyleSheet.create({
  btnChupAnhTouch: {
    padding: 10,
    borderColor: Color.btnMain,
    borderWidth: 1,
    backgroundColor: Color.inputBackgroundColor,
    borderRadius: 5,
    marginTop: 10,
  },
  btnChupAnhText: {
    color: Color.mainColor,
  },
  viewInfo: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
  },
  viewPicture: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  picture: {
    width: 180,
    borderRadius: 10,
    borderColor: Color.grayPlahoder,
    borderWidth: 1,
    resizeMode: "contain",
    height: 240,
  },
  label: {
    fontSize: 15,
  },
  field: {
    fontSize: 15,
    paddingLeft: 10,
  },
  body: {},
  CheckBoxE: {
    width: 30,
    height: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Color.primaryButton2,
    backgroundColor: Color.primaryButton2,
    justifyContent: "center",
    alignItems: "center",
  },
  CheckBoxD: {
    width: 30,
    height: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Color.mainColor,
  },
});

const TVSControlPopupMachine = ({
  isShow,
  onHide,
  children,
  title,
  maxHeight = Dimensions.get("screen").height,
  minHeight,
  backgroundColor = "white",
  type,
  empInfo,
  setDataOneItem = () => {},
  dsNhanVien,
  setDsNhanVien = () => {},
}) => {
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const dispatch = useDispatch();
  let tokenLogin = useSelector(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  let userPk = useSelector(
    (state) => state.loginReducers.data.data.tes_user_pk
  );
  let thr_emp_pk = useSelector(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );
  let crt_by = useSelector((state) => state.loginReducers.data.data.crt_by);
  let refreshToken = useSelector(
    (state) => state.loginReducers.data.data.refreshToken
  );
  let [dataMachine, setDataMachine] = useState([]);

  useEffect(() => {
    onLoadData();
  }, []);

  useEffect(() => {
    if (!isShow) {
      let newArr = [...dataMachine];
      newArr.forEach(function (dataItem) {
        dataItem.sel_yn = "N";
      });
      setDataMachine(newArr);
    }
    dataMachine.forEach(function (dataItem) {
      dataItem.status = "";
      dataItem.status_color = "";
    });
  }, [isShow]);

  const onLoadData = () => {
    const pro = "SELHRTI007004";
    const in_par = {
      p1_varchar2: userPk,
      p2_varchar2: APP_VERSION,
      p3_varchar2: crt_by,
    };
    console.log(pro, in_par);
    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_sys: "data",
        },
      },
      tokenLogin
    ).then((rs) => {
      console.log("RS", rs);
      if (rs == "Token Expired") {
        refreshNewToken("onLoadData");
      }
      if (rs != "Token Expired") {
        setDataMachine(rs.data.data);
      }
    });
  };
  const CheckMachine = (item) => {
    let newArr = [...dataMachine];
    let flagChk = item.sel_yn == "Y" ? "N" : "Y";
    newArr.forEach(function (dataItem) {
      if (dataItem.pk == item.pk) {
        dataItem.sel_yn = flagChk;
      }
    });
    setDataMachine(newArr);
  };

  const refreshNewToken = (obj) => {
    axios
      .post(API + "User/RefreshToken/", {
        token: tokenLogin,
        userPk: userPk,
        refreshToken: refreshToken,
      })
      .then((response) => {
        dispatch(
          updateUserAction({
            index: 0,
            value: response.data.token,
            key: "tokenLogin",
          })
        );
        dispatch(
          updateUserAction({
            index: 0,
            value: response.data.refreshToken,
            key: "refreshToken",
          })
        );
        tokenLogin = response.data.token;
        refreshToken = response.data.refreshToken;
      })
      .catch((error) => {
        if (error == "AxiosError: Request failed with status code 400") {
          Alert.alert(
            "Thông báo",
            "Phiên bản làm việc đã hết hạn. Vui lòng đăng nhập lại hệ thống",
            [
              {
                text: "Đóng",
                onPress: () => {
                  RNRestart.Restart();
                },
              },
            ],
            { cancelable: true }
          );
        }
        console.log(error);
      });
  };

  const onConfirmSelectMachine = () => {
    let arrData = [];

    dataMachine.forEach(function (item) {
      if (item.sel_yn == "Y") {
        arrData.push(item);
      }
    });
    if (arrData.length == 0) {
      dialogNoti("Vui lòng chọn máy chấm công");
      return;
    }

    if (type == "Update" && arrData.length > 1) {
      dialogNoti("Chỉ được chọn 1 máy khi cập nhật dữ liệu");
      return;
    }
    console.log("type ", type);
    let noti =
      type == "Register"
        ? "đăng ký xuống"
        : type == "Update"
        ? "cập nhật từ"
        : "đăng ký xuống";
    Alert.alert(
      "Thông báo",
      "Bạn có muốn " + noti + " máy chấm công không?",
      [
        {
          text: "Hủy bỏ",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: () => {
            onSelectMachine(arrData);
          },
        },
      ],
      { cancelable: false }
    );
  };
  const onSelectMachine = async (arrData) => {
    if (arrData.length > 0) {
      let data = [...dataMachine];
      data.map(function (itemData) {
        if (itemData.sel_yn == "Y") {
          itemData.status = "Đang xử lý";
          itemData.status_color = "#FFA500";
        } else {
          itemData.status = "";
          itemData.status_color = "";
        }
      });
      setDataMachine(data);

      if (type == "Register") {
        console.log(arrData);
        for (let i = 0; i < arrData.length; i++) {
          let rs = await RegisterMita(arrData[i]);
          console.log("rsMita ", rs);
        }
      } else if (type == "Update") {
        console.log("type ", type);
        let rs = await UploadMita(arrData[0]);
        console.log("rsMita ", rs);
      } else if (type == "RegisterMultiple") {
        onSelectMachineMultiple(arrData);
      }
    }
  };
  const UploadMita = (arrMachineUpload) => {
    return new Promise((resolve) => {
      var str_url = arrMachineUpload.ubio_url + "/GetUserInfoMita";

      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${tokenLogin}`,
          "content-type": "application/json",
        },
      };
      var obj = {
        userID: empInfo.id_num,
        machine_ip: arrMachineUpload.ip,
        port: arrMachineUpload.port,
      };
      axios
        .post(str_url, obj, {
          axiosConfig,
        })
        .then((res) => {
          if (res.data.Result == "S") {
            if (res.data.Data.Status == "S") {
              let fp1 = "";
              let fp2 = "";
              let fp3 = "";
              let cardno = "";
              if (res.data.Data.Data.fingerprints.length > 0) {
                for (
                  let i = 0;
                  i < res.data.Data.Data.fingerprints.length;
                  i++
                ) {
                  if (
                    res.data.Data.Data.fingerprints[i].fingerIndex == 0 &&
                    res.data.Data.Data.fingerprints[i].fingerData.length > 0
                  ) {
                    fp1 = res.data.Data.Data.fingerprints[i].fingerData;
                  } else if (
                    res.data.Data.Data.fingerprints[i].fingerIndex == 1 &&
                    res.data.Data.Data.fingerprints[i].fingerData.length > 0
                  ) {
                    fp2 = res.data.Data.Data.fingerprints[i].fingerData;
                  } else if (
                    res.data.Data.Data.fingerprints[i].fingerIndex == 2 &&
                    res.data.Data.Data.fingerprints[i].fingerData.length > 0
                  ) {
                    fp3 = res.data.Data.Data.fingerprints[i].fingerData;
                  }
                }
              }
              cardno = res.data.Data.Data.cardNumber;
              // dso_pro_hrmt00305_2.Call();
              const pro = "UPDHRTI007001";
              const in_par = {
                p1_varchar2: empInfo.id_num,
                p2_varchar2: fp1,
                p3_varchar2: fp2,
                p4_varchar2: fp3,
                p5_varchar2: cardno,
                p6_varchar2: APP_VERSION,
                p7_varchar2: crt_by,
              };
              sysFetch(
                API,
                {
                  pro,
                  in_par,
                  out_par: {
                    p1_number: "result",
                  },
                },
                tokenLogin
              ).then((rs) => {
                console.log("rs UPDHRTI007001", rs.data.result);
                if (rs != "Token Expired") {
                  if (rs.data.result == "1") {
                    let data = [...dataMachine];
                    data.map(function (itemData) {
                      if (
                        itemData.ubio_ter_id == arrMachineUpload.ubio_ter_id
                      ) {
                        itemData.status = "Hoàn thành";
                        itemData.status_color = "#00b050";
                      }
                    });
                    setDataMachine(data);
                    resolve(true);
                  } else {
                    let data = [...dataMachine];
                    data.map(function (itemData) {
                      if (
                        itemData.ubio_ter_id == arrMachineUpload.ubio_ter_id
                      ) {
                        itemData.status = "Thất bại";
                        itemData.status_color = "#ff0000";
                      }
                    });
                    setDataMachine(data);
                    resolve(false);
                  }
                } else {
                  let data = [...dataMachine];
                  data.map(function (itemData) {
                    if (itemData.ubio_ter_id == arrMachineUpload.ubio_ter_id) {
                      itemData.status = "Thất bại";
                      itemData.status_color = "#ff0000";
                    }
                  });
                  setDataMachine(data);
                  resolve(false);
                }
              });
            } else {
              let data = [...dataMachine];
              data.map(function (itemData) {
                if (itemData.ubio_ter_id == arrMachineUpload.ubio_ter_id) {
                  itemData.status = "Thất bại";
                  itemData.status_color = "#ff0000";
                }
              });
              setDataMachine(data);
              resolve(false);
            }
          } else {
            let data = [...dataMachine];
            data.map(function (itemData) {
              if (itemData.ubio_ter_id == arrMachineUpload.ubio_ter_id) {
                itemData.status = "Thất bại";
                itemData.status_color = "#ff0000";
              }
            });
            setDataMachine(data);
            resolve(false);
          }
        })
        .finally(() => {});
    });
  };
  const RegisterMita = (arrMachineRegister) => {
    return new Promise((resolve) => {
      var fingerprints = [];
      if (empInfo.finger_1.length > 0) {
        fingerprints.push({
          fingerIndex: 0,
          flag: 1,
          fingerData: empInfo.finger_1,
        });
      }
      if (empInfo.finger_2.length > 0) {
        fingerprints.push({
          fingerIndex: 1,
          flag: 1,
          fingerData: empInfo.finger_2,
        });
      }
      if (empInfo.finger_3.length > 0) {
        fingerprints.push({
          fingerIndex: 2,
          flag: 1,
          fingerData: empInfo.finger_3,
        });
      }

      str_url = arrMachineRegister.ubio_url + "/AddUserToTerminalMita";
      let obj = {
        userID: empInfo.id_num,
        name: empInfo.full_fname,
        privilege: 0,
        cardNumber:
          arrMachineRegister.auth_card_yn == "Y" ? empInfo.card_num : "",
        password: "",
        fingerprints,
        machine_ip: arrMachineRegister.ip,
        port: arrMachineRegister.port,
      };
      console.log("str_url", str_url);
      console.log("OBJ", obj);
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${tokenLogin}`,
          "content-type": "application/json",
        },
      };
      axios
        .post(str_url, obj, {
          axiosConfig,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.Result == "S" && res.data.Data.Status == "S") {
            let data = [...dataMachine];
            data.map(function (itemData) {
              if (itemData.ubio_ter_id == arrMachineRegister.ubio_ter_id) {
                itemData.status = "Hoàn thành";
                itemData.status_color = "#00b050";
              }
            });
            setDataMachine(data);
            resolve(true);
          } else {
            let data = [...dataMachine];
            data.map(function (itemData) {
              if (itemData.ubio_ter_id == arrMachineRegister.ubio_ter_id) {
                itemData.status = "Thất bại";
                itemData.status_color = "#ff0000";
              }
            });
            setDataMachine(data);
            resolve(false);
          }
        })
        .finally(() => {});
    });
  };

  const onSelectMachineMultiple = (dataMachine) => {
    console.log("onSelectMachineMultiple", type);
    onHide();
    let arrNoGroup = [];
    let arrHasGroup = [];
    let arrLstEmpPK = [];
    let lst_machine_pk = "";
    let lst_emp_pk = "";
    dataMachine.forEach(function (item) {
      lst_machine_pk += item.pk + ",";
    });
    lst_machine_pk = lst_machine_pk.substring(0, lst_machine_pk.length - 1);
    let date = new Date().getTime();
    dsNhanVien.forEach(function (itemUser) {
      if (itemUser.sel_yn == "Y") {
        dataMachine.forEach(function (itemMachine) {
          // if (type == "RegisterMultiple") {
          //   insertDBMultiple(itemMachine, itemUser, "EventAddUser", date);
          //   setTimeout(() => {
          //     getStatusDBMultiple(itemMachine, itemUser, "EventAddUser");
          //   }, 1000);
          // } else if (type == "UpdateMultiple") {
          //   insertDBMultiple(itemMachine, itemUser, "EventGetUserData", date);
          //   setTimeout(() => {
          //     getStatusDBMultiple(itemMachine, itemUser, "EventGetUserData");
          //     getInfoMultiple(itemUser);
          //   }, 1000);
          // }
        });
      }
    });

    dsNhanVien.forEach(function (itemUser) {
      if (itemUser.sel_yn == "Y") {
        if (itemUser.count_group == 0) {
          dataMachine.forEach(function (itemMachine) {
            console.log("item machine ", itemMachine);
            console.log("item itemUser ", itemUser);
            arrNoGroup.push({
              EMP_ID: itemUser.emp_id,
              ID_NUM: itemUser.id_num,
              BORNTIME: itemUser.borntime,
              IMAGE_FACE: itemUser.image,
              GENDER: itemUser.gender,
              HAS_PHOTO: itemUser.has_photo,
              FULL_NAME: itemUser.full_name,
              FULL_FNAME: itemUser.full_fname,
              CARD_NUM: itemUser.card_num,
              FINGER_1: itemUser.finger_1,
              FINGER_2: itemUser.finger_2,
              FINGER_3: itemUser.finger_3,
              AUTH_FINGER_YN: itemMachine.auth_finger_yn,
              AUTH_CARD_YN: itemMachine.auth_card_yn,
              AUTH_FACE_YN: itemMachine.auth_face_yn,
              FACE_IP: itemMachine.face_ip,
              URL_API: itemMachine.url_api,
              IP: itemMachine.ip,
              PORT: itemMachine.port,
              PASSWORD: itemMachine.password,
              MACHINE_KIND: itemMachine.machine_kind,
              URL_API_SERVER: itemMachine.url_api_server,
              URL_WS: itemMachine.url_ws,
              URL_CALLBACK: itemMachine.url_callback,
              UBIO_URL: itemMachine.ubio_url,
              UBIO_TER_ID: itemMachine.ubio_ter_id,
              CLIENT_PK: itemMachine.client_pk,
            });
          });
        } else if (itemUser.count_group > 0) {
          lst_emp_pk += itemUser.pk + ",";
        }
      }
    });
    if (arrNoGroup.length > 0) {
      onUserNoGroup(arrNoGroup);
    }
    // if (lst_emp_pk.length > 0) {
    //   arrLstEmpPK.push({
    //     list_emp_pk: lst_emp_pk.substring(0, lst_emp_pk.length - 1),
    //     list_machine_pk: lst_machine_pk,
    //   });
    // }
    // if (arrLstEmpPK.length > 0) {
    //   const pro = "SELHRTI007005";
    //   const in_par = {
    //     p1_varchar2: arrLstEmpPK[0].list_emp_pk,
    //     p2_varchar2: arrLstEmpPK[0].list_machine_pk,
    //     p3_varchar2: APP_VERSION,
    //     p4_varchar2: crt_by,
    //   };

    //   console.log(pro, in_par);

    //   sysFetch(
    //     API,
    //     {
    //       pro,
    //       in_par,
    //       out_par: {
    //         p1_sys: "data",
    //       },
    //     },
    //     tokenLogin
    //   ).then((rs) => {
    //     console.log("RS SELHRTI007005", rs);
    //     if (rs.data.data.length > 0) {
    //       rs.data.data.forEach(function (itemEmpGroup) {
    //         arrHasGroup.push({
    //           EMP_ID: itemEmpGroup.emp_id,
    //           ID_NUM: itemEmpGroup.id_num,
    //           BORNTIME: itemEmpGroup.borntime,
    //           IMAGE_FACE: itemEmpGroup.image_face,
    //           GENDER: itemEmpGroup.gender,
    //           HAS_PHOTO: itemEmpGroup.has_photo,
    //           FULL_NAME: itemEmpGroup.full_name,
    //           FULL_FNAME: itemEmpGroup.full_fname,
    //           CARD_NUM: itemEmpGroup.card_num,
    //           FP_UBIO_1_1: itemEmpGroup.fp_ubio_1_1,
    //           FP_UBIO_1_2: itemEmpGroup.fp_ubio_1_2,
    //           FP_UBIO_2_1: itemEmpGroup.fp_ubio_2_1,
    //           FP_UBIO_2_2: itemEmpGroup.fp_ubio_2_2,
    //           FP_UBIO_3_1: itemEmpGroup.fp_ubio_3_1,
    //           FP_UBIO_3_2: itemEmpGroup.fp_ubio_3_2,
    //           AUTH_FINGER_YN: itemEmpGroup.auth_finger_yn,
    //           AUTH_CARD_YN: itemEmpGroup.auth_card_yn,
    //           AUTH_FACE_YN: itemEmpGroup.auth_face_yn,
    //           FACE_IP: itemEmpGroup.face_ip,
    //           URL_API: itemEmpGroup.url_api,
    //           IP: itemEmpGroup.ip,
    //           PORT: itemEmpGroup.port,
    //           PASSWORD: itemEmpGroup.password,
    //           MACHINE_KIND: itemEmpGroup.machine_kind,
    //           URL_API_SERVER: itemEmpGroup.url_api_server,
    //           URL_WS: itemEmpGroup.url_ws,
    //           UBIO_URL: itemEmpGroup.ubio_url,
    //           UBIO_TER_ID: itemEmpGroup.ubio_ter_id,
    //           CLIENT_PK: itemMachine.client_pk,
    //         });
    //       });
    //       onUserHasGroup(arrHasGroup);
    //     }
    //   });
    // }
  };

  const onUserHasGroup = (arrData) => {
    let arrUBIO = [];
    arrData.forEach(function (item) {
      if (item.MACHINE_KIND == "UBIO") {
        arrUBIO.push(item);
      }
    });

    if (arrUBIO.length > 0) {
      if (type == "RegisterMultiple") {
        onRegisterUserToUBIO(arrUBIO);
      } else if (type == "UpdateMultiple") {
        onUpdateUserFromUBIO(arrUBIO);
      }
    }
  };

  const onUserNoGroup = (arrData) => {
    let arrMita = [];
    let curIndex = 0;
    arrData.forEach(function (item) {
      if (item.MACHINE_KIND == "MITA") {
        arrMita.push(item);
      }
    });
    if (arrMita.length > 0) {
      if (type == "RegisterMultiple") {
        onRegisterUserToMita(arrMita);
      } else if (type == "UpdateMultiple") {
        onUpdateUserFromUBIO(arrUBIO, curIndex);
      }
    }
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${tokenLogin}`,
      "content-type": "application/json",
    },
  };

  const dialogNoti = (text) => {
    Alert.alert(
      "Thông báo",
      text,
      [
        {
          text: "Đóng",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const onRegisterUserToMita = async (arrData, curIndex) => {
    for (let i = 0; i < arrData.length; i++) {
      let rs = await OnRegisterUserMita(arrData[i]);
      console.log("end: ", i, " rs:", rs);
      if (rs) {
        // txt_result_mita.value = '0';
      } else {
      }
      // dso_pro_hrmt00400_1.Call();
      // $('#pg1').attr('value', i + 1);
    }
  };

  const OnRegisterUserMita = (param) => {
    return new Promise((resolve) => {
      var fingerprints = [];
      // console.log("param mita ", param);
      setTimeout(() => {
        resolve(true);
      }, 2000);
      console.log(param.FINGER_1);
      console.log(param.FINGER_1 != null);
      console.log(param.FINGER_1 != "");
      if (param.FINGER_1 != "") {
        fingerprints.push({
          fingerIndex: 0,
          flag: 1,
          fingerData: param.FINGER_1,
        });
      }
      if (param.FINGER_2 != "") {
        fingerprints.push({
          fingerIndex: 1,
          flag: 1,
          fingerData: param.FINGER_2,
        });
      }
      if (param.FINGER_3 != "") {
        fingerprints.push({
          fingerIndex: 2,
          flag: 1,
          fingerData: param.FINGER_3,
        });
      }

      let str_url = param.UBIO_URL + "/AddUserToTerminalMita";
      let cardNum = param.CARD_NUM == null ? "" : param.CARD_NUM;
      let obj = {
        userID: param.ID_NUM,
        name: param.FULL_FNAME,
        privilege: 0,
        cardNumber: param.AUTH_CARD_YN == "Y" ? cardNum : "",
        password: "",
        fingerprints,
        machine_ip: param.IP,
        port: param.PORT,
      };
      console.log("OBJ", str_url);
      console.log("OBJ", obj);
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${tokenLogin}`,
          "content-type": "application/json",
        },
      };
      axios
        .post(str_url, obj, {
          axiosConfig,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.Result == "S" && res.data.Data.Status == "S") {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .finally(() => {});
      // $.ajax({
      // 	type: "POST",
      // 	url: str_url,
      // 	data: JSON.stringify(obj),
      // 	contentType: "application/json; charset=utf-8",
      // 	dataType: "json",
      // 	success: function (rs) {
      // 		console.log(rs);
      // 		if (rs.Result == "S" && rs.Data.Status == "S") {
      // 			txt_error.value = '';
      // 			resolve(true);
      // 		} else {
      // 			txt_result_mita.value = '-1';
      // 			txt_error.value  = rs.Data.Message
      // 			resolve(false);
      // 		}
      // 	},
      // 	error: function (xhr, status, error) {
      // 		console.log(error);
      // 		txt_result_mita.value = '-1';
      // 		txt_error.value = '';
      // 		resolve(false);
      // 	}
      // });
    });
  };

  const onUpdateUserFromUBIO = async (arrData, curIndex) => {
    try {
      if (curIndex >= arrData.length) {
        dialogNoti(
          "Gửi tín hiệu cập nhật thành công " + arrData.length + " người từ MCC"
        );
        return;
      }

      const item = arrData[curIndex];

      const urlPost =
        item.UBIO_URL +
        "/GetUserDataFromTerminal" +
        "?ClientPK=" +
        item.CLIENT_PK;

      var _data = {
        TerminalID: parseInt(item.UBIO_TER_ID),
        UserID: parseInt(item.ID_NUM),
        CRT_BY_PK: thr_emp_pk,
        CRT_BY: crt_by,
      };
      const res = await axios.post(urlPost, _data, {
        ...axiosConfig,
      });
      if (res.data.Result == "S" && res.data.Data.Status == "S") {
        await onUpdateUserFromUBIO(arrData, curIndex + 1);
      } else {
        dialogNoti("Lỗi cập nhật từ MCC");
      }
    } catch (err) {
      console.log("err UBio ", err);
      dialogNoti("Lỗi cập nhật MCC");
    }
  };

  return (
    <Modal transparent={true} visible={isShow}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(00,00,00,.1)",
        }}
      >
        <HideArea onHide={() => onHide()} />
        <AMT.View
          duration={300}
          animation={"fadeInUp"}
          style={{
            marginHorizontal: 10,
            backgroundColor: backgroundColor,
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 2,
          }}
        >
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              flexDirection: "row",
              backgroundColor: "rgba(00,00,00,.03)",
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
            }}
          >
            <PopupTitle>{title}</PopupTitle>
            <TouchableOpacity onPress={() => onHide()}>
              <Icon size={20} color={Color.mainColor} name={"close"} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              paddingTop: 10,
              paddingLeft: 20,
              paddingRight: 20,
              borderTopColor: Color.borderColor,
              borderTopWidth: 1,
              borderBottomColor: Color.borderColor,
              borderBottomWidth: 1,
              maxHeight,
              minHeight,
            }}
          >
            <View>
              <View
                style={{
                  paddingTop: 10,
                  zIndex: 2,
                }}
              >
                <Text>Máy chấm công</Text>
              </View>
              <View
                style={{
                  padding: 10,
                  borderRadius: 10,
                  borderWidth: 3,
                  borderColor: Color.inputBackgroundColor,
                  flexDirection: "row",
                  maxHeight: Dimensions.get("screen").height / 1.6,
                  minHeight: Dimensions.get("screen").height / 1.6,
                  marginTop: 5,
                }}
              >
                {dataMachine.length > 0 ? (
                  <FlatList
                    refreshing={false}
                    data={dataMachine}
                    renderItem={({ item }) => {
                      return (
                        <View flexDirection={"row"} marginBottom={10}>
                          <Button
                            nextScreen={() => {
                              CheckMachine(item);
                            }}
                            row
                            paddingLeft={5}
                            alignCenter
                          >
                            <View
                              style={
                                item.sel_yn == "Y"
                                  ? styles.CheckBoxE
                                  : styles.CheckBoxD
                              }
                            >
                              {item.sel_yn == "Y" ? (
                                <Icon
                                  name={"check"}
                                  color={Color.mainColor}
                                  size={25}
                                />
                              ) : null}
                            </View>
                          </Button>
                          <View
                            style={{
                              paddingLeft: 10,
                              alignSelf: "center",
                              flex: 2,
                            }}
                          >
                            <Text>{item.machine_nm}</Text>
                          </View>
                          <View
                            style={{
                              paddingLeft: 10,
                              alignSelf: "center",
                              flex: 1,
                            }}
                          >
                            <Text style={{ color: item.status_color }}>
                              {item.status}
                            </Text>
                          </View>
                        </View>
                      );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                  />
                ) : null}
              </View>
            </View>
          </View>

          <View
            style={{
              paddingVertical: 10,
              flexDirection: "row",
              backgroundColor: "rgba(00,00,00,.03)",
              justifyContent: "center",
            }}
          >
            <TVSButton
              icon={"check"}
              type={"primary"}
              buttonStyle={"3"}
              onPress={() => {
                onConfirmSelectMachine();
              }}
            >
              Xác nhận
            </TVSButton>
            <TVSButton
              type={"danger"}
              buttonStyle={"3"}
              icon={"close"}
              onPress={() => onHide()}
            >
              Đóng lại
            </TVSButton>
          </View>
        </AMT.View>
        <HideArea onHide={() => onHide()} />
      </View>
    </Modal>
  );
};
const PopupTitle = ({ children }) => {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          fontWeight: "bold",
          textTransform: "uppercase",
          color: Color.mainColor,
        }}
      >
        {children}
      </Text>
    </View>
  );
};
const HideArea = ({ onHide }) => {
  return <TouchableOpacity style={{ flex: 1 }} onPress={onHide} />;
};

export default TVSControlPopupMachine;

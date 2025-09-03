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
    const pro = "SELHRTI006004";
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

    if (type == "UpdateMultiple" && arrData.length > 1) {
      dialogNoti("Chỉ được chọn 1 máy khi cập nhật dữ liệu");
      return;
    }

    let noti =
      type == "Register"
        ? "đăng ký xuống"
        : type == "RegisterMultiple"
        ? "đăng ký xuống"
        : "cập nhật từ";
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
            if (type == "Register" || type == "Update") {
              onSelectMachine(arrData);
            } else if (type == "RegisterMultiple" || type == "UpdateMultiple") {
              onSelectMachineMultiple(arrData);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  const onSelectMachine = (arrData) => {
    console.log("type", type);
    if (arrData.length > 0) {
      let newArr = [...dataMachine];
      newArr.forEach(function (item) {
        if (item.sel_yn == "Y") {
          item.status = "Đang xử lý";
          item.status_color = "#FFA500";
        } else {
          item.status = "";
          item.status_color = "";
        }
      });
      setDataMachine(newArr);
      // setDataMachine(arrData);

      if (type == "Register") {
        insertDB(arrData, "EventAddUser");
        // onConfirmRegister(arrData);

        // setTimeout(() => {
        //   getStatusDB(arrData, "EventAddUser");
        // }, 2000);
      } else if (type == "Update") {
        insertDB(arrData, "EventGetUserData");

        onConfirmUpdate(arrData);

        setTimeout(() => {
          getStatusDB(arrData, "EventGetUserData");
          getInfo();
        }, 1000);
      }
    }
  };

  const onConfirmRegister = (arrMachineRegister, index) => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${tokenLogin}`,
        "content-type": "application/json",
      },
    };

    if (arrMachineRegister.length > 0) {
      // arrMachineRegister.map(function (item) {
      if (arrMachineRegister[index].machine_kind == "UBIO") {
        const check_finger_1 =
          empInfo.fp_ubio_1_1 &&
          empInfo.fp_ubio_1_1.length > 0 &&
          empInfo.fp_ubio_1_2 &&
          empInfo.fp_ubio_1_2.length > 0;
        const check_finger_2 =
          empInfo.fp_ubio_2_1 &&
          empInfo.fp_ubio_2_1.length > 0 &&
          empInfo.fp_ubio_2_2 &&
          empInfo.fp_ubio_2_2.length > 0;
        const check_finger_3 =
          empInfo.fp_ubio_3_1 &&
          empInfo.fp_ubio_3_1.length > 0 &&
          empInfo.fp_ubio_3_2 &&
          empInfo.fp_ubio_3_2.length > 0;
        const check_exists_finger =
          check_finger_1 || check_finger_2 || check_finger_3;
        const check_exists_image = empInfo.image && empInfo.image.length > 0;
        const check_exists_cardNo =
          empInfo.card_num && empInfo.card_num.length > 0;
        const arr_finger = [];

        if (check_finger_1) {
          arr_finger.push({
            idx: 1,
            biFPData1: empInfo.fp_ubio_1_1,
            biFPData2: empInfo.fp_ubio_1_2,
            flag_exists: check_finger_1,
          });
        }
        if (check_finger_2) {
          arr_finger.push({
            idx: 2,
            biFPData1: empInfo.fp_ubio_2_1,
            biFPData2: empInfo.fp_ubio_2_2,
            flag_exists: check_finger_2,
          });
        }
        if (check_finger_3) {
          arr_finger.push({
            idx: 3,
            biFPData1: empInfo.fp_ubio_3_1,
            biFPData2: empInfo.fp_ubio_3_2,
            flag_exists: check_finger_3,
          });
        }
        // item
        const urlPost =
          arrMachineRegister[index].ubio_url +
          "/AddUserToTerminal" +
          "?ClientPK=" +
          arrMachineRegister[index].client_pk;
        console.log("urlPost ", arrMachineRegister[index]);
        const obj = {
          terminalId: arrMachineRegister[index].ubio_ter_id,
          basicInfo: {
            userID: parseInt(empInfo.id_num),
            uniqueID: parseInt(empInfo.id_num),
            name: empInfo.full_fname,
          },
          properties: {
            isAdmin: false,
            isIdentify: true,
            isAndOperation: false,
            isCard:
              arrMachineRegister[index].auth_card_yn == "Y"
                ? check_exists_cardNo
                : false,
            IsIris: false,
            IrisData: "",
            isPassword: false,
            isFPCard: false,
            isFingerprint:
              arrMachineRegister[index].auth_finger_yn == "Y"
                ? check_exists_finger
                : false,
            isFace:
              arrMachineRegister[index].auth_face_yn == "Y"
                ? check_exists_image
                : false,
            FaceDatas: [],
          },
          accessAuthority: null,
          rfid: {
            rfid: check_exists_cardNo ? empInfo.card_num : "",
          },
          PictureData: check_exists_image ? empInfo.image : "",
          password: null,
          fingerPrint: arr_finger,
          walkthrough: {
            type: 12,
            data: check_exists_image ? empInfo.image : "",
          },
          accessflag: {
            isBlacklist: false,
            isFace1toN: true,
            isIris1toN: true,
            isExceptPassback: false,
          },
          AuthType: 5,
          CRT_BY_PK: thr_emp_pk,
          CRT_BY: crt_by,
        };

        // console.log(urlPost, obj);
        axios
          .post(urlPost, obj, {
            axiosConfig,
          })
          .then((res) => {
            if (res.data.Result == "S" && res.data.Data.Status == "S") {
            }
          })
          .finally(() => {
            setTimeout(() => {
              getStatusDB([arrMachineRegister[index]], "EventAddUser", index);
            }, 2000);
            if (index < arrMachineRegister.length - 1) {
              setTimeout(() => {
                onConfirmRegister(arrMachineRegister, index + 1);
              }, 2000);
            }
          });
      }
      // });
    }
  };

  const insertDB = (arrMachineRegister, eventType) => {
    let date = new Date().getTime();
    arrMachineRegister.map(function (item) {
      if (item.sel_yn == "Y") {
        if (item.machine_kind == "UBIO") {
          const pro = "UPDHRTI006001";
          const in_par = {
            p1_varchar2: thr_emp_pk,
            p2_varchar2: empInfo.pk,
            p3_varchar2: item.ubio_ter_id,
            p4_varchar2: date,
            p5_varchar2: eventType,
            p6_varchar2: APP_VERSION,
            p7_varchar2: crt_by,
          };
          console.log(pro, in_par);
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
            console.log("rs UPDHRTI006001", rs);
            if (rs != "Token Expired") {
              onConfirmRegister(arrMachineRegister, 0);
            }
          });
        }
      }
    });
  };

  const insertDBMultiple = (itemMachineRegister, itemUser, eventType, date) => {
    if (itemMachineRegister.sel_yn == "Y") {
      if (itemMachineRegister.machine_kind == "UBIO") {
        const pro = "UPDHRTI006001";
        const in_par = {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: itemUser.pk,
          p3_varchar2: itemMachineRegister.ubio_ter_id,
          p4_varchar2: date,
          p5_varchar2: eventType,
          p6_varchar2: APP_VERSION,
          p7_varchar2: crt_by,
        };
        console.log(pro, in_par);
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
          console.log("rs UPDHRTI006001", rs);
          if (rs != "Token Expired") {
            setTimeout(() => {
              getStatusDBMultiple(itemMachineRegister, itemUser, eventType, 0);
            }, 2000);
          }
        });
      }
    }
  };

  const getStatusDB = (arrMachineRegister, eventType, index) => {
    if (arrMachineRegister.length > 0) {
      arrMachineRegister.map(function (item) {
        if (item.sel_yn == "Y") {
          if (item.machine_kind == "UBIO") {
            const pro = "SELHRTI006003";
            const in_par = {
              p1_varchar2: empInfo.id_num,
              p2_varchar2: item.ubio_ter_id,
              p3_varchar2: eventType,
              p4_varchar2: APP_VERSION,
              p5_varchar2: crt_by,
            };
            console.log(pro, in_par);
            sysFetch(
              API,
              {
                pro,
                in_par,
                out_par: {
                  p1_number: "result",
                  p2_number: "terminalId",
                },
              },
              tokenLogin
            ).then((rs) => {
              console.log("rs SELHRTI006003", rs);
              if (rs != "Token Expired") {
                if (rs.results == "S") {
                  let data = [...dataMachine];
                  data.map(function (itemData) {
                    if (
                      itemData.sel_yn == "Y" &&
                      itemData.ubio_ter_id == rs.data.terminalId
                    ) {
                      if (rs.data.result == "0") {
                        itemData.status = "Hoàn thành";
                        itemData.status_color = "#00b050";
                      } else {
                        itemData.status = "Thất bại";
                        itemData.status_color = "#ff0000";
                      }
                    }
                  });
                  setDataMachine(data);
                }
              }
            });
          }
        }
      });
    }
  };

  const getStatusDBMultiple = (
    itemMachineRegister,
    itemUser,
    eventType,
    index
  ) => {
    if (itemMachineRegister.machine_kind == "UBIO") {
      const pro = "SELHRTI006003";
      const in_par = {
        p1_varchar2: itemUser.id_num,
        p2_varchar2: itemMachineRegister.ubio_ter_id,
        p3_varchar2: eventType,
        p4_varchar2: APP_VERSION,
        p5_varchar2: crt_by,
      };
      console.log(pro, in_par);
      sysFetch(
        API,
        {
          pro,
          in_par,
          out_par: {
            p1_number: "result",
            p2_number: "terminalId",
          },
        },
        tokenLogin
      ).then((rs) => {
        console.log("rs SELHRTI006003", rs);
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            let data = [...dsNhanVien];
            data.map(function (itemData) {
              if (itemData.id_num == itemUser.id_num) {
                if (rs.data.result == "0") {
                  itemData.status = "Hoàn thành";
                  itemData.status_color = "#00b050";
                } else {
                  if (index < 3) {
                    setTimeout(() => {
                      getStatusDBMultiple(
                        itemMachineRegister,
                        itemUser,
                        eventType,
                        index + 1
                      );
                    }, 2000);
                  } else {
                    itemData.status = "Thất bại";
                    itemData.status_color = "#ff0000";
                  }
                }
              }
            });
            setDsNhanVien(data);
          }
        }
      });
    }
  };

  const onConfirmUpdate = (arrMachineRegister) => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${tokenLogin}`,
        "content-type": "application/json",
      },
    };

    if (arrMachineRegister.length > 0) {
      arrMachineRegister.map(function (item) {
        if (item.machine_kind == "UBIO") {
          const urlPost =
            item.ubio_url +
            "/GetUserDataFromTerminal" +
            "?ClientPK=" +
            item.client_pk;

          var _data = {
            TerminalID: parseInt(item.ubio_ter_id),
            UserID: parseInt(empInfo.id_num),
            CRT_BY_PK: thr_emp_pk,
            CRT_BY: crt_by,
          };

          console.log(urlPost, _data);
          axios
            .post(urlPost, _data, {
              axiosConfig,
            })
            .then((res) => {
              if (res.data.Result == "S" && res.data.Data.Status == "S") {
              }
            })
            .finally(() => {});
        }
      });
    }
  };

  const getInfo = () => {
    const pro = "SELHRTI006007";
    const in_par = {
      p1_varchar2: empInfo.pk,
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
          p1_sys: "result",
        },
      },
      tokenLogin
    ).then((rs) => {
      console.log("rs SELHRTI006006", rs);
      if (rs != "Token Expired") {
        if (rs.results == "S") {
          console.log(rs.data.result);

          // empInfo.image = rs.data.result[0].data_image;
          // empInfo.card_num = rs.data.result[0].card_no;
          // empInfo.fp_ubio_1_1 = rs.data.result[0].finger_1_0;
          // empInfo.fp_ubio_1_2 = rs.data.result[0].finger_1_1;
          // empInfo.fp_ubio_2_1 = rs.data.result[0].finger_2_0;
          // empInfo.fp_ubio_2_2 = rs.data.result[0].finger_2_1;
          // empInfo.fp_ubio_3_1 = rs.data.result[0].finger_3_0;
          // empInfo.fp_ubio_3_2 = rs.data.result[0].finger_3_1;
          // const updatedEmpInfo = { ...empInfo };

          // Call the setDataOneItem function to update the state
          setDataOneItem(rs.data.result[0]);
        }
      }
    });
  };

  const getInfoMultiple = (arrEmp) => {
    const pro = "SELHRTI006007";
    const in_par = {
      p1_varchar2: arrEmp.pk,
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
          p1_sys: "result",
        },
      },
      tokenLogin
    ).then((rs) => {
      console.log("rs SELHRTI006006", rs);
      if (rs != "Token Expired") {
        if (rs.results == "S") {
          let arr = dsNhanVien.map(function (itemData) {
            if (itemData.pk == arrEmp.pk) {
              itemData.image = rs.data.result[0].image;
              itemData.card_num = rs.data.result[0].card_num;
              itemData.fp_ubio_1_1 = rs.data.result[0].fp_ubio_1_1;
              itemData.fp_ubio_1_2 = rs.data.result[0].fp_ubio_1_2;
              itemData.fp_ubio_2_1 = rs.data.result[0].fp_ubio_2_1;
              itemData.fp_ubio_2_2 = rs.data.result[0].fp_ubio_2_2;
              itemData.fp_ubio_3_1 = rs.data.result[0].fp_ubio_3_1;
              itemData.fp_ubio_3_2 = rs.data.result[0].fp_ubio_3_2;
            }
            return itemData;
          });
          setDsNhanVien(arr);
        }
      }
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
          if (type == "RegisterMultiple") {
            insertDBMultiple(itemMachine, itemUser, "EventAddUser", date);

            // setTimeout(() => {
            //   getStatusDBMultiple(itemMachine, itemUser, "EventAddUser");
            // }, 1000);
          } else if (type == "UpdateMultiple") {
            insertDBMultiple(itemMachine, itemUser, "EventGetUserData", date);

            setTimeout(() => {
              getStatusDBMultiple(itemMachine, itemUser, "EventGetUserData", 0);
              getInfoMultiple(itemUser);
            }, 1000);
          }
        });
      }
    });

    dsNhanVien.forEach(function (itemUser) {
      if (itemUser.sel_yn == "Y") {
        if (itemUser.count_group == 0) {
          dataMachine.forEach(function (itemMachine) {
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
              FP_UBIO_1_1: itemUser.fp_ubio_1_1,
              FP_UBIO_1_2: itemUser.fp_ubio_1_2,
              FP_UBIO_2_1: itemUser.fp_ubio_2_1,
              FP_UBIO_2_2: itemUser.fp_ubio_2_2,
              FP_UBIO_3_1: itemUser.fp_ubio_3_1,
              FP_UBIO_3_2: itemUser.fp_ubio_3_2,
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
    if (lst_emp_pk.length > 0) {
      arrLstEmpPK.push({
        list_emp_pk: lst_emp_pk.substring(0, lst_emp_pk.length - 1),
        list_machine_pk: lst_machine_pk,
      });
    }
    if (arrLstEmpPK.length > 0) {
      const pro = "SELHRTI006005";
      const in_par = {
        p1_varchar2: arrLstEmpPK[0].list_emp_pk,
        p2_varchar2: arrLstEmpPK[0].list_machine_pk,
        p3_varchar2: APP_VERSION,
        p4_varchar2: crt_by,
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
        console.log("RS SELHRTI006005", rs);
        if (rs.data.data.length > 0) {
          rs.data.data.forEach(function (itemEmpGroup) {
            arrHasGroup.push({
              EMP_ID: itemEmpGroup.emp_id,
              ID_NUM: itemEmpGroup.id_num,
              BORNTIME: itemEmpGroup.borntime,
              IMAGE_FACE: itemEmpGroup.image_face,
              GENDER: itemEmpGroup.gender,
              HAS_PHOTO: itemEmpGroup.has_photo,
              FULL_NAME: itemEmpGroup.full_name,
              FULL_FNAME: itemEmpGroup.full_fname,
              CARD_NUM: itemEmpGroup.card_num,
              FP_UBIO_1_1: itemEmpGroup.fp_ubio_1_1,
              FP_UBIO_1_2: itemEmpGroup.fp_ubio_1_2,
              FP_UBIO_2_1: itemEmpGroup.fp_ubio_2_1,
              FP_UBIO_2_2: itemEmpGroup.fp_ubio_2_2,
              FP_UBIO_3_1: itemEmpGroup.fp_ubio_3_1,
              FP_UBIO_3_2: itemEmpGroup.fp_ubio_3_2,
              AUTH_FINGER_YN: itemEmpGroup.auth_finger_yn,
              AUTH_CARD_YN: itemEmpGroup.auth_card_yn,
              AUTH_FACE_YN: itemEmpGroup.auth_face_yn,
              FACE_IP: itemEmpGroup.face_ip,
              URL_API: itemEmpGroup.url_api,
              IP: itemEmpGroup.ip,
              PORT: itemEmpGroup.port,
              PASSWORD: itemEmpGroup.password,
              MACHINE_KIND: itemEmpGroup.machine_kind,
              URL_API_SERVER: itemEmpGroup.url_api_server,
              URL_WS: itemEmpGroup.url_ws,
              UBIO_URL: itemEmpGroup.ubio_url,
              UBIO_TER_ID: itemEmpGroup.ubio_ter_id,
              CLIENT_PK: itemMachine.client_pk,
            });
          });
          onUserHasGroup(arrHasGroup);
        }
      });
    }
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
    let arrUBIO = [];
    let curIndex = 0;
    arrData.forEach(function (item) {
      if (item.MACHINE_KIND == "UBIO") {
        arrUBIO.push(item);
      }
    });
    if (arrUBIO.length > 0) {
      if (type == "RegisterMultiple") {
        onRegisterUserToUBIO(arrUBIO, curIndex);
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

  const onRegisterUserToUBIO = async (arrData, curIndex) => {
    try {
      if (curIndex >= arrData.length) {
        dialogNoti(
          "Gửi tín hiệu đăng ký thành công " +
            arrData.length +
            " người xuống MCC"
        );
        return;
      }

      const item = arrData[curIndex];
      const check_finger_1 =
        item.FP_UBIO_1_1 &&
        item.FP_UBIO_1_1.length > 0 &&
        item.FP_UBIO_1_2 &&
        item.FP_UBIO_1_2.length > 0;
      const check_finger_2 =
        item.FP_UBIO_2_1 &&
        item.FP_UBIO_2_1.length > 0 &&
        item.FP_UBIO_2_2 &&
        item.FP_UBIO_2_2.length > 0;
      const check_finger_3 =
        item.FP_UBIO_3_1 &&
        item.FP_UBIO_3_1.length > 0 &&
        item.FP_UBIO_3_2 &&
        item.FP_UBIO_3_2.length > 0;
      const check_exists_finger =
        check_finger_1 || check_finger_2 || check_finger_3;
      const check_exists_image = item.IMAGE_FACE && item.IMAGE_FACE.length > 0;
      const check_exists_cardNo = item.CARD_NUM && item.CARD_NUM.length > 0;
      const arr_finger = [];

      if (check_finger_1) {
        arr_finger.push({
          idx: 1,
          biFPData1: item.FP_UBIO_1_1,
          biFPData2: item.FP_UBIO_1_2,
          flag_exists: check_finger_1,
        });
      }
      if (check_finger_2) {
        arr_finger.push({
          idx: 2,
          biFPData1: item.FP_UBIO_2_1,
          biFPData2: item.FP_UBIO_2_2,
          flag_exists: check_finger_2,
        });
      }
      if (check_finger_3) {
        arr_finger.push({
          idx: 3,
          biFPData1: item.FP_UBIO_3_1,
          biFPData2: item.FP_UBIO_3_2,
          flag_exists: check_finger_3,
        });
      }

      const urlPost =
        item.UBIO_URL + "/AddUserToTerminal" + "?ClientPK=" + item.CLIENT_PK;
      const obj = {
        terminalId: item.UBIO_TER_ID,
        basicInfo: {
          userID: parseInt(item.ID_NUM),
          uniqueID: parseInt(item.ID_NUM),
          name: item.FULL_FNAME,
        },
        properties: {
          isAdmin: false,
          isIdentify: true,
          isAndOperation: false,
          isCard: item.AUTH_CARD_YN == "Y" ? check_exists_cardNo : false,
          IsIris: false,
          IrisData: "",
          isPassword: false,
          isFPCard: false,
          isFingerprint:
            item.AUTH_FINGER_YN == "Y" ? check_exists_finger : false,
          isFace: item.AUTH_FACE_YN == "Y" ? check_exists_image : false,
          FaceDatas: [],
        },
        accessAuthority: null,
        rfid: {
          rfid: check_exists_cardNo ? item.CARD_NUM : "",
        },
        PictureData: check_exists_image ? item.IMAGE_FACE : "",
        password: null,
        fingerPrint: arr_finger,
        walkthrough: {
          type: 12,
          data: check_exists_image ? item.IMAGE_FACE : "",
        },
        accessflag: {
          isBlacklist: false,
          isFace1toN: true,
          isIris1toN: true,
          isExceptPassback: false,
        },
        AuthType: 5,
        CRT_BY_PK: thr_emp_pk,
        CRT_BY: crt_by,
      };

      const res = await axios.post(urlPost, obj, {
        headers: {
          "content-type": "application/json",
        },
        ...axiosConfig,
      });

      if (res.data.Result == "S" && res.data.Data.Status == "S") {
        await onRegisterUserToUBIO(arrData, curIndex + 1);
      } else {
        dataMachine.map((item) => {
          console.log(item.ubio_ter_id, res.config.data.terminalId);
          if (item.ubio_ter_id == res.data.Data.Data.terminalId) {
            dialogNoti("Lỗi đăng ký: " + item.machine_nm);
            return;
          }
        });
      }
    } catch (err) {
      console.log("err UBio ", err);
      dialogNoti("Lỗi đăng ký xuống MCC");
    }
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

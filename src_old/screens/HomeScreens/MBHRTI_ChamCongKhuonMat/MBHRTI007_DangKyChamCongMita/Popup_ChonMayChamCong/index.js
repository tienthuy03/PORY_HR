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
  ActivityIndicator,
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
import sysFetch2 from "../../../../../services/fetch_v1/fetch2";
import { updateUserAction } from "../../../../../actions";
import Button from "../../../../../components/Button";
import RNRestart from "react-native-restart";
import { APP_VERSION } from "../../../../../config/Pro";
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
  let [urlService, setUrlService] = useState([]);

  useEffect(() => {
    onLoadData();
  }, []);

  useEffect(() => {
    setLoading(false);
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
  const [loading, setLoading] = useState(false);
  const onLoadData = () => {
    const pro = "SELHRTI007004";
    const in_par = {
      p1_varchar2: userPk,
      p2_varchar2: APP_VERSION,
      p3_varchar2: crt_by,
    };
    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_sys: "data",
          p2_sys: "data_url",
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
        setUrlService(rs.data.data_url);
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
  const CallCheckConnect = (machine) => {
    console.log("machine ", machine);
    return new Promise((resolve) => {
      let url = machine.ubio_url + "/ConnectToTerminalMita";
      let obj = {
        machine_ip: machine.ip,
        port: machine.port,
      };
      console.log(url, obj);
      try {
        axios.post(url, obj).then((res) => {
          console.log(res.data.Data.Status);
          if (res.data.Data.Status == "F") {
            //resolve(0);
            try {
              axios.post(url, obj).then((res2) => {
                console.log(res2.data.Data.Status);
                if (res2.data.Data.Status == "F") {
                  resolve(0);
                } else if (res2.data.Data.Status == "S") {
                  resolve(1);
                }
              });
            } catch (error) {
              console.log("error catch");
              console.log(error);
              resolve(2);
            }
          } else if (res.data.Data.Status == "S") {
            resolve(1);
          }
        });
      } catch (error) {
        console.log("error catch");
        console.log(error);
        resolve(2);
      }
    });
  };
  const onConfirmSelectMachine = () => {
    let arrData = [];
    let newArr = [...dataMachine];
    newArr.forEach(function (item) {
      item.status_color = "";
      item.status = "";
    });
    setDataMachine(newArr);
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
    let noti =
      type == "Register"
        ? "đăng ký xuống"
        : type == "Update"
        ? "cập nhật từ"
        : type == "UpdateMultiple"
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
    let lst_machine_pk = "";
    let lst_machine_sc = "";
    let lst_emp_pk = "";
    let objUrl = [];
    let flag = false;
    if (arrData.length > 0) {
      setLoading(true);
      if (type == "Register") {
        let arrMachine = [];
        let arrMachineErr = [];
        let strErrMachine = "";
        for (var i = 0; i < arrData.length; i++) {
          let rs = await CallCheckConnect(arrData[i]);
          console.log("rs ", rs);
          if (rs == 1) {
            arrMachine.push(arrData[i]);
          } else {
            arrMachineErr.push(arrData[i]);
          }
        }
        if (arrMachineErr.length > 0) {
          let newArr = [...dataMachine];
          arrMachineErr.forEach(function (item) {
            strErrMachine += item.machine_nm + " ";
            newArr.forEach(function (dataItem) {
              if (dataItem.pk == item.pk) {
                dataItem.status_color = "#ff0000";
                dataItem.status = "mất kết nối";
              }
            });
          });
          strErrMachine += "mất kết nối vui lòng kiểm tra lại";
          setDataMachine(newArr);
        }
        if (strErrMachine != "") console.log(strErrMachine);
        if (arrMachine.length == 0) {
          setLoading(false);
          return;
        }
        for (let i = 0; i < arrMachine.length; i++) {
          console.log("arrMachine[i] ", arrMachine[i]);
          flag = false;
          lst_machine_pk += arrMachine[i].pk + ",";
          if (objUrl.length == 0) {
            objUrl.push({
              pk: arrMachine[i].pk,
              url: arrMachine[i].ubio_url,
            });
          } else {
            objUrl.forEach(function (item) {
              if (item.url == arrMachine[i].ubio_url) {
                flag = true;
              }
            });

            if (!flag) {
              objUrl.push({
                pk: arrMachine[i].pk,
                url: arrMachine[i].ubio_url,
              });
            }
          }
        }
        objUrl.forEach(function (item) {
          lst_machine_sc = lst_machine_sc + item.url + ",";
        });
        lst_machine_pk = lst_machine_pk.substring(0, lst_machine_pk.length - 1);
        lst_machine_sc = lst_machine_sc.substring(0, lst_machine_sc.length - 1);
        console.log(lst_machine_pk, lst_machine_sc);
        RegisterMita(lst_machine_pk, lst_machine_sc);
      } else if (type == "Update") {
        if (arrData.length > 1) {
          dialogNoti("Vui lòng chọn 1 máy chấm công");
          return;
        }
        let arrEmp = [];
        arrEmp.push(empInfo.id_num);
        let rs = await UploadMita(arrData[0], arrEmp);
        console.log("rsMita ", rs);
        Alert.alert(
          "Thông báo",
          "Hoàn thành. Vui lòng làm mới lại dữ liệu",
          [
            {
              text: "Đóng",
              onPress: () => {},
            },
          ],
          { cancelable: true }
        );
        setLoading(false);
      } else if (type == "RegisterMultiple") {
        let arrMachine = [];
        let arrMachineErr = [];
        let strErrMachine = "";
        for (var i = 0; i < arrData.length; i++) {
          let rs = await CallCheckConnect(arrData[i]);
          console.log("rs ", rs);
          if (rs == 1) {
            arrMachine.push(arrData[i]);
          } else {
            arrMachineErr.push(arrData[i]);
          }
        }
        if (arrMachineErr.length > 0) {
          let newArr = [...dataMachine];
          arrMachineErr.forEach(function (item) {
            strErrMachine += item.machine_nm + " ";
            newArr.forEach(function (dataItem) {
              if (dataItem.pk == item.pk) {
                dataItem.status_color = "#ff0000";
                dataItem.status = "mất kết nối";
              }
            });
          });
          strErrMachine += "mất kết nối vui lòng kiểm tra lại";
          setDataMachine(newArr);
        }
        if (strErrMachine != "") console.log(strErrMachine);
        if (arrMachine.length == 0) {
          setLoading(false);
          return;
        }
        for (let i = 0; i < arrMachine.length; i++) {
          flag = false;
          lst_machine_pk += arrMachine[i].pk + ",";
          if (objUrl.length == 0) {
            objUrl.push({
              pk: arrMachine[i].pk,
              url: arrMachine[i].ubio_url,
            });
          } else {
            objUrl.forEach(function (item) {
              if (item.url == arrMachine[i].ubio_url) {
                flag = true;
              }
            });

            if (!flag) {
              objUrl.push({
                pk: arrMachine[i].pk,
                url: arrMachine[i].ubio_url,
              });
            }
          }
        }
        objUrl.forEach(function (item) {
          lst_machine_sc = lst_machine_sc + item.url + ",";
        });
        lst_machine_pk = lst_machine_pk.substring(0, lst_machine_pk.length - 1);
        lst_machine_sc = lst_machine_sc.substring(0, lst_machine_sc.length - 1);
        dsNhanVien.forEach(function (itemUser) {
          if (itemUser.sel_yn == "Y") {
            lst_emp_pk += itemUser.pk + ",";
          }
        });
        lst_emp_pk = lst_emp_pk.substring(0, lst_emp_pk.length - 1);
        onSelectMachineMultiple(lst_emp_pk, lst_machine_pk, lst_machine_sc);
      } else if (type == "UpdateMultiple") {
        if (arrData.length > 1) {
          dialogNoti("Vui lòng chọn 1 máy chấm công");
          return;
        }
        let arrEmp = [];
        dsNhanVien.forEach(function (itemUser) {
          if (itemUser.sel_yn == "Y") {
            arrEmp.push(itemUser.id_num);
          }
        });
        let rs = await UploadMita(arrData[0], arrEmp);
        console.log("rsMita ", rs);
        Alert.alert(
          "Thông báo",
          "Hoàn thành",
          [
            {
              text: "Đóng",
              onPress: () => {},
            },
          ],
          { cancelable: true }
        );
        setLoading(false);
      }
    }
  };
  const UploadMita = (arrMachineUpload, arrEmp) => {
    return new Promise((resolve) => {
      var str_url = arrMachineUpload.ubio_url + "/GetUserFromTerminalMita";

      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${tokenLogin}`,
          "content-type": "application/json",
        },
      };
      var obj = {
        lstUserID: arrEmp,
        machine_ip: arrMachineUpload.ip,
        port: arrMachineUpload.port,
        crt_by: crt_by,
      };

      axios
        .post(str_url, obj, {
          axiosConfig,
        })
        .then((res) => {
          console.log(res.data.Result == "S");
          if (res.data.Result == "S") {
            const pro = "UPDHRTI007001";
            const in_par = {
              p1_varchar2: arrMachineUpload.pk,
              p2_varchar2: APP_VERSION,
              p3_varchar2: crt_by,
            };
            console.log(in_par);
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
              if (rs.results == "S") {
                resolve(true);
              }
            });
          }
        });
    });
  };
  const RegisterMita = (lstMachinePK, lstSc) => {
    var currentTime = new Date();
    let seq_dt = currentTime.getTime();
    let event_type = "EventAddUser";
    const pro = "UPDHRTI007000";
    const in_par = {
      p1_clob: empInfo.pk,
      p2_varchar2: lstMachinePK,
      p3_varchar2: lstMachinePK.split(",").length,
      p4_varchar2: event_type,
      p5_varchar2: seq_dt,
      p6_varchar2: APP_VERSION,
      p7_varchar2: crt_by,
    };
    sysFetch2(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_sys: "result",
        },
      },
      tokenLogin
    ).then(async (rs) => {
      if (rs.result === "S") {
        if (urlService.length > 0) {
          let str_url = "";
          let obj = {
            crt_by: crt_by,
            seq: seq_dt,
            event_type: event_type,
          };
          for (var i = 0; i < lstSc.split(",").length; i++) {
            str_url = lstSc.split(",")[i] + "/AddUserToTerminalMita";
            var rs = await OnPromisCallScMita(str_url, obj);
          }
          setLoading(false);
          Alert.alert(
            "Thông báo",
            "Hoàn thành",
            [
              {
                text: "Đóng",
                onPress: () => {},
              },
            ],
            { cancelable: true }
          );
        }
      } else {
        console.log("error");
      }
      console.log(rs);
    });
  };
  const OnPromisCallScMita = (str_url, obj) => {
    return new Promise((resolve) => {
      axios.post(str_url, obj).then((res) => {
        console.log(res.data);
        resolve(true);
      });
    });
  };
  const onSelectMachineMultiple = (lstEmp, lstMachinePK, lstSc) => {
    var currentTime = new Date();
    let seq_dt = currentTime.getTime();
    let event_type = "EventAddUser";
    const pro = "UPDHRTI007000";
    const in_par = {
      p1_clob: lstEmp,
      p2_varchar2: lstMachinePK,
      p3_varchar2: lstMachinePK.split(",").length,
      p4_varchar2: event_type,
      p5_varchar2: seq_dt,
      p6_varchar2: APP_VERSION,
      p7_varchar2: crt_by,
    };
    sysFetch2(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_sys: "result",
        },
      },
      tokenLogin
    ).then(async (rs) => {
      if (rs.result === "S") {
        let str_url = "";
        let obj = {
          crt_by: crt_by,
          seq: seq_dt,
          event_type: event_type,
        };
        for (var i = 0; i < lstSc.split(",").length; i++) {
          str_url = lstSc.split(",")[i] + "/AddUserToTerminalMita";
          var rs = await OnPromisCallScMita(str_url, obj);
        }
        setLoading(false);
        Alert.alert(
          "Thông báo",
          "Hoàn thành",
          [
            {
              text: "Đóng",
              onPress: () => {},
            },
          ],
          { cancelable: true }
        );
      } else {
        console.log("error");
      }
    });
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
                  maxHeight: Dimensions.get("screen").height / 2,
                  minHeight: Dimensions.get("screen").height / 2,
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
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {loading ? (
                  <View>
                    <ActivityIndicator color="black" style={{ margin: 15 }} />
                    <Text>Đang xử lý...</Text>
                  </View>
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

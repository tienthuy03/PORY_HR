/************************************************ START: IMPORT ************************************************/
import moment from "moment";
import {
  Alert,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../../components/Block";
import axios from "axios";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../../services/fetch_v1";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import TVSButton from "../../../../../components/Tvs/Button";
import { APP_VERSION } from "../../../../../config/Pro";
import Text from "../../../../../components/Text";
import { updateUserAction } from "../../../../../actions";
import TVSList from "../../../../../components/Tvs/TVSList";
import ModalChonNhanVien from "../ModalChonNhanVien";
import Load from "../../../../../components/Loading";
import TVSDate from "../../../../../components/Tvs/TVSDate";

/************************************************ END: IMPORT ************************************************/

export default function DangKy({}) {
  const dispatch = useDispatch();
  //************************************************ START: VARIABLE ************************************************
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  let tokenLogin = useSelector(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  let userPk = useSelector(
    (state) => state.loginReducers.data.data.tes_user_pk
  );
  let refreshToken = useSelector(
    (state) => state.loginReducers.data.data.refreshToken
  );
  let thr_emp_pk = useSelector(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );
  let full_name = useSelector(
    (state) => state.loginReducers.data.data.full_name
  );
  let crt_by = useSelector((state) => state.loginReducers.data.data.crt_by);
  //******************************************************************** END: VARIABLE ********************************************************************

  const styles = StyleSheet.create({
    fieldsetTitle: {
      position: "absolute",
      top: -12,
      backgroundColor: "white",
      left: 10,
    },
    CheckBoxCircleY: {
      width: 20,
      height: 20,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: "#5A94E7",
      backgroundColor: Color.primaryButton2,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 5,
    },
    CheckBoxCircleN: {
      width: 20,
      height: 20,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: Color.mainColor,
      marginRight: 5,
    },
    CheckBoxSquareY: {
      width: 25,
      height: 25,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.primaryButton2,
      backgroundColor: Color.primaryButton2,
      justifyContent: "center",
      alignItems: "center",
    },
    CheckBoxSquareN: {
      width: 25,
      height: 25,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.mainColor,
    },

    // style form
    container: {
      paddingTop: 10,
      marginRight: 10,
      marginLeft: 10,
      backgroundColor: Color.white,
    },
    titleContainerTime: {
      paddingHorizontal: 5,
      marginBottom: 10,
      flexDirection: "row",
    },
    titleContainer: {
      paddingHorizontal: 5,
      marginBottom: 10,
    },
    titleTextTime: {
      flex: 1,
      flexDirection: "row",
      paddingBottom: 5,
      paddingLeft: 5,
      alignItems: "center",
    },
    titleText: {
      flexDirection: "row",
      paddingBottom: 5,
      paddingLeft: 5,
      alignItems: "center",
    },
    dropdownlistContainer: {
      paddingVertical: 5,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 6,
      flexDirection: "row",
      backgroundColor: Color.gray,
    },
    dropdownlistChild: {
      marginHorizontal: 20,
      marginBottom: 5,
      borderRadius: 6,
      borderColor: Color.gray,
      borderWidth: 2,
      paddingVertical: 10,
      justifyContent: "center",
      flexDirection: "row",
      backgroundColor: Color.tabColor,
    },
    dropdownlistChildHasAttach: {
      marginHorizontal: 5,
      marginBottom: 5,
      borderRadius: 6,
      borderColor: "lightgray",
      borderWidth: 2,
      height: 120,
      justifyContent: "center",
    },
    dropdownlistChildNoAttach: {
      marginHorizontal: 5,
      marginBottom: 5,
      borderRadius: 6,
      borderColor: "lightgray",
      borderWidth: 2,
      borderStyle: "dashed",
      height: 120,
      justifyContent: "center",
    },
    blockApproveInfo: {
      marginTop: 10,
    },
    approveIntoTitle: {
      position: "absolute",
      top: -20,
      backgroundColor: "white",
      left: 0,
    },
  });

  //************************************************ START: STATE ************************************************
  const [masterPK, setMasterPK] = useState("");
  const [dataEmployeeIns, setDataEmployeeIns] = useState([]);
  const [modalVisibleEmp, setModalVisibleEmp] = useState(false);
  const [modalVisiblePhongBan, setModalVisiblePhongBan] = useState(false);
  const [modalVisiblePhanXuong, setModalVisiblePhanXuong] = useState(false);
  const [modalVisibleTo, setModalVisibleTo] = useState(false);
  const [dataPhongBan, setDataPhongBan] = useState([]);
  const [dataPhanXuong, setDataPhanXuong] = useState([]);
  const [dataTo, setDataTo] = useState([]);
  const [warning, setWarning] = useState();
  const [phongBan_code, setPhongBan_code] = useState("");
  const [phongBan_code_nm, setPhongBan_code_nm] = useState("Chọn phòng ban");
  const [phanXuong_code, setPhanXuong_code] = useState("");
  const [phanXuong_code_nm, setPhanXuong_code_nm] = useState("Chọn phân xưởng");
  const [to_code, setTo_code] = useState("");
  const [to_code_nm, setTo_code_nm] = useState("Chọn tổ");
  const [lengthDataEmployeeIns, setLengthDataEmployeeIns] = useState(0);
  const [loading, setLoading] = useState(false);
  const [limitDate, setLimitDate] = useState(moment().format("YYYYMMDD"));

  //************************************************ END: STATE ************************************************

  //************************************************ START: HANDLE FUNCTION ***********************************************
  const showPopupSelectEmp = () => {
    if (phongBan_code == "") {
      dialogNoti("Vui lòng chọn phòng ban");
      return;
    }
    setModalVisibleEmp(true);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setLengthDataEmployeeIns(dataEmployeeIns.length);
  }, [dataEmployeeIns]);

  useEffect(() => {
    if (
      dataPhanXuong.length > 0 &&
      dataTo.length > 0 &&
      dataPhanXuong[0].code == "ALL" &&
      dataTo[0].code == "ALL"
    ) {
      setPhanXuong_code(dataPhanXuong[0].code);
      setPhanXuong_code_nm(dataPhanXuong[0].code_nm);
      setTo_code(dataTo[0].code);
      setTo_code_nm(dataTo[0].code_nm);
    }
  }, [dataPhanXuong, dataTo]);

  const getData = () => {
    const pro = "SELHRRE020000";
    const in_par = {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: userPk,
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
          p1_sys: "lst_org",
          p2_sys: "warning",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("RS", rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataPhongBan(rs.data.lst_org);

            setWarning(rs.data.warning[0].note);
            setLimitDate(rs.data.warning[0].limit_dt);
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };

  const getTeam_Factory = (pbCode) => {
    const pro = "SELHRRE020005";
    const in_par = {
      p1_varchar2: pbCode,
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
          p1_sys: "lst_team",
          p2_sys: "lst_factory",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("RS", rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataTo(rs.data.lst_team);
            setDataPhanXuong(rs.data.lst_factory);
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const refreshNewToken = (obj, p1, p2) => {
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

        if (obj == "getData") {
          getData();
        }
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

  const OnSave = () => {
    let dataIns = [...dataEmployeeIns];
    if (dataIns.length === 0) {
      dialogNoti("Chưa có nhân viên nào được chọn");
      return;
    } else if (dataIns.length > 0 || masterPK !== "") {
      const chunkSize = 200;
      const totalChunks = Math.ceil(dataIns.length / chunkSize);
      const sequence_dt = moment().format("YYYYMMDDHHmmss");
      let successFlag = true;

      const processChunk = async (chunkIndex) => {
        if (!successFlag) return;
        const start = chunkIndex * chunkSize;
        const end = start + chunkSize;
        const chunkData = dataIns.slice(start, end);

        const lst_thr_emp_pk = chunkData.map((item) => item.pk).join("|");
        const lst_from_dt = chunkData
          .map((item) => moment(item.from_dt, "DD/MM/YYYY").format("YYYYMMDD"))
          .join("|");
        const lst_to_dt = chunkData
          .map((item) => moment(item.to_dt, "DD/MM/YYYY").format("YYYYMMDD"))
          .join("|");
        const lst_reason = chunkData.map((item) => item.reason).join("|");
        const lst_note = chunkData.map((item) => item.note).join("|");

        const pro = "UPDHRRE020000";
        const in_par = {
          p1_varchar2: "INSERT",
          p2_varchar2: lst_thr_emp_pk,
          p3_varchar2: sequence_dt,
          p4_varchar2: phongBan_code,
          p5_varchar2: lst_from_dt,
          p6_varchar2: lst_to_dt,
          p7_varchar2: lst_reason,
          p8_varchar2: lst_note,
          p9_varchar2: dataIns.length,
          p10_varchar2: APP_VERSION,
          p11_varchar2: crt_by,
          p12_varchar2: thr_emp_pk,
        };

        try {
          const rs = await sysFetch(
            API,
            {
              pro,
              in_par,
              out_par: {
                p1_varchar2: "value_pk",
              },
            },
            tokenLogin
          );

          console.log("rs save ", rs);
          if (rs === "Token Expired") {
            refreshNewToken("OnSave", "", "");
          }
          if (rs !== "Token Expired") {
            if (rs.results === "F") {
              const newText = rs.errorData.split(":");
              const errors = newText[1].trim().split("\n")[0];
              dialogNoti(errors);
              successFlag = false;
            }
          }
        } catch (error) {
          console.log("error save");
          console.log(error);
          successFlag = false;
        }
      };

      const sendChunks = async () => {
        setLoading(true);
        for (let i = 0; i < totalChunks; i++) {
          await processChunk(i);
        }
        setLoading(false);

        if (successFlag) {
          dialogNoti("Sao lưu thành công");
          onResetData();
        }
      };

      Alert.alert(
        "Thông báo",
        "Bạn có muốn sao lưu?",
        [
          {
            text: "Hủy bỏ",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Xác nhận",
            onPress: sendChunks,
          },
        ],
        { cancelable: false }
      );
    }
  };

  const onResetData = () => {
    setMasterPK("");
    setDataEmployeeIns([]);
    setPhongBan_code("");
    setPhongBan_code_nm("Chọn phòng ban");
  };

  const getStatePhongBan = (result) => {
    setPhongBan_code(result.code);
    setPhongBan_code_nm(result.code_nm);
    setModalVisiblePhongBan(false);

    setDataEmployeeIns([]);

    setLoading(true);
    getTeam_Factory(result.code);
    setPhanXuong_code("");
    setPhanXuong_code_nm("Chọn phân xưởng");
    setDataPhanXuong([]);

    setTo_code("");
    setTo_code_nm("Chọn tổ");
    setDataTo([]);
  };

  const getStatePhanXuong = (result) => {
    setPhanXuong_code(result.code);
    setPhanXuong_code_nm(result.code_nm);
    setModalVisiblePhanXuong(false);

    setDataEmployeeIns([]);
  };

  const getStateTo = (result) => {
    setTo_code(result.code);
    setTo_code_nm(result.code_nm);
    setModalVisibleTo(false);

    setDataEmployeeIns([]);
  };

  const OnDelete = (pk) => {
    let newLst = [...dataEmployeeIns];
    newLst = newLst.filter((x) => x.pk != pk);
    setDataEmployeeIns(newLst);
  };

  const modalPhongBan = (
    <TVSControlPopup
      title={"Chọn phòng ban"}
      isShow={modalVisiblePhongBan}
      onHide={() => setModalVisiblePhongBan(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisiblePhongBan(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataPhongBan}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStatePhongBan(item);
              }}
              style={{
                backgroundColor: "#F3F6F9",
                padding: 10,
                borderRadius: 6,
                marginBottom: 3,
              }}
            >
              <Text>{item.code_nm}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </TVSControlPopup>
  );

  const modalPhanXuong = (
    <TVSControlPopup
      title={"Chọn phân xưởng"}
      isShow={modalVisiblePhanXuong}
      onHide={() => setModalVisiblePhanXuong(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisiblePhanXuong(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataPhanXuong}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStatePhanXuong(item);
              }}
              style={{
                backgroundColor: "#F3F6F9",
                padding: 10,
                borderRadius: 6,
                marginBottom: 3,
              }}
            >
              <Text>{item.code_nm}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </TVSControlPopup>
  );

  const modalTo = (
    <TVSControlPopup
      title={"Chọn tổ"}
      isShow={modalVisibleTo}
      onHide={() => setModalVisibleTo(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleTo(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataTo}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateTo(item);
              }}
              style={{
                backgroundColor: "#F3F6F9",
                padding: 10,
                borderRadius: 6,
                marginBottom: 3,
              }}
            >
              <Text>{item.code_nm}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </TVSControlPopup>
  );

  //************************************************ END: HANDLE FUNCTION ***********************************************

  return (
    <Block style={{ flex: 1 }} backgroundColor={Color.backgroundColor}>
      <Block flex backgroundColor={Color.gray}>
        <View
          style={{
            flex: 1,
            marginHorizontal: 10,
            marginVertical: 5,
            borderRadius: 8,
            padding: 4,
            backgroundColor: "#fff",
          }}
        >
          {/* START: CONTROL SELECT */}
          <Block style={styles.titleContainer}>
            <Block style={styles.titleText}>
              <Text color={Color.mainColor}>Chọn phòng ban</Text>
              <Text color={Color.red}> *</Text>
            </Block>
            <TVSList
              onPress={() => {
                setModalVisiblePhongBan(true);
              }}
              colorText={
                phongBan_code_nm == "Chọn phòng ban" ? "#B2B2B2" : null
              }
              code_nm={phongBan_code_nm}
            />
          </Block>
          {/* END: CONTROL SELECT */}

          {phongBan_code != "" ? (
            <>
              {/* START: CONTROL SELECT */}
              <Block style={styles.titleContainer}>
                <Block style={styles.titleText}>
                  <Text color={Color.mainColor}>Chọn phân xưởng</Text>
                  <Text color={Color.red}> *</Text>
                </Block>
                <TVSList
                  onPress={() => {
                    setModalVisiblePhanXuong(true);
                  }}
                  colorText={
                    phanXuong_code_nm == "Chọn phân xưởng" ? "#B2B2B2" : null
                  }
                  code_nm={phanXuong_code_nm}
                />
              </Block>
              {/* END: CONTROL SELECT */}

              {/* START: CONTROL SELECT */}
              <Block style={styles.titleContainer}>
                <Block style={styles.titleText}>
                  <Text color={Color.mainColor}>Chọn tổ</Text>
                  <Text color={Color.red}> *</Text>
                </Block>
                <TVSList
                  onPress={() => {
                    setModalVisibleTo(true);
                  }}
                  colorText={to_code_nm == "Chọn tổ" ? "#B2B2B2" : null}
                  code_nm={to_code_nm}
                />
              </Block>
              {/* END: CONTROL SELECT */}
            </>
          ) : null}

          {/* START: CONTROL DS NHÂN VIÊN */}
          <View
            border={1}
            paddingVertical={10}
            borderColor={Color.gray}
            radius={6}
            borderWidth={2}
            borderRadius={8}
            style={{
              marginHorizontal: 5,
              flex: 1,
              marginBottom: 5,
              marginTop: 12,
            }}
          >
            <View row style={styles.fieldsetTitle}>
              <View
                style={{
                  borderBottomColor: Color.mainColor,
                  borderBottomWidth: 0.2,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    showPopupSelectEmp();
                  }}
                >
                  <Text style={{ color: Color.mainColor }}>
                    Danh sách nhân viên{"  "}
                    <Text style={{ color: "red" }}>
                      {lengthDataEmployeeIns}
                    </Text>
                    {"  "}
                    <Icon
                      name={"pencil-outline"}
                      color={Color.mainColor}
                      size={15}
                    />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View>
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 50,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                        paddingVertical: 5,
                      }}
                    >
                      <Text>Xóa</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 120,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                        paddingVertical: 5,
                      }}
                    >
                      <Text>Mã NV</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 200,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                        paddingVertical: 5,
                      }}
                    >
                      <Text>Họ tên</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 100,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                      }}
                    >
                      <Text>Ngày bắt đầu</Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 100,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                      }}
                    >
                      <Text>Ngày kết thúc</Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 100,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                      }}
                    >
                      <Text>Lý do</Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 150,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                      }}
                    >
                      <Text>Ghi chú</Text>
                    </View>
                  </View>
                  <ScrollView>
                    {dataEmployeeIns.map((item) => (
                      <View
                        style={{
                          flexDirection: "row",
                          paddingVertical: 2,
                          borderBottomColor: "#BDBDBD",
                          borderBottomWidth: 0.2,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            width: 50,
                            justifyContent: "center",
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              OnDelete(item.pk);
                            }}
                          >
                            <View>
                              <Icon
                                name={"trash-can-outline"}
                                color={"#F64E60"}
                                size={25}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 120,
                            paddingLeft: 5,
                          }}
                        >
                          <Text>{item.emp_id}</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 200,
                          }}
                        >
                          <Text>{item.full_nm}</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 100,
                          }}
                        >
                          <Text>{item.from_dt}</Text>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 100,
                          }}
                        >
                          <Text>{item.to_dt}</Text>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 100,
                          }}
                        >
                          <Text>{item.reason}</Text>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            width: 150,
                            justifyContent: "center",
                          }}
                        >
                          <Text>{item.note}</Text>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </ScrollView>
            </View>
          </View>
          {/* END: CONTROL DS NHÂN VIÊN */}
        </View>

        {/* START: CONTROL BUTTON */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 20,
            flexDirection: "row",
            backgroundColor: "white",
            paddingVertical: 5,
          }}
        >
          <TVSButton
            onPress={() => onResetData()}
            icon={"reload"}
            buttonStyle={"3"}
            type={"secondary"}
          >
            Làm mới
          </TVSButton>
          <TVSButton
            onPress={() => OnSave()}
            icon={"content-save"}
            buttonStyle={"3"}
          >
            Sao lưu
          </TVSButton>
        </View>
        {/* END: CONTROL BUTTON */}
      </Block>
      <ModalChonNhanVien
        isShow={modalVisibleEmp}
        handleShow={setModalVisibleEmp}
        phongBan_code={phongBan_code}
        onReset={() => onReset()}
        warning={warning}
        dataEmployeeIns={dataEmployeeIns}
        setDataEmployeeIns={setDataEmployeeIns}
        limitDate={limitDate}
        to_code={to_code}
        phanXuong_code={phanXuong_code}
      ></ModalChonNhanVien>
      {modalPhongBan}
      {modalPhanXuong}
      {modalTo}
      <Load visible={loading}></Load>
    </Block>
  );
}

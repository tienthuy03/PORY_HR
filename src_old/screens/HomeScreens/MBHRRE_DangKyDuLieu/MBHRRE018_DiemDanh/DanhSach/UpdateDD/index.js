import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import Block from "../../../../../../components/Block";
import TVSHeader from "../../../../../../components/Tvs/Header";
import Typography from "../../../../../../components/Text";
import Text from "../../../../../../components/Text";
import sysFetch from "../../../../../../services/fetch_v1";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { APP_VERSION } from "../../../../../../config/Pro";
import TVSButton from "../../../../../../components/Tvs/Button";
import ModalSelectStatus from "./ModalSelectStatus";

const UpdateDD = ({ navigation: { goBack }, route }) => {
  const { item, tco_org_pk, work_dt, onRefresh } = route.params;
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  // Theme Color
  const Color = useSelector((s) => s.SystemReducer.theme);
  // Reducers info login
  const loginReducers = useSelector((state) => state.loginReducers);
  // Reducers menu
  const menuReducer = useSelector((state) => state.menuReducer);
  let refreshToken = useSelector(
    (state) => state.loginReducers.data.data.refreshToken
  );
  let thr_emp_pk;
  let tokenLogin;
  let fullname;
  let crt_by;
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {
    //
  }

  const navigation = useNavigation();
  const [dataEmp, setDataEmp] = useState([]);
  const [dataStatus, setDataStatus] = useState([]);
  const [modalSelectStatusVisible, setModalSelectStatusVisible] =
    useState(false);
  const [modalSelectStatusIndex, setModalSelectStatusIndex] = useState("");

  const styles = StyleSheet.create({
    titleText2: {
      flex: 1,
    },
    container2: {
      flexDirection: "row",
      marginBottom: 5,
      alignItems: "center",
      borderBottomWidth: 1,
      radius: 6,
      paddingRight: 10,
      paddingLeft: 10,
      paddingTop: 5,
      paddingBottom: 5,
      borderColor: "#F4F6F7",
    },
    container: {
      paddingTop: 10,
      marginRight: 10,
      marginLeft: 10,
      flex: 1,
      backgroundColor: Color.white,
    },
    titleContainer: {
      flex: 1,
      paddingHorizontal: 5,
      marginBottom: 10,
    },
    titleContainer2: {
      flex: 1,
      paddingHorizontal: 5,
    },
    titleText: {
      flexDirection: "row",
      paddingBottom: 5,
      paddingLeft: 5,
      alignItems: "center",
    },
    warning: {
      color: "#ffc107",
    },
    success: {
      color: "#28a745",
    },
    danger: {
      color: "#dc3545",
    },
  });

  useEffect(() => {
    getDataEmp();
  }, []);

  const getDataEmp = () => {
    console.log("SELHRRE018004", {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: tco_org_pk.toString(),
      p3_varchar2: work_dt,
      p4_varchar2: APP_VERSION,
      p5_varchar2: crt_by,
    });
    sysFetch(
      API,
      {
        pro: "SELHRRE018004",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: tco_org_pk.toString(),
          p3_varchar2: work_dt,
          p4_varchar2: APP_VERSION,
          p5_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "dataEmp",
          p2_sys: "dataStatus",
        },
      },
      tokenLogin
    )
      .then((res) => {
        setDataEmp(res.data.dataEmp);
        setDataStatus(res.data.dataStatus);
      })
      .catch((error) => {
        console.log("error");
        console.log(error);
      });
  };

  const modalSelectStatus = (
    <ModalSelectStatus
      title={"Chọn trạng thái"}
      isShow={modalSelectStatusVisible}
      data={dataStatus}
      item={dataEmp[modalSelectStatusIndex]}
      index={modalSelectStatusIndex}
      onHide={() => setModalSelectStatusVisible(false)}
      onSave={(
        index,
        workStatus,
        riceStatus,
        workStatusCodeName,
        description
      ) => {
        onReWriteObj(
          index,
          workStatus,
          riceStatus,
          workStatusCodeName,
          description
        );
        setModalSelectStatusVisible(false);
      }}
    ></ModalSelectStatus>
  );

  const dialogNoti = (text) => {
    Alert.alert(
      "Thông báo",
      text,
      [
        {
          text: "Ok",
          onPress: () => {
            navigation.goBack();
            onRefresh();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const onReWriteObj = (
    index,
    workStatus,
    riceStatus,
    workStatusCodeName,
    description
  ) => {
    const updatedDataEmployee = [...dataEmp];
    const updatedEmployee = {
      ...updatedDataEmployee[index],
      work_status_code: workStatus,
      rice_status: riceStatus,
      work_status_code_nm: workStatusCodeName,
      description: description,
    };
    updatedDataEmployee[index] = updatedEmployee;
    setDataEmp(updatedDataEmployee);
  };

  // const onConfirm = () => {
  //   const promises = dataEmp.map((item) => {
  //     const data = {
  //       attendance_daily_pk: item.attendance_daily_pk,
  //       meal_yn: item.rice_status,
  //       attendance_status: item.work_status_code,
  //       description: item.description,
  //     };
  //     return onSave(data);
  //   });

  //   Promise.all(promises)
  //     .then((results) => {
  //       results.every((rs) => {
  //         if (rs.results === "S") {
  //           Alert.alert(
  //             "Thông báo",
  //             "Điểm danh thành công",
  //             [
  //               {
  //                 text: "Đóng",
  //                 onPress: () => {
  //                   // onResetForm();
  //                 },
  //               },
  //             ],
  //             { cancelable: true }
  //           );
  //         } else {
  //           let newText = rs.errorData.split("ORA");
  //           let errors = "";
  //           try {
  //             errors = newText[1].trim().split(":")[1];
  //           } catch (error) {
  //             errors = "Lỗi: đăng ký không thành công.";
  //           }

  //           Alert.alert(
  //             "Thông báo",
  //             errors,
  //             [
  //               {
  //                 text: "Thoát",
  //                 onPress: () => {},
  //                 style: "cancel",
  //               },
  //             ],
  //             { cancelable: false }
  //           );
  //         }
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const onValided = () => {
    Alert.alert(
      "Thông báo",
      "Bạn có muốn điểm danh không?",
      [
        {
          text: "Hủy bỏ",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: () => {
            onSave();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const onSave = () => {
    var arrSave = [...dataEmp];
    let emp_id = "";
    let tco_org_pk = "";
    let meal_yn = "";
    let attendance_status = "";
    let thr_emp_pk_detail = "";
    let description = "";
    let attendance_daily_pk = "";

    arrSave.forEach(function (item) {
      attendance_daily_pk += item.attendance_daily_pk + "|";
      emp_id += item.emp_id + "|";
      tco_org_pk += item.tco_org_pk + "|";
      meal_yn += item.rice_status + "|";
      attendance_status += item.work_status_code + "|";
      thr_emp_pk_detail += item.thr_emp_pk + "|";
      description += item.description + "|";
    });

    console.log("UPDHRRE018000", {
      p1_varchar2: "UPDATE",
      p2_varchar2: attendance_daily_pk,
      p3_varchar2: "",
      p4_varchar2: "",
      p5_varchar2: "",
      p6_varchar2: "",
      p7_varchar2: description,
      p8_varchar2: meal_yn,
      p9_varchar2: attendance_status,
      p10_varchar2: arrSave.length,
      p11_varchar2: "",
      p12_varchar2: APP_VERSION,
      p13_varchar2: crt_by,
    });

    sysFetch(
      API,
      {
        pro: "UPDHRRE018000",
        in_par: {
          p1_varchar2: "UPDATE",
          p2_varchar2: attendance_daily_pk,
          p3_varchar2: "",
          p4_varchar2: "",
          p5_varchar2: "",
          p6_varchar2: "",
          p7_varchar2: description,
          p8_varchar2: meal_yn,
          p9_varchar2: attendance_status,
          p10_varchar2: arrSave.length,
          p11_varchar2: "",
          p12_varchar2: APP_VERSION,
          p13_varchar2: crt_by,
        },
        out_par: {
          p1_varchar2: "status",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("rs", rs);
        if (rs.results === "S") {
          Alert.alert(
            "Thông báo",
            "Điểm danh thành công",
            [
              {
                text: "Đóng",
                onPress: () => {},
              },
            ],
            { cancelable: true }
          );
        } else {
          let newText = rs.errorData.split("ORA");
          let errors = "";
          try {
            errors = newText[1].trim().split(":")[1];
          } catch (error) {
            errors = "Lỗi: đăng ký không thành công.";
          }

          Alert.alert(
            "Thông báo",
            errors,
            [
              {
                text: "Thoát",
                onPress: () => {},
                style: "cancel",
              },
            ],
            { cancelable: false }
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>Cập nhật điểm danh</TVSHeader>
      <Block flex backgroundColor={Color.gray}>
        <Block
          backgroundColor={"#FFFFFF"}
          alignCenter
          margin={10}
          padding={10}
          radius={10}
        >
          <Typography
            size={20}
            center
            color={Color.mainColor}
            fontFamily={"Roboto-Bold"}
          >
            {item.phongban_nm}
          </Typography>
        </Block>
        <Block paddingTop={5} paddingBottom={10} flex>
          <Block flex>
            <Block flex borderTopLeftRadius={6} borderTopRightRadius={6}>
              <ScrollView>
                <Block style={styles.container}>
                  <Block>
                    <Block style={styles.titleContainer2}>
                      <Block style={styles.titleText}>
                        <Text color={Color.mainColor}>Danh sách nhân viên</Text>
                      </Block>
                    </Block>
                    {dataEmp.map((item, index) => (
                      <Block style={styles.container2}>
                        <Text style={styles.titleText2}>
                          {index + 1}
                          {" - "}
                          {item.full_name}
                        </Text>
                        <Block
                          radius={4}
                          borderWidth={1}
                          borderColor={Color.gray}
                          minWidth={115}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              setModalSelectStatusVisible(true);
                              setModalSelectStatusIndex(index);
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text
                                paddingLeft={4}
                                paddingRight={4}
                                padding={3}
                                fontFamily={"Roboto-Medium"}
                                marginLeft={5}
                                style={[
                                  item.work_status_code === "1" &&
                                  item.rice_status === "Y"
                                    ? styles.success
                                    : item.work_status_code === "NV"
                                    ? styles.danger
                                    : item.work_status_code === "K"
                                    ? styles.danger
                                    : item.work_status_code === "1P"
                                    ? styles.warning
                                    : item.work_status_code === "1/2P"
                                    ? styles.warning
                                    : item.work_status_code === "1" &&
                                      item.rice_status === "N"
                                    ? styles.success
                                    : "",
                                ]}
                              >
                                {item.work_status_code === "1" &&
                                item.rice_status === "N"
                                  ? "Không ăn cơm"
                                  : item.work_status_code_nm}
                              </Text>
                              <View marginRight={5}>
                                <Icon
                                  name={"pencil-outline"}
                                  size={16}
                                  color={Color.black}
                                />
                              </View>
                            </View>
                          </TouchableOpacity>
                        </Block>
                      </Block>
                    ))}
                  </Block>
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingBottom: 3,
                    }}
                  >
                    <View>
                      <TVSButton
                        onPress={() => {
                          onValided();
                        }}
                        icon={"content-save"}
                        buttonStyle={"3"}
                        minWidth={150}
                      >
                        Cập nhật
                      </TVSButton>
                    </View>
                  </View>
                  {modalSelectStatus}
                </Block>
              </ScrollView>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default UpdateDD;

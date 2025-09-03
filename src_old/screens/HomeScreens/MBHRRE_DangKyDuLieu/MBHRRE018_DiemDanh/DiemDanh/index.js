/************************************************ START: IMPORT ************************************************/
import moment from "moment";
import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
// import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../../components/Block";
import Text from "../../../../../components/Text";
import TVSButton from "../../../../../components/Tvs/Button";
import TVSDate from "../../../../../components/Tvs/TVSDate";
import TVSList from "../../../../../components/Tvs/TVSList";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { updateUserAction } from "../../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../config/Pro";
import ModalSelectStatus from "./ModalSelectStatus";
/************************************************ END: IMPORT ************************************************/

export default function DD({ onCallbackReload }) {
  //get status isLoading
  const { isLoading } = useSelector((state) => state.GlobalLoadingReducer);

  //************************************************ START: VARIABLE ************************************************
  const Color = useSelector((s) => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    // style form
    titleText2: {
      // flex: 1,
      marginLeft: 5,
    },
    container2: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      radius: 6,
      paddingRight: 10,
      paddingLeft: 10,
      paddingTop: 5,
      borderColor: "#F4F6F7",
    },
    container: {
      paddingTop: 10,
      marginRight: 10,
      marginLeft: 10,
      flex: 1,
    },
    titleContainer: {
      // flex: 1,
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
    totalEmp: {
      marginLeft: 5,
      fontSize: 16,
    },
    avatar: {
      resizeMode: "cover",
      width: 50,
      height: 50,
      marginRight: 5,
      borderRadius: 50,
      resizeMode: "cover",
    },

    titleDate: {
      marginLeft: 5,
      color: Color.mainColor,
      fontWeight: "bold",
    },
  });

  const dispatch = useDispatch();
  const loginReducers = useSelector((state) => state.loginReducers);

  const API = useSelector((state) => state.SysConfigReducer.API_URL);

  let thr_emp_pk = useSelector(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );
  let tokenLogin = "";
  let userPk = useSelector(
    (state) => state.loginReducers.data.data.tes_user_pk
  );
  let refreshToken;
  let crt_by = "";
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    company_pk = loginReducers.data.data.company_pk;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    refreshToken = loginReducers.data.data.refreshToken;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {}
  //******************************************************************** END: VARIABLE ********************************************************************

  const scrollOffsetRef = useRef(0);
  const windowHeight = Dimensions.get("window").height;

  //******************************************************************** START: STATE ********************************************************************
  const [modalSelectStatusVisible, setModalSelectStatusVisible] =
    useState(false);
  const [modalSelectStatusIndex, setModalSelectStatusIndex] = useState("");
  const [totalDate, setTotalDate] = useState(
    moment(new Date().getTime()).format("DD/MM/YYYY")
  );
  const [totalDatePickerVisible, setTotalDatePickerVisible] = useState(false);
  const [time_attendance, setTime_Attendance] = useState("");
  // const [dataEmployee, setDataEmployee] = useState([]);
  const [dataStatus, setDataStatus] = useState([]);
  const [totalEmployee, setTotalEmployee] = useState(0);
  let [dsNhanVien, setDsNhanVien] = useState([]);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isListEnd, setIsListEnd] = useState(false);
  const [noneAvatar, setNoneAvatar] = useState(
    "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"
  );
  const [visibleBtnAttendance, setvisibleBtnAttendance] = useState(false);
  //******************************************************************** END: STATE ********************************************************************

  //******************************************************************** START: FUNCTION ********************************************************************
  useEffect(() => {
    getData();
  }, []);

  const hidePickerTotalDate = () => {
    setTotalDatePickerVisible(false);
  };
  const handleConfirmTotalDate = (val) => {
    hidePickerTotalDate();
    if (
      moment(val).format("YYYYMMDD") <
      moment(new Date().getTime()).format("YYYYMMDD")
    ) {
      dialogError("Vui lòng chọn từ ngày lớn hơn hoặc bằng ngày hiện tại");
      return;
    }
    setTotalDate(moment(val).format("DD/MM/YYYY"));
  };

  const convertDate = (datetime, characterSplit) => {
    const year = datetime.split(characterSplit)[2];
    const month = datetime.split(characterSplit)[1];
    const date = datetime.split(characterSplit)[0];
    const datetimeConvert = year + "" + month + "" + date;
    if (datetimeConvert == "yyyymmdd") {
      return "";
    } else return datetimeConvert;
  };

  //get org
  const getData = () => {
    console.log("get data");
    setLoad(true);
    console.log("SELHRRE018001", {
      p1_varchar2: userPk,
      p2_varchar2: thr_emp_pk,
      p3_varchar2: APP_VERSION,
      p4_varchar2: crt_by,
    });
    sysFetch(
      API,
      {
        pro: "SELHRRE018001",
        in_par: {
          p1_varchar2: userPk,
          p2_varchar2: thr_emp_pk,
          p3_varchar2: APP_VERSION,
          p4_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_org",
          p2_sys: "warning_time_attendance",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setdataPB(rs.data.lst_org);
            setTime_Attendance(
              rs.data.warning_time_attendance[0].time_attendance
            );
          }
        }
        setLoad(false);
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
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

  const onResetForm = () => {
    setPB_code("");
    setPB_code_nm("Chọn tổ");
  };

  const dialogNoti = (text) => {
    Alert.alert(
      "Thông báo",
      text,
      [
        {
          text: "Đóng",
          onPress: () => {
            onResetForm();
          },
        },
      ],
      { cancelable: false }
    );
  };

  //TO
  const [modalVisiblePB, setModalVisiblePB] = useState(false);
  const [dataPB, setdataPB] = useState([]);
  const [pb_code, setPB_code] = useState("");
  const [pb_code_nm, setPB_code_nm] = useState("Chọn tổ");
  const [colorTo, setColorTo] = useState("#B2B2B2");

  const getStateTo = async (result) => {
    setOffset(0);
    setvisibleBtnAttendance(false);
    setPB_code(result.code);
    setPB_code_nm(result.code_nm);
    setTotalEmployee(0);
    setColorTo(null);
    setModalVisiblePB(false);
    setDsNhanVien([]);
    setLoading(false);
    setIsListEnd(false);
    await onRequestToServerGetAllEmp(0, 0, result.code);
  };

  const modalTo = (
    <TVSControlPopup
      title={"Chọn tổ điểm danh"}
      isShow={modalVisiblePB}
      onHide={() => setModalVisiblePB(false)}
    >
      <FlatList
        data={dataPB}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
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

  const onReWriteObj = (
    index,
    workStatus,
    riceStatus,
    workStatusCodeName,
    description
  ) => {
    const updatedDataEmployee = [...dsNhanVien];
    const updatedEmployee = {
      ...updatedDataEmployee[index],
      work_status_code: workStatus,
      rice_status: riceStatus,
      work_status_code_nm: workStatusCodeName,
      description: description,
    };
    updatedDataEmployee[index] = updatedEmployee;
    // setDataEmployee(updatedDataEmployee);
    setDsNhanVien(updatedDataEmployee);
  };

  const dialogError = (text) => {
    Alert.alert(
      "Thông báo",
      text,
      [
        {
          text: "Ok",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const onValided = () => {
    if (pb_code === "") {
      dialogError("Vui lòng chọn tổ điểm danh!");
      return;
    }

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

  const onConfirm = () => {
    const promises = dsNhanVien.map((item) => {
      const data = {
        emp_id: item.emp_id,
        tco_org_pk: item.tco_org_pk,
        meal_yn: item.rice_status,
        attendance_status: item.work_status_code,
        thr_emp_pk_detail: item.thr_emp_pk,
        description: item.description,
      };
      return onSave(data);
    });

    Promise.all(promises)
      .then((results) => {
        console.log("results", results);
        results.every((rs) => {
          if (rs.results === "S") {
            Alert.alert(
              "Thông báo",
              "Điểm danh thành công",
              [
                {
                  text: "Đóng",
                  onPress: () => {
                    onResetForm();
                  },
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
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSave = () => {
    var arrSave = [...dsNhanVien];
    let emp_id = "";
    let tco_org_pk = "";
    let meal_yn = "";
    let attendance_status = "";
    let thr_emp_pk_detail = "";
    let description = "";

    arrSave.forEach(function (item) {
      emp_id += item.emp_id + "|";
      tco_org_pk += item.tco_org_pk + "|";
      meal_yn += item.rice_status + "|";
      attendance_status += item.work_status_code + "|";
      thr_emp_pk_detail += item.thr_emp_pk + "|";
      description += item.description + "|";
    });

    console.log("UPDHRRE018000", {
      p1_varchar2: "INSERT",
      p2_varchar2: "",
      p3_varchar2: thr_emp_pk_detail.toString(),
      p4_varchar2: emp_id,
      p5_varchar2: tco_org_pk.toString(),
      p6_varchar2: convertDate(totalDate, "/"),
      p7_varchar2: description,
      p8_varchar2: meal_yn,
      p9_varchar2: attendance_status,
      p10_varchar2: arrSave.length,
      p11_varchar2: thr_emp_pk,
      p12_varchar2: APP_VERSION,
      p13_varchar2: crt_by,
    });

    sysFetch(
      API,
      {
        pro: "UPDHRRE018000",
        in_par: {
          p1_varchar2: "INSERT",
          p2_varchar2: "",
          p3_varchar2: thr_emp_pk_detail.toString(),
          p4_varchar2: emp_id,
          p5_varchar2: tco_org_pk.toString(),
          p6_varchar2: convertDate(totalDate, "/"),
          p7_varchar2: description,
          p8_varchar2: meal_yn,
          p9_varchar2: attendance_status,
          p10_varchar2: arrSave.length,
          p11_varchar2: thr_emp_pk,
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
                onPress: () => {
                  onResetForm();
                },
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

  const onRequestToServerGetAllEmp = async (time, type, pb_code) => {
    setLoading(true);
    console.log("SELHRRE018002 GetAllEmp", {
      p1_varchar2: pb_code,
      p2_varchar2: "",
      p3_varchar2: APP_VERSION,
      p4_varchar2: crt_by,
    });
    sysFetch(
      API,
      {
        pro: "SELHRRE018002",
        in_par: {
          p1_varchar2: pb_code,
          p2_varchar2: "",
          p3_varchar2: APP_VERSION,
          p4_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "data",
          p2_sys: "dataStatus",
          p3_sys: "emp_images",
          p4_sys: "row_num_image",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs === "Token Expired") {
          refreshNewToken("grid", 0);
        } else if (rs !== "Token Expired") {
          console.log("rs onRequestToServerGetAllEmp", rs);
          if (rs.table.data > 0) {
            // console.log("RS DATA EMP IMAGES", rs.data.emp_images);
            setvisibleBtnAttendance(true);
            setDsNhanVien((prevData) => [...prevData, ...rs.data.data]);
            setTotalEmployee(rs.data.data.length);
            setDataStatus(rs.data.dataStatus);

            setDsNhanVien((prevData) => {
              return prevData.map((item) => {
                let index = rs.data.emp_images.findIndex(
                  (x) => x.emp_id == item.emp_id
                );
                if (index !== -1) {
                  item.avatar = rs.data.emp_images[index].avatar;
                  item.imageloaded = rs.data.emp_images[index].imageloaded;
                }
                return item;
              });
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onRequestToServerGetImage = (index, emp_id) => {
    sysFetch(
      API,
      {
        pro: "SELHRRE018012",
        in_par: {
          p1_varchar2: emp_id,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "data",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs === "Token Expired") {
          refreshNewToken("grid", 0);
        } else if (rs !== "Token Expired") {
          if (rs.table.data > 0) {
            const updatedDsNhanVien = [...dsNhanVien];
            updatedDsNhanVien[index].avatar = rs.data.data[0].avatar;
            console.log("IMAGE", rs.data.data[0].avatar);
            setDsNhanVien(updatedDsNhanVien);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //item FlatList
  const ItemView = ({ item, index }) => {
    return (
      <Block style={styles.container2}>
        <Image
          style={styles.avatar}
          source={{
            uri:
              item.avatar.length > 0
                ? "data:image/jpg;base64," + item.avatar
                : "data:image/jpg;base64," + noneAvatar,
          }}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.titleText2}>{item.full_name}</Text>
          <Text style={styles.titleText2}>{item.emp_id}</Text>
        </View>
        <Block
          radius={4}
          borderWidth={1}
          borderColor={Color.gray}
          minWidth={115}
          r
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
                  item.work_status_code === "1" && item.rice_status === "Y"
                    ? styles.success
                    : item.work_status_code === "NV"
                    ? styles.danger
                    : item.work_status_code === "K"
                    ? styles.danger
                    : item.work_status_code === "1P"
                    ? styles.warning
                    : item.work_status_code === "1/2P"
                    ? styles.warning
                    : item.work_status_code === "1" && item.rice_status === "N"
                    ? styles.success
                    : "",
                ]}
              >
                {item.work_status_code === "1" && item.rice_status === "N"
                  ? "Không ăn cơm"
                  : item.work_status_code_nm}
              </Text>
              <View marginRight={5}>
                <Icon name={"pencil-outline"} size={16} color={Color.black} />
              </View>
            </View>
          </TouchableOpacity>
        </Block>
      </Block>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footerLoading}>
        {loading ? (
          <ActivityIndicator color="black" style={{ margin: 15 }} />
        ) : null}
      </View>
    );
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          width: "100%",
        }}
      />
    );
  };

  const isItemVisible = (index) => {
    const itemOffsetY = index * 50;
    const itemHeight = 50;
    const scrollOffsetY = scrollOffsetRef.current;

    return (
      itemOffsetY >= scrollOffsetY - windowHeight &&
      itemOffsetY + itemHeight <= scrollOffsetY + 2 * windowHeight
    );
  };

  let count = 0;

  const onScroll = (event) => {
    const scrollOffsetY = event.nativeEvent.contentOffset.y;
    scrollOffsetRef.current = scrollOffsetY;

    dsNhanVien.forEach(async (employee, index) => {
      if (employee.imageloaded == "F" && isItemVisible(index)) {
        console.log("GET HINH NE", count++);
        dsNhanVien[index].imageloaded = "S";
        await onRequestToServerGetImage(index, employee.emp_id);
      }
    });
  };
  //******************************************************************** END: FUNCTION ********************************************************************

  return (
    <Block paddingTop={5} paddingBottom={10} flex>
      <Block flex>
        <Block
          flex
          borderTopLeftRadius={6}
          borderTopRightRadius={6}
          backgroundColor={Color.white}
        >
          {!isLoading && (
            <Block style={styles.container}>
              <Block style={styles.titleContainer}>
                <Block style={styles.titleText}>
                  <Text color={Color.mainColor}>Chọn tổ điểm danh</Text>
                  <Text color={Color.red}> *</Text>
                </Block>
                <TVSList
                  disabled={loading}
                  onPress={() => setModalVisiblePB(true)}
                  colorText={
                    pb_code_nm == "Chọn tổ" || loading ? "#B2B2B2" : null
                  }
                  code_nm={pb_code_nm}
                />
              </Block>

              <Block style={styles.titleContainer}>
                <Block style={styles.titleText}>
                  <Text color={Color.mainColor}>Ngày điểm danh</Text>
                  <Text color={Color.red}>*</Text>
                  <Text style={styles.titleDate}>{totalDate}</Text>
                </Block>
              </Block>

              <Block style={styles.titleContainer}>
                <Block style={styles.titleText}>
                  <Text style={{ fontSize: 16 }} color={Color.red}>
                    {time_attendance}
                  </Text>
                </Block>
              </Block>

              {pb_code !== "" ? (
                <Block flex>
                  <View style={{ flexDirection: "row" }}>
                    <Text color={Color.mainColor}>Danh sách nhân viên </Text>
                    <Text style={styles.totalEmp} color={Color.red}>
                      {totalEmployee}
                    </Text>
                  </View>

                  <SafeAreaView style={{ marginHorizontal: 5 }}>
                    <FlatList
                      data={dsNhanVien}
                      keyExtractor={(item, index) => index.toString()}
                      ItemSeparatorComponent={ItemSeparatorView}
                      renderItem={ItemView}
                      ListFooterComponent={renderFooter}
                      onScroll={onScroll}
                      scrollEventThrottle={16}
                    />
                  </SafeAreaView>
                </Block>
              ) : null}

              {modalTo}

              <ModalSelectStatus
                title={"Chọn trạng thái"}
                isShow={modalSelectStatusVisible}
                data={dataStatus}
                item={dsNhanVien[modalSelectStatusIndex]}
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
            </Block>
          )}
        </Block>

        {visibleBtnAttendance ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: Color.white,
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
                Điểm danh
              </TVSButton>
            </View>
          </View>
        ) : null}
      </Block>
    </Block>
  );
}

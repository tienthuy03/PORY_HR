import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  TextInput,
  View,
  Keyboard,
  FlatList,
  Image,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import Block from "../../../../../../components/Block";
import Text from "../../../../../../components/Text";
import sysFetch from "../../../../../../services/fetch_v1";
import sysFetch2 from "../../../../../../services/fetch_v1/fetch2";
import { APP_VERSION } from "../../../../../../config/Pro";
import Button from "../../../../../../components/Button";
import TVSButton from "../../../../../../components/Tvs/Button";
import Load from "../../../../../../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import TVSDate from "../../../../../../components/Tvs/TVSDate";
import TVSHeader from "../../../../../../components/Tvs/Header";
import { setHeaderChil2 } from "../../../../../../Language";
import TVSList from "../../../../../../components/Tvs/TVSList";
import TVSControlPopup from "../../../../../../components/Tvs/ControlPopup2";
import OneField from "../../../../../../components/OneFieldKeyValue";
import TVSSignature from "../../../../../../components/Tvs/TVSSignature";
import IconDate from "../../../../../../icons/Datev";
import IconTime from "../../../../../../icons/Time";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SignatureScreen from "react-native-signature-canvas";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
// import { request, PERMISSIONS } from "react-native-permissions";
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../../../services/redux/GlobalLoading/action";
import LinearGradient from "react-native-linear-gradient";
import TVSTextInput from "../../../../../../components/Tvs/TVSTextInput";
import TVSFieldSet from "../../../../../../components/Tvs/TVSFieldSet";
import { showAlert } from "../../../../../../components/Tvs/TVSAlertORA";
import ShowError from "../../../../../../services/errors";

const ChiPhi = ({ route_pk, car_reg_pk }) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const loginReducers = useSelector((state) => state.loginReducers);
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  let thr_emp_pk = "";
  let tokenLogin = "";
  let userPk;
  let refreshToken;
  let crt_by = "";
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    company_pk = loginReducers.data.data.company_pk;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    org_pk = loginReducers.data.data.org_pk;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {}
  const [dataMain, setDataMain] = useState([]);
  const [countEmp, setCountEmp] = useState(0);
  useEffect(() => {
    getDataMain(route_pk);
  }, []);

  const getDataMain = (route_pk) => {
    // dispatch(ShowGlobalLoading);
    console.log("get data main ", route_pk);
    sysFetch(
      API,
      {
        pro: "SELHRBS001004",
        in_par: {
          p1_varchar2: route_pk,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_data_main",
          p2_sys: "lst_data_cost_type",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("rs bs001003 ", rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setCountEmp(rs.data.lst_data_main.length);
            setDataMain(rs.data.lst_data_main);
            setArrCostType(rs.data.lst_data_cost_type);
            // dispatch(HideGlobalLoading);
          } else {
            // dispatch(HideGlobalLoading);
          }
        } else {
          // dispatch(HideGlobalLoading);
        }
      })
      .catch((error) => {
        dispatch(HideGlobalLoading);
        console.log(error);
      });
  };
  //
  const [arrCostType, setArrCostType] = useState([
    { code: 1, code_nm: "abc" },
    { code: 2, code_nm: "abcd" },
  ]);
  const [currentSelectedCostType, setCurrentSelectedCostType] = useState({
    arr: [],
    code_nm: "Chọn loại chi phí",
  });
  const onChangeSelectedCostType = (value) => {
    console.log(value);
    setCurrentSelectedCostType(value);
  };

  const SelectCostType = ({
    onChangeSelectedCostType,
    currentSelectedCostType,
  }) => {
    const Color = useSelector((s) => s.SystemReducer.theme);
    const [isShow, setIsShow] = useState(false);

    return (
      <View
        style={{
          marginBottom: 5,
        }}
      >
        <View
          style={{
            padding: 7,
            marginTop: 5,
            backgroundColor: Color.gray,
            justifyContent: "center",
            borderRadius: 8,
          }}
        >
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
            nextScreen={() => setIsShow(!isShow)}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: currentSelectedCostType.code === "" ? "#B2B2B2" : null,
                }}
              >
                {currentSelectedCostType.code_nm}
              </Text>
            </View>
            <Icon
              name={"arrow-down-drop-circle-outline"}
              color={Color.mainColor}
              size={24}
            />
          </Button>
          {isShow && (
            <ScrollView>
              <View
                style={{
                  marginTop: 10,
                }}
              >
                {arrCostType.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setIsShow(false);
                        onChangeSelectedCostType(item);
                      }}
                      key={index.toString()}
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        padding: 10,
                        backgroundColor: "white",
                        marginBottom: 5,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        flex={1}
                        flexWrap={"wrap"}
                        paddingLeft={5}
                        paddingRight={5}
                      >
                        {item.code_nm}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    );
  };
  //
  const defaultAvatar =
    "data:image/png;base64,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";

  const [showApprove, setShowApprove] = useState("N");
  const [approveName, setApproveName] = useState("");
  const [approveDescription, setApproveDescription] = useState("");

  const [image, setImage] = useState(defaultAvatar);
  const [itemPK, setItemPK] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescripton] = useState("");
  const [modalVisibleAddNew, setModalVisibleAddNew] = useState(false);
  const [modalVisibleEdit, setModalVisibleEdit] = useState(false);
  const modalEdit = (
    <TVSControlPopup
      maxHeight={450}
      minHeight={450}
      title={"Chi tiết"}
      isShow={modalVisibleEdit}
      onHide={() => {
        getDataMain(route_pk);
        setModalVisibleEdit(false);
      }}
      bottom={
        <>
          <TVSButton
            type={"primary"}
            icon={"content-save"}
            buttonStyle={"3"}
            onPress={() => OnConfirm("UPDATE")}
          >
            Sao lưu
          </TVSButton>

          <TVSButton
            type={"danger"}
            icon={"close"}
            buttonStyle={"3"}
            onPress={() => OnConfirm("DElETE")}
          >
            Xóa bỏ
          </TVSButton>
        </>
      }
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginBottom: 10,
          }}
        >
          <Text style={{ color: Color.mainColor }}>Loại chi phí</Text>
          <Block>
            <SelectCostType
              onChangeSelectedCostType={onChangeSelectedCostType}
              currentSelectedCostType={currentSelectedCostType}
            />
          </Block>
        </View>
        <View
          style={{
            marginBottom: 10,
          }}
        >
          <Text style={{ color: Color.mainColor }}>Số tiền</Text>
          <View style={{ marginTop: 5 }}>
            <TextInput
              style={{
                width: "100%",
                backgroundColor: Color.gray,
                padding: Platform.OS == "android" ? 5 : 10,
                borderRadius: 8,
              }}
              value={amount.toString()}
              placeholder="0"
              onChangeText={(num) => setAmount(num)}
              keyboardType={"numeric"}
              returnKeyType="done"
            />
          </View>
        </View>

        <View>
          <Block
            style={{
              marginBottom: 10,
            }}
          >
            <Block style={{}}>
              <Text style={{ color: Color.mainColor }}>Ghi chú</Text>
            </Block>
            <Block
              style={{
                backgroundColor: Color.gray,
                paddingHorizontal: 5,
                paddingVertical: Platform.OS == "ios" ? 18 : 0,
                borderRadius: 6,
                // minHeight: multiLine ? 70 : null,
              }}
            >
              <TextInput
                value={description.toString()}
                placeholder={"Nhập ghi chú"}
                multiline={true}
                onChangeText={(text) => setDescripton(text)}
              />
            </Block>
          </Block>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Block style={{}}>
            <Text style={{ color: Color.mainColor }}>Hình ảnh</Text>
          </Block>
          <View>
            <TouchableOpacity
              onPress={() => OnChangeImage()}
              style={{ alignItems: "center" }}
            >
              <Image
                style={{
                  width: 120,
                  height: 160,
                  resizeMode: "contain",
                  borderWidth: 1,
                  borderColor: Color.grayPlahoder,
                }}
                source={{ uri: image }}
              />
            </TouchableOpacity>
          </View>
        </View>
        {showApprove == "Y" && (
          <View>
            <TVSFieldSet label={"Thông tin phê duyệt"}>
              <View style={{ marginLeft: 5 }}>
                <Text>{approveName}</Text>
              </View>
              <View style={{ marginLeft: 5, marginTop: 5 }}>
                <Text>{approveDescription}</Text>
              </View>
            </TVSFieldSet>
          </View>
        )}
      </ScrollView>
    </TVSControlPopup>
  );
  const modalAddNew = (
    <TVSControlPopup
      maxHeight={450}
      minHeight={450}
      title={"Thêm mới"}
      isShow={modalVisibleAddNew}
      onHide={() => {
        getDataMain(route_pk);
        setModalVisibleAddNew(false);
      }}
      bottom={
        <TVSButton
          type={"primary"}
          icon={"content-save"}
          buttonStyle={"3"}
          onPress={() => OnConfirm("INSERT")}
        >
          Sao lưu
        </TVSButton>
      }
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginBottom: 10,
          }}
        >
          <Text style={{ color: Color.mainColor }}>Loại chi phí</Text>
          <Block>
            <SelectCostType
              onChangeSelectedCostType={onChangeSelectedCostType}
              currentSelectedCostType={currentSelectedCostType}
            />
          </Block>
        </View>
        <View
          style={{
            marginBottom: 10,
          }}
        >
          <Text style={{ color: Color.mainColor }}>Số tiền</Text>
          <View style={{ marginTop: 5 }}>
            <TextInput
              style={{
                width: "100%",
                backgroundColor: Color.gray,
                padding: Platform.OS == "android" ? 5 : 10,
                borderRadius: 8,
              }}
              value={amount.toString()}
              placeholder="0"
              onChangeText={(num) => setAmount(num)}
              keyboardType={"numeric"}
              returnKeyType="done"
            />
          </View>
        </View>

        <View>
          <Block
            style={{
              marginBottom: 10,
            }}
          >
            <Block style={{}}>
              <Text style={{ color: Color.mainColor }}>Ghi chú</Text>
            </Block>
            <Block
              style={{
                backgroundColor: Color.gray,
                paddingHorizontal: 5,
                paddingVertical: Platform.OS == "ios" ? 18 : 0,
                borderRadius: 6,
                // minHeight: multiLine ? 70 : null,
              }}
            >
              <TextInput
                value={description.toString()}
                placeholder={"Nhập ghi chú"}
                multiline={true}
                onChangeText={(text) => setDescripton(text)}
              />
            </Block>
          </Block>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Block style={{}}>
            <Text style={{ color: Color.mainColor }}>Hình ảnh</Text>
          </Block>
          <View>
            <TouchableOpacity
              onPress={() => OnChangeImage()}
              style={{ alignItems: "center" }}
            >
              <Image
                style={{
                  width: 120,
                  height: 160,
                  resizeMode: "contain",
                  borderWidth: 1,
                  borderColor: Color.grayPlahoder,
                }}
                source={{ uri: image }}
              />
            </TouchableOpacity>
          </View>
        </View>
        {showApprove == "Y" && (
          <View>
            <TVSFieldSet label={"Thông tin phê duyệt"}>
              <View style={{ marginLeft: 5 }}>
                <Text>{approveName}</Text>
              </View>
              <View style={{ marginLeft: 5, marginTop: 5 }}>
                <Text>{approveDescription}</Text>
              </View>
            </TVSFieldSet>
          </View>
        )}
      </ScrollView>
    </TVSControlPopup>
  );
  const OnChangeImage = async (type) => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Thông báo",
            message: "Xin hãy cấp quyền truy cập camera cho ứng dụng.",
            // buttonNegative: "Hủy bỏ",
            buttonPositive: "Xác nhận",
          }
        );
        console.log("granted ", granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            "Thông báo",
            "Hình ảnh được dùng lưu vào hệ thống",
            [
              {
                text: "Hủy bỏ",
              },
              {
                text: "Chọn ảnh từ thư viện",
                onPress: () => {
                  OnTakeImage("library");
                },
              },
              {
                text: "Chụp ảnh",
                onPress: () => {
                  OnTakeImage("camera");
                },
              },
            ],
            { cancelable: true }
          );
        } else {
          Alert.alert(
            "Thông báo",
            "Xin hãy cấp quyền truy cập camera cho ứng dụng.",
            [{ text: "Đóng" }]
          );
        }
      } else {
        Alert.alert(
          "Thông báo",
          "Hình ảnh được dùng để lưu vào hệ thống",
          [
            {
              text: "Chụp ảnh",
              onPress: () => {
                OnTakeImage("camera");
              },
            },
            {
              text: "Chọn ảnh từ thư viện",
              onPress: () => {
                OnTakeImage("library");
              },
            },
            {
              text: "Hủy bỏ",
            },
          ],
          { cancelable: true }
        );
      }
    } catch (err) {
      console.warn(err);
    }

    // try {
    //   if (Platform.OS === "android") {
    //     const granted = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.CAMERA,
    //       {
    //         title: "Thông báo",
    //         message: "Xin hãy cấp quyền truy cập camera cho ứng dụng.",
    //         buttonNegative: "Hủy bỏ",
    //         buttonPositive: "Xác nhận",
    //       }
    //     );
    //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //       OnTakeImage(type);
    //     } else {
    //       Alert.alert(
    //         "Thông báo",
    //         "Xin hãy cấp quyền truy cập camera cho ứng dụng.",
    //         [{ text: "Đóng" }]
    //       );
    //     }
    //   } else {
    //     request(PERMISSIONS.IOS.CAMERA).then((result) => {
    //       if (result === "granted") {
    //         OnTakeImage(type);
    //       } else if (result === "blocked") {
    //         Alert.alert(
    //           "Thông báo",
    //           "Xin hãy cấp quyền truy cập camera cho ứng dụng.",
    //           [{ text: "Đóng" }]
    //         );
    //       }
    //     });
    //   }
    // } catch (err) {
    //   console.warn(err);
    // }
  };
  const OptionsImage = {
    maxWidth: 450,
    maxHeight: 600,
    quality: 1,
    cameraType: "back",
    // cameraType: "front",
    includeBase64: true,
    mediaType: "photo",
    presentationStyle: "fullScreen",
  };
  const OnTakeImage = (type) => {
    if (type == "camera") {
      launchCamera(OptionsImage, (res) => {
        if (res.errorCode == "camera_unavailable") {
          ShowError("camera_unavailable");
        } else if (!res.didCancel) {
          dispatch(ShowGlobalLoading);
          setImage("data:image/png;base64," + res.assets[0].base64);
          dispatch(HideGlobalLoading);
        }
      });
    } else if (type == "library") {
      launchImageLibrary(OptionsImage, (res) => {
        console.log(res);
        if (res.errorCode == "camera_unavailable") {
          ShowError("camera_unavailable");
        } else if (!res.didCancel) {
          dispatch(ShowGlobalLoading);
          setImage("data:image/png;base64," + res.assets[0].base64);
          dispatch(HideGlobalLoading);
        }
      });
    }
  };
  const OnConfirm = (type) => {
    Alert.alert(
      "Thông báo",
      type == "DELETE" ? "Bạn có muốn xóa bỏ?" : "Bạn có muốn sao lưu?",
      [
        {
          text: "Hủy bỏ",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: () => (type == "DELETE" ? OnDelete() : OnSave(type)),
        },
      ],
      { cancelable: false }
    );
  };
  const OnSave = (type) => {
    console.log(currentSelectedCostType);
    const pro = "UPDHRBS001002";
    const in_par = {
      p1_varchar2: type,
      p2_varchar2: itemPK,
      p3_varchar2: route_pk,
      p4_varchar2: currentSelectedCostType.code,
      p5_varchar2: amount,
      p6_varchar2: description,
      p7_varchar2:
        image == defaultAvatar
          ? ""
          : image.replace("data:image/png;base64,", ""),
      p8_varchar2: APP_VERSION,
      p9_varchar2: crt_by,
    };
    const out_par = {
      // p1_varchar2: "rtn_value",
    };
    console.log(in_par);
    sysFetch2(
      API,
      {
        pro,
        in_par,
        out_par,
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);

        if (rs.result == "F") {
          showAlert(rs.content);
        } else {
          showAlert("Thành công");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const OnDelete = () => {
    console.log(currentSelectedCostType);
    const pro = "UPDHRBS001002";
    const in_par = {
      p1_varchar2: "DELETE",
      p2_varchar2: itemPK,
      p3_varchar2: "",
      p4_varchar2: "",
      p5_varchar2: "",
      p6_varchar2: "",
      p7_varchar2: "",
      p8_varchar2: APP_VERSION,
      p9_varchar2: crt_by,
    };
    const out_par = {
      // p1_varchar2: "rtn_value",
    };
    console.log(in_par);
    sysFetch2(
      API,
      {
        pro,
        in_par,
        out_par,
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);

        if (rs.result == "F") {
          showAlert(rs.content);
        } else {
          showAlert("Xóa bỏ thành công");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const ItemMain = ({ item }) => {
    return (
      <View
        style={{
          paddingTop: 5,
          //   paddingBottom: 10,
          // flex: 1,
        }}
      >
        <View style={{ marginBottom: 10, flexDirection: "row" }}>
          <Block
            backgroundColor={Color.white}
            borderTopLeftRadius={8}
            borderBottomLeftRadius={8}
            borderColor={Color.oneContentBorder}
            borderWidth={1}
            padding={5}
            flex={1}
          >
            <Block
              row
              paddingLeft={5}
              paddingRight={5}
              paddingTop={10}
              paddingBottom={10}
              justifyContent={"space-between"}
            >
              <Text style={{}} flex={0}>
                {item.cost_code_nm}
              </Text>
              <Text style={{}} flex={0}>
                {item.amount_cv}
              </Text>
            </Block>
          </Block>
          <TouchableOpacity
            onPress={() => {
              OnEdit({ item });
            }}
            style={{
              backgroundColor: "#498DE3",
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
              borderBottomRightRadius: 8,
              borderTopRightRadius: 8,
            }}
          >
            <Icon name={"pencil"} size={20} color={"white"} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const OnEdit = ({ item }) => {
    onChangeSelectedCostType({
      code: item.cost_code,
      code_nm: item.cost_code_nm,
    });
    setItemPK(item.pk);
    setAmount(item.amount);
    setDescripton(item.description);
    setShowApprove(item.show_approve);
    setApproveName(item.approved_by);
    setApproveDescription(item.approve_note);
    if (item.file_image == "") {
      setImage(defaultAvatar);
    } else {
      setImage("data:image/png;base64," + item.file_image);
    }

    console.log("edit ", item);
    setModalVisibleEdit(true);
  };

  const OnAddNew = () => {
    console.log("open ");
    onChangeSelectedCostType({
      code: "",
      code_nm: "Chọn loại chi phí",
    });
    setItemPK("");
    setAmount("");
    setDescripton("");
    setShowApprove("N");
    setApproveName("");
    setApproveDescription("");
    setImage(defaultAvatar);

    console.log("add ");
    setModalVisibleAddNew(true);
  };

  return (
    <Block flex>
      <View
        style={{
          paddingHorizontal: 10,
          marginTop: 10,
          alignItems: "flex-end",
        }}
      >
        <Text>Số lượng: {countEmp}</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: 10,
          marginBottom: 20,
          flex: 1,
        }}
      >
        {dataMain.length > 0 && (
          <View
            style={{
              paddingTop: 5,
              paddingBottom: 10,
              // flex: 1,
            }}
          >
            {dataMain.map((x) => (
              <ItemMain item={x} />
            ))}
          </View>
        )}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
          marginHorizontal: 10,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          paddingBottom: 10,
        }}
      >
        <TVSButton
          onPress={() => {
            OnAddNew();
          }}
          buttonStyle={"3"}
          type={"primary"}
          icon={"plus"}
          minWidth={150}
        >
          Thêm mới
        </TVSButton>
      </View>
      {/* <TouchableOpacity
        // style={{ zIndex: 999 }}
        onPress={() => {
          console.log("press");
          // setModalTitle("Thêm mới");
          // setModalType("INSERT");
          OnAddNew();
        }}
      >
        <LinearGradient
          colors={["#498DE3", "#25399F"]}
          style={{
            backgroundColor: "red",
            position: "absolute",
            bottom: 30,
            right: 30,
            borderRadius: 50,
            padding: 10,
          }}
        >
          {isLoading ? (
            <View style={{ padding: 5 }}>
              <ActivityIndicator color="white" />
            </View>
          ) : (
            <Icon name={"cash-plus"} size={30} color={"white"} />
          )}
        </LinearGradient>
      </TouchableOpacity> */}
      {modalAddNew}
      {modalEdit}
    </Block>
  );
};

export default ChiPhi;

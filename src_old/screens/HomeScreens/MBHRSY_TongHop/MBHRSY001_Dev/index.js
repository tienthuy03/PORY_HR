import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  View,
  Switch,
  Image,
  PermissionsAndroid,
  Dimensions,
  Linking,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import TVSHeader from "../../../../components/Tvs/Header";
import { setHeaderChil2 } from "../../../../Language";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import sysFetch from "../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../config/Pro";

//Control date
import TVSDateTime from "../../../../components/Tvs/TVSDateTime";
import moment from "moment";
//Control select list
import TVSButton from "../../../../components/Tvs/Button";
import TVSList2 from "../../../../components/Tvs/TVSList2";
//Control tab
import TVSTab from "../../../../components/Tvs/Tab";
//Control image
import { default as Icon } from "react-native-vector-icons/MaterialCommunityIcons";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ShowError from "../../../../services/errors";
import TVSTextInput from "../../../../components/Tvs/TVSTextInput";
//
import TVSControlPopupBottom from "../../../../components/Tvs/PopupBottom";
//Control List approver
import TVSListApprover from "../../../../components/Tvs/TVSListApprover";

import TVSFieldSet from "../../../../components/Tvs/TVSFieldSet";
import TVSPDF from "../../../../components/Tvs/TVSPDF";
import TVSCheckBox from "../../../../components/Tvs/TVSCheckBox";
import TVSListExpand from "../../../../components/Tvs/TVSListExpand";

import TVSSignature from "../../../../components/Tvs/TVSSignature";

import TVSModal from "../../../../components/Tvs/ControlPopupBottom";

import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";

const TongHop = ({ navigation: { goBack } }) => {
  const [orientation, setOrientation] = useState("UNKNOW");
  const isPortrait = () => {
    const dim = Dimensions.get("screen");
    return dim.height >= dim.width;
  };
  const isLandscape = () => {
    const dim = Dimensions.get("screen");
    return dim.width >= dim.height;
  };
  Dimensions.addEventListener("change", () => {
    checkOrientation();
  });
  const checkOrientation = () => {
    if (isPortrait()) {
      setOrientation("PORTRAIT");
    } else if (isLandscape()) {
      setOrientation("LANDSCAPE");
    } else {
      setOrientation("UNKNOW");
    }
  };
  useEffect(() => {
    checkOrientation();
  }, []);
  const ref_input = useRef();
  const ref_input2 = useRef();
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const dispatch = useDispatch();
  // URL API
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  // Theme Color
  const Color = useSelector((s) => s.SystemReducer.theme);
  // Reducers info login
  const loginReducers = useSelector((state) => state.loginReducers);
  // Reducers menu
  const menuReducer = useSelector((state) => state.menuReducer);

  let thr_emp_pk = "";
  let token = "";
  let fullname = "";
  let crt_by = "";
  try {
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    crt_by = loginReducers.data.data.crt_by;
    token = loginReducers.data.data.tokenLogin;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {
    //
  }

  //Start control date
  const [date, setDate] = useState("dd/mm/yyyy");
  const onChangeDate = (val) => {
    setDate(moment(val).format("DD/MM/YYYY"));
  };
  //End control date

  //Start control date
  // * From date
  const [fromDate, setFromDate] = useState("dd/mm/yyyy");
  const onChangeFromDate = (val) => {
    setFromDate(moment(val).format("DD/MM/YYYY"));
  };
  // * To date
  const [toDate, setToDate] = useState("dd/mm/yyyy");
  const onChangeToDate = (val) => {
    setToDate(moment(val).format("DD/MM/YYYY"));
  };
  //End control date

  //Start control switch
  const [switchValue, setSwitchValue] = useState(false);
  const toggleSwitch = (value) => {
    setSwitchValue(value);
  };
  //End control switch

  //Start control time
  const [time, setTime] = useState("hh:mm");
  const onChangeTime = (val) => {
    setTime(moment(val).format("HH:mm"));
  };

  //End control time

  //Start multi control time
  // from time
  const [fromTime, setFromTime] = useState("hh:mm");
  const onChangeFromTime = (val) => {
    setFromTime(moment(val).format("HH:mm"));
  };
  // to time
  const [toTime, setToTime] = useState("hh:mm");
  const onChangeToTime = (val) => {
    setToTime(moment(val).format("HH:mm"));
  };
  //End multi control time

  //start control datetime
  const [time2, setTime2] = useState("hh:mm");
  const [date2, setDate2] = useState("dd/mm/yyyy");
  const onChangeTime2 = (val) => {
    setTime2(moment(val).format("HH:mm"));
  };
  const onChangeDate2 = (val) => {
    setDate2(moment(val).format("DD/MM/YYYY"));
  };
  //end control datetime

  //Start control select list
  const [dataSelect, setDataSelect] = useState([
    { code: 1, code_nm: "data 1" },
    { code: 2, code_nm: "item 2" },
  ]);
  const [selectName, setSelectName] = useState("Chọn xe tuyến");
  const [selectPK, setSelectPK] = useState("");
  const onChangeSelect = (result) => {
    setSelectName(result.code_nm);
    setSelectPK(result.code);
  };

  //End control select list

  // start control text area
  const [textArea, setTextArea] = useState("");
  // end control text area

  //start control add image
  const [image, setImage] = useState("");
  const OptionsImage = {
    maxWidth: 450,
    maxHeight: 600,
    quality: 1,
    cameraType: "back",
    includeBase64: true,
    mediaType: "photo",
    presentationStyle: "fullScreen",
  };
  const onChangeImage = () => {
    try {
      if (Platform.OS === "android") {
        const granted = PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Thông báo",
            message: "Xin hãy cấp quyền truy cập camera cho ứng dụng.",
            buttonNegative: "Hủy bỏ",
            buttonPositive: "Xác nhận",
          }
        );
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
                  onTakePhoto("library");
                },
              },
              {
                text: "Chụp ảnh",
                onPress: () => {
                  onTakePhoto("camera");
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
          "Hình ảnh được dùng lưu vào hệ thống",
          [
            {
              text: "Chụp ảnh",
              onPress: () => {
                onTakePhoto("camera");
              },
            },
            {
              text: "Chọn ảnh từ thư viện",
              onPress: () => {
                onTakePhoto("library");
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
  };
  const onTakePhoto = (type) => {
    if (type == "camera") {
      launchCamera(OptionsImage, (res) => {
        if (res.errorCode == "camera_unavailable") {
          ShowError("camera_unavailable");
        } else if (!res.didCancel) {
          setImage(res.assets[0].base64);
        }
      });
    } else if (type == "library") {
      launchImageLibrary(OptionsImage, (res) => {
        console.log(res);
        if (res.errorCode == "camera_unavailable") {
          ShowError("camera_unavailable");
        } else if (!res.didCancel) {
          setImage(res.assets[0].base64);
        }
      });
    }
  };
  //end control add image

  const _openAppSetting = useCallback(async () => {
    // Open the custom settings if the app has one
    // await Linking.openSettings();
    await Linking.openURL("App-Prefs:Bluetooth");
  }, []);
  const [modalPDFVisible, setModalPDFVisible] = useState(false);
  const onHidePDF = () => {
    setModalPDFVisible(false);
  };

  const [valueChk, setValueChk] = useState("N");
  const onCheck = () => {
    console.log("valueChk ", valueChk);
    setValueChk(valueChk == "Y" ? "N" : "Y");
  };

  const onCallBack = (signature) => {
    console.log("test", signature);
  };

  const { Popover } = renderers;
  const [isShow, setIsShow] = useState(false);
  return (
    <Block flex backgroundColor={Color.gray}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          loginReducers.data.data.user_language,
          menuReducer.data.data.menu,
          "MBHRSY001",
          menuReducer.data.data.menu.filter((x) => x.menu_cd === "MBHRSY001")[0]
            .p_pk
        )}
      </TVSHeader>
      <Block flex backgroundColor={Color.gray}>
        <ScrollView style={{ marginBottom: 20 }}>
          <View style={{ marginTop: 20, marginHorizontal: 10 }}>
            <TVSButton
              type={"primary"}
              icon={"content-save"}
              buttonStyle={"3"}
              onPress={() => setIsShow(true)}
            >
              Open modal
            </TVSButton>
            <TVSModal
              title={"Tìm kiếm nâng cao"}
              isShow={isShow}
              onHide={() => {
                setIsShow(false);
              }}
              bottom={
                <View>
                  <TVSButton
                    type={"danger"}
                    icon={"close"}
                    buttonStyle={"3"}
                    onPress={() => setIsShow(false)}
                  >
                    Đóng lại
                  </TVSButton>
                </View>
              }
            />
          </View>
          {/* <TVSControlPopupBottom
            isShow={false}
            title={"Filter"}
            onSwipeComplete={() => setIsShow(false)}
          >
            <Text>abcd</Text>
          </TVSControlPopupBottom> 
          
            <TVSDateTime
              mode={"date"}
              label={"Ngày"}
              value={date}
              required={true}
              onChangeDateTime={(val) => onChangeDate(val)}
            />
            <View
              style={{
                borderBottomWidth: 0.5,
                borderBottomColor: Color.mainColor,
              }}
            ></View>
            <TVSDateTime
              multiDateTime={true}
              mode={"date"}
              required={true}
              label={"Từ ngày"}
              value={fromDate}
              onChangeDateTime={(val) => onChangeFromDate(val)}
              label2={"Đến ngày"}
              value2={toDate}
              onChangeDateTime2={(val) => onChangeToDate(val)}
            />
            <View
              style={{
                borderBottomWidth: 0.5,
                borderBottomColor: Color.mainColor,
              }}
            ></View>
            <View
              style={{
                marginVertical: 10,
              }}
            >
              <Switch
                style={{ marginRight: 10 }}
                onValueChange={toggleSwitch}
                value={switchValue}
              />
            </View>
            <View
              style={{
                borderBottomWidth: 0.5,
                borderBottomColor: Color.mainColor,
              }}
            ></View>
            <TVSDateTime
              mode={"time"}
              label={"Giờ"}
              value={time}
              required={true}
              onChangeDateTime={(val) => onChangeTime(val)}
            />
            <View
              style={{
                borderBottomWidth: 0.5,
                borderBottomColor: Color.mainColor,
              }}
            ></View>
            <TVSDateTime
              multiDateTime={true}
              mode={"time"}
              required={true}
              label={"Từ giờ"}
              value={fromTime}
              onChangeDateTime={(val) => onChangeFromTime(val)}
              label2={"Đến giờ"}
              value2={toTime}
              onChangeDateTime2={(val) => onChangeToTime(val)}
            />
            <View
              style={{
                borderBottomWidth: 0.5,
                borderBottomColor: Color.mainColor,
              }}
            ></View>
            <TVSDateTime
              mode={"datetime"}
              required={true}
              label={"Từ thời gian"}
              value={time2}
              onChangeDateTime={(val) => onChangeTime2(val)}
              value2={date2}
              onChangeDateTime2={(val) => onChangeDate2(val)}
            />
            <View
              style={{
                borderBottomWidth: 0.5,
                borderBottomColor: Color.mainColor,
              }}
            ></View>
            <TVSList2
              required={true}
              label={"Tiêu đề"}
              dataItem={dataSelect}
              code={selectPK}
              code_nm={selectName}
              onChangeSelect={(val) => onChangeSelect(val)}
            />
            <View
              style={{
                borderBottomWidth: 0.5,
                borderBottomColor: Color.mainColor,
              }}
            ></View>
            <View style={{ marginVertical: 10 }}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <TVSButton
                    type={"primary"}
                    icon={"content-save"}
                    buttonStyle={"3"}
                    onPress={() => console.log("primary ", date)}
                  >
                    primary
                  </TVSButton>
                </View>
                <View style={{ flex: 1 }}>
                  <TVSButton
                    type={"danger"}
                    icon={"close"}
                    buttonStyle={"3"}
                    onPress={() => console.log("danger ", fromDate)}
                  >
                    danger
                  </TVSButton>
                </View>
              </View>
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <View style={{ flex: 1 }}>
                  <TVSButton
                    type={"secondary"}
                    icon={"sync"}
                    buttonStyle={"3"}
                    onPress={() => console.log("secondary ", toDate)}
                  >
                    secondary
                  </TVSButton>
                </View>
                <View style={{ flex: 1 }}>
                  <TVSButton
                    type={"success"}
                    icon={"check"}
                    buttonStyle={"3"}
                    onPress={() => setModalPDFVisible(true)}
                  >
                    success
                  </TVSButton>
                </View>
              </View>
            </View>
            <View
              style={{
                borderBottomWidth: 0.5,
                borderBottomColor: Color.mainColor,
              }}
            ></View>

            <TVSTextInput
              required={true}
              label={"Ghi chú"}
              placeholder={"Nhập ghi chú"}
              value={textArea}
              changeValue={setTextArea}
              multiLine={true}
            />
            <View
              style={{
                borderBottomWidth: 0.5,
                borderBottomColor: Color.mainColor,
              }}
            ></View>
            <View style={{ marginVertical: 10 }}>
              <TVSTab
                fullTab
                scrollEnabled={false}
                data={[
                  {
                    id: 0,
                    name: "Tab 1",
                    count: null,
                    screen: <Text>Tab 1</Text>,
                  },
                  {
                    id: 1,
                    name: "Tab 2",
                    count: null,
                    screen: <Text>Tab 2</Text>,
                  },
                  {
                    id: 2,
                    name: "Tab 3",
                    count: null,
                    screen: <Text>Tab 3</Text>,
                  },
                ]}
              />
            </View>
            <View
              style={{
                borderBottomWidth: 0.5,
                borderBottomColor: Color.mainColor,
              }}
            ></View>
            <TouchableOpacity
              style={{ flex: 1, marginVertical: 10 }}
              onPress={() => onChangeImage()}
            >
              <>
                {image != "" ? (
                  <View
                    style={{
                      marginHorizontal: 5,
                      marginBottom: 5,
                      borderRadius: 6,
                      borderColor: "lightgray",
                      borderWidth: 2,
                      height: 120,
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setImage("");
                      }}
                      style={{
                        alignItems: "flex-end",
                        marginVertical: 5,
                        marginRight: 5,
                      }}
                    >
                      <Icon size={15} color={"gray"} name={"close"} />
                    </TouchableOpacity>
                    <View
                      style={{
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{
                          width: 80,
                          height: 90,
                          resizeMode: "stretch",
                        }}
                        source={{
                          uri: "data:image/png;base64," + image,
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      marginHorizontal: 5,
                      marginBottom: 5,
                      borderRadius: 6,
                      borderColor: "lightgray",
                      borderWidth: 2,
                      borderStyle: "dashed",
                      height: 120,
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 6,
                        flexDirection: "row",
                        backgroundColor: Color.tabColor,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          marginLeft: 5,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Icon size={15} color={"lightgray"} name={"plus"} />
                        <View>
                          <Text style={{ color: "lightgray" }}>Thêm mới</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </>
            </TouchableOpacity>
            <View
              style={{
                borderBottomWidth: 0.5,
                borderBottomColor: Color.mainColor,
              }}
            ></View>
            <TVSListApprover
              label={"Danh sách phê duyệt"}
              data={[
                {
                  thr_emp_pk: 92,
                  approve_role_type: 6,
                  level_name: "abc",
                  approve_name: "abc abc",
                  full_name: "abcd",
                  approve_level: 1,
                },
                {
                  thr_emp_pk: 92,
                  approve_role_type: 6,
                  level_name: "abc",
                  approve_name: "abc abc",
                  full_name: "abcd",
                  approve_level: 1,
                },
                {
                  thr_emp_pk: 92,
                  approve_role_type: 6,
                  level_name: "abc",
                  approve_name: "abc abc 123",
                  full_name: "abcd",
                  approve_level: 1,
                },
              ]}
              icon={"account-check-outline"}
            />
            <TVSFieldSet hasIcon={true} icon={"home"}>
              <View>
                <Text>abc</Text>
              </View>
            </TVSFieldSet>
            <TVSPDF
              title={"tieu de"}
              isShow={modalPDFVisible}
              onHide={() => onHidePDF()}
              dataPDF={""}
            ></TVSPDF>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <TVSCheckBox value={valueChk} onPress={() => onCheck()} />
              </View>
            </View>
            <TVSListExpand label={"abc"} colorLabel={"red"}>
              <View>
                <Text>abc</Text>
              </View>
            </TVSListExpand>

            <TVSSignature onCallBack={(item) => onCallBack(item)} />
            <MenuProvider>
              <View>
                <Menu placement={"bottom"}>
                  <MenuTrigger text="Select action" />
                  <MenuOptions>
                    <MenuOption onSelect={() => alert(`Save`)} text="Save" />
                    <MenuOption onSelect={() => alert(`Delete`)}>
                      <Text style={{ color: "red" }}>Delete</Text>
                    </MenuOption>
                    <MenuOption
                      onSelect={() => alert(`Not called`)}
                      disabled={true}
                      text="Disabled"
                    />
                  </MenuOptions>
                </Menu>
              </View>
            </MenuProvider>
          </View> */}
        </ScrollView>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backdrop: {},
  menuOptions: {
    padding: 50,
  },
  menuTrigger: {
    padding: 5,
  },
  triggerText: {
    fontSize: 20,
  },
  contentText: {
    fontSize: 18,
  },
});
export default TongHop;

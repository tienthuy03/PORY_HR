import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import moment from "moment";
import axios from "axios";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";
import { useDispatch, useSelector } from "react-redux";
import sysFetch from "../../../../services/fetch_v1";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import TVSControlPopupRegisterFace from "./Popup_DangKyKhuonMat";
// import TVSControlPopupRegisterFace from "./Popup_DangKyKhuonMat";
// import TVSControlPopupMachine from "./Popup_ChonMayChamCong";

import IconDate from "../../../../icons/Datev";
import TVSButton from "../../../../components/Tvs/Button";
import TVSSelect from "../../../../components/Tvs/Select";
import TVSControlPopup from "../../../../components/Tvs/ControlPopup";
import Button from "../../../../components/Button";
import Block from "../../../../components/Block";
import Text from "../../../../components/Text";
import TVSHeader from "../../../../components/Tvs/Header";

import { APP_VERSION } from "../../../../config/Pro";
import { setHeaderChil2 } from "../../../../Language";

import ModalFilter from "./ModalFilter.js";
import TVSControlPopupMachine from "./Popup_ChonMayChamCong";

const DangKyChamCongMita = ({ navigation: { goBack } }) => {
  const [noneAvatar, setNoneAvatar] = useState(
    "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"
  );
  const dispatch = useDispatch();
  const { width, height } = Dimensions.get("screen");
  const Color = useSelector((s) => s.SystemReducer.theme);
  const API = useSelector((state) => state.SysConfigReducer.API_URL);

  const menu = useSelector((state) => state.menuReducer.data.data.menu);

  const loginReducers = useSelector((state) => state.loginReducers);
  const menuReducer = useSelector((state) => state.menuReducer);

  const currentLangue = useSelector(
    (state) => loginReducers.data.data.user_language
  );
  const employee_pk = useSelector(
    (state) => loginReducers.data.data.thr_emp_pk
  );
  let tokenLogin = useSelector((state) => loginReducers.data.data.tokenLogin);
  let tes_user_pk = useSelector((state) => loginReducers.data.data.tes_user_pk);
  let crt_by = useSelector((state) => loginReducers.data.data.crt_by);
  let refreshToken = useSelector(
    (state) => loginReducers.data.data.refreshToken
  );

  const styles = StyleSheet.create({
    CheckBoxE_1: {
      width: 20,
      height: 20,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.primaryButton2,
      backgroundColor: Color.primaryButton2,
      justifyContent: "center",
      alignItems: "center",
    },
    CheckBoxD_1: {
      width: 20,
      height: 20,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.mainColor,
    },
  });

  const [empSearch, setEmpSearch] = useState("");
  const [isFilter, setIsFilter] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataOrg, setDataOrg] = useState([]);
  const [dataPos, setDataPos] = useState([]);
  const [dataStatus, setDataStatus] = useState([]);
  const [dataType, setDataType] = useState([]);
  const [dataDate, setDataDate] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataEmployee, setDataEmployee] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isListEnd, setIsListEnd] = useState(false);
  const [typeSelect, setTypeSelect] = useState(0);
  const [type, setType] = useState("");
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");
  const [p4, setP4] = useState("");
  const [p5, setP5] = useState("");
  const [p6, setP6] = useState("");
  const [p7, setP7] = useState("");
  const [modalOneItemVisible, setModalOneItemVisible] = useState(false);
  const [modalMachineVisible, setModalMachineVisible] = useState(false);
  const [dataOneItem, setDataOneItem] = useState([]);

  const onCallBack = (data) => {
    console.log("call back ", data);
    if (data.isFilter) {
      console.log("search");
      setDataEmployee([]);
      setP1(data.org);
      setP2(data.pos);
      setP3(data.status);
      setP4(data.type);
      setP5(data.dayType);
      setP6(data.fromDt);
      setP7(data.toDt);
      setTypeSelect(1);
      if (data.isClear) {
        setIsFilter(false);
      } else {
        setIsFilter(true);
      }
      onResetForSearch(
        1,
        data.org,
        data.pos,
        data.status,
        data.type,
        data.dayType,
        data.fromDt,
        data.toDt
      );
    } else {
      console.log("close");
    }
    setModalVisible(!modalVisible);
  };
  useEffect(() => {
    GetListData();
  }, []);
  const GetListData = () => {
    console.log("GetListData");
    const pro = "SELHRTI007000";
    const in_par = {
      p1_varchar2: tes_user_pk,
      p2_varchar2: APP_VERSION,
      p3_varchar2: crt_by,
    };
    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_sys: "org",
          p2_sys: "pos",
          p3_sys: "status",
          p4_sys: "type",
          p5_sys: "date",
        },
      },
      tokenLogin
    ).then((rs) => {
      //   console.log(rs);
      if (rs == "Token Expired") {
        // refreshNewToken("list", null);
      }
      if (rs != "Token Expired") {
        if (rs.results === "S") {
          setDataOrg(rs.data.org);
          setDataPos(rs.data.pos);

          setDataStatus(rs.data.status);

          setDataType(rs.data.type);
          setDataDate(rs.data.date);
        }
      }
    });
  };
  const renderFooter = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator />
      </View>
    ) : null;
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
  const ItemView = ({ item }) => {
    return (
      <View style={{ flexDirection: "row", marginHorizontal: 5 }}>
        <View
          style={{
            marginLeft: 5,
            marginRight: 5,
            marginBottom: 5,
            marginTop: 5,
            flexDirection: "row",
            backgroundColor: Color.white,
            borderRadius: 5,
            flex: 1,
          }}
        >
          <TouchableOpacity
            style={{ flex: 10 }}
            onPress={() => onRegisterFace(item.pk)}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: 75,
                  height: 90,
                }}
              >
                <Image
                  style={{
                    resizeMode: "stretch",
                    width: "100%",
                    height: "100%",
                  }}
                  source={{
                    uri:
                      item.image.length === 0
                        ? "data:image/png;base64, " + noneAvatar
                        : "data:image/png;base64, " + item.image,
                  }}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: Color.mainColor,
                    marginBottom: 5,
                  }}
                >
                  <MaterialCommunityIcons name={"account"} size={18} />
                  {"   "}
                  {item.full_name}
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyItems: "center",
                    alignContent: "center",
                    justifyContent: "space-between",
                    marginBottom: 5,
                    fontSize: 12,
                  }}
                >
                  <Text>
                    <MaterialCommunityIcons
                      name={"card-account-details"}
                      size={18}
                      color={Color.mainColor}
                    />
                    {"   "}
                    {item.emp_id}
                  </Text>
                  <Text style={{ color: item.status_color }}>
                    {item.status}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                  }}
                >
                  <MaterialCommunityIcons
                    name={"barcode"}
                    size={18}
                    color={Color.mainColor}
                  />
                  {"   "}
                  {item.id_num}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View
            flex={1}
            style={{
              alignSelf: "center",
              alignItems: "center",
              marginRight: 5,
            }}
          >
            <Button
              nextScreen={() => {
                onCheck(item);
              }}
              row
              alignCenter
            >
              <View
                style={
                  item.sel_yn == "Y" ? styles.CheckBoxE_1 : styles.CheckBoxD_1
                }
              >
                {item.sel_yn == "Y" ? (
                  <Icon name={"check"} color={Color.mainColor} size={15} />
                ) : null}
              </View>
            </Button>
          </View>
        </View>
      </View>
    );
  };
  const onCheck = (item) => {
    let newArr = [...dataEmployee];
    let flag = item.sel_yn == "Y" ? "N" : "Y";
    newArr.forEach(function (dataItem) {
      if (dataItem.pk == item.pk) {
        dataItem.sel_yn = flag;
      }
    });
    setDataEmployee(newArr);
  };
  const onRequestToServer = (
    type,
    offsets,
    p_tco_org_pk,
    p_position,
    p_status,
    p_img,
    p_select_type,
    p_from_dt,
    p_to_dt,
    isLoad,
    isEnd
  ) => {
    let TempDsNhanvien;
    if (offsets == 0) {
      TempDsNhanvien = [];
      setDataEmployee([]);
      setOffset(0);
    } else {
      TempDsNhanvien = [...dataEmployee];
    }
    try {
      if (!isLoad && !isEnd) {
        setIsLoading(true);
        if (type == 0) {
          console.log("search type 1");
          const pro = "SELHRTI007001";
          const in_par = {
            p1_varchar2: empSearch,
            p2_varchar2: p_tco_org_pk == "" ? "ALL" : p_tco_org_pk,
            p3_varchar2: p_position == "" ? "ALL" : p_position,
            p4_varchar2: p_status == "" ? "ALL" : p_status,
            p5_varchar2: p_img == "" ? "ALL" : p_img,
            p6_varchar2: p_select_type == "" ? "ALL" : p_select_type,
            p7_varchar2:
              p_select_type == "ALL"
                ? ""
                : p_select_type == ""
                ? ""
                : p_from_dt == "dd/mm/yyyy"
                ? ""
                : p_from_dt,
            p8_varchar2:
              p_select_type == "ALL"
                ? ""
                : p_select_type == ""
                ? ""
                : p_to_dt == "dd/mm/yyyy"
                ? ""
                : p_to_dt,
            p9_varchar2: offsets,
            p10_varchar2: APP_VERSION,
            p11_varchar2: crt_by,
          };

          //   console.log(pro, in_par);

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
          )
            .then((rs) => {
              if (rs == "Token Expired") {
                // refreshNewToken("grid", 0);
              }
              if (rs != "Token Expired") {
                if (rs.totalRow > 0) {
                  setOffset(offsets + 1);
                  setDataEmployee([...TempDsNhanvien, ...rs.data.data]);
                  setIsLoading(false);
                  setIsListEnd(false);
                } else {
                  setIsListEnd(true);
                  setIsLoading(false);
                }
              }
            })
            .catch((error) => {
              console.error("error form");
              console.error(error);
            });
        } else if (type == 1) {
          console.log("search type 2");
          const pro = "SELHRTI007001";

          const in_par = {
            p1_varchar2: empSearch,
            p2_varchar2: p_tco_org_pk == "" ? "ALL" : p_tco_org_pk,
            p3_varchar2: p_position == "" ? "ALL" : p_position,
            p4_varchar2: p_status == "" ? "ALL" : p_status,
            p5_varchar2: p_img == "" ? "ALL" : p_img,
            p6_varchar2: p_select_type == "" ? "ALL" : p_select_type,
            p7_varchar2:
              p_select_type == "ALL"
                ? ""
                : p_select_type == ""
                ? ""
                : p_from_dt == "dd/mm/yyyy"
                ? ""
                : p_from_dt,
            p8_varchar2:
              p_select_type == "ALL"
                ? ""
                : p_select_type == ""
                ? ""
                : p_to_dt == "dd/mm/yyyy"
                ? ""
                : p_to_dt,
            p9_varchar2: offsets,
            p10_varchar2: APP_VERSION,
            p11_varchar2: crt_by,
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
          )
            .then((rs) => {
              if (rs == "Token Expired") {
                // refreshNewToken("grid", 1);
              }
              if (rs != "Token Expired") {
                if (rs.totalRow > 0) {
                  setOffset(offsets + 1);
                  setDataEmployee([...TempDsNhanvien, ...rs.data.data]);
                  setIsLoading(false);
                  setIsListEnd(false);
                } else {
                  setIsListEnd(true);
                  setIsLoading(false);
                }
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onResetForSearch = (type, l1, l2, l3, l4, l5, l6, l7) => {
    setDataEmployee([]);
    setIsLoading(false);
    setOffset(0);
    setIsListEnd(false);
    if (type == 0) {
      onRequestToServer(type, 0, p1, p2, p3, p4, p5, p6, p7);
    } else {
      onRequestToServer(type, 0, l1, l2, l3, l4, l5, l6, l7);
    }
  };
  const onRegisterFace = (pk) => {
    setModalOneItemVisible(true);
    const dataFilter = dataEmployee.filter((x) => x.pk == pk)[0];
    setDataOneItem(dataFilter);
  };
  const popupRegister = (
    <TVSControlPopupRegisterFace
      title={"ĐĂNG KÝ THÔNG TIN"}
      isShow={modalOneItemVisible}
      minHeight={height}
      empInfo={dataOneItem}
      setDataOneItem={(data) => setDataOneItem(data)}
      dsNhanVien={dataEmployee}
      setDsNhanVien={(data) => setDataEmployee(data)}
      setModalOneItemVisible={() => setModalOneItemVisible(false)}
      onRequestToServer={(
        type,
        offsets,
        l1,
        l2,
        l3,
        l4,
        l5,
        l6,
        l7,
        isLoad,
        isEnd
      ) =>
        onRequestToServer(
          type,
          offsets,
          l1,
          l2,
          l3,
          l4,
          l5,
          l6,
          l7,
          isLoad,
          isEnd
        )
      }
    ></TVSControlPopupRegisterFace>
  );
  const onOpenPopupMachine = (type) => {
    let flag = false;
    dataEmployee.forEach(function (item) {
      if (item.sel_yn == "Y") {
        flag = true;
      }
    });
    if (flag) {
      setModalMachineVisible(true);
      setType(type);
    } else {
      dialogNoti("Vui lòng chọn nhân viên");
    }
  };
  const popupMachine = (
    <TVSControlPopupMachine
      title={"CHỌN MÁY CHẤM CÔNG"}
      isShow={modalMachineVisible}
      minHeight={height * 0.7}
      onHide={() => {
        setModalMachineVisible(false);
      }}
      dsNhanVien={dataEmployee}
      setDsNhanVien={(data) => setDataEmployee(data)}
      type={type}
    ></TVSControlPopupMachine>
  );

  return (
    <>
      <Block flex backgroundColor={Color.backgroundColor}>
        <TVSHeader goBack={goBack}>
          {setHeaderChil2(
            loginReducers.data.data.user_language,
            menuReducer.data.data.menu,
            "MBHRTI007",
            menuReducer.data.data.menu.filter(
              (x) => x.menu_cd === "MBHRTI007"
            )[0].p_pk
          )}
        </TVSHeader>
        <Block flex backgroundColor={Color.gray} paddingTop={5}>
          <SafeAreaView style={{ flex: 1 }}>
            <View
              zIndex={20}
              style={{
                marginVertical: 5,
                marginHorizontal: 10,
                marginBottom: 0,
                marginHorizontal: 10,
              }}
            >
              <View
                style={{
                  marginTop: 5,
                  marginBottom: 10,
                  flexDirection: "row",
                  backgroundColor: "white",
                  borderRadius: 10,
                }}
              >
                <View style={{ flex: 1 }}>
                  <TextInput
                    onChangeText={(newText) => setEmpSearch(newText)}
                    placeholder={"Tìm kiếm"}
                    style={{
                      padding: Platform.OS === "ios" ? 10 : 6,
                      backgroundColor: Color.white,
                      justifyContent: "center",
                      borderRadius: 10,
                    }}
                  />
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      setTypeSelect(0);
                      onResetForSearch(0);
                    }}
                    style={{
                      padding: 8,
                      backgroundColor: Color.white,
                    }}
                  >
                    <Icon
                      name={"account-search"}
                      size={22}
                      color={Color.mainColor}
                    />
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}
                    style={{
                      padding: 8,
                      borderRadius: 10,
                      backgroundColor: Color.white,
                    }}
                  >
                    <Icon
                      name={isFilter ? "filter" : "filter-outline"}
                      color={Color.mainColor}
                      size={22}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <FlatList
                data={dataEmployee}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={ItemSeparatorView}
                renderItem={ItemView}
                ListFooterComponent={renderFooter}
                onEndReached={() =>
                  onRequestToServer(
                    typeSelect,
                    offset,
                    p1,
                    p2,
                    p3,
                    p4,
                    p5,
                    p6,
                    p7,
                    isLoading,
                    isListEnd
                  )
                }
                onEndReachedThreshold={0.5}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
                marginHorizontal: 5,
              }}
            >
              <View style={{ flex: 1 }}>
                <TVSButton
                  icon={"download"}
                  type={"primary"}
                  buttonStyle={"3"}
                  onPress={() => {
                    onOpenPopupMachine("RegisterMultiple");
                  }}
                >
                  Đăng ký
                </TVSButton>
              </View>
              <View style={{ flex: 1 }}>
                <TVSButton
                  icon={"upload"}
                  type={"success"}
                  buttonStyle={"3"}
                  onPress={() => {
                    onOpenPopupMachine("UpdateMultiple");
                  }}
                >
                  Cập nhật dữ liệu
                </TVSButton>
              </View>
            </View>
          </SafeAreaView>
        </Block>
        {popupRegister}
        {popupMachine}
        <ModalFilter
          isShow={modalVisible}
          callBack={(data) => onCallBack(data)}
          lstOrg={dataOrg}
          lstPos={dataPos}
          lstStatus={dataStatus}
          lstType={dataType}
          lstDayType={dataDate}
        />
      </Block>
    </>
  );
};
export default DangKyChamCongMita;

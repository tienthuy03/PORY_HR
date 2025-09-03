/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import Device from "react-native-device-info";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import Button from "../../../../components/Button";
import Calender from "../../../../components/Calendes";
import Text from "../../../../components/Text";
import TVSControlPopup from "../../../../components/Tvs/ControlPopup";
import TVSHeader from "../../../../components/Tvs/Header";
import Icon_calendar from "../../../../icons/Datev";
import ShowError from "../../../../services/errors";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../services/redux/GlobalLoading/action";
import OneRecordRecognize from "./OneRecordRecognize";
import sysFetch from "../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../config/Pro";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ModalExtend from "./ModalExtend.js";

const ChamCongKhuonMat = ({ navigation: { goBack } }) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const [noneAvatar, setNoneAvatar] = useState(
    "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"
  );
  const [selectedDate, setSelectedDate] = useState(
    moment().format("DD/MM/YYYY")
  );
  const dispatch = useDispatch();
  // const { isLoading } = useSelector((state) => state.GlobalLoadingReducer);
  const [dataRecord, setDataRecord] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [startDate, setStartDate] = useState(moment().format("YYYYMMDD"));
  const [endDate, setEndDate] = useState(moment().format("YYYYMMDD"));
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const currentLangue = useSelector(
    (state) => state.loginReducers.data.data.user_language
  );
  const employee_pk = useSelector(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );
  let tokenLogin = useSelector(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  let userPk = useSelector(
    (state) => state.loginReducers.data.data.tes_user_pk
  );
  let crt_by = useSelector((state) => state.loginReducers.data.data.crt_by);
  let refreshToken = useSelector(
    (state) => state.loginReducers.data.data.refreshToken
  );
  const menu = useSelector((state) => state.menuReducer.data.data.menu);
  try {
    menu.filter((x) => x.menu_cd === "MBHRTI003")[0][
      currentLangue.toLowerCase()
    ];
  } catch (error) {
    Alert.alert("Thông báo", "Menu MBHRTI003 không tồn tại.", [
      { text: "Xác nhận", onPress: () => goBack() },
    ]);
  }

  const getStateCalendar = async (result) => {
    setModalVisible(false);
    setSelectedDate(result.daySelecteds);
    setStartDate(result.startingDays);
    setEndDate(result.endingDays);
    setP1(result.startingDays);
    setP2(result.endingDays);
    onResetForSearch(result.startingDays, result.endingDays, false, false);
  };

  const loadData = async () => {
    dispatch(ShowGlobalLoading);
    sysFetch(
      API,
      {
        pro: "SELHRTI003000",
        in_par: {
          p1_varchar2: employee_pk,
          p2_varhcar2: startDate,
          p3_varhcar2: endDate,
          p4_varchar2: APP_VERSION,
          p5_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "data",
        },
      },
      tokenLogin
    )
      .then((res) => {
        console.log(res);
        if (res == "Token Expired") {
          refreshNewToken("loadData", "", "", "");
        }
        if (res != "Token Expired") {
          if (res.results === "S") {
            dispatch(HideGlobalLoading);
            setDataRecord(res.data.data);
          } else {
            ShowError("fail");
            dispatch(HideGlobalLoading);
          }
        }
      })
      .catch((error) => {
        dispatch(HideGlobalLoading);
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
        if (obj == "loadData") {
          loadData();
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

  const DatePicker = ({ visible }) => {
    return (
      <TVSControlPopup
        isShow={visible}
        onHide={() => setModalVisible(false)}
        maxHeight={500}
        title={"Chọn ngày"}
      >
        <Calender
          getState={getStateCalendar}
          startDayss={startDate}
          endDayss={endDate}
        />
      </TVSControlPopup>
    );
  };

  // const renderItem = ({ item }) => {
  //   return <OneRecordRecognize item={item} />;
  // };

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
      <>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 5,
            marginTop: 5,
          }}
        >
          <View
            style={{
              marginHorizontal: 5,
              backgroundColor: Color.white,
              paddingHorizontal: 10,
              paddingVertical: 5,
              alignItems: "center",
              justifyContent: "center",
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              borderWidth: 0.5,
              borderColor: "lightgray",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name={"calendar"} color={Color.mainColor} size={20} />
              <Text style={{ paddingLeft: 5, paddingRight: 10 }}>
                {item.work_dt}
              </Text>
              <Icon name={"clock-outline"} color={Color.mainColor} size={20} />
              <Text style={{ paddingLeft: 5 }}>{item.time}</Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginHorizontal: 5 }}>
          <View
            style={{
              marginLeft: 5,
              marginRight: 5,
              marginBottom: 5,
              flexDirection: "row",
              backgroundColor: Color.white,
              borderTopRightRadius: 6,
              borderBottomRightRadius: 6,
              flex: 1,
              borderColor: "lightgray",
              borderWidth: 0.5,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                console.log("press ", item.pk);
                onShowImage(item.pk);
              }}
              style={{
                width: 90,
                height: 120,
                marginRight: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* {item.image.length > 0 ? (
                <Image
                  style={{
                    resizeMode: "stretch",
                    width: "100%",
                    height: "100%",
                  }}
                  source={{
                    uri: "data:image/png;base64, " + item.image,
                  }}
                />
              ) : (
                <Image
                  style={{
                    resizeMode: "stretch",
                    width: "100%",
                    height: "100%",
                  }}
                  source={require("../../../../assets/images/mcc/user.png")}
                />
              )} */}
              <Icon
                name={"file-image-outline"}
                color={Color.mainColor}
                size={50}
              />
              <Text>Xem ảnh</Text>
            </TouchableOpacity>
            <View style={{ justifyContent: "center", flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 2,
                }}
              >
                <Icon
                  name={"card-account-details-outline"}
                  color={Color.mainColor}
                  size={20}
                />
                <Text
                  style={{ paddingLeft: 5, fontWeight: "500", fontSize: 15 }}
                >
                  {item.full_name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 2,
                }}
              >
                <Icon
                  name={"briefcase-outline"}
                  color={Color.mainColor}
                  size={20}
                />
                <Text style={{ paddingLeft: 5 }}>{item.org_name}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 2,
                }}
              >
                <Icon name={"cellphone"} color={Color.mainColor} size={20} />
                <Text style={{ paddingLeft: 5 }}>{item.machine_name}</Text>
              </View>
            </View>
          </View>
        </View>
      </>
    );
  };

  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isListEnd, setIsListEnd] = useState(false);
  const [typeSelect, setTypeSelect] = useState(0);
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const onResetForSearch = (l1, l2, l3, l4) => {
    setDataRecord([]);
    setIsLoading(false);
    setOffset(0);
    setIsListEnd(false);
    onRequestToServer(0, l1, l2, l3, l4);
  };
  const onRequestToServer = (offsets, p_from_dt, p_to_dt, isLoad, isEnd) => {
    console.log("param ", offsets, p_from_dt, p_to_dt, isLoad, isEnd);
    let TempDataRecord;
    if (offsets == 0) {
      TempDataRecord = [];
      setDataRecord([]);
      setOffset(0);
    } else {
      TempDataRecord = [...dataRecord];
    }
    try {
      if (!isLoad && !isEnd) {
        setIsLoading(true);
        const pro = "SELHRTI003000";
        const in_par = {
          p1_varchar2: employee_pk,
          p2_varchar2: p_from_dt, //startDate,
          p3_varchar2: p_to_dt, //endDate,
          p4_varchar2: offsets,
          p5_varchar2: APP_VERSION,
          p6_varchar2: crt_by,
        };
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
                setDataRecord([...TempDataRecord, ...rs.data.data]);
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
      } else {
        setIsListEnd(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [modalExtendVisible, setModalExtendVisible] = useState(false);
  const [titleImg, setTitleImg] = useState("");
  const [dataImg, setDataImg] = useState("");
  const [hasImg, setHasImg] = useState("N");
  const onShowImage = (pk) => {
    console.log(pk);
    const pro = "SELHRTI003001";
    const in_par = {
      p1_varchar2: pk,
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
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          // refreshNewToken("grid", 0);
        }
        if (rs != "Token Expired") {
          // console.log(rs.data.data);
          setTitleImg(rs.data.data[0].title);
          setDataImg(rs.data.data[0].data_img);
          setHasImg(rs.data.data[0].has_img);
          setModalExtendVisible(true);
        }
      })
      .catch((error) => {
        console.error("error form");
        console.error(error);
      });
  };
  // useEffect(() => {
  //   console.log("test");
  //   setModalExtendVisible(true);
  // }, [titleImg, dataImg, hasImg]);
  const onCallBack = (data) => {
    console.log("call back ", data);
    setModalExtendVisible(false);
  };
  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {
          menu.filter((x) => x.menu_cd === "MBHRTI003")[0][
            currentLangue.toLowerCase()
          ]
        }
      </TVSHeader>
      <Block flex backgroundColor={Color.gray} paddingTop={5}>
        <Block margin={10} radius={8} row>
          <Block
            column
            backgroundColor={Color.white}
            radius={5}
            alignCenter
            justifyCenter
            height={40}
            flex
            // marginRight={10}
          >
            <Button
              nextScreen={() => toggleModal()}
              row
              height={40}
              paddingLeft={20}
              alignCenter
              justifyCenter
              // marginRight={10}
            >
              <Icon_calendar color={Color.mainColor} />
              <Text
                paddingRight={10}
                center
                color={Color.mainColor}
                flex
                size={14}
                paddingLeft={10}
              >
                Ngày {selectedDate}
              </Text>
              <Text marginRight={10} />
            </Button>
          </Block>
          {/* <View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
              style={{
                padding: 8,
                borderRadius: 6,
                backgroundColor: Color.white,
              }}
            >
              <Icon
                name={isFilter ? "filter" : "filter-outline"}
                color={Color.mainColor}
                size={22}
              />
            </TouchableOpacity>
          </View> */}
        </Block>
        <View style={{ alignItems: "flex-end", marginRight: 10 }}>
          <Text>Số dòng: {dataRecord.length}</Text>
        </View>
        {dataRecord.length > 0 ? (
          <FlatList
            data={dataRecord}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
            ListFooterComponent={renderFooter}
            onEndReached={() =>
              onRequestToServer(offset, p1, p2, isLoading, isListEnd)
            }
            onEndReachedThreshold={0.5}
            refreshing={false}
            onRefresh={() => {
              onResetForSearch(p1, p2, false, false);
            }}
          />
        ) : null}
      </Block>
      <DatePicker visible={modalVisible} />

      <ModalExtend
        isShow={modalExtendVisible}
        image={dataImg}
        title={titleImg}
        hasImage={hasImg}
        callBack={(data) => onCallBack(data)}
      />
    </Block>
  );
};

export default ChamCongKhuonMat;

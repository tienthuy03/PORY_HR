import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../../components/Block";
import Typography from "../../../../../components/Text";
import sysFetch from "../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../config/Pro";
import TVSButton from "../../../../../components/Tvs/Button";
import moment from "moment";
import Icon_time from "../../../../../icons/Datev";
import { Text, SafeAreaView, View } from "react-native";
import Button from "../../../../../components/Button";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import Calender from "../../../../../components/Calendes";
import OneField from "../../../../../components/OneFieldKeyValue";
import { StyleSheet, FlatList, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const DSPDG = () => {
  const navigation = useNavigation();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const [daySelect, setDateSelect] = useState(
    moment(new Date()).format("01/MM/YYYY") +
      " - " +
      moment(new Date()).endOf("month").format("DD/MM/YYYY")
  );
  const [modalVisible, setModalVisible] = useState(false);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const loginReducers = useSelector((state) => state.loginReducers);
  let thr_emp_pk = "";
  let tokens = "";
  let fullname = "";
  let crt_by = "";

  try {
    tokens = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {
    //
  }
  const handleGetData = () => {
    getData(startDate, endDate);
  };
  useEffect(() => {
    getData(
      moment(new Date()).format("YYYYMM01"),
      moment(new Date()).endOf("month").format("YYYYMMDD")
    );
  }, []);

  const [dataMaster, setDataMaster] = useState([]);
  const [dataDetail, setDataDetail] = useState([]);
  const getData = (startDt, endDt) => {
    console.log({
      p1_varchar2: thr_emp_pk,
      p2_varchar2: startDt,
      p3_varchar2: endDt,
      p4_varchar2: APP_VERSION,
      p5_varchar2: crt_by,
    });
    sysFetch(
      API,
      {
        pro: "SELHRSV004001",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: startDt,
          p3_varchar2: endDt,
          p4_varchar2: APP_VERSION,
          p5_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "master",
          p2_sys: "detail",
        },
      },
      tokens
    )
      .then((res) => {
        setDataMaster(res.data.master);
        setDataDetail(res.data.detail);
      })
      .catch((error) => {});
  };
  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYYMM01")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).endOf("month").format("YYYYMMDD")
  );
  const getStateCalendar = async (result) => {
    setModalVisible(false);
    setDateSelect(result.daySelecteds);
    setStartDate(result.startingDays);
    setEndDate(result.endingDays);
    getData(result.startingDays, result.endingDays);
  };
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const modal = (
    <TVSControlPopup
      maxHeight={500}
      title={"Chọn ngày"}
      onHide={() => setModalVisible(false)}
      isShow={modalVisible}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisible(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <Calender
        getState={getStateCalendar}
        startDayss={startDate}
        endDayss={endDate}
      />
    </TVSControlPopup>
  );
  const renderItem = ({ item }) => {
    return (
      <Block
        style={{ flex: 1 }}
        marginLeft={10}
        marginBottom={10}
        marginRight={10}
      >
        <Block row justifyContent={"space-between"}>
          {item.label && (
            <Block
              borderTopLeftRadius={6}
              borderTopRightRadius={6}
              backgroundColor={Color.white}
              height={35}
              alignCenter
              justifyCenter
              paddingLeft={10}
              paddingRight={10}
            >
              <Text style={{ color: Color.mainColor }} size={14}>
                {item.label}
              </Text>
            </Block>
          )}
          <Text color={Color.white} size={13} />
        </Block>
        <Block
          backgroundColor={Color.white}
          borderBottomLeftRadius={6}
          borderBottomRightRadius={6}
          borderColor={Color.oneContentBorder}
          borderWidth={1}
          paddingBottom={5}
        >
          {Object.entries(item).map((oneField, index) => {
            return (
              oneField[0].substr(0, 1) === "_" && (
                <OneField
                  value={oneField[1]}
                  keyName={
                    oneField[0].replace("_", "").substr(0, 1).toUpperCase() +
                    oneField[0]
                      .replace("_", "")
                      .substr(1, oneField[0].replace("_", "").length)
                  }
                />
              )
            );
          })}
          <FlatList
            showsVerticalScrollIndicator={false}
            // onRefresh={() => getData(startDate, endDate)}
            // refreshing={false}
            data={dataDetail.filter((x) => x.parent_pk == item.pk)}
            renderItem={renderItemDetail}
            keyExtractor={(item, index) => index.toString()}
          />
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 10,
              backgroundColor: "#FFFFFF",
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <TVSButton
                buttonStyle="3"
                onPress={() => {
                  navigation.navigate("UpdatePDGXT", {
                    itemRoute: item,
                    onRefresh: handleGetData,
                  });
                }}
                type={"secondary"}
                icon={"sync"}
              >
                Chỉnh sửa
              </TVSButton>
            </View>
            <View style={{ flex: 1 }}>
              <TVSButton
                buttonStyle="3"
                type={"danger"}
                onPress={() => confirmDelete(item.pk)}
                icon={"trash-can-outline"}
              >
                Xóa bỏ
              </TVSButton>
            </View>
          </View>
        </Block>
      </Block>
    );
  };
  const confirmDelete = (pk) => {
    Alert.alert("Thông báo", "Bạn có muốn xóa bỏ?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => onDelete(pk) },
    ]);
  };
  const onDelete = (pk) => {
    sysFetch(
      API,
      {
        pro: "UPDHRSV004000",
        in_par: {
          p1_varchar2: "DELETE",
          p2_varchar2: pk,
          p3_varchar2: "",
          p4_varchar2: "",
          p5_varchar2: "",
          p6_varchar2: "",
          p7_varchar2: "",
          p8_varchar2: "",
          p9_varchar2: "",
          p10_varchar2: APP_VERSION,
          p11_varchar2: crt_by,
        },
        out_par: {
          p1_varchar2: "showDialog",
        },
      },
      tokens
    )
      .then((res) => {
        handleGetData();
        // setComfirmSent()
        if (res.results == "F") {
          let newText = res.errorData.split("ORA");
          let errors = "";
          try {
            errors = newText[1].trim().split(":")[1];
          } catch (error) {
            errors = "Lỗi: Xóa bỏ không thành công.";
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
        } else {
          Alert.alert(
            "Thông báo",
            "Xóa bỏ thành công",
            [
              {
                text: "Thoát",
                onPress: () => {},
                style: "cancel",
              },
            ],
            { cancelable: false }
          );
          // setSendStatus(res.data.showDialog);
        }
      })
      .catch((error) => {});
  };
  const renderItemDetail = ({ item }) => {
    return (
      <View
        style={{
          paddingHorizontal: 10,
          marginTop: 5,
          paddingBottom: 10,
        }}
      >
        <View style={{}}>
          <Text>{item.ques_name}</Text>
        </View>
        <View style={{ flexDirection: "row", marginLeft: 10 }}>
          <View
            style={{
              width: 18,
              height: 18,
              margin: 5,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 18 / 2,
              borderWidth: 2,
              borderColor: Color.mainColor,
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 10 / 2,
                backgroundColor: Color.mainColor,
              }}
            />
          </View>
          <View style={{ paddingLeft: 3, marginTop: 5, opacity: 0.8 }}>
            <Text>{item.ans_nm}</Text>
          </View>
        </View>
        {item.extend_reply != undefined && item.extend_reply != "" ? (
          <View style={{ marginLeft: 15, marginTop: 5, flexDirection: "row" }}>
            <Icon
              name={"square-edit-outline"}
              color={Color.mainColor}
              size={20}
            />
            <Text style={{ paddingLeft: 8 }}>{item.extend_reply}</Text>
          </View>
        ) : null}
      </View>
    );
  };

  const onRenderNoItem = () => {
    return (
      <Block justifyCenter alignCenter flex marginTop={20}>
        <Text>Không có dữ liệu !</Text>
      </Block>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }} backgroundColor={Color.gray}>
      <View
        style={{
          flexDirection: "column",
          backgroundColor: Color.gray,
          flex: 1,
        }}
      >
        <View
          style={{
            marginHorizontal: 10,
            marginVertical: 10,
            borderRadius: 8,
            backgroundColor: Color.white,
          }}
        >
          <Button
            nextScreen={toggleModal}
            row
            alignCenter
            justifyContent={"space-between"}
          >
            <Icon_time style={{ marginLeft: 20 }} />
            <Typography
              center
              color={Color.mainColor}
              flex
              size={14}
              padding={10}
            >
              Ngày {daySelect}
            </Typography>
            <Typography marginRight={10} />
          </Button>
          {modal}
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            onRefresh={() => getData(startDate, endDate)}
            refreshing={false}
            data={dataMaster}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={onRenderNoItem}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default DSPDG;

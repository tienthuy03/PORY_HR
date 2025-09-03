import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useContext, useState, useRef } from "react";
import {
  SafeAreaView,
  StatusBar,
  //   Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
// Icon
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import Icon_calendar from "../../../../../icons/Datev";
import Block from "../../../../../components/Block";
import Button from "../../../../../components/Button";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import TVSButton from "../../../../../components/Tvs/Button";
import Calender from "../../../../../components/Calendes";
import Text from "../../../../../components/Text";
import TVSDateTime from "../../../../../components/Tvs/TVSDateTime";

const ModalFilter = ({
  isShow,
  callBack,
  lstOrg,
  lstPos,
  lstStatus,
  lstType,
  lstDayType,
}) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  //   console.log("isShow", isShow);
  const [modalVisible, setModalVisible] = useState(isShow);
  useEffect(() => {
    // console.log("effect");
    setModalVisible(isShow);
    setDataOrg(lstOrg);
    setDataPosition(lstPos);
    setDataStatus(lstStatus);
    setDataType(lstType);
    setDataDayType(lstDayType);
  }, [isShow]);
  //
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
  //
  const [dataOrg, setDataOrg] = useState([]);
  const [selectNameOrg, setSelectNameOrg] = useState("Chọn phòng ban");
  const [selectCodeOrg, setSelectCodeOrg] = useState("");
  const onChangeOrg = (result) => {
    setSelectNameOrg(result.code_nm);
    setSelectCodeOrg(result.code);

    setModalVisibleOrg(false);
    setColorOrg(null);
  };
  const [colorOrg, setColorOrg] = useState("#B2B2B2");
  const [modalVisibleOrg, setModalVisibleOrg] = useState(false);

  const modalOrg = (
    <TVSControlPopup
      title={"Chọn phòng ban"}
      isShow={modalVisibleOrg}
      onHide={() => setModalVisibleOrg(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleOrg(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataOrg}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onChangeOrg(item);
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
  //
  const [dataPosition, setDataPosition] = useState([]);
  const [selectNamePosition, setSelectNamePosition] = useState("Chọn chức vụ");
  const [selectCodePosition, setSelectCodePosition] = useState("");
  const onChangePosition = (result) => {
    setSelectNamePosition(result.code_nm);
    setSelectCodePosition(result.code);

    setModalVisiblePosition(false);
    setColorPosition(null);
  };
  const [colorPosition, setColorPosition] = useState("#B2B2B2");
  const [modalVisiblePosition, setModalVisiblePosition] = useState(false);

  const modalPosition = (
    <TVSControlPopup
      title={"Chọn chức vụ"}
      isShow={modalVisiblePosition}
      onHide={() => setModalVisiblePosition(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisiblePosition(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataPosition}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onChangePosition(item);
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

  //
  const [dataStatus, setDataStatus] = useState([]);
  const [selectNameStatus, setSelectNameStatus] = useState("Chọn trạng thái");
  const [selectCodeStatus, setSelectCodeStatus] = useState("");
  const onChangeStatus = (result) => {
    setSelectNameStatus(result.code_nm);
    setSelectCodeStatus(result.code);

    setModalVisibleStatus(false);
    setColorStatus(null);
  };
  const [colorStatus, setColorStatus] = useState("#B2B2B2");
  const [modalVisibleStatus, setModalVisibleStatus] = useState(false);

  const modalStatus = (
    <TVSControlPopup
      title={"Chọn trạng thái"}
      isShow={modalVisibleStatus}
      onHide={() => setModalVisibleStatus(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleStatus(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataStatus}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onChangeStatus(item);
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
  //
  const [dataType, setDataType] = useState([]);
  const [selectNameType, setSelectNameType] = useState(
    "Chọn dữ liệu chấm công"
  );
  const [selectCodeType, setSelectCodeType] = useState("");
  const onChangeType = (result) => {
    setSelectNameType(result.code_nm);
    setSelectCodeType(result.code);

    setModalVisibleType(false);
    setColorType(null);
  };
  const [colorType, setColorType] = useState("#B2B2B2");
  const [modalVisibleType, setModalVisibleType] = useState(false);

  const modalType = (
    <TVSControlPopup
      title={"Chọn dữ liệu chấm công"}
      isShow={modalVisibleType}
      onHide={() => setModalVisibleType(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleType(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataType}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onChangeType(item);
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
  //
  const [dataDayType, setDataDayType] = useState([]);
  const [selectNameDayType, setSelectNameDayType] = useState("Chọn loại ngày");
  const [selectCodeDayType, setSelectCodeDayType] = useState("");
  const onChangeDayType = (result) => {
    setSelectNameDayType(result.code_nm);
    setSelectCodeDayType(result.code);

    setModalVisibleDayType(false);
    setColorDayType(null);
  };
  const [colorDayType, setColorDayType] = useState("#B2B2B2");
  const [modalVisibleDayType, setModalVisibleDayType] = useState(false);

  const modalDayType = (
    <TVSControlPopup
      title={"Chọn loại ngày"}
      isShow={modalVisibleDayType}
      onHide={() => setModalVisibleDayType(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleDayType(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataDayType}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onChangeDayType(item);
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
  const ResetFilter = () => {
    setSelectCodeOrg("");
    setSelectNameOrg("Chọn phòng ban");
    setColorOrg("#B2B2B2");
    setSelectCodePosition("");
    setSelectNamePosition("Chọn chức vụ");
    setColorPosition("#B2B2B2");
    setSelectCodeStatus("");
    setSelectNameStatus("Chọn trạng thái");
    setColorStatus("#B2B2B2");
    setSelectCodeType("");
    setSelectNameType("Chọn dữ liệu chấm công");
    setColorType("#B2B2B2");
    setSelectCodeDayType("");
    setSelectNameDayType("Chọn loại ngày");
    setColorDayType("#B2B2B2");
    setFromDate("dd/mm/yyyy");
    setToDate("dd/mm/yyyy");
    // callBack(!modalVisible);
    callBack({
      isFilter: true,
      isClear: true,
      org: "",
      pos: "",
      status: "",
      type: "",
      dayType: "",
      fromDt: "dd/mm/yyyy",
      toDt: "dd/mm/yyyy",
    });
    setModalVisible(!modalVisible);
  };
  return (
    <>
      <Modal
        swipeDirection="down"
        onSwipeComplete={() => {
          //   callBack({
          //     org: selectCodeOrg,
          //     pos: selectCodePosition,
          //     status: selectCodeStatus,
          //     type: selectCodeType,
          //     dayType: selectCodeDayType,
          //     fromDt: fromDate,
          //     toDt: toDate,
          //   });
          callBack({ isFilter: false, isClear: false });
          setModalVisible(!modalVisible);
          console.log("swipe");
        }}
        isVisible={modalVisible}
        style={[
          {
            justifyContent: "flex-end",
            margin: 0,
          },
        ]}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "flex-end",
            flex: 1,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 8,
              height: 5,
              width: 80,
              marginBottom: 8,
            }}
          ></View>
        </View>
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 4,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
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
            Tìm kiếm nâng cao
          </Text>
          {/* Control Phong ban */}
          <Block style={{ margin: 10 }}>
            <Block
              style={{
                flexDirection: "row",
                paddingBottom: 5,
                paddingLeft: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ color: Color.mainColor }}>Phòng ban</Text>
              <Text style={{ color: Color.red }}> *</Text>
            </Block>
            <Button
              nextScreen={() => setModalVisibleOrg(true)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: Color.gray,
                borderRadius: 6,
              }}
            >
              <Block
                style={{
                  flex: 1,
                  justifyContent: "center",
                  paddingLeft: 10,
                  paddingVertical: 10,
                }}
              >
                <Text style={{ color: colorOrg }}>{selectNameOrg}</Text>
              </Block>
              <Block style={{ justifyContent: "center", paddingRight: 10 }}>
                <Icon name={"chevron-down"} color={Color.mainColor} size={30} />
              </Block>
            </Button>
            {modalOrg}
          </Block>
          {/* Control Chuc vu */}
          <Block style={{ margin: 10 }}>
            <Block
              style={{
                flexDirection: "row",
                paddingBottom: 5,
                paddingLeft: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ color: Color.mainColor }}>Chức vụ</Text>
              <Text style={{ color: Color.red }}> *</Text>
            </Block>
            <Button
              nextScreen={() => setModalVisiblePosition(true)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: Color.gray,
                borderRadius: 6,
              }}
            >
              <Block
                style={{
                  flex: 1,
                  justifyContent: "center",
                  paddingLeft: 10,
                  paddingVertical: 10,
                }}
              >
                <Text style={{ color: colorPosition }}>
                  {selectNamePosition}
                </Text>
              </Block>
              <Block style={{ justifyContent: "center", paddingRight: 10 }}>
                <Icon name={"chevron-down"} color={Color.mainColor} size={30} />
              </Block>
            </Button>
            {modalPosition}
          </Block>
          {/*  Control trang thai */}
          <Block style={{ margin: 10 }}>
            <Block
              style={{
                flexDirection: "row",
                paddingBottom: 5,
                paddingLeft: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ color: Color.mainColor }}>Trạng thái</Text>
              <Text style={{ color: Color.red }}> *</Text>
            </Block>
            <Button
              nextScreen={() => setModalVisibleStatus(true)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: Color.gray,
                borderRadius: 6,
              }}
            >
              <Block
                style={{
                  flex: 1,
                  justifyContent: "center",
                  paddingLeft: 10,
                  paddingVertical: 10,
                }}
              >
                <Text style={{ color: colorStatus }}>{selectNameStatus}</Text>
              </Block>
              <Block style={{ justifyContent: "center", paddingRight: 10 }}>
                <Icon name={"chevron-down"} color={Color.mainColor} size={30} />
              </Block>
            </Button>
            {modalStatus}
          </Block>
          {/*  Control du lieu cham cong */}
          <Block style={{ margin: 10 }}>
            <Block
              style={{
                flexDirection: "row",
                paddingBottom: 5,
                paddingLeft: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ color: Color.mainColor }}>Dữ liệu chấm công</Text>
              <Text style={{ color: Color.red }}> *</Text>
            </Block>
            <Button
              nextScreen={() => setModalVisibleType(true)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: Color.gray,
                borderRadius: 6,
              }}
            >
              <Block
                style={{
                  flex: 1,
                  justifyContent: "center",
                  paddingLeft: 10,
                  paddingVertical: 10,
                }}
              >
                <Text style={{ color: colorType }}>{selectNameType}</Text>
              </Block>
              <Block style={{ justifyContent: "center", paddingRight: 10 }}>
                <Icon name={"chevron-down"} color={Color.mainColor} size={30} />
              </Block>
            </Button>
            {modalType}
          </Block>
          {/*  Control loai ngay */}
          <Block style={{ margin: 10 }}>
            <Block
              style={{
                flexDirection: "row",
                paddingBottom: 5,
                paddingLeft: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ color: Color.mainColor }}>Loại ngày</Text>
              <Text style={{ color: Color.red }}> *</Text>
            </Block>
            <Button
              nextScreen={() => setModalVisibleDayType(true)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: Color.gray,
                borderRadius: 6,
              }}
            >
              <Block
                style={{
                  flex: 1,
                  justifyContent: "center",
                  paddingLeft: 10,
                  paddingVertical: 10,
                }}
              >
                <Text style={{ color: colorDayType }}>{selectNameDayType}</Text>
              </Block>
              <Block style={{ justifyContent: "center", paddingRight: 10 }}>
                <Icon name={"chevron-down"} color={Color.mainColor} size={30} />
              </Block>
            </Button>
            {modalDayType}
          </Block>
          {/*  */}
          <Block style={{ margin: 10, flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <TVSDateTime
                mode={"date"}
                required={true}
                label={"Từ ngày"}
                value={fromDate}
                onChangeDateTime={(val) => onChangeFromDate(val)}
              />
            </View>
            <Block
              style={{
                flexDirection: "column",
              }}
            >
              <Block>
                <Text
                  style={{
                    paddingLeft: 10,
                    color: Color.mainColor,
                  }}
                ></Text>
              </Block>
              <Block
                style={{
                  alignItems: "center",
                  marginLeft: 10,
                  marginRight: 10,
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <Text>...</Text>
              </Block>
            </Block>
            <View style={{ flex: 1 }}>
              <TVSDateTime
                mode={"date"}
                required={true}
                label={"Đến ngày"}
                value={toDate}
                onChangeDateTime={(val) => onChangeToDate(val)}
              />
            </View>
          </Block>
          <Block style={{ margin: 10, flexDirection: "row" }}></Block>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <View style={{ flex: 1 }}>
              <TVSButton
                icon={"check"}
                buttonStyle={"3"}
                onPress={() => {
                  callBack({
                    isFilter: true,
                    isClear: false,
                    org: selectCodeOrg,
                    pos: selectCodePosition,
                    status: selectCodeStatus,
                    type: selectCodeType,
                    dayType: selectCodeDayType,
                    fromDt: fromDate,
                    toDt: toDate,
                  });
                  setModalVisibleDayType(false);
                }}
              >
                Xác nhận
              </TVSButton>
            </View>
            <View style={{ flex: 1 }}>
              <TVSButton
                type={"secondary"}
                icon={"sync"}
                buttonStyle={"3"}
                onPress={() => ResetFilter()}
              >
                Xóa bộ lọc
              </TVSButton>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ModalFilter;

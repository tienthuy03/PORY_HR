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

const ModalFilter = ({ isShow, callBack, lstOrg, lstType }) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  //   console.log("isShow", isShow);
  const [modalVisible, setModalVisible] = useState(isShow);
  useEffect(() => {
    // console.log("effect");
    setModalVisible(isShow);
    setDataOrg(lstOrg);
    setDataType(lstType);
  }, [isShow]);
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
  const [dataType, setDataType] = useState([]);
  const [selectNameType, setSelectNameType] = useState("Chọn loại chấm công");
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
      title={"Chọn loại chấm công"}
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
  const ResetFilter = () => {
    setSelectCodeOrg("");
    setSelectNameOrg("Chọn phòng ban");
    setColorOrg("#B2B2B2");
    setSelectCodeType("");
    setSelectNameType("Chọn loại chấm công");
    setColorType("#B2B2B2");
    // callBack(!modalVisible);
    callBack({
      isFilter: true,
      isClear: true,
      org: "",
      type: "",
    });
    setModalVisible(!modalVisible);
  };
  return (
    <>
      <Modal
        // swipeDirection="down"
        // onSwipeComplete={() => {
        //   setModalVisible(!modalVisible);
        //   callBack({ isFilter: false, isClear: false });
        //   console.log("swipe");
        // }}
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
          {/* <View
            style={{
              backgroundColor: "white",
              borderRadius: 8,
              height: 5,
              width: 80,
              marginBottom: 8,
            }}
          ></View> */}
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
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                flex: 1,
                fontSize: 15,
                fontWeight: "bold",
                textTransform: "uppercase",
                color: Color.mainColor,
              }}
            >
              Tìm kiếm nâng cao
            </Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
                callBack({ isFilter: false, isClear: false });
              }}
            >
              <Icon size={20} color={Color.mainColor} name={"close"} />
            </TouchableOpacity>
          </View>
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
              <Text style={{ color: Color.mainColor }}>Loại chấm công</Text>
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
                    type: selectCodeType,
                  });
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

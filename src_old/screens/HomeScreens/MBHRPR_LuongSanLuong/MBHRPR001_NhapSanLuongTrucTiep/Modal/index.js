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

const ModalFilter = ({ isShow, callBack, data, title }) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  //   console.log("isShow", isShow);
  const [modalVisible, setModalVisible] = useState(isShow);
  const [dataSuggest, setDataSuggest] = useState([]);
  const [dataSuggestTitle, setDataSuggestTitle] = useState([]);
  useEffect(() => {
    setDataSuggest(data);
    setDataSuggestTitle(title);
    setModalVisible(isShow);
  }, [isShow]);

  const onSelect = (item) => {
    console.log("select ===> ", item);
    let dataSuggestTemp = [...dataSuggest];
    dataSuggestTemp = dataSuggestTemp.map((obj) => {
      if (obj.process_code == item.process_code) {
        if (obj.selected) {
          return { ...obj, selected: false };
        } else {
          return { ...obj, selected: true };
        }
      } else {
        return obj;
      }
    });
    setDataSuggest(dataSuggestTemp);
    // callBack(item);
    // setModalVisible(!modalVisible);
  };

  const handleSelectProcess = () => {
    let dataProcessTemp = [...dataSuggest];
    let tmp = [];
    dataProcessTemp
      .filter((x) => x.selected == true)
      .map((x) => {
        tmp.push(x);
      });
    console.log("tmp ", tmp);
    callBack(tmp);
    setModalVisible(!modalVisible);
  };

  return (
    <>
      <Modal
        // swipeDirection="down"
        // onSwipeComplete={() => {
        //   // callBack({ data: [] });
        //   // setModalVisible(!modalVisible);
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
              Danh sách dữ liệu gần nhất
            </Text>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  callBack(null);
                  setModalVisible(!modalVisible);
                }}
              >
                <Icon size={20} color={Color.mainColor} name={"close"} />
              </TouchableOpacity>
            </View>
          </View>

          {dataSuggestTitle.length > 0 ? (
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "500" }}>
                {dataSuggestTitle[0].text}
              </Text>
            </View>
          ) : null}
          <FlatList
            style={{ maxHeight: 500 }}
            showsVerticalScrollIndicator={false}
            data={dataSuggest}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    flex: 1,
                    backgroundColor: Color.gray,
                    borderRadius: 8,
                    padding: 10,
                    marginTop: 10,
                    borderColor: item.selected ? "#3CB371" : null,
                    borderWidth: item.selected ? 0.5 : null,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ opacity: 0.8, marginBottom: 5 }}>
                      <Text>Tổ chuyền</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                      <Text>{item.org_nm}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ opacity: 0.8, marginBottom: 5 }}>
                      <Text>Mã hàng</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                      <Text>{item.item_code_nm}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ opacity: 0.8, marginBottom: 5 }}>
                      <Text>Công đoạn</Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        alignItems: "flex-end",
                        marginLeft: 10,
                      }}
                    >
                      <Text>{item.process_code_nm}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ opacity: 0.8, marginBottom: 5 }}>
                      <Text>Số lượng</Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        alignItems: "flex-end",
                        marginLeft: 10,
                      }}
                    >
                      <Text>{item.quantity}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        onSelect(item);
                      }}
                      style={{
                        flexDirection: "row",
                        paddingHorizontal: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        // marginHorizontal: 5,
                        borderWidth: 0.5,
                        borderRadius: 8,
                        borderColor: item.selected ? "red" : "#3CB371",
                        backgroundColor: "white",
                      }}
                    >
                      <Icon
                        name={item.selected ? "close" : "check"}
                        color={item.selected ? "red" : "#3CB371"}
                        size={20}
                      />
                      <Text
                        style={{
                          textAlign: "center",
                          paddingVertical: 10,
                          fontWeight: "bold",
                          color: item.selected ? "red" : "#3CB371",
                        }}
                      >
                        {item.selected ? "Bỏ chọn" : "Chọn"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <TVSButton
              // type={"danger"}
              icon={"check"}
              buttonStyle={"3"}
              onPress={() => handleSelectProcess()}
            >
              Xác nhận
            </TVSButton>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ModalFilter;

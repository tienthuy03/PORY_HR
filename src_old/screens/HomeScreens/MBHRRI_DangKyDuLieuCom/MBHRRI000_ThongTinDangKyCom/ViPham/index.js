import moment from "moment";
import React, { useEffect, useState } from "react";

import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../../components/Block";
import Button from "../../../../../components/Button";
import Text from "../../../../../components/Text";
import {
  HRRI000LayDuLieuViPhamComS,
  HRRI000LayDuLieuViPhamCom,
} from "../../../../../services/redux/HRRI000_ThongTinDangKyCom/action";

const ViPham = ({}) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const loginReducers = useSelector((state) => state.loginReducers);
  const menuReducer = useSelector((state) => state.menuReducer);
  let thr_emp_pks = "";
  let tokenss = "";
  let fullnames = "";
  try {
    tokenss = loginReducers.data.data.tokenLogin;
    thr_emp_pks = loginReducers.data.data.thr_emp_pk;
    fullnames = loginReducers.data.data.full_name;
  } catch (error) {
    //
  }
  const dsViPhamCom = useSelector(
    (state) => state.HRRI000_ThongTinDangKyComReducer.ViPhamCom.data
  );
  useEffect(() => {
    console.log("dsViPhamCom ", dsViPhamCom);
  }, [dsViPhamCom]);
  const renderTitle = ({ item, index }) => {
    const currentTabName = item.tab_name;
    return (
      <>
        <Block flex marginLeft={10} marginBottom={10} marginRight={10}>
          <Block row justifyContent={"space-between"}>
            {currentTabName && (
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
                <Text style={{ color: Color.mainColor, fontSize: 14 }}>
                  {currentTabName}
                </Text>
              </Block>
            )}
            <Text color={Color.white} size={13} />
          </Block>
          <Block
            paddingHorizontal={10}
            paddingBottom={10}
            backgroundColor={Color.white}
            borderBottomLeftRadius={6}
            borderBottomRightRadius={6}
            borderColor={Color.oneContentBorder}
            borderWidth={1}
          >
            <View
              style={{ justifyContent: "space-between", flexDirection: "row" }}
            >
              <View style={{ flex: 1 }}>
                {Object.entries(item).map((oneField, index) => {
                  return (
                    oneField[0].substr(0, 1) === "_" &&
                    (oneField[1] != "" ? (
                      <Block
                        row
                        borderBottomWidth={1}
                        borderBottomColor={"#F4F6F7"}
                        paddingTop={10}
                        paddingBottom={10}
                        justifyContent={"space-between"}
                      >
                        <Text flex={0}>
                          {oneField[0]
                            .replace("_", "")
                            .substr(0, 1)
                            .toUpperCase() +
                            oneField[0]
                              .replace("_", "")
                              .substr(1, oneField[0].replace("_", "").length)}
                        </Text>

                        <Text right flex={1}>
                          {oneField[1]}
                        </Text>
                      </Block>
                    ) : null)
                  );
                })}
              </View>
            </View>
            {/* {item.is_show == "Y" ? (
              <Block
                keyExtractor={index.toString()}
                style={{
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,

                  elevation: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    padding: 10,
                    backgroundColor: Color.blueB,
                  }}
                >
                  <Text color={Color.keyColor} flex={1}>
                    {item.content}
                  </Text>
                </View>
              </Block>
            ) : null}

            {item.is_show == "N" ? (
              <Button
                nextScreen={() => {
                  ShowMore(item);
                }}
              >
                <View style={{ alignItems: "center", flex: 1, paddingTop: 10 }}>
                  <Text
                    textDecorationLine={"underline"}
                    style={{ color: Color.mainColor }}
                  >
                    Chi tiết
                  </Text>
                </View>
              </Button>
            ) : null}
            {item.is_show == "Y" ? (
              <Button
                nextScreen={() => {
                  CloseShowMore(item);
                }}
              >
                <View style={{ alignItems: "center", flex: 1, paddingTop: 10 }}>
                  <Text
                    textDecorationLine={"underline"}
                    style={{ color: Color.mainColor }}
                  >
                    Ẩn bớt
                  </Text>
                </View>
              </Button>
            ) : null} */}
          </Block>
        </Block>
      </>
    );
  };

  const ShowMore = (item) => {
    console.log("show more ", item);
    let arrData = [...dsViPhamCom];
    arrData.forEach(function (itemFilter) {
      if (itemFilter.pk == item.pk) {
        itemFilter.is_show = "Y";
      }
    });
    dispatch(HRRI000LayDuLieuViPhamComS({ data: arrData }));
  };
  const CloseShowMore = (item) => {
    console.log("close more ", item);
    let arrData = [...dsViPhamCom];
    arrData.forEach(function (itemFilter) {
      if (itemFilter.pk == item.pk) {
        itemFilter.is_show = "N";
      }
    });
    dispatch(HRRI000LayDuLieuViPhamComS({ data: arrData }));
  };
  const OnRefresh = () => {
    dispatch(HRRI000LayDuLieuViPhamCom());
  };
  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <Block flex backgroundColor={Color.gray} paddingTop={5}>
        <Block marginBottom={Platform.OS === "ios" ? 20 : 5} flex>
          <FlatList
            showsVerticalScrollIndicator={false}
            onRefresh={() => OnRefresh()}
            data={dsViPhamCom}
            keyExtractor={(item, index) => index.toString() + "_a"}
            renderItem={renderTitle}
            refreshing={false}
            ListEmptyComponent={() => (
              <View
                style={{
                  margin: 10,
                  marginTop: 20,
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Không có dữ liệu !</Text>
              </View>
            )}
          />
        </Block>
      </Block>
    </Block>
  );
};

export default ViPham;

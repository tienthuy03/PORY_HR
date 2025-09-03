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
  Text,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../../components/Block";
import OneField from "../../../../../components/OneFieldKeyValue";
import { HRRI000LayDanhSachDangKy } from "../../../../../services/redux/HRRI000_ThongTinDangKyCom/action";

const DanhSach = ({}) => {
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
  const dsDangKy = useSelector(
    (state) => state.HRRI000_ThongTinDangKyComReducer.DanhSachDangKy.data
  );
  useEffect(() => {
    console.log("dsDangKy ", dsDangKy);
  }, [dsDangKy]);
  const renderItem = ({ item }) => {
    return (
      <Block flex marginLeft={10} marginBottom={10} marginRight={10}>
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
              <Text style={{ color: Color.mainColor, fontSize: 14 }}>
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
        </Block>
      </Block>
    );
  };

  const onRenderNoItem = () => {
    return (
      <Block justifyCenter alignCenter flex marginTop={20}>
        <Text>Không có dữ liệu !</Text>
      </Block>
    );
  };

  const OnRefresh = () => {
    dispatch(HRRI000LayDanhSachDangKy());
  };

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <Block flex backgroundColor={Color.gray} paddingTop={5}>
        <FlatList
          showsVerticalScrollIndicator={false}
          onRefresh={() => OnRefresh()}
          refreshing={false}
          data={dsDangKy}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          // onEndReached={() => handleLoadMore(lengthDataProps)}
          onEndReachedThreshold={0.5}
          // extraData={data}
          ListEmptyComponent={onRenderNoItem}
        />
      </Block>
    </Block>
  );
};

export default DanhSach;

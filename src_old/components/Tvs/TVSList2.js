import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Color } from "../../colors/colortv";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Block from "../Block";
import Button from "../Button";
import TVSControlPopup from "./ControlPopup2";
import TVSButton from "./Button";
const TVSList2 = ({
  children,
  disabled = false,
  required = false,
  code,
  code_nm,
  label,
  onChangeSelect,
  dataItem,
  hasLabel = true,
  colorLabel = Color.mainColor,
  titleModal = "Chọn",
}) => {
  const [colorSelect, setColorSelect] = useState("#B2B2B2");
  const [modalVisibleSelect, setModalVisibleSelect] = useState(false);
  // const [dataSelect, setDataSelect] = useState(dataItem);
  const [selectName, setSelectName] = useState(code_nm);
  const [selectPK, setSelectPK] = useState(code);

  const modalSelect = (
    <TVSControlPopup
      title={titleModal}
      isShow={modalVisibleSelect}
      onHide={() => setModalVisibleSelect(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleSelect(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataItem}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateSelect(item);
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

  const getStateSelect = (result) => {
    setSelectName(result.code_nm);
    setSelectPK(result.code);
    setModalVisibleSelect(false);
    setColorSelect(null);
    onChangeSelect(result);
  };

  return (
    <Block style={{ margin: 10 }}>
      {hasLabel ? (
        <Block
          style={{
            flexDirection: "row",
            paddingBottom: 5,
            paddingLeft: 5,
            alignItems: "center",
          }}
        >
          <Text style={{ color: colorLabel }}>{label}</Text>
          {required ? <Text style={{ color: Color.red }}> *</Text> : null}
        </Block>
      ) : null}
      <Button
        nextScreen={() => (disabled ? null : setModalVisibleSelect(true))}
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
          <Text style={{ color: colorSelect }}>{selectName}</Text>
        </Block>
        <Block style={{ justifyContent: "center", paddingRight: 10 }}>
          <Icon
            name={"chevron-down"}
            color={disabled ? Color.disableButton2 : Color.mainColor}
            size={30}
          />
        </Block>
      </Button>
      {modalSelect}
    </Block>
  );
};

export default TVSList2;

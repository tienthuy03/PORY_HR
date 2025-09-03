import React from "react";
import { Modal, ActivityIndicator } from "react-native";
import Block from "./Block";
import Text from "./Text";
// import {Color} from '../colors/color';
import { useSelector } from "react-redux";
export default function Loading({ visible }) {
  const Color = useSelector((s) => s.SystemReducer.theme);
  return (
    <Modal transparent={true} onRequestClose={() => null} visible={visible}>
      <Block flex alignCenter justifyCenter backgroundColor={"rgba(0,0,0,0.2)"}>
        <Block
          alignCenter
          width={150}
          height={100}
          borderRadius={10}
          backgroundColor={"white"}
          padding={25}
        >
          {/* <Text size={15} fontWeight={"200"}>
            Loading
          </Text> */}
          <ActivityIndicator size="small" color="grey" />
        </Block>
      </Block>
    </Modal>
  );
}

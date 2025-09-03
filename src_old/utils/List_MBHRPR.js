import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Block from "../components/Block";
import Text from "../components/Text";
import Button from "../components/Button";
import Icon_next from "../icons/Next";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { setLanguageItem } from "../Language";
import { Color } from "../colors/color";

const Item_MBHRPR = () => {
  const navigation = useNavigation();
  const state = useSelector((state) => state);
  let dataMenuMBHRs = [];
  let language;
  try {
    dataMenuMBHRs = state.menuReducer.data.data.menu;
    language = state.loginReducers.data.data.user_language;
  } catch (error) {}
  const [dataMenuMBHRPR, setDataMenuMBHRPR] = useState([]);

  useEffect(() => {
    let dataMenuMBHRPRs = [];
    dataMenuMBHRs.map((item) => {
      if (
        item.p_pk === dataMenuMBHRs.filter((i) => i.menu_cd === "MBHRPR")[0].pk
      ) {
        dataMenuMBHRPRs.push(item);
      }
      setDataMenuMBHRPR(dataMenuMBHRPRs);
    });
  }, []);
  const renderItem = ({ item, index }) => {
    return (
      <Block>
        <Button
          nextScreen={() => navigation.navigate(item.menu_cd)}
          shadow
          height={60}
          justifyContent={"space-between"}
          alignCenter
          marginLeft={20}
          marginRight={20}
          marginBottom={10}
          radius={8}
          row
          backgroundColor={Color.tabColor}
        >
          <Block
            marginLeft={10}
            height={40}
            width={40}
            radius={6}
            alignCenter
            justifyCenter
          >
            <Icon name={item.icon} color={Color.titleColor} size={24} />
          </Block>
          <Text
            flex
            paddingLeft={10}
            height={60}
            size={16}
            color={Color.titleColor}
            fontFamily={"Roboto-Medium"}
          >
            {setLanguageItem(item, language)}
          </Text>
          <Icon_next color={Color.titleColor} style={{ marginRight: 10 }} />
        </Button>
      </Block>
    );
  };

  return (
    <Block flex paddingTop={10}>
      <FlatList
        data={dataMenuMBHRPR}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </Block>
  );
};

export default Item_MBHRPR;

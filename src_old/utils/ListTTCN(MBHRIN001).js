/* eslint-disable react-native/no-inline-styles */
import React, { useState } from "react";
import { FlatList, Platform, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import Block from "../components/Block";
import Button from "../components/Button";
import Text from "../components/Text";
import Icon_next from "../icons/Next";

const Item_MBHRIN = ({ data, fetchItems, refreshing }) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const state = useSelector((state) => state);
  let userLanguage;
  let dataLanguage = [];
  try {
    userLanguage = state.loginReducers.data.data.user_language;
    dataLanguage = state.languageReducer.data.data.language;
    // dataLanguage = state.loginReducers.data.data.user_language;
  } catch (error) {}
  const [currentData, setCurrentData] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [TabName, setTabName] = useState("");

  const data_language = [];
  dataLanguage.map((item, key) => {
    if (
      item.field_name === "personal_inf" ||
      item.field_name === "work_inf" ||
      item.field_name === "contract_inf" ||
      item.field_name === "salary_inf" ||
      item.field_name === "family_inf" ||
      item.field_name === "disciplinary_inf" ||
      item.field_name === "edu_inf"
    ) {
      data_language.push(item);
    }
  });
  function selectRecord(data, params, item) {
    if (params === "ENG") {
      return item.eng;
    } else if (params === "VIE") {
      return item.vie;
    } else if (params === "KOR") {
      return item.kor;
    } else if (params === "CHI") {
      return item.chi;
    } else if (params === "JAP") {
      return item.jap;
    } else if (params === "FRA") {
      return item.fra;
    }
  }
  function selectLag(params, items) {
    if (params === "ENG") {
      if (items.val.field_name === "") {
        if (items.key.substr(0, 5) === "allow") {
          const vals = items.val2.split("_");
          if (vals[1] === "Y") {
            return (
              <Block
                row
                borderBottomWidth={1}
                borderBottomColor={Color.borderColor}
                paddingLeft={5}
                paddingRight={5}
                paddingTop={10}
                paddingBottom={10}
                justifyContent={"space-between"}
              >
                <Text color={Color.keyColor} flex={1}>
                  {vals[2]}
                </Text>
                <Text color={Color.valueColor} flex={1}>
                  {vals[0]} Vnđ
                </Text>
              </Block>
            );
          } else if (vals[1] === "N") {
            <Block />;
          }
        } else {
          return (
            <Block
              row
              borderBottomWidth={1}
              borderBottomColor={Color.borderColor}
              paddingLeft={5}
              paddingRight={5}
              paddingTop={10}
              paddingBottom={10}
              justifyContent={"space-between"}
            >
              <Text color={Color.keyColor} flex={1}>
                {items.key}
              </Text>
              <Text color={Color.valueColor} flex={1}>
                {items.val2}
              </Text>
            </Block>
          );
        }
      } else {
        return (
          <Block
            row
            borderBottomWidth={1}
            borderBottomColor={Color.borderColor}
            paddingLeft={5}
            paddingRight={5}
            paddingTop={10}
            paddingBottom={10}
            justifyContent={"space-between"}
          >
            <Text color={Color.keyColor} flex={1}>
              {items.val.eng}
            </Text>
            <Text color={Color.valueColor} flex={1}>
              {items.val2}
            </Text>
          </Block>
        );
      }
    } else if (params === "VIE") {
      if (items.val.field_name === "") {
        if (items.key.substr(0, 5) === "allow") {
          const vals = items.val2.split("_");
          if (vals[1] === "Y") {
            return (
              <Block
                row
                borderBottomWidth={1}
                borderBottomColor={Color.borderColor}
                paddingLeft={5}
                paddingRight={5}
                paddingTop={10}
                paddingBottom={10}
                justifyContent={"space-between"}
              >
                <Text color={Color.keyColor} flex={1}>
                  {vals[2]}
                </Text>
                <Text color={Color.valueColor} flex={1}>
                  {vals[0]} Vnđ
                </Text>
              </Block>
            );
          } else if (vals[1] === "N") {
            <Block />;
          }
        } else {
          return (
            <Block
              row
              borderBottomWidth={1}
              borderBottomColor={Color.borderColor}
              paddingLeft={5}
              paddingRight={5}
              paddingTop={10}
              paddingBottom={10}
              justifyContent={"space-between"}
            >
              <Text color={Color.keyColor} flex={1}>
                {items.key}
              </Text>
              <Text color={Color.valueColor} flex={1}>
                {items.val2}
              </Text>
            </Block>
          );
        }
      } else {
        return (
          <Block
            row
            borderBottomWidth={1}
            borderBottomColor={Color.borderColor}
            paddingLeft={5}
            paddingRight={5}
            paddingTop={10}
            paddingBottom={10}
            justifyContent={"space-between"}
          >
            <Text color={Color.keyColor} flex={1}>
              {items.val.vie}
            </Text>
            <Text color={Color.valueColor} flex={1}>
              {items.val2}
            </Text>
          </Block>
        );
      }
    } else if (params === "KOR") {
      if (items.val.field_name === "") {
        if (items.key.substr(0, 5) === "allow") {
          const vals = items.val2.split("_");
          if (vals[1] === "Y") {
            return (
              <Block
                row
                borderBottomWidth={1}
                borderBottomColor={Color.borderColor}
                paddingLeft={5}
                paddingRight={5}
                paddingTop={10}
                paddingBottom={10}
                justifyContent={"space-between"}
              >
                <Text color={Color.keyColor} flex={1}>
                  {vals[2]}
                </Text>
                <Text color={Color.valueColor} flex={1}>
                  {vals[0]} Vnđ
                </Text>
              </Block>
            );
          } else if (vals[1] === "N") {
            <Block />;
          }
        } else {
          return (
            <Block
              row
              borderBottomWidth={1}
              borderBottomColor={Color.borderColor}
              paddingLeft={5}
              paddingRight={5}
              paddingTop={10}
              paddingBottom={10}
              justifyContent={"space-between"}
            >
              <Text color={Color.keyColor} flex={1}>
                {items.key}
              </Text>
              <Text color={Color.valueColor} flex={1}>
                {items.val2}
              </Text>
            </Block>
          );
        }
      } else {
        return (
          <Block
            row
            borderBottomWidth={1}
            borderBottomColor={Color.borderColor}
            paddingLeft={5}
            paddingRight={5}
            paddingTop={10}
            paddingBottom={10}
            justifyContent={"space-between"}
          >
            <Text color={Color.keyColor} flex={1}>
              {items.val.kor}
            </Text>
            <Text color={Color.valueColor} flex={1}>
              {items.val2}
            </Text>
          </Block>
        );
      }
    } else if (params === "CHI") {
      return (
        <Text color={Color.keyColor} flex={1}>
          {items.val.chi}
        </Text>
      );
    } else if (params === "JAP") {
      return (
        <Text color={Color.keyColor} flex={1}>
          {items.val.jap}
        </Text>
      );
    } else if (params === "FRA") {
      return (
        <Text color={Color.keyColor} flex={1}>
          {items.val.fra}
        </Text>
      );
    }
  }

  const showList = (id) => {
    if (id === 1) {
      setVisit(true);
      setVisit1(false);
      setVisit2(false);
      setVisit3(false);
      setVisit4(false);
      setVisit5(false);
      setVisit6(false);
      if (visit == true) {
        setVisit(false);
      } else {
        setVisit(true);
      }
    } else if (id === 2) {
      setVisit1(true);
      setVisit(false);
      setVisit2(false);
      setVisit3(false);
      setVisit4(false);
      setVisit5(false);
      setVisit6(false);
      if (visit1 == true) {
        setVisit1(false);
      } else {
        setVisit1(true);
      }
    } else if (id === 3) {
      setVisit1(false);
      setVisit(false);
      setVisit2(true);
      setVisit3(false);
      setVisit4(false);
      setVisit5(false);
      setVisit6(false);
      if (visit2 == true) {
        setVisit2(false);
      } else {
        setVisit2(true);
      }
    } else if (id === 4) {
      setVisit1(false);
      setVisit(false);
      setVisit2(false);
      setVisit3(true);
      setVisit4(false);
      setVisit5(false);
      setVisit6(false);
      if (visit3 == true) {
        setVisit3(false);
      } else {
        setVisit3(true);
      }
    } else if (id === 5) {
      setVisit1(false);
      setVisit(false);
      setVisit2(false);
      setVisit3(false);
      setVisit4(!visit4);
      setVisit5(false);
      setVisit6(false);
    } else if (id === 6) {
      setVisit1(false);
      setVisit(false);
      setVisit2(false);
      setVisit3(false);
      setVisit4(false);
      setVisit5(!visit5);
      setVisit6(false);
    } else if (id === 7) {
      setVisit1(false);
      setVisit(false);
      setVisit2(false);
      setVisit3(false);
      setVisit4(false);
      setVisit5(false);
      setVisit6(!visit6);
    }
  };

  function Item(field_name, id) {
    let temp = data_language.filter((e) => e.field_name === field_name);
    return (
      <Button
        nextScreen={() => showList(id)}
        shadow
        height={36}
        justifyContent={"space-between"}
        alignCenter
        marginLeft={10}
        marginRight={10}
        marginBottom={2}
        radius={8}
        row
        backgroundColor={Color.tabColor}
      >
        <Block
          marginLeft={10}
          height={10}
          width={10}
          radius={5}
          backgroundColor={Color.titleColor}
        />
        <Text
          flex
          paddingLeft={10}
          height={60}
          size={16}
          color={Color.titleColor}
          fontFamily={"Roboto-Bold"}
        >
          {temp.length === 0
            ? field_name
            : selectRecord(data_language, userLanguage, temp[0])}
        </Text>
        <Icon_next color={Color.titleColor} style={{ marginRight: 10 }} />
      </Button>
    );
  }

  function showlist2(vis, datass) {
    return vis ? (
      <Block
        flex
        marginBottom={10}
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
        <FlatList
          data={datass}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={fetchItems}
          refreshing={refreshing}
        />
      </Block>
    ) : (
      <Block />
    );
  }

  const renderItem = ({ item, index }) => {
    return (
      <Block
        // width={Dimensions.get('screen').width}
        style={{
          marginLeft: 10,
          marginRight: 10,
          backgroundColor: index % 2 === 0 ? "white" : Color.blueB,
        }}
      >
        {selectLag(userLanguage, item)}
      </Block>
    );
  };

  //func of render Multi Tab
  const renderMulti = ({ item, index }) => {
    let temp = item.txtvalue.split("|");
    return (
      <Block
        keyExtractor={index.toString()}
        backgroundColor={Color.blueB}
        // padding={10}
        marginLeft={10}
        // borderBottomColor={Color.line}
        // borderBottomWidth={1}
        marginRight={10}
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
        marginBottom={10}
      >
        {temp.map((i, index) => {
          let temp = i.toString().split(":");
          return (
            <View
              style={{
                flexDirection: "row",
                padding: 10,
                backgroundColor: index % 2 === 0 ? "white" : Color.blueB,
              }}
            >
              <Text color={Color.keyColor} flex={1}>
                {temp[0]}
              </Text>
              <Text color={Color.valueColor} flex={1}>
                {temp[1]}
              </Text>
            </View>
          );
        })}
      </Block>
    );
  };

  const renderTitle = ({ item, index }) => {
    const tempTabName = dataLanguage.filter(
      (x) => x.field_name === item.tab_name
    );
    const currentTabName =
      tempTabName.length > 0
        ? tempTabName[0][userLanguage.toLowerCase()]
        : item.tab_name;
    return (
      <>
        {item.use_yn === "Y" ? (
          <Button
            nextScreen={() => {
              setIsShow(true);
              setCurrentData(data["o" + (index + 2)]);
              setTabName(currentTabName);
            }}
            shadow
            justifyContent={"space-between"}
            alignCenter
            marginLeft={10}
            marginRight={10}
            marginBottom={5}
            radius={8}
            padding={10}
            row
            backgroundColor={Color.tabColor}
          >
            <Block
              marginLeft={10}
              height={10}
              width={10}
              radius={5}
              backgroundColor={Color.titleColor}
            />
            <Text
              flex
              paddingLeft={10}
              height={60}
              size={16}
              color={Color.titleColor}
              fontFamily={"Roboto-Bold"}
            >
              {currentTabName}
            </Text>
            <Icon_next color={Color.titleColor} style={{ marginRight: 10 }} />
          </Button>
        ) : null}
      </>
    );
  };
  const RenderOneTabComponent = ({
    data,
    tabName,
    isShow,
    renderMulti,
    fetchItems,
  }) => {
    return (
      <Block
        style={{
          flex: 1,
          position: "absolute",
          zIndex: 99,
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
        }}
      >
        <Button
          nextScreen={() => {
            setIsShow(false);
            setCurrentData([]);
            setTabName("");
          }}
          shadow
          justifyContent={"space-between"}
          alignCenter
          marginLeft={10}
          marginRight={10}
          marginBottom={5}
          radius={8}
          padding={10}
          row
          backgroundColor={Color.tabColor}
        >
          <Block
            marginLeft={10}
            height={10}
            width={10}
            radius={5}
            backgroundColor={Color.titleColor}
          />
          <Text
            flex
            paddingLeft={10}
            height={60}
            size={16}
            color={Color.titleColor}
            fontFamily={"Roboto-Bold"}
          >
            {tabName}
          </Text>
          <Icon
            name={"close-circle"}
            size={20}
            color={Color.titleColor}
            style={{ marginRight: 10 }}
          />
        </Button>
        <FlatList
          data={data}
          renderItem={renderMulti}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={fetchItems}
          refreshing={false}
        />
      </Block>
    );
  };
  return (
    <Block marginBottom={Platform.OS === "ios" ? 20 : 5} flex>
      {isShow ? (
        <RenderOneTabComponent
          data={currentData}
          tabName={TabName}
          isShow={isShow}
          renderMulti={renderMulti}
          fetchItems={fetchItems}
        />
      ) : (
        <FlatList
          refreshing={false}
          data={data.o1}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderTitle}
          onRefresh={() => console.log("test")}
        />
      )}
    </Block>
  );
};

export default Item_MBHRIN;

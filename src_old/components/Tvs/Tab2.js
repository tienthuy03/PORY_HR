import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import * as AMT from "react-native-animatable";

const TVSTab = ({
  scrollEnabled = true,
  fullTab = false,
  onChangeTab = null,
  tab = 0,
  ...props
}) => {
  const flatlistRef = useRef();
  const { data } = props;
  const Color = useSelector((s) => s.SystemReducer.theme);

  const windowWidth = (Dimensions.get("window").width - 20) / data.length;

  //customize tab
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    setCurrentTab(tab);
    onChangeTab && onChangeTab(tab);
  }, [tab]);

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <View
        style={{
          flex: 0,
          flexDirection: "row",
          marginHorizontal: 10,
          borderRadius: 10,
          backgroundColor: "white",
        }}
      >
        <FlatList
          ref={flatlistRef}
          scrollEnabled={scrollEnabled}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={data}
          keyExtractor={(item, index) => {
            const onlyKey = index.toString() + "tabs" + Math.random();
            return onlyKey;
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={"tab" + Math.random()}
              activeOpacity={0.7}
              style={{
                width: fullTab ? windowWidth : null,
                flex: fullTab ? 1 : 0,
                padding: 10,
                justifyContent: "flex-start",
                flexDirection: "row",
                borderBottomColor:
                  // item.id === currentTab
                  //   ? item.bottomColor != null
                  //     ? item.bottomColor
                  //     : Color.tabUnderLine
                  //   : "#ccc",
                  item.id == "0" && currentTab == "0"
                    ? "#D2691E"
                    : item.id == "1" && currentTab == "1"
                      ? "#17a2b8"
                      : item.id == "2" && currentTab == "2"
                        ? "#2262e3"
                        : item.id == "3" && currentTab == "3"
                          ? "red"
                          : item.id == "4" && currentTab == "4"
                            ? "#009E00"
                            : item.id == "5" && currentTab == "5"
                              ? "red"
                              : "#7F8C8D",
                borderBottomWidth: 3,
              }}
              onPress={() => {
                let index = 0;
                if (item.id === 0 || item.id === data.length - 1) {
                  index = item.id;
                } else {
                  index = item.id - 1;
                }
                flatlistRef.current.scrollToIndex({ index });
                setCurrentTab(item.id);
                onChangeTab && onChangeTab(item.id);
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    paddingHorizontal: 10,
                    color:
                      item.id == "0" && currentTab == "0"
                        ? "#D2691E"
                        : item.id == "1" && currentTab == "1"
                          ? "#17a2b8"
                          : item.id == "2" && currentTab == "2"
                            ? "#2262e3"
                            : item.id == "3" && currentTab == "3"
                              ? "red"
                              : item.id == "4" && currentTab == "4"
                                ? "#009E00"
                                : item.id == "5" && currentTab == "5"
                                  ? "red"
                                  : "#7F8C8D",
                    fontWeight: "bold",
                    // color: item.id === currentTab ? Color.mainColor : "#7F8C8D",
                  }}
                >
                  {item.name}
                </Text>
              </View>
              {item.count != null ? (
                <View
                  style={{
                    minWidth: 20,
                    minHeight: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 2,
                    paddingHorizontal: 5,
                  }}
                >
                  <Text
                    style={{
                      color:
                        item.id == "0" && currentTab == "0"
                          ? "#D2691E"
                          : item.id == "1" && currentTab == "1"
                            ? "#17a2b8"
                            : item.id == "2" && currentTab == "2"
                              ? "#2262e3"
                              : item.id == "3" && currentTab == "3"
                                ? "red"
                                : item.id == "4" && currentTab == "4"
                                  ? "#009E00"
                                  : item.id == "5" && currentTab == "5"
                                    ? "red"
                                    : "#7F8C8D",
                      fontSize: 15,
                      fontWeight: "bold",
                    }}
                  >
                    {item.count}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          )}
        />
      </View>
      <Effect key={data[currentTab].id}>
        {data[currentTab] ? data[currentTab].screen : null}
      </Effect>
    </View>
  );
};
const Effect = ({ children }) => {
  return (
    <AMT.View style={{ flex: 1 }} animation={"fadeInRight"} duration={300}>
      {children}
    </AMT.View>
  );
};
export default TVSTab;

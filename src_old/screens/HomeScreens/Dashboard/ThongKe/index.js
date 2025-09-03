/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  AppState,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Color } from "../../../../colors/colorhp";
import { HRDB001LayDuLieuThongKe } from "../../../../services/redux/Dashboard/action";
import TKContent from "./TKContent";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
const styles = StyleSheet.create({
  label: {
    width: "50%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
  },
});
const ThongKe = ({ navigation }) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const { single, menu, detail, detail2 } = useSelector(
    (state) => state.HRDB001_DashboardReducer.DuLieuThongKe
  );
  // const [expanded1, setExpanded1] = useState(false);

  useEffect(() => {
    if (isFocused) {
      dispatch(HRDB001LayDuLieuThongKe());
    }
  }, [isFocused]);

  const ItemDashboard = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => (item.path ? navigation.navigate(item.path) : null)}
        style={{
          width: "33%",
          padding: 5,
        }}
      >
        <View
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 10,
            backgroundColor: item.color_text
              ? item.color_text
              : Color.mainColor,
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: 75,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "flex-start",
              flex: 3,
              overflow: "hidden",
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                fontWeight: "bold",
                fontSize: 12,
                color: Color.white,
              }}
            >
              {item.title}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 24,
                color: Color.white,
              }}
            >
              {item.value}
            </Text>
            <Icon
              size={24}
              color={Color.white}
              name={item.icon ? item.icon : ""}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      > */}
      <View style={{ marginBottom: 10, flexDirection: "column" }}>
        <FlatList
          numColumns={3}
          data={single}
          onRefresh={() => {
            dispatch(HRDB001LayDuLieuThongKe());
          }}
          style={{ paddingHorizontal: 4 }}
          refreshing={false}
          scrollEnabled={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <ItemDashboard item={item} key={index} />
          )}
        />
      </View>
      <View style={{ marginBottom: 10 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={menu}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={() => {
            dispatch(HRDB001LayDuLieuThongKe());
          }}
          refreshing={false}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <ItemMenu
              item={item}
              detail={detail.filter((x) => x.parent == item.code)}
              detail2={detail2.filter((x) => x.parent == item.code)}
            />
          )}
        />
      </View>
      {/* </ScrollView> */}
    </View>
  );
};
const ItemMenu = ({ item, detail, detail2 }) => {
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation();
  let count1 = 0;
  let count2 = 0;
  let count3 = 0;
  detail.forEach(function (itemD) {
    count1 += Number(itemD.count.split("|")[0].split(":")[1]);
    count2 += Number(itemD.count.split("|")[1].split(":")[1]);
    count3 += Number(itemD.count.split("|")[2].split(":")[1]);
  });
  return item.menu_type == 1 ? (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setExpanded(!expanded);
          }}
        >
          <View
            style={{
              height: 60,
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 5,
              marginBottom: 10,
              borderRadius: 8,
              flexDirection: "row",
              backgroundColor: Color.tabColor,
            }}
          >
            <View
              style={{
                // paddingLeft: 10,
                minWidth: 50,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                }}
              >
                <LinearGradient
                  colors={[item.color_from, item.color_to]}
                  style={{
                    flex: 1,
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "transparent",
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon name={item.icon} size={25} color="white" />
                  </View>
                </LinearGradient>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                marginLeft: 10,
                width: 40,
                justifyContent: "center",
              }}
            >
              <View>
                <Text
                  numberOfLines={1}
                  paddingLeft={10}
                  height={60}
                  fontFamily={"Roboto-Medium"}
                  style={{
                    // fontWeight: 'bold',
                    fontSize: 17,
                    color: Color.mainColor,
                  }}
                >
                  {item.name}
                </Text>
              </View>
            </View>
            <View
              style={{
                minWidth: 5,
                minHeight: 30,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 2,
                paddingHorizontal: 5,
                marginLeft: 1,
                marginVertical: 15,
                marginHorizontal: 2,
              }}
            >
              <Text
                style={{
                  color: "#FFA800",
                  fontSize: 17,
                  fontWeight: "bold",
                }}
              >
                {count1}
              </Text>
            </View>
            <View
              style={{
                minWidth: 5,
                minHeight: 30,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 2,
                paddingHorizontal: 5,
                marginLeft: 1,
                marginVertical: 15,
                marginHorizontal: 2,
              }}
            >
              <Text
                style={{
                  color: "#009E00",
                  fontSize: 17,
                  fontWeight: "bold",
                }}
              >
                {count2}
              </Text>
            </View>
            <View
              style={{
                minWidth: 5,
                minHeight: 30,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 2,
                paddingHorizontal: 5,
                marginLeft: 1,
                marginVertical: 15,
                marginHorizontal: 2,
              }}
            >
              <Text
                style={{
                  color: "red",
                  fontSize: 17,
                  fontWeight: "bold",
                }}
              >
                {count3}
              </Text>
            </View>
            <View
              style={{
                marginRight: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                size={25}
                color={Color.mainColor}
                name={expanded ? "chevron-up" : "chevron-down"}
              />
            </View>
          </View>
        </TouchableOpacity>
        {expanded && (
          <FlatList
            data={detail}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => <ItemDetail item={item} />}
          />
        )}
      </View>
    </View>
  ) : item.menu_type == "2" ? (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setExpanded(!expanded);
        }}
      >
        <View
          style={{
            height: 60,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 5,
            marginBottom: 5,
            borderRadius: 8,
            flexDirection: "row",
            backgroundColor: Color.tabColor,
          }}
        >
          <View
            style={{
              minWidth: 50,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
              }}
            >
              <LinearGradient
                colors={[item.color_from, item.color_to]}
                style={{
                  flex: 1,
                  borderTopLeftRadius: 8,
                  borderBottomLeftRadius: 8,
                }}
              >
                <View
                  style={{
                    backgroundColor: "transparent",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon name={item.icon} size={25} color="white" />
                </View>
              </LinearGradient>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              marginLeft: 10,
              width: 40,
              justifyContent: "center",
            }}
          >
            <View>
              <Text
                numberOfLines={1}
                paddingLeft={10}
                height={60}
                fontFamily={"Roboto-Medium"}
                style={{
                  // fontWeight: 'bold',
                  fontSize: 17,
                  color: Color.mainColor,
                }}
              >
                {item.name}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginRight: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              size={25}
              color={Color.mainColor}
              name={expanded ? "chevron-up" : "chevron-down"}
            />
          </View>
        </View>
      </TouchableOpacity>

      {expanded && (
        <>
          <View style={{ marginBottom: 10 }}>
            <FlatList
              data={detail2}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => <Item item={item} />}
            />
          </View>
        </>
      )}
    </View>
  ) : (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => {
          // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          // setExpanded(!expanded);
          item.path ? navigation.navigate(item.path) : null;
        }}
      >
        <View
          style={{
            height: 60,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 5,
            marginBottom: 5,
            borderRadius: 8,
            flexDirection: "row",
            backgroundColor: Color.tabColor,
          }}
        >
          <View
            style={{
              minWidth: 50,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
              }}
            >
              <LinearGradient
                colors={[item.color_from, item.color_to]}
                style={{
                  flex: 1,
                  borderTopLeftRadius: 8,
                  borderBottomLeftRadius: 8,
                }}
              >
                <View
                  style={{
                    backgroundColor: "transparent",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon name={item.icon} size={25} color="white" />
                </View>
              </LinearGradient>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              marginLeft: 10,
              width: 40,
              justifyContent: "center",
            }}
          >
            <View>
              <Text
                numberOfLines={1}
                paddingLeft={10}
                height={60}
                fontFamily={"Roboto-Medium"}
                style={{
                  // fontWeight: 'bold',
                  fontSize: 17,
                  color: Color.mainColor,
                }}
              >
                {item.name}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginRight: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={25} color={Color.mainColor} name={"chevron-right"} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
const ItemDetail = ({ item }) => {
  let count1 = 0;
  let count2 = 0;
  let count3 = 0;
  count1 = item.count.split("|")[0].split(":")[1];
  count2 = item.count.split("|")[1].split(":")[1];
  count3 = item.count.split("|")[2].split(":")[1];
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => (item.path ? navigation.navigate(item.path) : null)}
    >
      <View style={{ marginHorizontal: 20 }}>
        <View
          style={{
            height: 40,
            justifyContent: "center",
            marginHorizontal: 5,
            marginBottom: 5,
            borderRadius: 8,
            flexDirection: "row",
            backgroundColor: Color.tabColor,
          }}
        >
          <View
            style={{
              marginLeft: 10,
              width: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name={"circle"} color={Color.titleColor} size={13} />
          </View>
          <View
            style={{
              flex: 1,
              marginLeft: 10,
              width: 40,
              justifyContent: "center",
            }}
          >
            <View>
              <Text
                numberOfLines={1}
                paddingLeft={10}
                size={16}
                color={Color.titleColor}
                fontFamily={"Roboto-Medium"}
              >
                {item.name}
              </Text>
            </View>
          </View>
          <View
            style={{
              minWidth: 5,
              minHeight: 30,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 5,
              marginLeft: 1,
              marginVertical: 5,
              marginHorizontal: 2,
            }}
          >
            <Text
              style={{
                color: "#FFA800",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              {count1}
            </Text>
          </View>
          <View
            style={{
              minWidth: 5,
              minHeight: 30,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 5,
              marginLeft: 1,
              marginVertical: 5,
              marginHorizontal: 2,
            }}
          >
            <Text
              style={{
                color: "#009E00",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              {count2}
            </Text>
          </View>
          <View
            style={{
              minWidth: 5,
              minHeight: 30,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 5,
              marginLeft: 1,
              marginRight: 10,
              marginVertical: 5,
              marginHorizontal: 2,
            }}
          >
            <Text
              style={{
                color: "red",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              {count3}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const OneContent = ({ item, values, navigation, type, menu }) => {
  return (
    <View
      style={{
        backgroundColor: "rgba(00,00,00,.03)",
        marginBottom: 10,
      }}
    >
      <TKContent
        data={type.filter((sub) => sub.parent === item.code)}
        values={values}
        menu={menu.filter((sub) => sub.parent === item.code)}
        navigation={navigation}
      />
    </View>
  );
};

const Item = ({ item }) => {
  return (
    <View
      style={{
        paddingHorizontal: 10,
        marginHorizontal: 10,
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: Color.white,
        borderBottomWidth: 1,
        borderBottomColor: "#F4F6F7",
      }}
    >
      <View>
        <Text>{item.title}</Text>
      </View>
      <View>
        <Text>{item.value}</Text>
      </View>
    </View>
  );
};
export default ThongKe;

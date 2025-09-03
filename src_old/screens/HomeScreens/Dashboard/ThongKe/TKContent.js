import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
} from "react-native";
import { Color } from "../../../../colors/colorhp";
import Block from "../../../../components/Block";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const TKContent = ({ data, values, navigation, menu }) => {
  return (
    <>
      <FlatList
        style={{
          padding: 5,
        }}
        // numColumns={3}
        data={data}
        renderItem={({ item, index }) => (
          <OneItem1
            item={item}
            values={values.filter((x) => x.parent === item.code)}
            navigation={navigation}
            menu={values.filter((x) => x.parent === menu.code)}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      {/* <FlatList
        style={{
          padding: 5,
        }}
        data={data}
        renderItem={({item, index}) => <OneItem2 menu={menu} />}
        keyExtractor={(item, index) => index.toString()}
      /> */}
    </>
  );
};
const OneItem1 = ({ item, values, navigation, menu }) => {
  const arrSubValue = values.length > 0 ? values[0].value.split("|") : [];
  // const arrSubMenu = values.length > 0 ? values[0].value.split('|') : [];
  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  const [expanded, setExpanded] = useState(false);
  const { type } = item;
  return type === "single" ? (
    <FlatList
      numColumns={3}
      data={arrSubValue}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          onPress={() =>
            item.split(":")[2] ? navigation.navigate(item.split(":")[2]) : null
          }
          style={{
            width: "33%",
            padding: 5,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              padding: 10,
              flex: 1,
            }}
          >
            <Text
              style={{
                color: Color.mainColor,
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {item.split(":")[1]}
            </Text>
            <Text
              style={{
                textAlign: "center",
              }}
            >
              {item.split(":")[0]}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  ) : type === "menu" ? (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            setExpanded(!expanded);
          }}
        >
          {/* <Text>Press me to {expanded ? 'collapse' : 'expand'}!</Text> */}
          <View
            style={{
              height: 60,
              justifyContent: "center",
              marginHorizontal: 5,
              marginBottom: 10,
              borderRadius: 8,
              flexDirection: "row",
              backgroundColor: Color.tabColor,
            }}
          >
            <View
              style={{
                marginLeft: 10,
                width: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                name={"backspace-outline"}
                color={Color.titleColor}
                size={24}
              />
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
                  size={16}
                  color={Color.titleColor}
                  fontFamily={"Roboto-Medium"}
                >
                  Đơn từ - Đề nghị
                </Text>
              </View>
            </View>
            <View
              style={{
                borderColor: "#FFA800",
                borderWidth: 1,
                borderRadius: 5,
                minWidth: 30,
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
                  fontSize: 12,
                }}
              >
                1
              </Text>
            </View>
            <View
              style={{
                borderColor: "#009E00",
                borderWidth: 1,
                borderRadius: 5,
                minWidth: 30,
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
                  fontSize: 12,
                }}
              >
                2
              </Text>
            </View>
            <View
              style={{
                borderColor: "red",
                borderWidth: 1,
                borderRadius: 5,
                minWidth: 30,
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
                  fontSize: 12,
                }}
              >
                3
              </Text>
            </View>
            <View
              style={{
                marginRight: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={25} color={Color.mainColor} name={"chevron-down"} />
            </View>
          </View>
        </TouchableOpacity>
        {expanded && (
          <View style={styles.tile}>
            <Text>I disappear sometimes!</Text>
          </View>
        )}
      </View>
    </View>
  ) : null;
};
const OneItem = ({ item, values, navigation }) => {
  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  const [expanded, setExpanded] = useState(false);
  const arrSubValue = values.length > 0 ? values[0].value.split("|") : [];
  const total = values.length > 0 ? values[0].total : 0;
  const path = values.length > 0 ? values[0].path : null;
  const { type } = item;
  return type === "single" ? (
    <FlatList
      numColumns={3}
      data={arrSubValue}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          onPress={() =>
            item.split(":")[2] ? navigation.navigate(item.split(":")[2]) : null
          }
          style={{
            width: "33%",
            padding: 5,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              padding: 10,
              flex: 1,
            }}
          >
            <Text
              style={{
                color: Color.mainColor,
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {item.split(":")[1]}
            </Text>
            <Text
              style={{
                textAlign: "center",
              }}
            >
              {item.split(":")[0]}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  ) : (
    <View>
      {arrSubValue && (
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
              setExpanded(!expanded);
            }}
          >
            {/* <Text>Press me to {expanded ? 'collapse' : 'expand'}!</Text> */}
            <View
              style={{
                height: 60,
                justifyContent: "center",
                marginHorizontal: 5,
                marginBottom: 10,
                borderRadius: 8,
                flexDirection: "row",
                backgroundColor: Color.tabColor,
              }}
            >
              <View
                style={{
                  marginLeft: 10,
                  width: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  name={"backspace-outline"}
                  color={Color.titleColor}
                  size={24}
                />
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
                    size={16}
                    color={Color.titleColor}
                    fontFamily={"Roboto-Medium"}
                  >
                    Đơn từ - Đề nghị
                  </Text>
                </View>
              </View>
              <View
                style={{
                  borderColor: "#FFA800",
                  borderWidth: 1,
                  borderRadius: 5,
                  minWidth: 30,
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
                    fontSize: 12,
                  }}
                >
                  1
                </Text>
              </View>
              <View
                style={{
                  borderColor: "#009E00",
                  borderWidth: 1,
                  borderRadius: 5,
                  minWidth: 30,
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
                    fontSize: 12,
                  }}
                >
                  2
                </Text>
              </View>
              <View
                style={{
                  borderColor: "red",
                  borderWidth: 1,
                  borderRadius: 5,
                  minWidth: 30,
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
                    fontSize: 12,
                  }}
                >
                  3
                </Text>
              </View>
              <View
                style={{
                  marginRight: 5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={25} color={Color.mainColor} name={"chevron-down"} />
              </View>
            </View>
          </TouchableOpacity>
          {expanded && (
            <View style={styles.tile}>
              <Text>I disappear sometimes!</Text>
            </View>
          )}
        </View>
      )}
    </View>
    // <View style={styles.label}>
    //   <View
    //     style={{
    //       marginHorizontal: 2,
    //       marginVertical: 5,
    //       backgroundColor: 'white',
    //       borderRadius: 10,
    //       flex: 1,
    //     }}>
    //     {item.name.length > 0 && (
    //       <View
    //         style={{
    //           borderTopRightRadius: 10,
    //           borderTopLeftRadius: 10,
    //           paddingVertical: 10,
    //           flexDirection: 'row',
    //           paddingHorizontal: 10,
    //           backgroundColor: '#D6EAF8',
    //           paddingBottom: 5,
    //         }}>
    //         <Text
    //           style={{
    //             flex: 1,
    //             color: Color.mainColor,
    //           }}>
    //           {item.name}
    //         </Text>
    //         <Text>{total}</Text>
    //       </View>
    //     )}
    //     {arrSubValue && (
    //       <View
    //         style={{
    //           paddingHorizontal: 10,
    //           paddingVertical: 10,
    //         }}>
    //         {arrSubValue.map(x => {
    //           return <OneSubValue key={'subValue' + Math.random()} item={x} />;
    //         })}
    //         {path ? (
    //           <TouchableOpacity
    //             activeOpacity={0.7}
    //             onPress={() => (path ? navigation.navigate(path) : null)}
    //             style={{
    //               paddingVertical: 5,
    //               justifyContent: 'center',
    //               alignItems: 'center',
    //             }}>
    //             <Text
    //               style={{
    //                 color: Color.mainColor,
    //               }}>
    //               Xem thêm
    //             </Text>
    //           </TouchableOpacity>
    //         ) : null}
    //       </View>
    //     )}
    //   </View>
    // </View>
  );
};

const OneItem2 = ({ menu }) => {
  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  const [expanded, setExpanded] = useState(false);
  return menu.length > 0 ? (
    <FlatList
      data={menu}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <View>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                setExpanded(!expanded);
              }}
            >
              {/* <Text>Press me to {expanded ? 'collapse' : 'expand'}!</Text> */}
              <View
                style={{
                  height: 60,
                  justifyContent: "center",
                  marginHorizontal: 5,
                  marginBottom: 10,
                  borderRadius: 8,
                  flexDirection: "row",
                  backgroundColor: Color.tabColor,
                }}
              >
                <View
                  style={{
                    marginLeft: 10,
                    width: 40,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    name={"backspace-outline"}
                    color={Color.titleColor}
                    size={24}
                  />
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
                      size={16}
                      color={Color.titleColor}
                      fontFamily={"Roboto-Medium"}
                    >
                      Đơn từ - Đề nghị
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    borderColor: "#FFA800",
                    borderWidth: 1,
                    borderRadius: 5,
                    minWidth: 30,
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
                      fontSize: 12,
                    }}
                  >
                    1
                  </Text>
                </View>
                <View
                  style={{
                    borderColor: "#009E00",
                    borderWidth: 1,
                    borderRadius: 5,
                    minWidth: 30,
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
                      fontSize: 12,
                    }}
                  >
                    2
                  </Text>
                </View>
                <View
                  style={{
                    borderColor: "red",
                    borderWidth: 1,
                    borderRadius: 5,
                    minWidth: 30,
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
                      fontSize: 12,
                    }}
                  >
                    3
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
                    name={"chevron-down"}
                  />
                </View>
              </View>
            </TouchableOpacity>
            {expanded && (
              <View style={styles.tile}>
                <Text>I disappear sometimes!</Text>
              </View>
            )}
          </View>
        </View>
      )}
    />
  ) : null;
};

const OneSubValue = ({ item }) => {
  return (
    <View
      style={{
        marginBottom: 5,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            flex: 1,
            color: item.split(":")[2] ? item.split(":")[2] : null,
          }}
        >
          {item.split(":")[0]}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: item.split(":")[2] ? item.split(":")[2] : null,
          }}
        >
          {item.split(":")[1]}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    width: "50%",
  },
  tile: {
    backgroundColor: "lightgrey",
    borderWidth: 0.5,
    borderColor: "#d6d7da",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: 'center',
    overflow: "hidden",
  },
});
export default TKContent;

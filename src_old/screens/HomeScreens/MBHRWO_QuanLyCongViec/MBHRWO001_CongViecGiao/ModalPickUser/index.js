import React, { useEffect, useState } from "react";
import {
  Dimensions,
  TouchableOpacity,
  TextInput,
  View,
  Image,
} from "react-native";
import { Color } from "../../../../../colors/colortv";
import { FlatList } from "react-native-gesture-handler";
import Text from "../../../../../components/Text";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Block from "../../../../../components/Block";
import Button from "../../../../../components/Button";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import TVSButton from "../../../../../components/Tvs/Button";
import TVSCheckBox from "../../../../../components/Tvs/TVSCheckBox";
//type
//1: Nguoi giao viec
//2: Nguoi thuc hien
//3: Nguoi theo doi
const { width, height } = Dimensions.get("screen");

const ModalPickUser = ({
  children,
  disabled = false,
  required = false,
  label,
  onSelect,
  lstData,
  type,
  dataItemAssignSelectedSend,
  dataItemImplementSelectedSend,
  dataItemFollowSelectedSend,
  colorLabel = Color.mainColor,
}) => {

  const dataItemAssignSelected = dataItemAssignSelectedSend ? dataItemAssignSelectedSend : [];
  const dataItemImplementSelected = dataItemImplementSelectedSend ? dataItemImplementSelectedSend : [];
  const dataItemFollowSelected = dataItemFollowSelectedSend ? dataItemFollowSelectedSend : [];
  const [dataItem, setDataItem] = useState(lstData);
  const OnFilter = (text) => {
    if (text) {
      const newData = dataItem.filter(function (item) {
        const itemFilter = item.name
          ? item.name.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemFilter.indexOf(textData) > -1;
      });
      setDataItem(newData);
      setFilter(text);
    } else {
      setDataItem(lstData);
      setFilter(text);
    }
  };

  const onCheck = (item) => {
    let arrItem = [...dataItem];
    arrItem.forEach((itemArr) => {
      if (itemArr.pk == item.pk) {
        if (item.sel == "Y") {
          itemArr.sel = "N";
        } else {
          itemArr.sel = "Y";
        }
      }
    });
    setDataItem(arrItem);
  };

  const [modalVisibleSelect, setmodalVisibleSelect] = useState(false);
  const [filter, setFilter] = useState("");
  const modalSelect = (
    <TVSControlPopup
      minHeight={(height * 70) / 100}
      maxHeight={(height * 70) / 100}
      title={"Chọn " + label}
      isShow={modalVisibleSelect}
      onHide={() => {
        onSelect(dataItem);
        setmodalVisibleSelect(false);
      }}
      bottom={
        <>
          <TVSButton
            type={"danger"}
            icon={"close"}
            buttonStyle={"3"}
            onPress={() => {
              onSelect(dataItem);
              setmodalVisibleSelect(false);
            }}
          >
            Đóng lại
          </TVSButton>
        </>
      }
    >
      <>
        <View
          style={{
            marginBottom: 5,
            flexDirection: "row",
          }}
        >
          <Block
            style={{
              backgroundColor: Color.gray,
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
              justifyContent: "center",
              alignItems: "center",
              padding: 8,
            }}
          >
            <Icon
              name="account-search-outline"
              color={Color.grayPlahoder}
              size={30}
            />
          </Block>
          <Block
            style={{
              flex: 1,
              backgroundColor: Color.gray,
              paddingHorizontal: 5,
              paddingVertical: 10,
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
              justifyContent: "center",
            }}
          >
            <TextInput
              value={filter}
              placeholder={"Tìm kiếm"}
              onChangeText={(text) => {
                OnFilter(text);
              }}
            />
          </Block>
        </View>
        <FlatList
          data={dataItem}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  onCheck(item);
                }}
                style={{
                  backgroundColor: "#F3F6F9",
                  padding: 10,
                  borderRadius: 6,
                  marginBottom: 3,
                  flexDirection: "row",
                }}
              >
                <View>
                  <TVSCheckBox value={item.sel} onPress={() => onCheck(item)} />
                </View>
                <View style={{
                  marginLeft: 5,
                  width: 32,
                  borderRadius: 32,
                  borderColor: Color.grayPlahoder,
                  backgroundColor: 'white',
                  borderWidth: 1,
                  height: 32,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                  <Image
                    style={{
                      width: 30,
                      borderRadius: 30,
                      borderColor: Color.grayPlahoder,
                      resizeMode: "contain",
                      height: 30,
                    }}
                    source={{
                      uri: "data:image/png;base64," + item.image,
                    }}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    marginLeft: 5,
                  }}
                >
                  <Text>{item.name}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </>
    </TVSControlPopup>
  );

  const handleShowModel = () => {
    console.log("handleShowModel", dataItem.length);
    setmodalVisibleSelect(true);
  }

  return (
    <View style={{ flexDirection: "row", marginBottom: 5 }}>
      <Block style={{ marginHorizontal: 10, flex: 3 }}>
        <Button
          nextScreen={() => (disabled ? null : handleShowModel())}
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
              paddingLeft: 10,
              paddingVertical: 10,
              flexDirection: "row",
            }}
          >
            <Text style={{ color: colorLabel }}>{label}</Text>
            {required ? <Text style={{ color: Color.red }}> *</Text> : null}
          </Block>
          <Block style={{ justifyContent: "center", paddingRight: 10 }}>
            <Icon name={"chevron-down"} color={Color.mainColor} size={30} />
          </Block>
        </Button>
        {modalSelect}
      </Block>
      <View style={{ flex: 2 }}>
        {type == 1 ? (
          <>
            {dataItemAssignSelected.length > 0 ? (
              dataItemAssignSelected.length > 2 ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    style={{
                      width: 40,
                      borderRadius: 100,
                      borderColor: Color.grayPlahoder,
                      // borderWidth: 1,
                      resizeMode: "contain",
                      height: 40,
                    }}
                    source={{
                      uri:
                        "data:image/png;base64," +
                        dataItemAssignSelected[0].image,
                    }}
                  />
                  <Image
                    style={{
                      width: 40,
                      borderRadius: 100,
                      borderColor: Color.grayPlahoder,
                      // borderWidth: 1,
                      resizeMode: "contain",
                      height: 40,
                    }}
                    source={{
                      uri:
                        "data:image/png;base64," +
                        dataItemAssignSelected[1].image,
                    }}
                  />
                  <View
                    style={{
                      width: 40,
                      borderRadius: 100,
                      borderColor: Color.grayPlahoder,
                      // borderWidth: 1,
                      resizeMode: "contain",
                      height: 40,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>+{dataItemAssignSelected.length - 2}</Text>
                  </View>
                </View>
              ) : dataItemAssignSelected.length > 1 ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    style={{
                      width: 40,
                      borderRadius: 100,
                      borderColor: Color.grayPlahoder,
                      // borderWidth: 1,
                      resizeMode: "contain",
                      height: 40,
                    }}
                    source={{
                      uri:
                        "data:image/png;base64," +
                        dataItemAssignSelected[0].image,
                    }}
                  />
                  <Image
                    style={{
                      width: 40,
                      borderRadius: 100,
                      borderColor: Color.grayPlahoder,
                      // borderWidth: 1,
                      resizeMode: "contain",
                      height: 40,
                    }}
                    source={{
                      uri:
                        "data:image/png;base64," +
                        dataItemAssignSelected[1].image,
                    }}
                  />
                </View>
              ) : dataItemAssignSelected.length > 0 ? (
                <Image
                  style={{
                    width: 40,
                    borderRadius: 100,
                    borderColor: Color.grayPlahoder,
                    // borderWidth: 1,
                    resizeMode: "contain",
                    height: 40,
                  }}
                  source={{
                    uri:
                      "data:image/png;base64," +
                      dataItemAssignSelected[0].image,
                  }}
                />
              ) : null
            ) : null}
          </>
        ) : type == 2 ? (
          <>
            {dataItemImplementSelected.length > 0 ? (
              dataItemImplementSelected.length > 2 ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{
                    width: 42,
                    borderRadius: 42,
                    borderColor: Color.grayPlahoder,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    height: 42,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                    <Image
                      style={{
                        width: 40,
                        borderRadius: 100,
                        borderColor: Color.grayPlahoder,
                        // borderWidth: 1,
                        resizeMode: "contain",
                        height: 40,
                      }}
                      source={{
                        uri:
                          "data:image/png;base64," +
                          dataItemImplementSelected[0].image,
                      }}
                    />
                  </View>

                  <View style={{
                    marginLeft: 2,
                    width: 42,
                    borderRadius: 42,
                    borderColor: Color.grayPlahoder,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    height: 42,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                    <Image
                      style={{
                        width: 40,
                        borderRadius: 100,
                        borderColor: Color.grayPlahoder,
                        // borderWidth: 1,
                        resizeMode: "contain",
                        height: 40,
                      }}
                      source={{
                        uri:
                          "data:image/png;base64," +
                          dataItemImplementSelected[1].image,
                      }}
                    />
                  </View>

                  <View style={{
                    marginLeft: 2,
                    width: 42,
                    borderRadius: 42,
                    borderColor: Color.grayPlahoder,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    height: 42,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                    <View
                      style={{
                        width: 40,
                        borderRadius: 100,
                        borderColor: Color.grayPlahoder,
                        // borderWidth: 1,
                        resizeMode: "contain",
                        height: 40,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text>+{dataItemImplementSelected.length - 2}</Text>
                    </View>
                  </View>
                </View>
              ) : dataItemImplementSelected.length > 1 ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{
                    width: 42,
                    borderRadius: 42,
                    borderColor: Color.grayPlahoder,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    height: 42,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                    <Image
                      style={{
                        width: 40,
                        borderRadius: 100,
                        borderColor: Color.grayPlahoder,
                        // borderWidth: 1,
                        resizeMode: "contain",
                        height: 40,
                      }}
                      source={{
                        uri:
                          "data:image/png;base64," +
                          dataItemImplementSelected[0].image,
                      }}
                    />
                  </View>

                  <View style={{
                    marginLeft: 2,
                    width: 42,
                    borderRadius: 42,
                    borderColor: Color.grayPlahoder,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    height: 42,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                    <Image
                      style={{
                        width: 40,
                        borderRadius: 100,
                        borderColor: Color.grayPlahoder,
                        // borderWidth: 1,
                        resizeMode: "contain",
                        height: 40,
                      }}
                      source={{
                        uri:
                          "data:image/png;base64," +
                          dataItemImplementSelected[1].image,
                      }}
                    />
                  </View>
                </View>
              ) : dataItemImplementSelected.length > 0 ? (
                <View style={{
                  width: 42,
                  borderRadius: 42,
                  borderColor: Color.grayPlahoder,
                  backgroundColor: 'white',
                  borderWidth: 1,
                  height: 42,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                  <Image
                    style={{
                      width: 40,
                      borderRadius: 100,
                      borderColor: Color.grayPlahoder,
                      // borderWidth: 1,
                      resizeMode: "contain",
                      height: 40,
                    }}
                    source={{
                      uri:
                        "data:image/png;base64," +
                        dataItemImplementSelected[0].image,
                    }}
                  />
                </View>
              ) : null
            ) : null}
          </>
        ) : (
          <>
            {dataItemFollowSelected.length > 0 ? (
              dataItemFollowSelected.length > 2 ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{
                    width: 42,
                    borderRadius: 42,
                    borderColor: Color.grayPlahoder,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    height: 42,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                    <Image
                      style={{
                        width: 40,
                        borderRadius: 100,
                        borderColor: Color.grayPlahoder,
                        // borderWidth: 1,
                        resizeMode: "contain",
                        height: 40,
                      }}
                      source={{
                        uri:
                          "data:image/png;base64," +
                          dataItemFollowSelected[0].image,
                      }}
                    />
                  </View>

                  <View style={{
                    marginLeft: 2,
                    width: 42,
                    borderRadius: 42,
                    borderColor: Color.grayPlahoder,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    height: 42,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                    <Image
                      style={{
                        width: 40,
                        borderRadius: 100,
                        borderColor: Color.grayPlahoder,
                        // borderWidth: 1,
                        resizeMode: "contain",
                        height: 40,
                      }}
                      source={{
                        uri:
                          "data:image/png;base64," +
                          dataItemFollowSelected[1].image,
                      }}
                    />
                  </View>

                  <View style={{
                    marginLeft: 2,
                    width: 42,
                    borderRadius: 42,
                    borderColor: Color.grayPlahoder,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    height: 42,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                    <View
                      style={{
                        width: 40,
                        borderRadius: 100,
                        borderColor: Color.grayPlahoder,
                        // borderWidth: 1,
                        resizeMode: "contain",
                        height: 40,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text>+{dataItemFollowSelected.length - 2}</Text>
                    </View>
                  </View>
                </View>
              ) : dataItemFollowSelected.length > 1 ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{
                    width: 42,
                    borderRadius: 42,
                    borderColor: Color.grayPlahoder,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    height: 42,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                    <Image
                      style={{
                        width: 40,
                        borderRadius: 100,
                        borderColor: Color.grayPlahoder,
                        // borderWidth: 1,
                        resizeMode: "contain",
                        height: 40,
                      }}
                      source={{
                        uri:
                          "data:image/png;base64," +
                          dataItemFollowSelected[0].image,
                      }}
                    />
                  </View>

                  <View style={{
                    marginLeft: 2,
                    width: 42,
                    borderRadius: 42,
                    borderColor: Color.grayPlahoder,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    height: 42,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                    <Image
                      style={{
                        width: 40,
                        borderRadius: 100,
                        borderColor: Color.grayPlahoder,
                        // borderWidth: 1,
                        resizeMode: "contain",
                        height: 40,
                      }}
                      source={{
                        uri:
                          "data:image/png;base64," +
                          dataItemFollowSelected[1].image,
                      }}
                    />
                  </View>
                </View>
              ) : dataItemFollowSelected.length > 0 ? (

                <View style={{
                  width: 42,
                  borderRadius: 42,
                  borderColor: Color.grayPlahoder,
                  backgroundColor: 'white',
                  borderWidth: 1,
                  height: 42,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                  <Image
                    style={{
                      width: 40,
                      borderRadius: 100,
                      borderColor: Color.grayPlahoder,
                      // borderWidth: 1,
                      resizeMode: "contain",
                      height: 40,
                    }}
                    source={{
                      uri:
                        "data:image/png;base64," +
                        dataItemFollowSelected[0].image,
                    }}
                  />
                </View>
              ) : null
            ) : null}
          </>
        )}
      </View>
    </View>
  );
};

export default ModalPickUser;

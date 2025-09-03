import { View, Text } from "react-native";
import { Color } from "../../colors/colortv";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Block from "../Block";
import Button from "../Button";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import React, { useState } from "react";
const TVSDateTime = ({
  disabled = false,
  colorLabel = Color.mainColor,
  mode,
  required = false,
  multiDateTime = false,
  label,
  onChangeDateTime,
  value,
  label2,
  onChangeDateTime2,
  value2,
  hasLabel = true,
}) => {
  const [dateTime, setDateTime] = useState(value);
  const [colorDateTime, setColorDateTime] = useState(
    mode == "date"
      ? value != "dd/mm/yyyy"
        ? "black"
        : "#B2B2B2"
      : value != "hh:mm"
      ? "black"
      : "#B2B2B2"
  );
  const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const showDateTimePicker = () => {
    if (disabled) return;
    setDateTimePickerVisible(true);
  };

  const hideDateTimePicker = () => {
    setDateTimePickerVisible(false);
  };

  const handleConfirmDateTime = (val) => {
    hideDateTimePicker();
    if (mode == "date") {
      setDateTime(moment(val).format("DD/MM/YYYY"));
    } else if (mode == "time") {
      setDateTime(moment(val).format("HH:mm"));
    } else if (mode == "datetime") {
      setDateTime(moment(val).format("HH:mm"));
    }
    onChangeDateTime(val);
    setColorDateTime(null);
  };

  const [dateTime2, setDateTime2] = useState(value2);
  const [colorDateTime2, setColorDateTime2] = useState(
    mode == "date" || mode == "datetime"
      ? value2 != "dd/mm/yyyy"
        ? "black"
        : "#B2B2B2"
      : value2 != "hh:mm"
      ? "black"
      : "#B2B2B2"
  );
  const [dateTime2PickerVisible, setDateTime2PickerVisible] = useState(false);
  const showDateTime2Picker = () => {
    setDateTime2PickerVisible(true);
  };

  const hideDateTime2Picker = () => {
    setDateTime2PickerVisible(false);
  };

  const handleConfirmDateTime2 = (val) => {
    hideDateTime2Picker();
    if (mode == "date") {
      setDateTime2(moment(val).format("DD/MM/YYYY"));
    } else if (mode == "time") {
      setDateTime2(moment(val).format("HH:mm"));
    } else if (mode == "datetime") {
      setDateTime2(moment(val).format("DD/MM/YYYY"));
    }
    onChangeDateTime2(val);
    setColorDateTime2(null);
  };
  return (
    <View style={{}}>
      {multiDateTime ? (
        <Block
          style={{
            flex: 1,
            flexDirection: "row",
          }}
        >
          <Block
            style={{
              flex: 1,
            }}
          >
            <>
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
                  {required ? (
                    <Text style={{ color: Color.red }}> *</Text>
                  ) : null}
                </Block>
              ) : null}
              <Button
                nextScreen={() => showDateTimePicker()}
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
                  <Text style={{ color: colorDateTime }}>{dateTime}</Text>
                </Block>
                <Block style={{ justifyContent: "center", paddingRight: 10 }}>
                  <Icon
                    name={
                      mode == "date"
                        ? "calendar-month-outline"
                        : "clock-outline"
                    }
                    color={Color.mainColor}
                    size={25}
                  />
                </Block>
              </Button>
              {mode == "date" ? (
                <DateTimePickerModal
                  cancelTextIOS="Hủy bỏ"
                  confirmTextIOS="Xác nhận"
                  isVisible={dateTimePickerVisible}
                  mode="date"
                  hideTitleContainerIOS={false}
                  date={
                    dateTime !== "dd/mm/yyyy"
                      ? new Date(moment(dateTime, "DD/MM/YYYY"))
                      : new Date()
                  }
                  locale="vi_VN"
                  onConfirm={handleConfirmDateTime}
                  onCancel={() => hideDateTimePicker()}
                />
              ) : (
                <DateTimePickerModal
                  cancelTextIOS="Hủy bỏ"
                  confirmTextIOS="Xác nhận"
                  isVisible={dateTimePickerVisible}
                  mode="time"
                  hideTitleContainerIOS={false}
                  date={
                    dateTime !== "hh:mm"
                      ? new Date(moment(dateTime, "hh:mm"))
                      : new Date()
                  }
                  locale="vi_VN"
                  onConfirm={handleConfirmDateTime}
                  onCancel={() => hideDateTimePicker()}
                />
              )}
            </>
          </Block>
          <Block
            style={{
              flexDirection: "column",
            }}
          >
            <Block>
              <Text
                style={{
                  paddingLeft: 10,
                  color: Color.mainColor,
                }}
              ></Text>
            </Block>
            <Block
              style={{
                alignItems: "center",
                marginLeft: 10,
                marginRight: 10,
                justifyContent: "center",
                flex: 1,
              }}
            >
              <Text>...</Text>
            </Block>
          </Block>
          <Block
            style={{
              flex: 1,
            }}
          >
            <>
              {hasLabel ? (
                <Block
                  style={{
                    flexDirection: "row",
                    paddingBottom: 5,
                    paddingLeft: 5,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: colorLabel }}>{label2}</Text>
                  {required ? (
                    <Text style={{ color: Color.red }}> *</Text>
                  ) : null}
                </Block>
              ) : null}
              <Button
                nextScreen={() => showDateTime2Picker()}
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
                  <Text style={{ color: colorDateTime2 }}>{dateTime2}</Text>
                </Block>
                <Block style={{ justifyContent: "center", paddingRight: 10 }}>
                  <Icon
                    name={
                      mode == "date"
                        ? "calendar-month-outline"
                        : "clock-outline"
                    }
                    color={Color.mainColor}
                    size={25}
                  />
                </Block>
              </Button>
              {mode == "date" ? (
                <DateTimePickerModal
                  cancelTextIOS="Hủy bỏ"
                  confirmTextIOS="Xác nhận"
                  isVisible={dateTime2PickerVisible}
                  mode="date"
                  hideTitleContainerIOS={false}
                  date={
                    dateTime2 !== "dd/mm/yyyy"
                      ? new Date(moment(dateTime2, "DD/MM/YYYY"))
                      : new Date()
                  }
                  locale="vi_VN"
                  onConfirm={handleConfirmDateTime2}
                  onCancel={() => hideDateTime2Picker()}
                />
              ) : (
                <DateTimePickerModal
                  cancelTextIOS="Hủy bỏ"
                  confirmTextIOS="Xác nhận"
                  isVisible={dateTime2PickerVisible}
                  mode="time"
                  hideTitleContainerIOS={false}
                  date={
                    dateTime2 !== "hh:mm"
                      ? new Date(moment(dateTime2, "hh:mm"))
                      : new Date()
                  }
                  locale="vi_VN"
                  onConfirm={handleConfirmDateTime2}
                  onCancel={() => hideDateTime2Picker()}
                />
              )}
            </>
          </Block>
        </Block>
      ) : (
        <>
          {mode == "datetime" ? (
            <Block
              style={{
                flex: 1,
                flexDirection: "row",
              }}
            >
              {hasLabel ? (
                <Block
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginRight: 5,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: colorLabel }}>{label}</Text>
                  {required ? (
                    <Text style={{ color: Color.red }}> *</Text>
                  ) : null}
                </Block>
              ) : null}
              <Block style={{ flex: 3, flexDirection: "row" }}>
                <View style={{ flex: 2 }}>
                  <Button
                    nextScreen={() => showDateTimePicker()}
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
                      <Text style={{ color: colorDateTime }}>{dateTime}</Text>
                    </Block>
                    <Block
                      style={{ justifyContent: "center", paddingRight: 10 }}
                    >
                      <Icon
                        name={"clock-outline"}
                        color={Color.mainColor}
                        size={25}
                      />
                    </Block>
                  </Button>
                  <DateTimePickerModal
                    cancelTextIOS="Hủy bỏ"
                    confirmTextIOS="Xác nhận"
                    isVisible={dateTimePickerVisible}
                    mode="time"
                    hideTitleContainerIOS={false}
                    date={
                      dateTime !== "hh:mm"
                        ? new Date(moment(dateTime, "hh:mm"))
                        : new Date()
                    }
                    locale="vi_VN"
                    onConfirm={handleConfirmDateTime}
                    onCancel={() => hideDateTimePicker()}
                  />
                </View>
                <View style={{ flex: 3, marginLeft: 5 }}>
                  <Button
                    nextScreen={() => showDateTime2Picker()}
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
                      <Text style={{ color: colorDateTime2 }}>{dateTime2}</Text>
                    </Block>
                    <Block
                      style={{ justifyContent: "center", paddingRight: 10 }}
                    >
                      <Icon
                        name={"calendar-month-outline"}
                        color={Color.mainColor}
                        size={25}
                      />
                    </Block>
                  </Button>
                  <DateTimePickerModal
                    cancelTextIOS="Hủy bỏ"
                    confirmTextIOS="Xác nhận"
                    isVisible={dateTime2PickerVisible}
                    mode="date"
                    hideTitleContainerIOS={false}
                    date={
                      dateTime2 !== "dd/mm/yyyy"
                        ? new Date(moment(dateTime2, "DD/MM/YYYY"))
                        : new Date()
                    }
                    locale="vi_VN"
                    onConfirm={handleConfirmDateTime2}
                    onCancel={() => hideDateTime2Picker()}
                  />
                </View>
              </Block>
            </Block>
          ) : (
            <>
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
                  {required ? (
                    <Text style={{ color: Color.red }}> *</Text>
                  ) : null}
                </Block>
              ) : null}
              <Button
                nextScreen={() => showDateTimePicker()}
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
                  <Text style={{ color: colorDateTime }}>{dateTime}</Text>
                </Block>
                <Block style={{ justifyContent: "center", paddingRight: 10 }}>
                  <Icon
                    name={
                      mode == "date"
                        ? "calendar-month-outline"
                        : "clock-outline"
                    }
                    color={Color.mainColor}
                    size={25}
                  />
                </Block>
              </Button>
              {mode == "date" ? (
                <DateTimePickerModal
                  cancelTextIOS="Hủy bỏ"
                  confirmTextIOS="Xác nhận"
                  isVisible={dateTimePickerVisible}
                  mode="date"
                  hideTitleContainerIOS={false}
                  date={
                    dateTime !== "dd/mm/yyyy"
                      ? new Date(moment(dateTime, "DD/MM/YYYY"))
                      : new Date()
                  }
                  locale="vi_VN"
                  onConfirm={handleConfirmDateTime}
                  onCancel={() => hideDateTimePicker()}
                />
              ) : (
                <DateTimePickerModal
                  cancelTextIOS="Hủy bỏ"
                  confirmTextIOS="Xác nhận"
                  isVisible={dateTimePickerVisible}
                  mode="time"
                  hideTitleContainerIOS={false}
                  date={
                    dateTime !== "hh:mm"
                      ? new Date(moment(dateTime, "hh:mm"))
                      : new Date()
                  }
                  locale="vi_VN"
                  onConfirm={handleConfirmDateTime}
                  onCancel={() => hideDateTimePicker()}
                />
              )}
            </>
          )}
        </>
      )}
    </View>
  );
};

export default TVSDateTime;

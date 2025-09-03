import moment from "moment";
import React, { useEffect } from "react";
import { ScrollView, View, Image } from "react-native";
import RenderHtml from "react-native-render-html";
import Text from "../../../../components/Text";
import TVSControlPopup from "../../../../components/Tvs/ControlPopup2";

const ModalChiTiet = ({
  itemCongViec,
  bottom,
  modalVisibleChiTietCongViec,
  setModalVisibleChiTietCongViec,
  Color,
}) => {
  //--------------START DECLARE VARIABLE------------------//
  //--------------END DECLARE VARIABLE------------------//
  const avatar = itemCongViec.avatar ? itemCongViec.avatar : "N";
  const nguoiThucHien = itemCongViec.nguoiThucHien
    ? itemCongViec.nguoiThucHien
    : [];
  const nguoiTheoDoi = itemCongViec.nguoiTheoDoi
    ? itemCongViec.nguoiTheoDoi
    : [];
  const listHoatDong = itemCongViec.listHoatDong
    ? itemCongViec.listHoatDong
    : [];
  let quaHan = false;
  let soGioQuaHan = 0;
  let soNgayQuaHan = 0;
  let soGioConLai = 0;
  let soNgayConLai = 0;
  let strTrangThaiCongViec = "";
  let color = "black";
  const colorBorderBottom = "#ddd";
  const fontLable = "600";
  const fontSizeLable = 15;
  switch (itemCongViec.trangthai_code) {
    case "01": //mau vang
      color = "#D2691E";
      break;
    case "02": //mau do
      color = Color.primaryColor;
      break;
    case "03": //mau xanh
      color = Color.green;
      break;
    case "04": //mau tim
      color = "#800080";
      break;
    case "05": //mau tim
      color = "red";
      break;
    default: //mau den
      color = Color.black;
      break;
  }
  if (itemCongViec.deadline_date) {
    const deadline_date = itemCongViec.deadline_date;
    const deadline = moment(deadline_date, "HH:mm - DD/MM/YYYY");
    const ngayHoanThanh = itemCongViec.finish_date
      ? itemCongViec.finish_date
      : "";
    if (ngayHoanThanh != "") {
      const finish_date = moment(ngayHoanThanh, "HH:mm - DD/MM/YYYY");
      const diff = deadline.diff(finish_date);
      if (diff < 0) {
        quaHan = true;
        soNgayQuaHan = deadline.diff(finish_date, "days");
        soGioQuaHan = deadline.diff(finish_date, "hours") - soNgayQuaHan * 24;
        strTrangThaiCongViec =
          "Quá hạn " + soNgayQuaHan + " ngày " + soGioQuaHan + " giờ";
      } else {
        quaHan = false;
        soNgayConLai = deadline.diff(finish_date, "days");
        soGioConLai = deadline.diff(finish_date, "hours") - soNgayConLai * 24;
        strTrangThaiCongViec =
          "Trước hạn " + soNgayConLai + " ngày " + soGioConLai + " giờ";
      }
    } else {
      const now = moment();
      const diff = deadline.diff(now);
      if (diff < 0) {
        quaHan = true;
        soNgayQuaHan = deadline.diff(now, "days");
        soGioQuaHan = deadline.diff(now, "hours") - soNgayQuaHan * 24;
        strTrangThaiCongViec =
          "Quá hạn " + soNgayQuaHan + " ngày " + soGioQuaHan + " giờ";
      } else {
        quaHan = false;
        soNgayConLai = deadline.diff(now, "days");
        soGioConLai = deadline.diff(now, "hours") - soNgayConLai * 24;
        strTrangThaiCongViec =
          "Còn lại " + soNgayConLai + " ngày " + soGioConLai + " giờ";
      }
    }
  }

  const OneField2 = ({
    value,
    keyName,
    typeValue,
    avatar,
    html,
    paddingBottom,
    borderBottomWidth,
    borderBottomColor,
  }) => {
    let color = "black";
    switch (typeValue) {
      case "01": //mau vang
        color = "#D2691E";
        break;
      case "02": //mau do
        color = Color.primaryColor;
        break;
      case "03": //mau xanh
        color = Color.green;
        break;
      case "04": //mau tim
        color = "#800080";
        break;
      case "05": //mau tim
        color = "red";
        break;
      default: //mau den
        color = Color.black;
        break;
    }
    //Avatar la base64
    let avatarBase64 = null;
    if (!avatar) {
      avatarBase64 = null;
    } else if (avatar == "N") {
      avatarBase64 =
        "https://api-private.atlassian.com/users/f3ba6e3feb7b6867012f05b2f873affb/avatar";
    } else {
      avatarBase64 = "data:image/png;base64," + avatar;
    }
    return (
      <View
        style={{
          flexDirection: "column",
          paddingVertical: 5,
          borderBottomWidth: 1,
          padding: 10,
          paddingBottom: paddingBottom,
          borderBottomWidth: borderBottomWidth,
          borderBottomColor: colorBorderBottom,
          marginTop: 6,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontWeight: fontLable,
              fontSize: fontSizeLable,
            }}
          >
            {keyName}
          </Text>
        </View>
        {avatarBase64 ? (
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: Color.gray,
            padding: 10,
            borderRadius: 10,
          }}>
            <Image
              source={{ uri: avatarBase64 }}
              style={{ width: 30, height: 30, borderRadius: 15 }}
            />
            <Text style={{ color }}>{value}</Text>
          </View>
        ) : (
          <View style={{
            backgroundColor: Color.gray,
            padding: 10,
            borderRadius: 10,
          }}>
            {html ? (
              <RenderHtml
                contentWidth={300}
                color={color}
                marginBottom={10}
                source={{ html: value }}
              />
            ) : (
              <Text
                style={{
                  color,
                  marginBottom: 10,
                }}
              >
                {value}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <TVSControlPopup
      title={"Chi tiết công việc"}
      isShow={modalVisibleChiTietCongViec}
      onHide={() => setModalVisibleChiTietCongViec(false)}
      bottom={bottom}
    >
      <ScrollView style={{ height: "100%" }}>
        {itemCongViec.full_name && (
          <OneField2
            avatar={avatar}
            keyName={"Người thực hiện"}
            value={itemCongViec.full_name}
            isShow={true}
          />
        )}
        {nguoiThucHien.length > 0 && (
          <View
            style={{
              flexDirection: "column",
              paddingVertical: 5,
              padding: 10,
              paddingBottom: 10,
            }}
          >
            <View>
              <Text
                style={{
                  fontWeight: fontLable,
                  marginBottom: 10,
                  fontSize: fontSizeLable,
                }}
              >
                Người thực hiện
              </Text>
            </View>
            {nguoiThucHien.length == 1 ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: Color.gray,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Image
                  source={{
                    uri: "data:image/png;base64," + nguoiThucHien[0].avatar,
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                  }}
                />
                <Text
                  style={{
                    color: Color.black,
                    marginLeft: 10,
                  }}
                >
                  {nguoiThucHien[0].fullname}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: Color.gray,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                {nguoiThucHien.map((item, index) => {
                  const avatar = item.avatar;
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginRight: 10,
                      }}
                    >
                      <Image
                        source={{
                          uri: "data:image/png;base64," + avatar,
                        }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                        }}
                      />
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {nguoiTheoDoi.length > 0 && (
          <View
            style={{
              flexDirection: "column",
              paddingVertical: 5,
              padding: 10,
              paddingBottom: 10,
              marginTop: 6,
            }}
          >
            <View>
              <Text
                style={{
                  fontWeight: fontLable,
                  marginBottom: 10,
                  fontSize: fontSizeLable,
                }}
              >
                Người theo dõi
              </Text>
            </View>
            {nguoiTheoDoi.length == 1 ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: Color.gray,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Image
                  source={{
                    uri: "data:image/png;base64," + nguoiTheoDoi[0].avatar,
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                  }}
                />
                <Text
                  style={{
                    color: Color.black,
                    marginLeft: 10,
                  }}
                >
                  {nguoiTheoDoi[0].fullname}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: Color.gray,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                {nguoiTheoDoi.map((item, index) => {
                  const avatar = item.avatar;
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginRight: 10,
                      }}
                    >
                      <Image
                        source={{
                          uri: "data:image/png;base64," + avatar,
                        }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                        }}
                      />
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {itemCongViec.motacv == "" ||
          itemCongViec.motacv == undefined ? null : (
          <OneField2
            keyName={"Mô tả công việc"}
            value={itemCongViec.motacv}
            html={true}
            isShow={true}
            paddingBottom={10}
          />
        )}

        {itemCongViec.deadline_date && (
          <View
            style={{
              flexDirection: "column",
              paddingVertical: 5,
              padding: 10,
              marginBottom: 10,
              paddingBottom: 10,
            }}
          >
            <Text
              style={{
                fontWeight: fontLable,
                marginBottom: 10,
                fontSize: fontSizeLable,
                marginTop: 6,
              }}
            >
              Thời hạn hoàn thành
            </Text>
            <View style={{
              backgroundColor: Color.gray,
              padding: 10,
              borderRadius: 10,
            }}>
              <Text style={{ color: Color.black }}>
                {itemCongViec.deadline_date}
              </Text>
              <Text style={{ color: color, marginTop: 10, marginBottom: 10 }}>
                {itemCongViec.trangthai_name}
              </Text>
              {quaHan ? (
                <Text style={{ color: "red" }}>{strTrangThaiCongViec}</Text>
              ) : (
                <Text style={{ color: Color.black }}>
                  {strTrangThaiCongViec}
                </Text>
              )}
            </View>
          </View>
        )}

        {listHoatDong.length > 0 && (
          <View
            style={{
              flexDirection: "column",
              paddingVertical: 5,
              padding: 10,
            }}
          >
            <Text
              style={{
                fontWeight: fontLable,
                marginBottom: 10,
                fontSize: fontSizeLable,
              }}
            >
              Hoạt động
            </Text>
            {listHoatDong.map((item, index) => {
              const ngay_batdau = moment(item.ngay_batdau, "YYYYMMDD").format(
                "DD/MM/YYYY"
              );
              const gio_batdau = item.gio_batdau ? item.gio_batdau : "00:00";
              const ngay_gio = gio_batdau + " - " + ngay_batdau;
              const image = item.image ? item.image : avatar;
              const noidung =
                item.nguoi_thaydoi_name + " - " + item.noidunghoatdong;

              return (
                <View
                  style={{
                    flexDirection: "row",
                    borderBottomColor: Color.gray,
                    borderBottomWidth: 1,
                    paddingBottom: 10,
                    backgroundColor: Color.gray,
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 5
                  }}
                >
                  <Image
                    source={{ uri: "data:image/png;base64," + image }}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text>{ngay_gio}</Text>
                    <Text>{noidung}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </TVSControlPopup>
  );
};

export default ModalChiTiet;
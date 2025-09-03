import moment from "moment";
import React, { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon_calendar from "../../../../icons/Datev";
import { setHeaderChil2 } from "../../../../Language";
import Block from "../../../../components/Block";
import Button from "../../../../components/Button";
import Calender from "../../../../components/Calendes";
import Text from "../../../../components/Text";
import TVSButton from "../../../../components/Tvs/Button";
import TVSControlPopup from "../../../../components/Tvs/ControlPopup2";
import TVSHeader from "../../../../components/Tvs/Header";
import TVSTab from "../../../../components/Tvs/Tab";
import CXN from "./ChoXacNhan";
import DXN from "./DaXacNhan";

import {
  HRRI011FromDt,
  HRRI011ToDt,
  HRRI011LayDanhSachXN,
} from "../../../../services/redux/HRRI011_XacNhanLyDoViPhamCom/action";

const { width } = Dimensions.get("screen");

const XacNhanLyDoViPhamCom = ({ navigation: { goBack } }) => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const menuReducer = useSelector((state) => state.menuReducer);
  const loginReducers = useSelector((state) => state.loginReducers);
  const xntcReducer = useSelector((state) => state.xntcReducer);
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  let thr_emp_pks = "";
  let tokenLogin = "";
  let fullnames = "";
  let org_pks = "";
  let dataXntc = [];
  let userPk;
  let refreshToken;
  let crt_by = loginReducers.data.data.crt_by;
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pks = loginReducers.data.data.thr_emp_pk;
    fullnames = loginReducers.data.data.full_name;
    org_pks = loginReducers.data.data.org_pk;
    dataXntc = xntcReducer.data.data.xntc;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {
    //
  }
  const from_dt = useSelector(
    (state) => state.HRRI011_XacNhanLyDoViPhamComReducer.From_dt
  );
  const to_dt = useSelector(
    (state) => state.HRRI011_XacNhanLyDoViPhamComReducer.To_dt
  );

  const DsCXN = useSelector(
    (state) => state.HRRI011_XacNhanLyDoViPhamComReducer.DsCXN
  );
  const DsDXN = useSelector(
    (state) => state.HRRI011_XacNhanLyDoViPhamComReducer.DsDXN
  );

  const [daySelect, setDateSelect] = useState(
    "01" +
      moment(new Date()).format("/MM/YYYY") +
      " - " +
      moment(new Date()).format("DD/MM/YYYY")
  );

  const getStateCalendar = async (result) => {
    setModalVisible(false);
    setDateSelect(result.daySelecteds);

    dispatch(HRRI011FromDt(result.startingDays));
    dispatch(HRRI011ToDt(result.endingDays));
    dispatch(HRRI011LayDanhSachXN());
  };

  const modal = (
    <TVSControlPopup
      isShow={isModalVisible}
      maxHeight={500}
      title={"Chọn ngày"}
      onHide={() => setModalVisible(false)}
      bottom={
        <View style={{ flexDirection: "row" }}>
          <TVSButton
            type={"danger"}
            buttonStyle={"3"}
            icon={"close"}
            onPress={() => setModalVisible(false)}
          >
            Đóng lại
          </TVSButton>
        </View>
      }
    >
      <Calender
        getState={getStateCalendar}
        startDayss={from_dt}
        endDayss={to_dt}
      />
    </TVSControlPopup>
  );
  useEffect(() => {
    dispatch(HRRI011FromDt(moment(new Date()).format("YYYYMM01")));
    dispatch(HRRI011ToDt(moment(new Date()).format("YYYYMMDD")));
    dispatch(HRRI011LayDanhSachXN());
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: Color.backgroundColor }}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          loginReducers.data.data.user_language,
          menuReducer.data.data.menu,
          "MBHRRI011",
          menuReducer.data.data.menu.filter((x) => x.menu_cd === "MBHRRI011")[0]
            .p_pk
        )}
      </TVSHeader>
      <Block flex backgroundColor={Color.gray}>
        <Block
          margin={10}
          radius={8}
          backgroundColor={Color.white}
          padding={10}
        >
          <Button
            nextScreen={() => toggleModal()}
            row
            paddingLeft={20}
            alignCenter
            justifyContent={"space-between"}
          >
            <Icon_calendar color={Color.mainColor} />
            <Text
              paddingRight={10}
              center
              color={Color.mainColor}
              flex
              size={14}
              paddingLeft={10}
            >
              Ngày {daySelect}
            </Text>
            <Text marginRight={10} />
          </Button>
        </Block>
        <TVSTab
          fullTab={true}
          scrollEnabled={false}
          data={[
            {
              id: 0,
              name: "Chờ xác nhận",
              count: DsCXN.length.toString(),
              screen: (
                <CXN
                  data={DsCXN}
                  onReload={() => dispatch(HRRI011LayDanhSachXN())}
                />
              ),
            },
            {
              id: 1,
              name: "Đã xác nhận",
              count: DsDXN.length.toString(),
              screen: (
                <DXN
                  data={DsDXN}
                  onReload={() => dispatch(HRRI011LayDanhSachXN())}
                />
              ),
            },
          ]}
        />
      </Block>
      {modal}
    </View>
  );
};

export default XacNhanLyDoViPhamCom;

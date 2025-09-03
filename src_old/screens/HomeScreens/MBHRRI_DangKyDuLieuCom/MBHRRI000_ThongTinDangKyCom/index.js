import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import Button from "../../../../components/Button";
import Text from "../../../../components/Text";
import TVSHeader from "../../../../components/Tvs/Header";
import TVSButton from "../../../../components/Tvs/Button";
import TVSControlPopup from "../../../../components/Tvs/ControlPopup2";
import Calender from "../../../../components/Calendes";
import Icon_time from "../../../../icons/Datev";
import { setHeaderChil2 } from "../../../../Language";
import TVSTab from "../../../../components/Tvs/Tab3";
import {
  HRRI000FromDt,
  HRRI000ToDt,
  HRRI000LayDanhSachDangKy,
  HRRI000LayDanhSachNhaAn,
  HRRI000LayDuLieuViPhamCom,
} from "../../../../services/redux/HRRI000_ThongTinDangKyCom/action";
import DanhSach from "./DanhSach";
import ViPham from "./ViPham";
import NhaAnCoDinh from "./NhaAnCoDinh";

const MBHRRI000_ThongTinDangKyCom = ({ navigation: { goBack } }) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const loginReducers = useSelector((state) => state.loginReducers);
  const menuReducer = useSelector((state) => state.menuReducer);
  const from_dt = useSelector(
    (state) => state.HRRI000_ThongTinDangKyComReducer.From_dt
  );
  const to_dt = useSelector(
    (state) => state.HRRI000_ThongTinDangKyComReducer.To_dt
  );
  const dsNhaAnCoDinh = useSelector(
    (state) => state.HRRI000_ThongTinDangKyComReducer.DanhSachNhaAnCoDinh.data
  );

  const dsDangKy = useSelector(
    (state) => state.HRRI000_ThongTinDangKyComReducer.DanhSachDangKy.data
  );
  console.log("dsNhaAnCoDinh ", dsNhaAnCoDinh == undefined);
  console.log("dsDangKy ", dsDangKy == undefined);
  let thr_emp_pks = "";
  let tokenss = "";
  let fullnames = "";
  try {
    tokenss = loginReducers.data.data.tokenLogin;
    thr_emp_pks = loginReducers.data.data.thr_emp_pk;
    fullnames = loginReducers.data.data.full_name;
  } catch (error) {
    //
  }
  const [modalVisible, setModalVisible] = useState(false);
  const [dateSelect, setDateSelect] = useState(
    moment(new Date()).format("01/MM/YYYY") +
      " - " +
      //   moment(new Date()).endOf("month").format("DD/MM/YYYY")
      moment(new Date()).format("DD/MM/YYYY")
  );

  useEffect(() => {
    dispatch(HRRI000FromDt(moment(new Date()).format("YYYYMM01")));
    dispatch(HRRI000ToDt(moment(new Date()).format("YYYYMMDD")));
    dispatch(HRRI000LayDanhSachDangKy());
    dispatch(HRRI000LayDanhSachNhaAn());
    dispatch(HRRI000LayDuLieuViPhamCom());
  }, []);
  const getStateCalendar = async (result) => {
    setModalVisible(false);

    // setStartDt(result.startingDays);
    // setEndDt(result.endingDays);

    setDateSelect(result.daySelecteds);
    // setDates(result.startingDays + " - " + result.endingDays);
    console.log("check");
    dispatch(HRRI000FromDt(result.startingDays));
    dispatch(HRRI000ToDt(result.endingDays));
    dispatch(HRRI000LayDanhSachDangKy());
    dispatch(HRRI000LayDanhSachNhaAn());
    dispatch(HRRI000LayDuLieuViPhamCom());
  };
  const modal = (
    <TVSControlPopup
      title={"Chọn ngày"}
      isShow={modalVisible}
      onHide={() => setModalVisible(false)}
      maxHeight={500}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisible(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <Calender
        getState={getStateCalendar}
        startDayss={from_dt}
        endDayss={to_dt}
      />
    </TVSControlPopup>
  );
  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>Thông tin đăng ký cơm</TVSHeader>
      <Block flex backgroundColor={Color.gray} paddingTop={10}>
        <Block
          marginLeft={10}
          marginRight={10}
          radius={8}
          backgroundColor={Color.white}
          marginBottom={10}
        >
          <Button
            nextScreen={() => setModalVisible(true)}
            row
            alignCenter
            justifyContent={"space-between"}
          >
            <Icon_time style={{ marginLeft: 20 }} />
            <Text center color={Color.mainColor} flex size={14} padding={10}>
              Ngày {dateSelect}
            </Text>
            <Text marginRight={10} />
          </Button>
        </Block>
        <TVSTab
          // fullTab
          // scrollEnabled={true}
          data={[
            {
              id: 0,
              name: "Danh sách đăng ký",
              count: null,
              screen: <DanhSach />,
            },
            {
              id: 1,
              name: "Vi phạm cơm",
              count: null,
              screen: <ViPham />,
            },
            {
              id: 2,
              name: "Nhà ăn cố định",
              count: null,
              screen: <NhaAnCoDinh />,
            },
          ]}
        />
      </Block>
      {modal}
    </Block>
  );
};

export default MBHRRI000_ThongTinDangKyCom;

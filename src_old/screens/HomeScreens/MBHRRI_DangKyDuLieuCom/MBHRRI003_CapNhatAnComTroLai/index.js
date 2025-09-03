import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import TVSHeader from "../../../../components/Tvs/Header";
import TVSTab from "../../../../components/Tvs/Tab";
import { setHeaderChil2 } from "../../../../Language";
import DK from "./DangKy";
import DS from "./DanhSach";

const DangKyKhongAnCom = ({ navigation: { goBack } }) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const loginReducers = useSelector((state) => state.loginReducers);
  const menuReducer = useSelector((state) => state.menuReducer);
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
  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-01")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).endOf("month").format("YYYY-MM-DD")
  );

  const onCallbackSetDate = (sDate, eDate) => {
    setStartDate(sDate);
    setEndDate(eDate);
  };

  const onCallbackReload = () => {};

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          loginReducers.data.data.user_language,
          menuReducer.data.data.menu,
          "MBHRRI003",
          menuReducer.data.data.menu.filter((x) => x.menu_cd === "MBHRRI003")[0]
            .p_pk
        )}
      </TVSHeader>
      <Block flex backgroundColor={Color.gray} paddingTop={5}>
        <TVSTab
          fullTab
          scrollEnabled={false}
          data={[
            {
              id: 0,
              name: "Đăng ký",
              count: null,
              screen: <DK onCallbackReload={onCallbackReload} />,
            },
            {
              id: 1,
              name: "Danh sách",
              count: null,
              screen: (
                <DS
                  onCallbackSetDate={onCallbackSetDate}
                  startDate={startDate}
                  endDate={endDate}
                />
              ),
            },
          ]}
        />
      </Block>
    </Block>
  );
};

export default DangKyKhongAnCom;

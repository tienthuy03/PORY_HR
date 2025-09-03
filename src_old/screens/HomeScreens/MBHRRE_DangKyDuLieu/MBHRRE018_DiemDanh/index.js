import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import TVSHeader from "../../../../components/Tvs/Header";
import TVSTab from "../../../../components/Tvs/Tab";
import { setHeaderChil2 } from "../../../../Language";
import DD from "./DiemDanh";
import DS from "./DanhSach";

const DiemDanh = ({ navigation: { goBack } }) => {
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
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
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
          "MBHRRE018",
          menuReducer.data.data.menu.filter((x) => x.menu_cd === "MBHRRE018")[0]
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
              name: "Điểm danh",
              count: null,
              screen: <DD onCallbackReload={onCallbackReload} />,
            },
            {
              id: 1,
              name: "Đã điểm danh",
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

export default DiemDanh;

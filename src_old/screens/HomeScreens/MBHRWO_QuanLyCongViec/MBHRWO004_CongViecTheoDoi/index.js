import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TVSHeader from "../../../../components/Tvs/Header";
import { setHeaderChil2 } from "../../../../Language";
import Block from "../../../../components/Block";
import DanhSach from "./DanhSach";
import { useNavigation } from "@react-navigation/native";

const MBHRWO004 = ({ navigation: { goBack } }) => {
    const navigation = useNavigation();
    const Color = useSelector((s) => s.SystemReducer.theme);
    const loginReducers = useSelector((state) => state.loginReducers);
    const menuReducer = useSelector((state) => state.menuReducer);
    let thr_emp_pk = "";
    let tokens = "";
    let fullname = "";
    let crt_by = "";
    try {
        tokens = loginReducers.data.data.tokenLogin;
        thr_emp_pk = loginReducers.data.data.thr_emp_pk;
        fullname = loginReducers.data.data.full_name;
        crt_by = loginReducers.data.data.crt_by;
    } catch (error) {
        //
    }

    const goDetail = (itemCongViec) => {
        navigation.navigate("MBHRWO004_ChiTiet", { itemCongViec: itemCongViec });
    };

    return (
        <Block flex backgroundColor={Color.gray}>
            <TVSHeader goBack={goBack}>
                {setHeaderChil2(
                    loginReducers.data.data.user_language,
                    menuReducer.data.data.menu,
                    "MBHRWO004",
                    menuReducer.data.data.menu.filter((x) => x.menu_cd === "MBHRWO004")[0].p_pk
                )}
            </TVSHeader>
            <DanhSach goDetail={(item) => goDetail(item)} />
        </Block>
    )
}

export default MBHRWO004;
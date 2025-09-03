import TVSHeader from "../../../../../components/Tvs/Header";

import React from "react";
import { useSelector } from "react-redux";
import Block from "../../../../../components/Block";
import Update from "./Update";

const MBHRWO001_Update = ({ navigation: { goBack },route }) => {
    const Color = useSelector((s) => s.SystemReducer.theme);
    const loginReducers = useSelector((state) => state.loginReducers);
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
    return (
        <Block flex backgroundColor={Color.gray}>
            <TVSHeader goBack={goBack}>
                Cập nhật công việc
            </TVSHeader>
            <Update route={route} />
        </Block>
    );
};
export default MBHRWO001_Update;

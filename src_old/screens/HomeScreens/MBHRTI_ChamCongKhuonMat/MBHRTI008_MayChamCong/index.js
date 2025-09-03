import React from "react";
import {SafeAreaView} from "react-native";
import { useSelector } from "react-redux";
import Block from "../../../../components/Block";
import TVSHeader from "../../../../components/Tvs/Header";
import { setHeaderChil2 } from "../../../../Language";
import DSMayChamCong from "./DanhSach";

const MayChamCong = ({ navigation: { goBack } }) => {
    const Color = useSelector((s) => s.SystemReducer.theme);
    const loginReducers = useSelector((state) => state.loginReducers);
    const menuReducer = useSelector((state) => state.menuReducer);

    return (
        <>
            <Block flex backgroundColor={Color.backgroundColor}>
                <TVSHeader goBack={goBack}>
                    {setHeaderChil2(
                        loginReducers.data.data.user_language,
                        menuReducer.data.data.menu,
                        "MBHRTI008",
                        menuReducer.data.data.menu.filter(
                            (x) => x.menu_cd === "MBHRTI008"
                        )[0].p_pk
                    )}
                </TVSHeader>
                <Block flex backgroundColor={Color.gray} paddingTop={5}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <DSMayChamCong />
                    </SafeAreaView>
                </Block>
            </Block>
        </>
    )
}

export default MayChamCong
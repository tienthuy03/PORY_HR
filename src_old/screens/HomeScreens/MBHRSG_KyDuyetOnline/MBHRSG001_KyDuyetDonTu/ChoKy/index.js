import React, { useState, useEffect } from "react";
import Block from "../../../../../components/Block";
import Typography from "../../../../../components/Text";
import { useSelector } from "react-redux";
import {
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from "react-native";
import TVSList from "../../../../../components/Tvs/TVSList";
import { useNavigation } from '@react-navigation/native';
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup";
import TVSButton from "../../../../../components/Tvs/Button";
import OneField from "../../../../../components/OneFieldKeyValue";
import sysFetch from "../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../config/Pro";
import NoiDungTrinhKy from "./NoiDungTrinhKy";

const ChoKy = () => {

    const API = useSelector(state => state.SysConfigReducer.API_URL);
    const loginReducers = useSelector(state => state.loginReducers);
    let thr_approve_pk;
    let tokens;
    let fullname;
    let crt_by;
    let thr_master_pk = '';
    let thr_file_pk = '';

    const navigation = useNavigation();
    const Color = useSelector(s => s.SystemReducer.theme);
    const [modalVisibleVanBan, setModalVisibleVanBan] = useState(false);

    const [colorFrom, setColorFrom] = useState('#B2B2B2');
    const [fromDate, setFromDate] = useState('dd/mm/yyyy');
    const [colorLoai, setColorLoai] = useState('#B2B2B2');

    const [arrLoaiVanBan, setArrLoaiVanBan] = useState([]);
    const [data, setData] = useState([]);

    const [selectedType, setSelectedType] = useState(null);

    try {
        tokens = loginReducers.data.data.tokenLogin;
        thr_approve_pk = loginReducers.data.data.thr_emp_pk;
        fullname = loginReducers.data.data.full_name;
        crt_by = loginReducers.data.data.crt_by;
    } catch (error) {
        //
    }

    const styles = StyleSheet.create({
        formSelect: {
            backgroundColor: 'white',
            margin: 10,
            padding: 10,
        },
        textForm: {
            fontSize: 16
        }
    });

    console.log("ID: ", thr_approve_pk);

    const refreshData = () => {
        getData();
    }

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        sysFetch(
            API,
            {
                pro: 'SELHRSG001000',
                in_par: {
                    p1_varchar2: thr_approve_pk, //ghi nhớ tài khoản
                    p2_varchar2: arrLoaiVanBan,
                    p3_varchar2: '',
                    p4_varchar2: '',
                    p5_varchar2: APP_VERSION,
                    p6_varchar2: crt_by,
                    p7_varchar2: thr_master_pk,
                    p8_varchar2: thr_file_pk,
                },
                out_par: {
                    p1_sys: 'loaiVanBan',

                    p2_sys: 'choKy',
                    p3_sys: 'danhSach_ChoKy',
                    p4_sys: 'file_ChoKy',

                    p5_sys: 'daKy',
                    p6_sys: 'danhSach_daKy',
                    p7_sys: 'file_daKy',

                    p8_sys: 'huyKy',
                    p9_sys: 'danhSach_huyKy',
                    p10_sys: 'file_huyKy',
                },
            },
            tokens,
        )
            .then(res => {
                console.log("Data: ", res.data.choKy);
                setArrLoaiVanBan(res.data.loaiVanBan);
                setData(res.data.choKy);
            })
            .catch(error => {
                console.log('error');
                console.log(error);
            });
    };
    const filteredData = selectedType
        ? data.filter((item) => item['_loại quyết định'] === selectedType)
        : data;

    const getStateVanBan = result => {
        console.log(result);

        setSelectedType(result.code_nm === "Tất cả" ? null : result.code_nm);
        setModalVisibleVanBan(false);
        setColorLoai(null);
    };

    const modalLoaiVanBan = (
        <TVSControlPopup
            title={'Chọn loại văn bản'}
            isShow={modalVisibleVanBan}
            onHide={() => setModalVisibleVanBan(false)}
            bottom={
                <TVSButton
                    type={'danger'}
                    icon={'close'}
                    buttonStyle={'3'}
                    onPress={() => setModalVisibleVanBan(false)}>
                    Đóng lại
                </TVSButton>
            }>
            <FlatList
                data={[{ code_nm: 'Tất cả' }, ...arrLoaiVanBan]}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                getStateVanBan(item);
                            }}
                            style={{
                                backgroundColor: '#F3F6F9',
                                padding: 10,
                                borderRadius: 6,
                                marginBottom: 3,
                            }}>
                            <Typography>{item.code_nm}</Typography>
                        </TouchableOpacity>
                    );
                }}
            />
        </TVSControlPopup>
    );
    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('NoiDungTrinhKy', {
                        item: item,
                        thr_master_pk: item.pk,
                        thr_file_pk: item.attach_file_pk,
                        onRefresh: refreshData,
                    });
                }}>

                <Block backgroundColor={Color.gray} >
                    <Block backgroundColor={Color.white}
                        radius={16}
                        marginBottom={5}
                        marginLeft={10}
                        marginRight={10}
                        paddingLeft={5}
                        paddingRight={5}
                        borderColor={Color.oneContentBorder}
                        borderWidth={1}>
                        <Block alignCenter={true} padding={8}>
                            <Typography medium={true} size={18} color={Color.mainColor}>
                                {item.decis_content === '' ? item['_loại quyết định'] : item.decis_content}
                            </Typography>
                        </Block>
                        {Object.entries(item).map((oneField, index) => {
                            const fieldName = oneField[0].replace('_', '');
                            if (fieldName === 'ngày trình ký' || fieldName === 'người trình ký') {
                                return (
                                    <OneField
                                        value={oneField[1]}
                                        keyName={
                                            fieldName.substr(0, 1).toUpperCase() +
                                            fieldName.substr(1, fieldName.length)
                                        }
                                    />
                                )
                            }
                            return null;
                        })}
                    </Block>
                </Block>
            </TouchableOpacity >
        )
    }
    return (
        <Block flex={1}>
            <Block style={styles.formSelect} row radius={10}>
                <Block justifyCenter>
                    <Typography style={{ fontSize: 18 }} color={Color.mainColor}>
                        Loại văn bản:
                    </Typography>
                </Block>
                <Block flex={1} marginLeft={8}>
                    <TVSList
                        onPress={() => setModalVisibleVanBan(true)}
                        code_nm={selectedType ?? 'Tất cả'}
                    />
                    {modalLoaiVanBan}
                </Block>
            </Block>

            <Block flex>
                <FlatList
                    data={filteredData}
                    renderItem={renderItem}
                />
            </Block>
        </Block>
    )
};

export default ChoKy;
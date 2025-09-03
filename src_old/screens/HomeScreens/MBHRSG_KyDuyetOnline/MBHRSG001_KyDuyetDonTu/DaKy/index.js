import React, { useCallback, useState, useEffect } from "react";
import Block from "../../../../../components/Block";
import moment from 'moment';
import Typography from "../../../../../components/Text";
import { useSelector } from "react-redux";
import {
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from "react-native";
import TVSList from "../../../../../components/Tvs/TVSList";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup";
import TVSButton from "../../../../../components/Tvs/Button";
import Calender from '../../../../../components/Calendes';
import Button from '../../../../../components/Button';
import NetInfo from '@react-native-community/netinfo';
import OneField from "../../../../../components/OneFieldKeyValue";
import { useNavigation } from '@react-navigation/native';
import sysFetch from "../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../config/Pro";
import Text from '../../../../../components/Text';
import Icon_calendar from '../../../../../icons/Datev';
import NoiDungDaKy from './NoiDungDaKy';

const DaKy = () => {

    const API = useSelector(state => state.SysConfigReducer.API_URL);
    const loginReducers = useSelector(state => state.loginReducers);
    let thr_approve_pk;
    let tokens;
    let fullname;
    let crt_by;
    let thr_master_pk = '';
    let thr_file_pk = '';

    const Color = useSelector(s => s.SystemReducer.theme);
    const [modalVisibleVanBan, setModalVisibleVanBan] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);

    const getState = result => {
        setModalVisible(false);
        setStartDay(result.startingDays);
        setEndtDay(result.endingDays);
        setDateSelect(result.daySelecteds);
    };

    const [startDay, setStartDay] = useState(
        moment(new Date()).format('YYYY-MM-DD'),
    );
    const [endDay, setEndtDay] = useState(
        moment(new Date()).format('YYYY-MM-DD'),
    );
    const [daySelect, setDateSelect] = useState(
        moment(new Date()).format('DD/MM/YYYY'),
    );

    const showPicker = useCallback(value => setModalVisible(value), []);

    const onValueChange = useCallback(() => {
        showPicker(true);
        setArrLoaiVanBan('ALL');
    }, [showPicker]);

    const [colorLoai, setColorLoai] = useState('#B2B2B2');
    const navigation = useNavigation();

    const [arrLoaiVanBan, setArrLoaiVanBan] = useState('ALL');
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
            marginTop: 5,
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 10,
            padding: 5,

        }
    });

    console.log("ID: ", thr_approve_pk);

    const refreshData = () => {
        getData();
    }

    useEffect(() => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                getData();
            } else {
                ShowError('No internet');
            }
        });
    }, [startDay, endDay]);

    const getData = () => {
        console.log({
            p3_varchar2: moment(startDay).format('YYYYMMDD'),
            p4_varchar2: moment(endDay).format('YYYYMMDD'),
        })
        sysFetch(
            API,
            {
                pro: 'SELHRSG001000',
                in_par: {
                    p1_varchar2: thr_approve_pk, //ghi nhớ tài khoản
                    p2_varchar2: arrLoaiVanBan,
                    p3_varchar2: moment(startDay).format('YYYYMMDD'),
                    p4_varchar2: moment(endDay).format('YYYYMMDD'),
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
                console.log("Data: ", res.data.daKy);
                setArrLoaiVanBan(res.data.loaiVanBan);
                setData(res.data.daKy);
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
                    navigation.navigate('NoiDungDaKy', {
                        item: item,
                        thr_master_pk: item.m_pk,
                        thr_file_pk: item.attach_file_pk,
                        onRefresh: refreshData,
                    });
                }}
            >
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
                        {Object.entries(item).map((oneField) => {
                            const fieldName = oneField[0].replace('_', '');
                            if (fieldName === 'ngày phê duyệt' || fieldName === 'người trình ký') {
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

    const modal = (
        <TVSControlPopup
            maxHeight={500}
            isShow={modalVisible}
            title={'Chọn ngày'}
            onHide={() => setModalVisible(false)}>
            <Calender getState={getState} startDayss={startDay} endDayss={endDay} />
        </TVSControlPopup>
    );

    return (
        <Block flex={1}>
            <Block backgroundColor={Color.gray}>
                <Block marginTop={10} marginLeft={10} marginRight={10} radius={8} backgroundColor={Color.white}>
                    <Button
                        nextScreen={() => onValueChange()}
                        padding={10}
                        row
                        alignCenter
                        paddingLeft={20}
                        justifyContent={'space-between'}>
                        <Icon_calendar color={Color.mainColor} marginLeft={20} />
                        <Text
                            paddingRight={20}
                            size={14}
                            center
                            color={Color.mainColor}
                            flex
                            paddingLeft={10}
                            height={60}>
                            Ngày {daySelect}
                        </Text>
                        <Text marginRight={10} />
                    </Button>
                    {modal}
                </Block>
            </Block>
            <Block style={styles.formSelect} row radius={10}>
                <Block justifyCenter>
                    <Typography style={{ fontSize: 16 }} color={Color.mainColor}>
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

export default DaKy;
import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Block from '../../../../../components/Block';
import Typography from '../../../../../components/Text';
import sysFetch from '../../../../../services/fetch_v1';
import { APP_VERSION } from '../../../../../config/Pro';
import TVSButton from '../../../../../components/Tvs/Button';
import moment from 'moment';
import Icon_time from '../../../../../icons/Datev'
import { Text } from 'react-native';
import Button from '../../../../../components/Button';
import TVSControlPopup from '../../../../../components/Tvs/ControlPopup';
import Calender from '../../../../../components/Calendes';
import { StyleSheet, FlatList } from 'react-native';



const DSPDG = ({ startDate, endDate }) => {
    const API = useSelector(state => state.SysConfigReducer.API_URL);
    const [dateItem, setDateItem] = useState('dasasd');

    const dataItem = [{ idd: 1, loaidanhgia: 'Nhà ăn 1', ngay: '16-01-2023' },
    { idd: 2, loaidanhgia: 'Nhà ăn 2', ngay: '15-01-2023' }]

    const [daySelect, setDateSelect] = useState(
        moment(new Date()).format('01/MM/YYYY') +
        ' - ' +
        moment(new Date()).endOf('month').format('DD/MM/YYYY'),
    );

    const [modalVisible, setModalVisible] = useState(false);

    const Color = useSelector(s => s.SystemReducer.theme);
    const dispatch = useDispatch();
    const loginReducers = useSelector(state => state.loginReducers);
    const menuReducer = useSelector(state => state.menuReducer);
    let thr_emp_pk = '';
    let tokens = '';
    let fullname = '';
    let crt_by = '';

    try {
        tokens = loginReducers.data.data.tokenLogin;
        thr_emp_pk = loginReducers.data.data.thr_emp_pk;
        fullname = loginReducers.data.data.full_name;
        crt_by = loginReducers.data.data.crt_by;
    } catch (error) {
        //
    }

    useEffect(() => {
        console.log('effet');
        getData();
    }, []);

    const getData = () => {
        sysFetch(
            API,
            {
                pro: 'SELHRSV001000',
                in_par: {
                    p1_varchar2: thr_emp_pk, //ghi nhớ tài khoản
                    p2_varchar2: APP_VERSION,
                    p3_varchar2: crt_by,

                },
                out_par: {
                    p1_sys: 'tieuChi',

                },
            },
            tokens,
        )
            .then(res => {
                console.log('res ', res);


            })
            .catch(error => {
                console.log('error');
                console.log(error);
            });
    }

    const getStateCalendar = async result => {
        setModalVisible(false);
        onCallbackSetDate(result.startingDays, result.endingDays);
        setDateSelect(result.daySelecteds);
        // setDates(result.startingDays + ' - ' + result.endingDays);
        getData(result.startingDays, result.endingDays);
    };



    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const modal = (
        <TVSControlPopup
            maxHeight={500}
            title={'Chọn ngày'}
            onHide={() => setModalVisible(false)}
            isShow={modalVisible}>
            <Calender
                getState={getStateCalendar}
                startDayss={startDate}
                endDayss={endDate}
            />
        </TVSControlPopup>
    );

    const renderItem = ({ item }) => {

        return (
            <Block style={styles.boxItem} backgroundColor={'#FFFFFF'}>
                <Block alignCenter={true}>
                    <Typography style={{ fontSize: 16, color:Color.mainColor }} >{item.ngay}</Typography>
                    
                </Block>
                <Block flexDirection={'row'} >
                    <Typography style={styles.formText}>Loại đánh giá</Typography>
                    <Typography style={{ fontSize: 16 }}>{item.loaidanhgia}</Typography>
                </Block>
                <Block style={{ marginTop: 10 }}>
                    <TVSButton style={{ backgroundColor: 'yellow', flex: 1, paddingTop: 10 }} onPress={delItem}>
                        <Typography >Xóa bỏ</Typography>
                    </TVSButton>
                </Block>
            </Block>
        )
    }


    let str = '';
    const delItem = () => {

    }


    return (
        <Block paddingTop={10} backgroundColor={Color.gray} flex margin={10}>
            <Block
                marginLeft={10}
                marginRight={10}
                radius={8}
                backgroundColor={Color.white}>
                <Button
                    nextScreen={toggleModal}
                    row
                    alignCenter
                    justifyContent={'space-between'}>
                    <Icon_time style={{ marginLeft: 20 }} />
                    <Typography center color={Color.mainColor} flex size={14} padding={10}>
                        Ngày {daySelect}
                    </Typography>
                    <Typography marginRight={10} />
                </Button>
                {modal}
            </Block>
            <Block flex>
                <FlatList
                    data={dataItem}
                    renderItem={renderItem}
                />

            </Block>
        </Block>
    )

}
const styles = StyleSheet.create({
    boxItem: {
        borderRadius: 10,
        
      
      padding:8,
      margin:8
    },
    formText: {
        flex: 1,
        flexDirection: 'row',
        fontSize: 16,
      

    }

})
export default DSPDG;
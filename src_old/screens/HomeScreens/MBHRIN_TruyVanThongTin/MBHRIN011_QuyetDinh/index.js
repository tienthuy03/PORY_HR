/* eslint-disable react-hooks/exhaustive-deps */
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import Block from '../../../../components/Block';
import TVSHeader from '../../../../components/Tvs/Header';
import {setHeaderChil2} from '../../../../Language';
import TVSControlPopup from '../../../../components/Tvs/ControlPopup';
import Calender from '../../../../components/Calendes';
import Icon_calendar from '../../../../icons/Datev';
import sysFetch from '../../../../services/fetch_v1';
import {APP_VERSION} from '../../../../config/Pro';
import PopupPDF from './Popup_PDF';

const QuanLyCacQuyetDinh = ({navigation: {goBack}}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
  const loginReducers = useSelector(state => state.loginReducers);
  const menuReducer = useSelector(state => state.menuReducer);
  let dataMenuMBHRs;
  let language;
  let fullname;
  let avartar;
  let empId;
  let tokenLogin;
  let userPk;
  let refreshToken;
  let crt_by = useSelector(state => state.loginReducers.data.data.crt_by);
  let thr_emp_pk = useSelector(
    state => state.loginReducers.data.data.thr_emp_pk,
  );
  try {
    avartar = loginReducers.data.data.avatar;
    fullname = loginReducers.data.data.full_name;
    empId = loginReducers.data.data.emp_id;
    language = loginReducers.data.data.user_language;
    tokenLogin = loginReducers.data.data.tokenLogin;
    dataMenuMBHRs = menuReducer.data.data.menu;
    refreshToken = loginReducers.data.data.refreshToken;
    userPk = loginReducers.data.data.tes_user_pk;
  } catch (error) {
    console.log(error);
  }
  useEffect(() => {
    // dispatch(HideGlobalLoading);
  }, []);
  const [modalPDFVisible, setModalPDFVisible] = useState(false);
  const [data, setData] = useState([]);
  const [dataCard, setDataCard] = useState([]);
  const [dataPDF, setDataPDF] = useState('');
  const [startDay, setStartDay] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [endDay, setEndDay] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [daySelect, setDateSelect] = useState(
    moment(new Date()).format('DD/MM/YYYY'),
  );
  const [modalVisible, setModalVisible] = useState(false);

  const showPicker = useCallback(value => setModalVisible(value), []);

  const onValueChange = useCallback(() => {
    showPicker(true);
  }, [showPicker]);

  const getState = result => {
    setModalVisible(false);
    setStartDay(result.startingDays);
    setEndDay(result.endingDays);
    setDateSelect(result.daySelecteds);
    console.log('result ', result);
  };
  const styles = StyleSheet.create({});

  const modal = (
    <TVSControlPopup
      maxHeight={500}
      isShow={modalVisible}
      title={'Chọn ngày'}
      onHide={() => setModalVisible(false)}>
      <Calender getState={getState} startDayss={startDay} endDayss={endDay} />
    </TVSControlPopup>
  );

  useEffect(() => {
    getDataBinding();
  }, []);
  useEffect(() => {
    getData();
  }, [startDay, endDay]);
  const getDataBinding = () => {
    sysFetch(
      API,
      {
        pro: 'SELHRIN011000',
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: 'data',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        console.log('rs ', rs.data.data);
        setStartDay(rs.data.data[0].start_dt);
        setEndDay(rs.data.data[0].end_dt);
        setDateSelect(rs.data.data[0].current_dt_disp);
      })
      .catch(error => {
        console.log('error');
        console.log(error);
      });
  };

  const getData = () => {
    console.log('startDay: ', startDay, '|endDay: ', endDay);
    sysFetch(
      API,
      {
        pro: 'SELHRIN011001',
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: startDay,
          p3_varchar2: endDay,
          p4_varchar2: APP_VERSION,
          p5_varchar2: crt_by,
        },
        out_par: {
          p1_sys: 'dataItem',
          p2_sys: 'dataCard',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        console.log(rs);
        setData(rs.data.dataItem);
        setDataCard(rs.data.dataCard);
      })
      .catch(error => {
        console.log('error');
        console.log(error);
      });
  };
  const modalPDF = (
    <PopupPDF
      title={'PDF'}
      isShow={modalPDFVisible}
      dataPDF={dataPDF}
      onHide={() => setModalPDFVisible(false)}></PopupPDF>
  );
  const renderItemCard = ({item}) => {
    let filterData = data.filter(x => x.pk === item.pk);
    // console.log('item ', item);
    return (
      <TouchableOpacity
        onPress={() => {
          setModalPDFVisible(true);
          setDataPDF(item.base64);
        }}
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          padding: 10,
          borderRadius: 10,
          marginBottom: 5,
          marginLeft: 10,
          marginRight: 10,
        }}>
        {/* render item text */}
        <View
          style={{
            marginLeft: 10,
            justifyContent: 'center',
            flex: 1,
          }}>
          {filterData.map(itemTitle => renderItem({itemTitle}))}
        </View>
        <View>
          <Image
            style={{width: 80, height: 90}}
            source={require('../../../../assets/images/pdf.png')}
          />
        </View>
      </TouchableOpacity>
    );
  };
  const renderItem = ({itemTitle}) => {
    return (
      <Text
        style={{
          fontSize: itemTitle.font_size,
          color: itemTitle.color,
          fontWeight: itemTitle.font_weight,
          paddingBottom: itemTitle.padding_bottom,
        }}>
        {itemTitle.title}
      </Text>
    );
  };
  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          language,
          dataMenuMBHRs,
          'MBHRIN011',
          dataMenuMBHRs.filter(x => x.menu_cd === 'MBHRIN011')[0].p_pk,
        )}
      </TVSHeader>

      <Block backgroundColor={Color.gray} flex>
        <Block backgroundColor={Color.gray}>
          <Block margin={10} radius={8} backgroundColor={Color.white}>
            <TouchableOpacity
              onPress={() => onValueChange()}
              style={{
                padding: 10,
                paddingLeft: 20,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Icon_calendar color={Color.mainColor} marginLeft={20} />
              <View
                style={{
                  paddingRight: 20,
                  paddingLeft: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: Color.mainColor,
                  }}>
                  Ngày {daySelect}
                </Text>
              </View>
              <Text marginRight={10} />
            </TouchableOpacity>
            {modal}
            {modalPDF}
          </Block>
        </Block>
        <View style={{flex: 1}}>
          <FlatList
            data={dataCard}
            renderItem={renderItemCard}
            refreshing={false}
            onRefresh={() => {
              getData();
            }}
          />
        </View>
      </Block>
    </Block>
  );
};
export default QuanLyCacQuyetDinh;

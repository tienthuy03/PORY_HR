import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Alert,
  FlatList,
  ActivityIndicator,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../components/Block';
import Button from '../../../../components/Button';
import Calender from '../../../../components/Calendes';
import Text from '../../../../components/Text';
import TVSControlPopup from '../../../../components/Tvs/ControlPopup';
import TVSHeader from '../../../../components/Tvs/Header';
import Icon_calendar from '../../../../icons/Datev';
import {setHeaderChil2} from '../../../../Language';
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../services/fetch';
import Person from '../../../../icons/Person';

const LichSuChamCong = ({navigation: {goBack}}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
  const loginReducers = useSelector(state => state.loginReducers);
  const mainMenu = useSelector(state => state.menuReducer.data.data.menu);
  const language = useSelector(
    state => state.loginReducers.data.data.user_language,
  );
  let thr_emp_pk = '';
  let tokenLogin = '';
  let fullname = '';
  let userPk;
  let refreshToken;
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {}
  const styles = StyleSheet.create({
    footerLoading: {
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    labelCtlDate: {
      paddingRight: 20,
      size: 14,
      color: Color.mainColor,
      paddingLeft: 10,
      textAlign: 'center',
    },
    imageSize: {
      width: 80,
      height: 80,
    },
    imageTimeFace: {
      width: 80,
      height: 80,
      borderRadius: 80 / 2,
    },
    oneItem: {
      flexDirection: 'row',
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 10,
      marginBottom: 5,
      marginLeft: 10,
      marginRight: 10,
    },
    labelDt: {
      color: Color.mainColor,
      fontWeight: 'bold',
      marginBottom: 5,
    },
  });
  const [offset, setOffset] = useState(0);
  const [timesClick, setTimeClick] = useState(0);
  const [isListEnd, setIsListEnd] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dsChamCong, setDsChamCong] = useState([]);
  const [startDay, setStartDay] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [endDay, setEndtDay] = useState(
    moment(new Date()).format('YYYY-MM-DD'),
  );
  const [daySelect, setDateSelect] = useState(
    moment(new Date()).format('DD/MM/YYYY'),
  );
  const [modalVisible, setModalVisible] = useState(false);
  const refreshNewToken = obj => {
    axios
      .post(API + 'User/RefreshToken/', {
        token: tokenLogin,
        userPk: userPk,
        refreshToken: refreshToken,
      })
      .then(response => {
        dispatch(
          updateUserAction({
            index: 0,
            value: response.data.token,
            key: 'tokenLogin',
          }),
        );
        dispatch(
          updateUserAction({
            index: 0,
            value: response.data.refreshToken,
            key: 'refreshToken',
          }),
        );
        tokenLogin = response.data.token;
        refreshToken = response.data.refreshToken;
        if (obj == 'onRequestToServer') {
          onreset();
        }
      })
      .catch(error => {
        if (error == 'AxiosError: Request failed with status code 400') {
          Alert.alert(
            'Thông báo',
            'Phiên bản làm việc đã hết hạn. Vui lòng đăng nhập lại hệ thống',
            [
              {
                text: 'Đóng',
                onPress: () => {
                  RNRestart.Restart();
                },
              },
            ],
            {cancelable: true},
          );
        }
        console.log(error);
      });
  };
  const getStateCalendar = async result => {
    await setTimeout(() => {
      setModalVisible(false);
      setStartDay(result.startingDays);
      setEndtDay(result.endingDays);
      setDateSelect(result.daySelecteds);
    }, 100);
  };
  const onreset = () => {
    setIsListEnd(false);
    setLoading(false);
    setOffset(0);
    setTimeClick(0);
    setDsChamCong([]);
    onRequestToServer(0);
  };
  const onRequestToServer = time => {
    if (time > 0) {
      onreset();
      return;
    }
    console.log('time ', time);
    try {
      console.log('loading ', !loading);
      console.log('isListEnd ', !isListEnd);
      if (!loading && !isListEnd) {
        setLoading(true);
        console.log('offset ', offset);
        sysFetch(
          API,
          {
            pro: 'SELHRIN0070100',
            in_par: {
              p1_varchar2: thr_emp_pk,
              p2_varchar2: moment(startDay).format('YYYYMMDD'),
              p3_varchar2: moment(endDay).format('YYYYMMDD'),
              p4_varchar2: fullname,
              p5_varchar2: offset,
            },
            out_par: {
              p1_sys: 'lscc',
            },
          },
          tokenLogin,
        )
          .then(rs => {
            console.log('rs ', rs);
            if (rs == 'Token Expired') {
              refreshNewToken('onRequestToServer', 1);
            }
            if (rs != 'Token Expired') {
              if (rs.totalRow > 0) {
                setOffset(offset + 1);
                //After the response increasing the offset for the next API call.
                setDsChamCong([...dsChamCong, ...rs.data.lscc]);
                setLoading(false);
              } else {
                setIsListEnd(true);
                setLoading(false);
              }
            }
          })
          .catch(error => {
            console.error('error form');
            console.error(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    onreset();
  }, [startDay]);

  const ItemView = ({item}) => {
    return (
      <View style={styles.oneItem}>
        <View style={styles.imageSize}>
          {item.image ? (
            <Image
              style={styles.imageTimeFace}
              source={{
                uri: 'data:image/jpeg;base64,' + item.image,
              }}
            />
          ) : (
            <Person />
          )}
        </View>
        <View
          style={{
            marginLeft: 10,
            justifyContent: 'center',
          }}>
          <Text style={styles.labelDt}>{item.scan_dt}</Text>
          <Text>{item.scan_time}</Text>
        </View>
      </View>
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: Color.gray,
        }}
      />
    );
  };

  const renderFooter = () => {
    return (
      //Footer View with Loader
      <View style={styles.footerLoading}>
        {loading ? (
          <ActivityIndicator color="black" style={{margin: 15}} />
        ) : null}
      </View>
    );
  };

  const modal = (
    <TVSControlPopup
      maxHeight={500}
      isShow={modalVisible}
      onHide={() => setModalVisible(false)}
      title={'Chọn ngày'}>
      <Calender
        getState={getStateCalendar}
        startDayss={startDay}
        endDayss={endDay}
      />
    </TVSControlPopup>
  );

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          language,
          mainMenu,
          'MBHRIN007',
          mainMenu.filter(x => x.menu_cd === 'MBHRIN007')[0].p_pk,
        )}
      </TVSHeader>
      <Block flex backgroundColor={Color.gray}>
        <Block margin={10} radius={8} backgroundColor={Color.white}>
          <Button
            nextScreen={() => setModalVisible(true)}
            row
            padding={10}
            alignCenter
            justifyContent={'space-between'}>
            <Icon_calendar color={Color.mainColor} marginLeft={20} />
            <Text flex style={styles.labelCtlDate}>
              Ngày {daySelect}
            </Text>
            <Text marginRight={10} />
          </Button>
        </Block>
        {modal}
        <Block flex>
          <Block flex>
            <SafeAreaView style={{flex: 1, marginHorizontal: 5}}>
              <FlatList
                data={dsChamCong}
                refreshing={false}
                onRefresh={() => {
                  onRequestToServer(timesClick + 1);
                }}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={ItemSeparatorView}
                renderItem={ItemView}
                ListFooterComponent={renderFooter}
                onEndReached={onRequestToServer(timesClick)}
                onEndReachedThreshold={0.5}
              />
            </SafeAreaView>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};
export default LichSuChamCong;

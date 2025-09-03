import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import TVSHeader from '../../../../components/Tvs/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Block from '../../../../components/Block';
import OneItem from '../OneItem';
import sysFetch from '../../../../services/fetch_v1';
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import Button from '../../../../components/Button';
const {width, height} = Dimensions.get('screen');
// import Orientation from 'react-native-orientation';

import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from '../../../../services/redux/GlobalLoading/action';
import {TouchableOpacity} from 'react-native';
const MBHRMT001_Monitering = ({navigation: {goBack}}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
  const currentLangue = useSelector(
    state => state.loginReducers.data.data.user_language,
  );
  const menu = useSelector(state => state.menuReducer.data.data.menu);
  let tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  let userPk = useSelector(state => state.loginReducers.data.data.tes_user_pk);
  let empPk = useSelector(state => state.loginReducers.data.data.thr_emp_pk);
  let crt_by = useSelector(state => state.loginReducers.data.data.crt_by);
  let refreshToken = useSelector(
    state => state.loginReducers.data.data.refreshToken,
  );

  const [Avatar, setAvatar] = useState(
    'data:image/png;base64,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',
  );
  const ImageDish =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAADkklEQVR4nO2aS0hVQRjHf+YjjULDSrMwy15SYVZkpUsp7CEkBG1cRSRtg9r0kKBtbYKyl5kRbloVQo9NED1QgqhVUWak1Sa7aaGm1xbfnM69t3PTrud856bnB8NwZ86Z7z/fnTnnm5kDAQEBAQEBAQFTlBSf7OYB+4D15ncHcAX47JMeVaqBXmA0Jn0BtvmoS4USoB/p8B2gzqS7pqwPWOGbOgWuIh29TvT0SwFumLpLPuhSowvpZIlD3SpT91ZVkTIhpJO5DnW52M8CNaZpGgNem7zKoW5rzDWTkoPIv/wR2BJRXgF8MnX1PuhSIxVoQzoaBl6ZFDZlt9Eflepk8GcMYKUMH3WpYnV4rUnWb3XSFG0tAvbGlMVGfkdM3oq8MicVjcQf+rHpvJYozRFgze824EWca9YA24HpKorQdYDFG8QBOUC2KQsBX4EZ2mK8XA6nIg+4KpMqgcxx3jsMPAfum/QA+OmBRk8ckA/sRwKagojyUeA9MgK6kCXxgKnLBGYjD8pioDBGWzfyXLhIEu8ZLAZagEHsh1kXcBrYiXP8H49cYBdwBnGa1d4AcM3YShqygAbgByJyCFnaVuDOCEtBpk8rMg1Gja0TxravVAKdiKgR4DKw0EN7hUCTsWUtnSs8tPdX6rGHewdQqmi7DHhmbA8CBxRtkw5cwP7XT5oybdKBU9ijoVFDRyr21lU/sNtrg+OgFviOaLqJh7FN5L5dL7DRK0MJUI4EUk77ja5x3BgIkVydt9gMfEM0HnW78Wpkro0AO9xu3EVqsHW6dsaQA3xAPHvMrUY9pAE76swe49pxcc40+BR5CCY7aUA7ovnsRBtbhkRfw8DqiTamSCkyDYaApRNpqAXxZJMLorRpRrQ3J9rAPGTxMQIscUmUJsWI9gFgTiINHEY8eMtFUdpYW/CHErn5sbm51k1FyuxB+vDwX2+ciz18ZrosSpNZSB+GiTMN4p3CbDJ1j5CY/3+lD3iCvL7LnS6I54B1Jm/3QJQ2HSYvc6qM54DlJn/puhx9rD6sdKqM54D5Ju9xXY4+3SbPd6qMXDvXYe/iWt/p1AAbvNGlhtWnEuyjtx4kyPu9bi7A9tRUYQHQY40A69gqhOK5nE/UI6vEqKP4IiRg6PRDkTLWLnYRTIGvMcYidgMxC+cPmCYTUYcplgPCJs8D7qnK8Y8w2A7oRr7QLPJNji7vmHpvvYCAgICAgICAaH4BkibW5yWRECEAAAAASUVORK5CYII=';
  const [dataEmp, setDataEmp] = useState([]);
  const [dataTitle, setDataTitle] = useState([]);
  const [data, setData] = useState([]);
  let numColumns = 2;

  const styles = StyleSheet.create({
    container: {
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 5,
      marginTop: 5,
      backgroundColor: Color.white,
      borderRadius: 5,
    },
    viewInfo: {
      flexDirection: 'row',
    },
    viewAvatar: {
      width: 150,
      height: 150,
    },
    avatar: {
      resizeMode: 'stretch',
      width: '100%',
      height: '100%',
      borderRadius: 5,
      borderColor: Color.grayPlahoder,
      borderWidth: 1,
    },
    viewContent: {
      padding: 10,
      paddingTop: 20,
    },
    fullname: {
      fontSize: 14,
      color: Color.mainColor,
      marginBottom: 5,
    },
    checkbox: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Color.mainColor,
    },
    viewCheckbox: {
      margin: 10,
      height: 30,
      width: 30,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.mainColor,
    },
  });
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1);
      getDataEmp();
      console.log('process');
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getData = () => {
    try {
      sysFetch(
        API,
        {
          pro: 'SELHRMT001000',
          in_par: {
            p1_varchar2: empPk,
          },
          out_par: {
            p1_sys: 'title',
            p2_sys: 'data',
          },
        },
        tokenLogin,
      ).then(rs => {
        // console.log(rs);
        if (rs == 'Token Expired') {
          refreshNewToken('getData');
        }
        if (rs != 'Token Expired') {
          if (rs.results === 'S') {
            console.log('change meal');
            setDataTitle(rs.data.title[0]);
            setData(rs.data.data);
            onConvertItem(rs.data.data);
          }
        }
      });
    } catch (error) {
      dispatch(HideGlobalLoading);
    }
    // onSetDataEmp();
  };

  const getDataEmp = () => {
    try {
      sysFetch(
        API,
        {
          pro: 'SELHRMT001001',
          in_par: {
            p1_varchar2: userPk,
          },
          out_par: {
            p1_sys: 'emp_info',
          },
        },
        tokenLogin,
      ).then(rs => {
        // console.log(rs);
        if (rs == 'Token Expired') {
          refreshNewToken('getData');
        }
        if (rs != 'Token Expired') {
          if (rs.results === 'S') {
            console.log('change emp');
            console.log(rs.data.emp_info[0]);
            setDataEmp(rs.data.emp_info[0]);
          }
        }
      });
    } catch (error) {
      dispatch(HideGlobalLoading);
    }
    // onSetDataEmp();
  };

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
        if (obj == 'getData') {
          getData();
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

  const onConvertItem = items => {
    // let dataTemp = [];
    let dataTemp = items;
    try {
      //Chia cột cho menu home
      if (dataTemp.length % 2 === 1) {
        dataTemp.push({name: '', image: '', contractor: '', pk: 'pk'});
      }
      setData(dataTemp);
    } catch (error) {
      console.log(error);
    }
    dispatch(HideGlobalLoading);
  };

  const onCheck = pk => {
    const nameSelect = data.filter(x => x.pk == pk)[0].meal_name;
    const selectItem = data.filter(x => x.pk == pk)[0];
    Alert.alert(
      'Thông báo',
      'Bạn có muốn chọn món ' + nameSelect + '?',
      [
        {
          text: 'Hủy bỏ',
          onPress: () => {
            console.log('Cancel ');
          },
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: () => {
            onUpdateData(1, selectItem);
            // Alert.alert(
            //   'Cảm ơn đã chọn món!',
            //   'Chúc bạn ngày làm việc hiệu quả.',
            //   [
            //     {
            //       text: 'Xác nhận',
            //       onPress: () => {
            //         console.log('pk ', pk);
            //       },
            //     },
            //   ],
            //   {cancelable: false},
            // );
          },
        },
      ],
      {cancelable: false},
    );
  };
  const onUpdateData = (type, selectItem) => {
    let param;
    if (type == 1) {
      param = {
        p1_varchar2: dataEmp.emp_pk,
        p2_varchar2: dataEmp.full_name,
        p3_varchar2: dataEmp.emp_id,
        p4_varchar2: selectItem.pk,
        p5_varchar2: selectItem.meal_name,
        p6_varchar2: dataEmp.work_dt,
        p7_varchar2: dataEmp.org_pk,
        p8_varchar2: dataEmp.time,
        p9_varchar: dataTitle.meal_type_code,
      };
    } else {
      param = {
        p1_varchar2: dataEmp.emp_pk,
        p2_varchar2: dataEmp.full_name,
        p3_varchar2: dataEmp.emp_id,
        p4_varchar2: '',
        p5_varchar2: '',
        p6_varchar2: dataEmp.work_dt,
        p7_varchar2: dataEmp.org_pk,
        p8_varchar2: dataEmp.time,
        p9_varchar: dataTitle.meal_type_code,
      };
    }
    try {
      sysFetch(
        API,
        {
          pro: 'UPDHRMT001000',
          in_par: param,
          out_par: {
            p1_sys: 'rs',
          },
        },
        tokenLogin,
      ).then(rs => {
        console.log(rs);
        if (type == 1) {
          Alert.alert(
            'Cảm ơn đã chọn món!',
            'Chúc bạn ngày làm việc hiệu quả.',
            [
              {
                text: 'Xác nhận',
                onPress: () => {},
              },
            ],
            {cancelable: false},
          );
        }
        if (type == 0) {
          Alert.alert(
            'Thông báo',
            'Không chọn món thành công',
            [
              {
                text: 'Xác nhận',
                onPress: () => {},
              },
            ],
            {cancelable: false},
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
    console.log('param ', param);
  };
  const renderItem = ({item}) => {
    if (item.pk === 'pk') {
      return (
        <Block flex height={140} margin={10} borderRadius={20} justifyCenter />
      );
    } else {
      return (
        <View
          shadow
          flex={1}
          height={140}
          margin={10}
          borderRadius={20}
          justifyCenter
          backgroundColor={Color.white}>
          <Button nextScreen={() => onCheck(item.pk)}>
            <View
              style={{
                alignItems: 'center',
                marginVertical: 5,
              }}>
              <View style={{width: 80, height: 80}}>
                <Image
                  style={{
                    resizeMode: 'stretch',
                    width: '100%',
                    height: '100%',
                    borderRadius: 5,
                    color: Color.grayPlahoder,
                  }}
                  source={{
                    uri:
                      item.meal_image === ''
                        ? ImageDish
                        : 'data:image/png;base64,' + item.meal_image,
                  }}
                />
              </View>
            </View>
            <View style={{alignItems: 'center', marginTop: 10}}>
              <Text
                style={{
                  paddingTop: 3,
                  color: Color.mainColor,
                  fontSize: 14,
                  numberOfLines: 1,
                }}>
                {item.meal_name}
              </Text>
            </View>
          </Button>
        </View>
      );
    }
  };

  return (
    <View
      backgroundColor={Color.gray}
      style={{
        flex: 1,
      }}>
      <TVSHeader goBack={goBack}>
        {
          menu.filter(x => x.menu_cd === 'MBHRMT001')[0][
            currentLangue.toLowerCase()
          ]
        }
      </TVSHeader>
      <View style={{flexDirection: 'row', flex: 1}}>
        <View style={{flex: 1}}>
          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginBottom: 5,
              marginTop: 5,
              backgroundColor: Color.white,
              borderRadius: 5,
            }}>
            <View style={{}}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 200,
                    height: 240,
                  }}>
                  <Image
                    style={styles.avatar}
                    source={{
                      uri:
                        dataEmp.image === ''
                          ? Avatar
                          : 'data:image/png;base64,' + dataEmp.image,
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: 20,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    marginBottom: 5,
                  }}>
                  {dataEmp.full_name}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    marginBottom: 5,
                    color: 'gray',
                  }}>
                  {dataEmp.org_nm}
                </Text>
                {/* <Text>{seconds} seconds have elapsed since mounting.</Text> */}
              </View>
              <View
                style={{
                  marginHorizontal: 20,
                  marginBottom: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                  padding: 10,
                  flexDirection: 'row',
                }}>
                <View style={{flex: 1, alignItems: 'flex-start'}}>
                  <Text style={{fontWeight: '500', fontSize: 16}}>
                    Giờ đăng ký
                  </Text>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Text
                    style={{fontWeight: '500', fontSize: 16, color: 'blue'}}>
                    {dataEmp.time}
                  </Text>
                </View>
              </View>
              <View style={{marginVertical: 20, alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Thông báo',
                      'Bạn có muốn không chọn món ?',
                      [
                        {
                          text: 'Hủy bỏ',
                          onPress: () => {
                            console.log('Cancel ');
                          },
                          style: 'cancel',
                        },
                        {
                          text: 'Xác nhận',
                          onPress: () => {
                            onUpdateData(0, []);
                          },
                        },
                      ],
                      {cancelable: false},
                    );
                  }}
                  style={{
                    padding: 10,
                    marginTop: 5,
                    backgroundColor: '#E7F2FE',
                    justifyContent: 'center',
                    borderRadius: 8,
                  }}>
                  <Text style={{color: '#F64E60'}}>
                    <Icon
                      name={'camera-rear-variant'}
                      size={16}
                      color={'#F64E60'}
                    />{' '}
                    Không chọn món
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={{flex: 1}}>
          <View>
            <View style={{paddingBottom: 0, marginTop: 20}}>
              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 18, color: Color.mainColor}}>
                  Thực đơn ngày: {dataTitle.currentdate}
                </Text>
              </View>
              <View style={{padding: 10}}>
                <Text style={{fontSize: 18, color: Color.mainColor}}>
                  Ca ăn: {dataTitle.meal_type}
                </Text>
              </View>
            </View>
          </View>
          <View style={{flex: 1}}>
            <FlatList
              data={data}
              renderItem={renderItem}
              numColumns={numColumns}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
export default MBHRMT001_Monitering;

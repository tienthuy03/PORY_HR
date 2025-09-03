import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Block from '../components/Block';
import Button from '../components/Button';
import Text from '../components/Text';
import Icon_next from '../icons/Next';
import {setLanguageItem} from '../Language';
import {useDispatch, useSelector} from 'react-redux';
import {deviceId} from '../constants/index';
import {fetchMenuAction} from '../actions';
import {useIsFocused} from '@react-navigation/native';
const Item_MBHRAP = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  const Color = useSelector(s => s.SystemReducer.theme);
  const navigation = useNavigation();
  let dataMenuMBHRs = [];
  let language;
  let fullname;
  let tokenLogin;
  let thr_emp_pk;
  let tes_user_pk;
  let user_name;
  try {
    fullname = state.loginReducers.data.data.full_name;
    user_name = state.loginReducers.user_name;
    tes_user_pk = state.loginReducers.data.data.tes_user_pk;
    tokenLogin = state.loginReducers.data.data.tokenLogin;
    thr_emp_pk = state.loginReducers.data.data.thr_emp_pk;
    dataMenuMBHRs = state.menuReducer.data.data.menu;
    language = state.loginReducers.data.data.user_language;
    // PushNotificationIOS
  } catch (error) {
    console.log('error home main');
    console.log(error);
  }

  let [dataMenuMBHRRE, setDataMenuMBHRRE] = useState([]);

  useEffect(() => {
    let dataMenuMBHRREs = [];
    dataMenuMBHRs.map(item => {
      if (
        item.p_pk === dataMenuMBHRs.filter(i => i.menu_cd === 'MBHRAP')[0].pk
      ) {
        dataMenuMBHRREs.push(item);
      }
      setDataMenuMBHRRE(dataMenuMBHRREs);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataMenuMBHRs]);
  const onReload = () => {
    console.log('reload');
    dispatch(
      fetchMenuAction({
        token: tokenLogin,
        machine_id: deviceId,
        tes_user_pk: tes_user_pk,
        thr_emp_pk: thr_emp_pk,
        user_name: user_name,
      }),
    );
  };
  useEffect(() => {
    // onReload();
    console.log(isFocused);
    if (isFocused) {
      onReload();
    }
  }, [isFocused]);
  const renderItem = ({item, index}) => {
    return (
      <Block>
        <Button
          nextScreen={() => navigation.navigate(item.menu_cd)}
          shadow
          height={60}
          justifyContent={'space-between'}
          alignCenter
          marginLeft={20}
          marginRight={20}
          marginBottom={10}
          radius={8}
          row
          backgroundColor={Color.tabColor}>
          <Block
            marginLeft={10}
            height={40}
            width={40}
            radius={6}
            alignCenter
            justifyCenter>
            <Icon name={item.icon} color={Color.titleColor} size={24} />
          </Block>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
            }}>
            <View>
              <Text
                numberOfLines={1}
                paddingLeft={10}
                height={60}
                size={17}
                color={Color.titleColor}
                fontFamily={'Roboto-Medium'}>
                {setLanguageItem(item, language)}
                {/* {item.menu_cd} */}
              </Text>
            </View>
          </View>
          <View
            style={{
              minWidth: 5,
              minHeight: 30,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 5,
              marginLeft: 1,
              marginVertical: 5,
              marginHorizontal: 2,
            }}>
            <Text
              style={{
                color: '#FFA800',
                fontSize: 17,
                fontWeight: 'bold',
              }}>
              {item.count_approve_1}
            </Text>
          </View>
          <View
            style={{
              minWidth: 5,
              minHeight: 30,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 5,
              marginLeft: 1,
              marginVertical: 5,
              marginHorizontal: 2,
            }}>
            <Text
              style={{
                color: '#009E00',
                fontSize: 17,
                fontWeight: 'bold',
              }}>
              {item.count_approve_2}
            </Text>
          </View>
          <View
            style={{
              minWidth: 5,
              minHeight: 30,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 5,
              marginLeft: 1,
              marginVertical: 5,
              marginHorizontal: 2,
            }}>
            <Text
              style={{
                color: 'red',
                fontSize: 17,
                fontWeight: 'bold',
              }}>
              {item.count_approve_3}
            </Text>
          </View>
          <Icon_next color={Color.titleColor} style={{marginRight: 10}} />
        </Button>
      </Block>
    );
  };

  return (
    <Block flex>
      <FlatList
        data={dataMenuMBHRRE}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        refreshing={false}
        onRefresh={() => {
          onReload();
        }}
      />
    </Block>
  );
};

export default Item_MBHRAP;

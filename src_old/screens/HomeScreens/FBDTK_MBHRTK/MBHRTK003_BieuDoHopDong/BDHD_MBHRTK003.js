/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {Platform, StatusBar, View, Alert} from 'react-native';
import {Text} from 'react-native-svg';
import {PieChart} from 'react-native-svg-charts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../components/Block';
import Button from '../../../../components/Button';
import Texts from '../../../../components/Text';
import TVSHeader from '../../../../components/Tvs/Header';
import Icon_back from '../../../../icons/Back';
import {setHeaderChil2} from '../../../../Language';
// import {Color} from '../../../../colors/color';
import {
  HRTK003LayDanhSachPhongBan,
  HRTK003LayDuLieuS,
  HRTK003ShowPopupPhongBan,
} from '../../../../services/redux/HRTK003_BieuDoHopDong/action';
import PopUpPhongBan from './PopUpPhongBan';
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../services/fetch';

const BDHD_MBHRMN003 = ({navigation: {goBack}}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
  const ChonPhongBan = useSelector(
    state => state.HRTK003_BieuDoHopDongReducer.ChonPhongBan,
  );
  const isLoading = useSelector(state => state.GlobalLoadingReducer.isLoading);
  const data = useSelector(
    state => state.HRTK003_BieuDoHopDongReducer.DuLieuHopDong,
  );
  const language = useSelector(
    state => state.loginReducers.data.data.user_language,
  );
  let tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  let userPk = useSelector(state => state.loginReducers.data.data.tes_user_pk);
  let refreshToken = useSelector(
    state => state.loginReducers.data.data.refreshToken,
  );

  const dataMenuMBHRs = useSelector(state => state.menuReducer.data.data.menu);
  const Labels = ({slices}) => {
    return slices.map((slice, index) => {
      const {pieCentroid, data} = slice;
      return (
        <>
          {data.amount > 0 ? (
            <Text
              key={index}
              x={pieCentroid[0]}
              y={pieCentroid[1]}
              fill={'white'}
              textAnchor={'middle'}
              alignmentBaseline={'center'}
              fontSize={20}>
              {data.amount + '%'}
            </Text>
          ) : null}
        </>
      );
    });
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
  const getData = () => {
    sysFetch(
      API,
      {
        pro: 'SELHRTK0030100',
        in_par: {
          p1_varchar2: userPk,
        },
        out_par: {
          p1_sys: 'data',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        if (rs == 'Token Expired') {
          refreshNewToken('getData');
        }
        if (rs != 'Token Expired') {
          dispatch(HRTK003LayDuLieuS(null));
          dispatch(HRTK003LayDanhSachPhongBan());
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  function itemCircle({contract_no, svg, amount, contract_amount}) {
    return (
      <Block padding={5} row alignCenter key={contract_no}>
        <Block radius={5} width={25} height={25} backgroundColor={svg.fill} />
        <Texts marginLeft={10}>{contract_no}</Texts>
        <Block flex alignEnd>
          <Texts>
            {contract_amount} - {amount}%
          </Texts>
        </Block>
      </Block>
    );
  }

  return (
    <>
      <PopUpPhongBan />
      <Block flex backgroundColor={Color.backgroundColor}>
        <TVSHeader goBack={goBack}>
          {setHeaderChil2(
            language,
            dataMenuMBHRs,
            'MBHRTK003',
            dataMenuMBHRs.filter(x => x.menu_cd === 'MBHRTK')[0].pk,
          )}
        </TVSHeader>
        <Block flex backgroundColor={Color.gray} paddingTop={5}>
          <Block
            column
            backgroundColor={'#fff'}
            radius={8}
            marginTop={5}
            paddingLeft={5}
            paddingRight={5}
            marginLeft={10}
            paddingBottom={10}
            marginRight={10}>
            <Block row>
              <Texts paddingLeft={5} height={40} color={Color.mainColor}>
                Phòng ban
              </Texts>
            </Block>
            <Button
              nextScreen={() => dispatch(HRTK003ShowPopupPhongBan())}
              row
              height={40}
              justifyCenter
              alignCenter
              backgroundColor={'#F3F6F9'}
              radius={8}>
              <Block flex height={40} paddingLeft={10} justifyCenter>
                <Texts size={16} color={Color.mainColor}>
                  {ChonPhongBan.code_nm}
                </Texts>
              </Block>
              <Block justifyCenter paddingRight={10}>
                <Icon
                  name={'arrow-down-drop-circle-outline'}
                  color={Color.mainColor}
                  size={24}
                />
              </Block>
            </Button>
          </Block>
          {data === null ? null : (
            <Block column margin={10} radius={8} padding={5}>
              {data !== null ? data.map(item => itemCircle(item)) : null}
            </Block>
          )}
          <View
            style={{
              alignContent: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              margin: 10,
              padding: 5,
            }}>
            {data === null ? null : data.length === 0 && isLoading === false ? (
              <View
                style={{
                  height: '100%',
                  top: -100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Texts>Không có dữ liệu thống kê cho phòng ban này.</Texts>
              </View>
            ) : (
              <PieChart
                style={{height: 300}}
                valueAccessor={({item}) => item.amount}
                data={data}
                spacing={0}
                outerRadius={'95%'}>
                <Labels />
              </PieChart>
            )}
          </View>
        </Block>
      </Block>
    </>
  );
};

export default BDHD_MBHRMN003;

import moment from 'moment';
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import TVSHeader from '../../../../components/Tvs/Header';
import {setHeaderChil2} from '../../../../Language';

import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../components/Block';
import TVSList from '../../../../components/Tvs/TVSList';
import Typography from '../../../../components/Text';
import TVSButton from '../../../../components/Tvs/Button';
import TVSControlPopup from '../../../../components/Tvs/ControlPopup2';
import TVSDate from '../../../../components/Tvs/TVSDate';
import RadioForm from 'react-native-radio-form';
import sysFetch from '../../../../services/fetch_v1';
import {APP_VERSION} from '../../../../config/Pro';

const PhieuDanhGia = ({navigation: {goBack}}) => {
  const API = useSelector(state => state.SysConfigReducer.API_URL);

  const [colorFrom, setColorFrom] = useState('#B2B2B2');
  const [fromDate, setFromDate] = useState('dd/mm/yyyy');
  const [colorLoai, setColorLoai] = useState('#B2B2B2');
  const [nhaan_val, setnhaan_val] = useState('Chọn nhà ăn');
  const [yKien, setYKien] = useState('');
  const [sentNhaAn, setSentNhaAn] = useState('');
  const [confirmSent, setConfirmSent] = useState('');

  const [danhSachNhaAn, setDanhSachNhaAn] = useState([]);
  const [diemTieuChi, setDiemTieuChi] = useState([]);
  const [loaiTieuChi, SetloaiTieuChi] = useState([]);
  const [ghiChu, setGhiChu] = useState([]);
  const [modalVisiableNhaAn, setModalVisiableNhaAn] = useState(false);
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);

  const [arr, setArr] = useState([]);

  const Color = useSelector(s => s.SystemReducer.theme);
  const dispatch = useDispatch();
  const loginReducers = useSelector(state => state.loginReducers);
  const menuReducer = useSelector(state => state.menuReducer);
  let thr_emp_pk = '';
  let tokens = '';
  let fullname = '';
  let crt_by = '';
  // let arr = [];

  let p_from_date = moment(moment(fromDate, 'DD/MM/YYYY')).format('YYYYMMDD');
  try {
    tokens = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {
    //
  }

  //Ngay lam viec
  const showDatePickerStart = () => {
    setStartDatePickerVisible(true);
  };

  const hideDatePickerStart = () => {
    setStartDatePickerVisible(false);
  };

  const handleConfirmStart = val => {
    hideDatePickerStart();
    setFromDate(moment(val).format('DD/MM/YYYY'));
    setColorFrom(null);
  };

  //
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
          p2_sys: 'nhaAn',
          p3_sys: 'ghiChu',
          p4_sys: 'diemDanhGia',
        },
      },
      tokens,
    )
      .then(res => {
        console.log('res ', res.data.ghiChu);
        console.log('res ', res.data.nhaAn);
        console.log('res ', res.data.tieuChi);
        setDiemTieuChi(res.data.diemDanhGia);
        setDanhSachNhaAn(res.data.nhaAn);
        SetloaiTieuChi(res.data.tieuChi);
        setGhiChu(res.data.ghiChu);
      })
      .catch(error => {
        console.log('error');
        console.log(error);
      });
  };

  const modalNhaAn = (
    <TVSControlPopup
      title={'Chọn nhà ăn'}
      isShow={modalVisiableNhaAn}
      onHide={() => setModalVisiableNhaAn(false)}
      bottom={
        <TVSButton
          type={'danger'}
          icon={'close'}
          buttonStyle={'3'}
          onPress={() => setModalVisiableNhaAn(false)}>
          Đóng lại
        </TVSButton>
      }>
      <FlatList
        data={danhSachNhaAn}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateNhaAn(item);
              }}
              style={{
                backgroundColor: '#F3F6F9',
                padding: 10,
                borderRadius: 6,
                marginBottom: 3,
              }}>
              <Text>{item.code_nm}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </TVSControlPopup>
  );

  const getStateNhaAn = result => {
    setnhaan_val(result.code_nm);

    setModalVisiableNhaAn(false);
    setColorLoai(null);
    setSentNhaAn(result);
  };

  const modalPhieu = () => {
    Alert.alert('Thông báo', 'Bạn có muốn gửi phiếu không ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => sendPhieu()},
    ]);
  };

  const sendPhieu = () => {
    console.log('Ngày: ' + p_from_date);
    console.log('Nhà ăn số: ' + sentNhaAn.code);

    let str = '';
    arr.forEach(function (item) {
      str += item.loaitieuchi + ',' + item.diemtieuchi + '|';
    });
    console.log(str);
    console.log(yKien);

    console.log({
      p1_varchar2: 'INSERT',
      p2_varchar2: '',
      p3_varchar2: thr_emp_pk,
      p4_varchar2: str,
      p5_varchar2: loaiTieuChi.length,
      p6_varchar2: p_from_date,
      p7_varchar2: sentNhaAn.code,
      p8_varchar2: yKien,
      p9_varchar2: APP_VERSION,
      p10_varchar2: crt_by,
    });
    console.log('_______________');

    sysFetch(
      API,
      {
        pro: 'UPDHRSV001000',
        in_par: {
          p1_varchar2: 'INSERT',
          p2_varchar2: '',
          p3_varchar2: thr_emp_pk,
          p4_varchar2: str,
          p5_varchar2: loaiTieuChi.length,
          p6_varchar2: p_from_date,
          p7_varchar2: sentNhaAn.code,
          p8_varchar2: yKien,
          p9_varchar2: APP_VERSION,
          p10_varchar2: crt_by,
        },
        out_par: {
          p1_varchar2: 'showDialog',
        },
      },
      tokens,
    )
      .then(res => {
        console.log('res ', res);

        // setComfirmSent()
        if (res.results == 'F') {
          let newText = res.errorData.split('ORA');
          let errors = '';
          try {
            errors = newText[1].trim().split(':')[1];
          } catch (error) {
            errors = 'Lỗi: đăng ký không thành công.';
          }

          Alert.alert(
            'Thông báo',
            errors,
            [
              {
                text: 'Thoát',
                onPress: () => {},
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );
        } else {
          Alert.alert(
            'Thông báo',
            'Gửi phiếu thành công',
            [
              {
                text: 'Thoát',
                onPress: () => {},
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );
          setConfirmSent(res.data.showDialog);
        }
      })
      .catch(error => {
        console.log('error');
        console.log(error);
      });
  };

  const getDiemTieuChi = (result1, result2) => {
    console.log(result2);
    console.log(result1);
    let arrLoai = [...arr];
    if (arrLoai.length == 0) {
      arrLoai.push({loaitieuchi: result2.code, diemtieuchi: result1.code});
    } else {
      let flag = 'N';
      arrLoai.forEach(function (item) {
        //update diem tieu chi
        if (item.loaitieuchi == result2.code) {
          flag = 'Y';
          item.diemtieuchi = result1.code;
        }
      });
      if (flag == 'N') {
        //check LoaiTieuChi co hay khong ???
        arrLoai.push({loaitieuchi: result2.code, diemtieuchi: result1.code});
      }
    }
    setArr(arrLoai);
  };

  const loadNew = () => {
    setFromDate('dd/mm/yyyy');
    setColorFrom('#B2B2B2');
    setnhaan_val('Chọn nhà ăn');
    setColorLoai('#B2B2B2');
    SetloaiTieuChi([]);
    getData();
    setConfirmSent('');
  };
  return (
    <Block flex backgroundColor={Color.gray}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          loginReducers.data.data.user_language,
          menuReducer.data.data.menu,
          'MBHRSV001',
          menuReducer.data.data.menu.filter(x => x.menu_cd === 'MBHRSV001')[0]
            .p_pk,
        )}
      </TVSHeader>
      {/* <TVSTab
          fullTab
          scrollEnabled={false}
          data={[
            {
              id: 0,
              name: 'Đăng ký phiếu ',
              count: null,
              screen: <PDG />
            },
            {
              id: 1,
              name: 'Danh sách phiếu',
              count: null,
              screen: <DSPDG/>
            },
          ]}
        /> */}
      <ScrollView>
        <Block flex backgroundColor={Color.gray}>
          <Block style={styles.titleContainer}>
            <Block style={{paddingVertical: 5}}>
              <Typography style={{fontSize: 18}} color={Color.mainColor}>
                Chọn ngày tạo phiếu
              </Typography>
              <TVSDate
                onPress={() => showDatePickerStart()}
                colorText={colorFrom}
                date={fromDate}
                modalVisible={startDatePickerVisible}
                onConfirm={handleConfirmStart}
                onCancel={hideDatePickerStart}
              />
            </Block>
            <Block>
              <Typography style={{fontSize: 18}} color={Color.mainColor}>
                Chọn nhà ăn
              </Typography>
              <TVSList
                onPress={() => setModalVisiableNhaAn(true)}
                colorText={colorLoai}
                code_nm={nhaan_val}
              />
              {modalNhaAn}
            </Block>
            <Block style={{margin: 8}}>
              <Typography style={{fontSize: 15}}>
                {ghiChu.map(x => x.description)}
              </Typography>
            </Block>
            <Block>
              {loaiTieuChi.map(x => (
                <Block style={{margin: 5}}>
                  <Typography style={{fontSize: 16}} color={Color.mainColor}>
                    {x.code_nm}
                  </Typography>
                  <RadioForm
                    dataSource={diemTieuChi}
                    itemShowKey="code_nm"
                    itemRealKey="code"
                    circleSize={16}
                    initial={-1}
                    formHorizontal={true}
                    labelHorizontal={true}
                    onPress={code => getDiemTieuChi(code, x)}
                  />
                </Block>
              ))}
            </Block>
            <Block>
              <Typography style={{marginTop: 5, fontSize: 16}}>
                Đề xuất cải tiến (nếu có):{' '}
              </Typography>
              <TextInput
                value={yKien}
                onChangeText={e => {
                  setYKien(e.toString());
                }}
                style={{
                  backgroundColor: Color.inputBackgroundColor,
                  paddingBottom: 10,
                  paddingHorizontal: 10,
                  paddingTop: 12,
                  borderRadius: 5,
                  marginVertical: 10,
                }}
                multiline
                placeholder="Ý kiến cá nhân..."
              />
            </Block>
            <Block>
              <Typography style={{color: 'red'}}>{confirmSent}</Typography>
            </Block>
            <Block
              style={{marginTop: 10, flexDirection: 'row', marginBottom: 20}}>
              <Block style={{flex: 1}}>
                <TVSButton
                  buttonStyle="3"
                  onPress={loadNew}
                  type={'secondary'}
                  icon={'sync'}>
                  Làm mới
                </TVSButton>
              </Block>
              <Block style={{flex: 1}}>
                <TVSButton buttonStyle="3" onPress={modalPhieu} icon={'check'}>
                  Gửi phiếu
                </TVSButton>
              </Block>
            </Block>
          </Block>
        </Block>
      </ScrollView>
    </Block>
  );
};
const styles = StyleSheet.create({
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 5,
    marginBottom: 10,
    margin: 10,
    backgroundColor: '#FFFFFFFF',
    borderRadius: 8,
  },
  titleText: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  formCheck: {
    flexDirection: 'row',
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  radioDanhGia: {
    flexDirection: 'row',
  },
});
export default PhieuDanhGia;

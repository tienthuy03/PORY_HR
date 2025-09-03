import moment from 'moment';
import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon_sp from '../icons/Next_sp';
import Block from './Block';
import Button from './Button';
import Text from './Text';
import TextInput from './TextInput';
import {useSelector} from 'react-redux';
const Item_CXN = ({item}) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const [show, setShow] = useState(false);
  return (
    <Block flex marginLeft={15} marginRight={15} marginBottom={15}>
      <Block marginBottom={5} row justifyContent={'space-between'}>
        <Block
          radius={8}
          backgroundColor={Color.mainColor}
          height={35}
          alignCenter
          justifyCenter
          paddingLeft={10}
          paddingRight={10}>
          <Text color={'#fff'} size={13}>
            {moment(item.work_dt).format('DD-MM-YYYY')} - Thứ {item.day_type}
          </Text>
        </Block>

        <Text color={'#fff'} size={13} />
      </Block>
      <Block backgroundColor={'#fff'} radius={6} paddingBottom={5}>
        <Block
          row
          borderBottomWidth={1}
          borderBottomColor={'#D9DCE3'}
          paddingTop={15}
          paddingBottom={15}
          paddingRight={5}
          paddingLeft={5}
          alignCenter
          justifyContent={'space-between'}>
          <Text color={Color.mainColor} flex={1}>
            Ca làm việc
          </Text>
          <Text color={Color.mainColor} flex={1} right flexWrap={'wrap'}>
            {item.shift}
          </Text>
        </Block>
        <Block
          row
          borderBottomWidth={1}
          borderBottomColor={'#D9DCE3'}
          paddingTop={15}
          paddingBottom={15}
          paddingRight={5}
          paddingLeft={5}
          alignCenter
          justifyContent={'space-between'}>
          <Text color={Color.mainColor} flex={1}>
            Giờ vào ra
          </Text>
          <Text color={Color.mainColor} flex={1} right flexWrap={'wrap'}>
            {item.time_in} | {item.time_out}
          </Text>
        </Block>
        <Block
          row
          borderBottomWidth={1}
          borderBottomColor={'#D9DCE3'}
          paddingTop={15}
          paddingBottom={15}
          paddingRight={5}
          paddingLeft={5}
          alignCenter
          justifyContent={'space-between'}>
          <Text color={Color.mainColor} flex={1}>
            Giờ làm việc
          </Text>
          <Text color={Color.mainColor} flex={1} right flexWrap={'wrap'}>
            {item.gio_lv}
          </Text>
        </Block>
        <Block
          row
          borderBottomWidth={1}
          borderBottomColor={'#D9DCE3'}
          paddingTop={15}
          paddingBottom={15}
          paddingRight={5}
          paddingLeft={5}
          alignCenter
          justifyContent={'space-between'}>
          <Text color={Color.mainColor} flex={1}>
            Giờ tăng ca
          </Text>
          <Text color={Color.mainColor} flex={1} right flexWrap={'wrap'}>
            {item.ot}
          </Text>
        </Block>
        <Block
          row
          borderBottomWidth={1}
          borderBottomColor={'#D9DCE3'}
          paddingTop={5}
          paddingBottom={5}
          paddingRight={5}
          paddingLeft={5}
          alignCenter
          justifyContent={'space-between'}>
          <Text color={Color.mainColor} flex={1}>
            Giờ tăng ca xác nhận(NLĐ)
          </Text>
          <Block
            backgroundColor={'#F3F6F9'}
            radius={6}
            width={80}
            alignCenter
            justifyCenter>
            <TextInput
              height={40}
              center
              placeholder={'Số giờ'}
              color={Color.mainColor}
              flex={1}
              right
              flexWrap={'wrap'}
            />
          </Block>
        </Block>
        <Block borderBottomWidth={1} borderBottomColor={'#D9DCE3'}>
          <Block
            row
            paddingTop={5}
            paddingBottom={5}
            paddingRight={5}
            paddingLeft={5}
            alignCenter
            justifyContent={'space-between'}>
            <Button
              nextScreen={() => {
                if (show) {
                  setShow(false);
                } else {
                  setShow(true);
                }
              }}
              height={40}
              alignCenter
              row>
              <Text color={Color.mainColor}>Người phê duyệt</Text>
              <Block marginLeft={6} style={{transform: [{rotate: '90deg'}]}}>
                <Icon_sp color={Color.mainColor} />
              </Block>
            </Button>

            <Block
              backgroundColor={'#F3F6F9'}
              radius={6}
              width={80}
              height={40}
              alignCenter
              justifyCenter>
              <Text color={'#B90000'}>Thay đổi</Text>
            </Block>
          </Block>
          {show ? (
            <Block animated>
              <Block
                row
                paddingTop={10}
                paddingBottom={10}
                paddingRight={15}
                paddingLeft={15}
                alignCenter
                justifyContent={'space-between'}>
                <Text color={Color.mainColor} flex={1}>
                  Tổ trưởng
                </Text>
                <Text color={Color.mainColor} flex={1} right flexWrap={'wrap'}>
                  {item.ot}
                </Text>
              </Block>
              <Block
                row
                paddingTop={10}
                paddingBottom={10}
                paddingRight={15}
                paddingLeft={15}
                alignCenter
                justifyContent={'space-between'}>
                <Text color={Color.mainColor} flex={1}>
                  Trưởng bộ phận
                </Text>
                <Text color={Color.mainColor} flex={1} right flexWrap={'wrap'}>
                  {item.ot}
                </Text>
              </Block>
            </Block>
          ) : (
            <Block />
          )}
        </Block>
        <Block
          flex
          height={100}
          backgroundColor={'#F3F6F9'}
          marginLeft={5}
          marginRight={5}
          marginTop={10}
          radius={7}>
          <TextInput
            height={60}
            placeholder={'Công việc làm thêm'}
            color={Color.mainColor}
            flex={1}
            left
            flexWrap={'wrap'}
          />
        </Block>
        <Block
          marginTop={10}
          marginBottom={10}
          row
          justifyContent={'space-between'}
          paddingLeft={20}
          paddingRight={20}>
          <Button
            radius={8}
            backgroundColor={'#0092C9'}
            paddingTop={10}
            paddingBottom={10}
            paddingLeft={20}
            paddingRight={20}>
            <Text color={'#fff'}>Thêm khung giờ</Text>
          </Button>
          <Button
            radius={8}
            backgroundColor={Color.mainColor}
            paddingTop={10}
            paddingBottom={10}
            paddingLeft={20}
            paddingRight={20}>
            <Text color={'#fff'}>Xác nhận</Text>
          </Button>
        </Block>
      </Block>
    </Block>
  );
};
const Item_DXN = ({item, index}) => {
  return (
    <Block flex marginLeft={15} marginRight={15} marginBottom={15}>
      <Block marginBottom={5} row justifyContent={'space-between'}>
        <Block
          radius={8}
          backgroundColor={Color.mainColor}
          height={35}
          alignCenter
          justifyCenter
          paddingLeft={10}
          paddingRight={10}>
          <Text color={'#fff'} size={13}>
            {moment(item.work_dt).format('DD-MM-YYYY')} - Thứ {item.day_type}
          </Text>
        </Block>

        <Text color={'#fff'} size={13} />
      </Block>
      <Block backgroundColor={'#fff'} radius={6} paddingBottom={5}>
        <Block
          row
          borderBottomWidth={1}
          borderBottomColor={'#D9DCE3'}
          paddingTop={15}
          paddingBottom={15}
          paddingRight={5}
          paddingLeft={5}
          alignCenter
          justifyContent={'space-between'}>
          <Text color={Color.mainColor} flex={1}>
            Ca làm việc
          </Text>
          <Text color={Color.mainColor} flex={1} right flexWrap={'wrap'}>
            {item.shift}
          </Text>
        </Block>
        <Block
          row
          borderBottomWidth={1}
          borderBottomColor={'#D9DCE3'}
          paddingTop={15}
          paddingBottom={15}
          paddingRight={5}
          paddingLeft={5}
          alignCenter
          justifyContent={'space-between'}>
          <Text color={Color.mainColor} flex={1}>
            Giờ vào ra
          </Text>
          <Text color={Color.mainColor} flex={1} right flexWrap={'wrap'}>
            {item.time_in} | {item.time_out}
          </Text>
        </Block>
        <Block
          row
          borderBottomWidth={1}
          borderBottomColor={'#D9DCE3'}
          paddingTop={15}
          paddingBottom={15}
          paddingRight={5}
          paddingLeft={5}
          alignCenter
          justifyContent={'space-between'}>
          <Text color={Color.mainColor} flex={1}>
            Giờ làm việc
          </Text>
          <Text color={Color.mainColor} flex={1} right flexWrap={'wrap'}>
            {item.gio_lv}
          </Text>
        </Block>
        <Block
          row
          borderBottomWidth={1}
          borderBottomColor={'#D9DCE3'}
          paddingTop={15}
          paddingBottom={15}
          paddingRight={5}
          paddingLeft={5}
          alignCenter
          justifyContent={'space-between'}>
          <Text color={Color.mainColor} flex={1}>
            Giờ tăng ca
          </Text>
          <Text color={Color.mainColor} flex={1} right flexWrap={'wrap'}>
            {item.ot}
          </Text>
        </Block>
        <Block
          row
          borderBottomWidth={1}
          borderBottomColor={'#D9DCE3'}
          paddingTop={5}
          paddingBottom={5}
          paddingRight={5}
          paddingLeft={5}
          alignCenter
          justifyContent={'space-between'}>
          <Text color={Color.mainColor} flex={1}>
            Giờ tăng ca xác nhận(NLĐ)
          </Text>
          <Block
            backgroundColor={'#F3F6F9'}
            radius={6}
            width={80}
            alignCenter
            justifyCenter>
            <TextInput
              height={40}
              center
              placeholder={'Số giờ'}
              color={Color.mainColor}
              flex={1}
              right
              flexWrap={'wrap'}
            />
          </Block>
        </Block>
        <Block
          flex
          height={50}
          backgroundColor={'#F3F6F9'}
          marginLeft={5}
          marginRight={5}
          marginTop={10}
          radius={7}>
          <TextInput
            height={50}
            placeholder={'...'}
            color={Color.mainColor}
            flex={1}
            left
            flexWrap={'wrap'}
          />
        </Block>
        <Block
          flex
          marginTop={10}
          marginBottom={10}
          alignEnd
          paddingRight={5}
          justifyContent={'space-between'}>
          <Button
            radius={8}
            width={120}
            justifyCenter
            alignCenter
            backgroundColor={'#BA2310'}
            paddingTop={10}
            paddingBottom={10}>
            <Text color={'#fff'}>Huỷ</Text>
          </Button>
        </Block>
      </Block>
    </Block>
  );
};

const Item_CPD = ({item, checkbox}) => {
  const [check, setCheck] = useState(false);
  //const [checkBox, setCheckBox] = useState([]);
  const [numberCheck, setNumberCheck] = useState(0);
  const toggleCheckbox = (pk) => {
    let checkboxes = checkbox;

    if (pk === 'All') {
      checkboxes = [];
      if (check == true) {
        checkboxes = [];
        setCheck(false);
        setNumberCheck(checkboxes.length);
        // this.setState({
        //   checkAll: false,
        //   checkboxes,
        //   numberCheck: checkboxes.length,
        // });
      } else {
        this.props.data.map((item) => {
          checkboxes.push(item.pk);
        });
        setCheck(true);
        setNumberCheck(checkboxes.length);
        // this.setState({
        //   checkAll: true,
        //   checkboxes,
        //   numberCheck: checkboxes.length,
        // });
      }
    } else {
      const index = checkboxes.indexOf(pk);
      if (checkboxes && index != -1) {
        checkboxes.splice(index, 1);
      } else {
        checkboxes.push(pk);
      }

      if (checkboxes.length == this.props.data.length) {
        setCheck(true);
        setNumberCheck(checkboxes.length);
        // this.setState({
        //   checkAll: true,
        //   checkboxes,
        //   numberCheck: checkboxes.length,
        // });
      } else {
        setCheck(false);
        setNumberCheck(checkboxes.length);
        // this.setState({
        //   checkAll: false,
        //   checkboxes,
        //   numberCheck: checkboxes.length,
        // });
      }
    }
  };

  return (
    <Block flex marginLeft={15} marginRight={15} marginBottom={15}>
      <Block marginBottom={5} row justifyContent={'space-between'} alignCenter>
        <Block
          radius={6}
          backgroundColor={Color.mainColor}
          height={35}
          alignCenter
          justifyCenter
          paddingLeft={10}
          paddingRight={10}>
          <Text color={'#fff'} size={13}>
            {moment(item.abs_dt).format('DD-MM-YYYY')}
          </Text>
        </Block>
        <TouchableOpacity
          style={styles.radioCircle}
          onPress={() => toggleCheckbox(item.pk)}>
          {check === true && <View style={styles.selectedRb} />}
        </TouchableOpacity>
      </Block>
      <Block backgroundColor={'#fff'} radius={6} paddingBottom={5}>
        <Block
          row
          borderBottomWidth={1}
          borderBottomColor={'#D9DCE3'}
          paddingTop={15}
          paddingBottom={15}
          paddingRight={5}
          paddingLeft={5}
          alignCenter
          justifyContent={'space-between'}>
          <Text color={Color.mainColor} flex={1}>
            Mã nhân viên
          </Text>
          <Text color={Color.mainColor} flex={1} right flexWrap={'wrap'}>
            {item.emp_id}
          </Text>
        </Block>
        <Block
          row
          borderBottomWidth={1}
          borderBottomColor={'#D9DCE3'}
          paddingTop={15}
          paddingBottom={15}
          paddingRight={5}
          paddingLeft={5}
          alignCenter
          justifyContent={'space-between'}>
          <Text color={Color.mainColor} flex={1}>
            Họ tên
          </Text>
          <Text color={Color.mainColor} flex={1} right flexWrap={'wrap'}>
            {item.full_name}
          </Text>
        </Block>
        <Block
          row
          borderBottomWidth={1}
          borderBottomColor={'#D9DCE3'}
          paddingTop={15}
          paddingBottom={15}
          paddingRight={5}
          paddingLeft={5}
          alignCenter
          justifyContent={'space-between'}>
          <Text color={Color.mainColor} flex={1}>
            Giờ nghỉ
          </Text>
          <Text color={Color.mainColor} flex={1} right flexWrap={'wrap'}>
            {item.start_hours ? item.start_hours : '--:--'} -{' '}
            {item.end_hours ? item.end_hours : '--:--'}
          </Text>
        </Block>
        <Block
          row
          borderBottomWidth={1}
          borderBottomColor={'#D9DCE3'}
          paddingTop={15}
          paddingBottom={15}
          paddingRight={5}
          paddingLeft={5}
          alignCenter
          justifyContent={'space-between'}>
          <Text color={Color.mainColor} flex={1}>
            Lý do vắng
          </Text>
          <Text color={Color.mainColor} flex={1} right flexWrap={'wrap'}>
            {item.reason_type}
          </Text>
        </Block>
        <Block
          flex
          backgroundColor={'#F3F6F9'}
          marginLeft={5}
          marginRight={5}
          marginTop={10}
          radius={7}>
          <Text
            paddingTop={10}
            paddingBottom={10}
            paddingLeft={10}
            paddingRight={10}
            color={Color.mainColor}
            flex={1}
            flexWrap={'wrap'}>
            {item.description ? item.description : ' '}
          </Text>
        </Block>
        <Block
          column
          borderBottomWidth={1}
          borderBottomColor={'#D9DCE3'}
          paddingTop={15}
          paddingBottom={15}
          paddingRight={5}
          paddingLeft={5}>
          <Text fontFamily={'Roboto-Medium'} color={Color.mainColor} flex={1}>
            Phản hồi
          </Text>
          <Block
            flex
            height={50}
            backgroundColor={'#F3F6F9'}
            marginTop={10}
            radius={7}>
            <TextInput
              height={50}
              paddingLeft={5}
              placeholder={'Phản hồi...'}
              color={Color.mainColor}
              flex={1}
              left
              flexWrap={'wrap'}
            />
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Color.mainColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    marginRight: 6,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: Color.mainColor,
  },
});

export {Item_CXN, Item_DXN, Item_CPD};

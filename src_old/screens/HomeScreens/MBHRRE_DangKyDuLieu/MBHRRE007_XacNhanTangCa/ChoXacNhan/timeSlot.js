import moment from 'moment';
import React, {useState} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import TVSControlPopup from '../../../../../components/Tvs/ControlPopup';

const TimeSlot = ({isShow, onHide, workDt, onAcceptTimeSlot, data}) => {
  const currentDate = moment(workDt, 'YYYYMMDD').format('DD/MM/YYYY');
  const Color = useSelector(s => s.SystemReducer.theme);

  //initial state
  //1
  const [showTimePickerStart1, setShowTimePickerStart1] = useState(false);
  const [timeStart1, setTimeStart1] = useState(
    data.timeStart1 === '' ? 'hh:mm' : data.timeStart1,
  );

  const [showDatePickerStart1, setShowDatePickerStart1] = useState(false);
  const [dateStart1, setDateStart1] = useState(data.dateStart1);

  const [showTimePickerEnd1, setShowTimePickerEnd1] = useState(false);
  const [timeEnd1, setTimeEnd1] = useState(
    data.timeEnd1 === '' ? 'hh:mm' : data.timeEnd1,
  );

  const [showDatePickerEnd1, setShowDatePickerEnd1] = useState(false);
  const [dateEnd1, setDateEnd1] = useState(data.dateEnd1);

  const [eat1, setEat1] = useState(data.eat1);

  const onShowStartDatePopup1 = () => {
    setShowDatePickerStart1(true);
  };
  const onShowStartTimePopup1 = () => {
    setShowTimePickerStart1(true);
  };
  const onShowEndDatePopup1 = () => {
    setShowDatePickerEnd1(true);
  };
  const onShowEndTimePopup1 = () => {
    setShowTimePickerEnd1(true);
  };

  //handle when start date 1 changed
  const handleChangedStartDate1 = date => {
    //carry the End date 1
    //changed end date 1 when start date 1 > current end date 1
    if (dateEnd1 === 'dd/mm/yyyy') {
      setDateEnd1(moment(date).format('DD/MM/YYYY'));
    }

    if (
      moment(date).format('YYYYMMDD') >
      moment(dateEnd1, 'DD/MM/YYYY').format('YYYYMMDD')
    ) {
      setDateEnd1(moment(date).format('DD/MM/YYYY'));
    }

    if (
      moment(date).format('YYYYMMDD') ===
        moment(dateEnd1, 'DD/MM/YYYY').format('YYYYMMDD') &&
      parseInt(timeStart1.replace(':', '')) >
        parseInt(timeEnd1.replace(':', ''))
    ) {
      setTimeEnd1(timeStart1);
    }

    setDateStart1(moment(date).format('DD/MM/YYYY'));
    setShowDatePickerStart1(false);
  };

  //handle when end date 1 changed
  const handleChangedEndDate1 = date => {
    if (dateStart1 === 'dd/mm/yyyy') {
      setDateStart1(moment(date).format('DD/MM/YYYY'));
    } else {
      //alert when selected date < start date 1
      if (
        moment(date).format('YYYYMMDD') <
        moment(dateStart1, 'DD/MM/YYYY').format('YYYYMMDD')
      ) {
        return Alert.alert(
          'Thông báo',
          'Ngày kết thúc không được nhỏ hơn ngày bắt đầu.',
          [
            {
              text: 'Đóng lại',
            },
          ],
        );
      }
    }

    if (
      moment(date).format('YYYYMMDD') ===
        moment(dateStart1, 'DD/MM/YYYY').format('YYYYMMDD') &&
      timeStart1.replace(':', '') > timeEnd1.replace(':', '')
    ) {
      setTimeEnd1(timeStart1);
    }

    setDateEnd1(moment(date).format('DD/MM/YYYY'));
    setShowDatePickerEnd1(false);
  };

  //handle when start time 1 changed
  const handleChangedStartTime1 = time => {
    //checking start time 1
    if (timeEnd1 === 'hh:mm') {
      setTimeEnd1(moment(time).format('HH:mm'));
    } else {
      if (dateStart1 === dateEnd1) {
        if (moment(time).format('HHmm') > parseInt(timeEnd1.replace(':', ''))) {
          setTimeEnd1(moment(time).format('HH:mm'));
        }
      }
    }

    setShowTimePickerStart1(false);
    setTimeStart1(moment(time).format('HH:mm'));
  };

  //handle when end time 1 changed
  const handleChangedEndTime1 = time => {
    //before
    if (timeStart1 === 'hh:mm') {
      setTimeStart1(moment(time).format('HH:mm'));
    } else {
      if (
        moment(time).format('HHmm') < parseInt(timeStart1.replace(':', '')) &&
        dateStart1 === dateEnd1
      ) {
        return Alert.alert(
          'Thông báo',
          'Giờ kết thúc không được nhỏ hơn giờ bắt đầu.',
          [
            {
              text: 'Đóng lại',
            },
          ],
        );
      }
    }

    setShowTimePickerEnd1(false);
    setTimeEnd1(moment(time).format('HH:mm'));
  };

  //initial state
  //2
  const [showTimePickerStart2, setShowTimePickerStart2] = useState(false);
  const [timeStart2, setTimeStart2] = useState(
    data.timeStart2 === '' ? 'hh:mm' : data.timeStart2,
  );

  const [showDatePickerStart2, setShowDatePickerStart2] = useState(false);
  const [dateStart2, setDateStart2] = useState(data.dateStart2);

  const [showTimePickerEnd2, setShowTimePickerEnd2] = useState(false);
  const [timeEnd2, setTimeEnd2] = useState(
    data.timeEnd2 === '' ? 'hh:mm' : data.timeEnd2,
  );

  const [showDatePickerEnd2, setShowDatePickerEnd2] = useState(false);
  const [dateEnd2, setDateEnd2] = useState(data.dateEnd2);

  const [eat2, setEat2] = useState(data.eat2);

  const onShowStartDatePopup2 = () => {
    setShowDatePickerStart2(true);
  };
  const onShowStartTimePopup2 = () => {
    setShowTimePickerStart2(true);
  };
  const onShowEndDatePopup2 = () => {
    setShowDatePickerEnd2(true);
  };
  const onShowEndTimePopup2 = () => {
    setShowTimePickerEnd2(true);
  };

  //handle when start date 2 changed
  const handleChangedStartDate2 = date => {
    if (dateEnd2 === 'dd/mm/yyyy') {
      setDateEnd2(moment(date).format('DD/MM/YYYY'));
    }
    //carry the End date 2
    //changed end date 2 when start date 2 > current end date 2
    if (
      moment(date).format('YYYYMMDD') >
      moment(dateEnd2, 'DD/MM/YYYY').format('YYYYMMDD')
    ) {
      setDateEnd2(moment(date).format('DD/MM/YYYY'));
    }

    if (
      moment(date).format('YYYYMMDD') ===
        moment(dateEnd2, 'DD/MM/YYYY').format('YYYYMMDD') &&
      parseInt(timeStart2.replace(':', '')) >
        parseInt(timeEnd2.replace(':', ''))
    ) {
      setTimeEnd2(timeStart2);
    }

    setDateStart2(moment(date).format('DD/MM/YYYY'));
    setShowDatePickerStart2(false);
  };

  //handle when end date 2 changed
  const handleChangedEndDate2 = date => {
    if (dateStart2 === 'dd/mm/yyyy') {
      setDateStart2(moment(date).format('DD/MM/YYYY'));
    } else {
      //alert when selected date < start date 2
      if (
        moment(date).format('YYYYMMDD') <
        moment(dateStart2, 'DD/MM/YYYY').format('YYYYMMDD')
      ) {
        return Alert.alert(
          'Thông báo',
          'Ngày kết thúc không được nhỏ hơn ngày bắt đầu.',
          [
            {
              text: 'Đóng lại',
            },
          ],
        );
      }
    }

    if (
      moment(date).format('YYYYMMDD') ===
        moment(dateStart2, 'DD/MM/YYYY').format('YYYYMMDD') &&
      timeStart2.replace(':', '') > timeEnd2.replace(':', '')
    ) {
      setTimeEnd2(timeStart2);
    }

    setDateEnd2(moment(date).format('DD/MM/YYYY'));
    setShowDatePickerEnd2(false);
  };

  //handle when start time 2 changed
  const handleChangedStartTime2 = time => {
    //checking start time 2
    if (timeEnd2 === 'hh:mm') {
      setTimeEnd2(moment(time).format('HH:mm'));
    } else {
      if (dateStart2 === dateEnd2) {
        if (moment(time).format('HHmm') > parseInt(timeEnd2.replace(':', ''))) {
          setTimeEnd2(moment(time).format('HH:mm'));
        }
      }
    }

    setShowTimePickerStart2(false);
    setTimeStart2(moment(time).format('HH:mm'));
  };

  //handle when end time 2 changed
  const handleChangedEndTime2 = time => {
    //before
    if (timeStart2 === 'hh:mm') {
      setTimeStart2(moment(time).format('HH:mm'));
    } else {
      if (
        moment(time).format('HHmm') < parseInt(timeStart2.replace(':', '')) &&
        dateStart2 === dateEnd2
      ) {
        return Alert.alert(
          'Thông báo',
          'Giờ kết thúc không được nhỏ hơn giờ bắt đầu.',
          [
            {
              text: 'Đóng lại',
            },
          ],
        );
      }
    }

    setShowTimePickerEnd2(false);
    setTimeEnd2(moment(time).format('HH:mm'));
  };
  return (
    <TVSControlPopup
      onAccept={() =>
        onAcceptTimeSlot({
          hasData: true,
          dateStart1,
          dateStart2,
          dateEnd1,
          dateEnd2,
          eat1,
          eat2,
          timeEnd1: timeEnd1 === 'hh:mm' ? '' : timeEnd1,
          timeEnd2: timeEnd2 === 'hh:mm' ? '' : timeEnd2,
          timeStart1: timeStart1 === 'hh:mm' ? '' : timeStart1,
          timeStart2: timeStart2 === 'hh:mm' ? '' : timeStart2,
        })
      }
      isShow={isShow}
      title="Thêm khung giờ"
      onHide={() => {
        //
        // setTimeStart1('');
        // setDateStart1('');
        // setTimeEnd1('');
        // setDateEnd1('');
        // setEat1('');
        // setTimeStart2('');
        // setDateStart2('');
        // setTimeEnd2('');
        // setDateEnd2('');
        // setEat2('');
        //
        onHide();
      }}>
      {/* start time picker 1 */}
      <DateTimePicker
        cancelTextIOS="Hủy bỏ"
        confirmTextIOS="Xác nhận"
        cancelTextStyle={{color: 'red'}}
        hideTitleContainerIOS={false}
        titleIOS="Từ giờ (Khung giờ 1)"
        is24Hour={true}
        locale="vi_VN"
        isVisible={showTimePickerStart1}
        onConfirm={handleChangedStartTime1}
        onCancel={() => setShowTimePickerStart1(false)}
        mode={'time'}
        date={
          timeStart1 === 'hh:mm'
            ? new Date()
            : moment(timeStart1, 'HH:mm').toDate()
        }
        datePickerModeAndroid={'calendar'}
      />

      {/* start date picker 1 */}
      <DateTimePicker
        cancelTextIOS="Hủy bỏ"
        confirmTextIOS="Xác nhận"
        cancelTextStyle={{color: 'red'}}
        hideTitleContainerIOS={false}
        titleIOS="Từ ngày (Khung giờ 1)"
        is24Hour={true}
        locale="vi_VN"
        isVisible={showDatePickerStart1}
        date={
          dateStart1 === 'dd/mm/yyyy'
            ? new Date()
            : moment(dateStart1, 'DD/MM/YYYY').toDate()
        }
        onConfirm={handleChangedStartDate1}
        onCancel={() => setShowDatePickerStart1(false)}
        mode={'date'}
        datePickerModeAndroid={'calendar'}
      />

      {/* end time picker 1 */}
      <DateTimePicker
        cancelTextIOS="Hủy bỏ"
        confirmTextIOS="Xác nhận"
        cancelTextStyle={{color: 'red'}}
        hideTitleContainerIOS={false}
        titleIOS="Từ giờ (Khung giờ 1)"
        is24Hour={true}
        locale="vi_VN"
        isVisible={showTimePickerEnd1}
        onConfirm={handleChangedEndTime1}
        onCancel={() => setShowTimePickerEnd1(false)}
        mode={'time'}
        datePickerModeAndroid={'calendar'}
        date={
          timeEnd1 === 'hh:mm' ? new Date() : moment(timeEnd1, 'HH:mm').toDate()
        }
      />

      {/* end date picker 1*/}
      <DateTimePicker
        cancelTextIOS="Hủy bỏ"
        confirmTextIOS="Xác nhận"
        cancelTextStyle={{color: 'red'}}
        hideTitleContainerIOS={false}
        titleIOS="Từ ngày (Khung giờ 1)"
        is24Hour={true}
        locale="vi_VN"
        isVisible={showDatePickerEnd1}
        date={
          dateEnd1 === 'dd/mm/yyyy'
            ? new Date()
            : moment(dateEnd1, 'DD/MM/YYYY').toDate()
        }
        onConfirm={handleChangedEndDate1}
        onCancel={() => setShowDatePickerEnd1(false)}
        mode={'date'}
        datePickerModeAndroid={'calendar'}
      />
      {/* start time picker 2 */}
      <DateTimePicker
        cancelTextIOS="Hủy bỏ"
        confirmTextIOS="Xác nhận"
        cancelTextStyle={{color: 'red'}}
        hideTitleContainerIOS={false}
        titleIOS="Từ giờ (Khung giờ 2)"
        is24Hour={true}
        locale="vi_VN"
        isVisible={showTimePickerStart2}
        onConfirm={handleChangedStartTime2}
        onCancel={() => setShowTimePickerStart2(false)}
        mode={'time'}
        date={
          timeStart2 === 'hh:mm'
            ? new Date()
            : moment(timeStart2, 'HH:mm').toDate()
        }
        datePickerModeAndroid={'calendar'}
      />

      {/* start date picker 2 */}
      <DateTimePicker
        cancelTextIOS="Hủy bỏ"
        confirmTextIOS="Xác nhận"
        cancelTextStyle={{color: 'red'}}
        hideTitleContainerIOS={false}
        titleIOS="Từ ngày (Khung giờ 2)"
        is24Hour={true}
        locale="vi_VN"
        isVisible={showDatePickerStart2}
        date={
          dateStart2 === 'dd/mm/yyyy'
            ? new Date()
            : moment(dateStart2, 'DD/MM/YYYY').toDate()
        }
        onConfirm={handleChangedStartDate2}
        onCancel={() => setShowDatePickerStart2(false)}
        mode={'date'}
        datePickerModeAndroid={'calendar'}
      />

      {/* end time picker 2 */}
      <DateTimePicker
        cancelTextIOS="Hủy bỏ"
        confirmTextIOS="Xác nhận"
        cancelTextStyle={{color: 'red'}}
        hideTitleContainerIOS={false}
        titleIOS="Từ giờ (Khung giờ 2)"
        is24Hour={true}
        locale="vi_VN"
        isVisible={showTimePickerEnd2}
        onConfirm={handleChangedEndTime2}
        onCancel={() => setShowTimePickerEnd2(false)}
        mode={'time'}
        datePickerModeAndroid={'calendar'}
        date={
          timeEnd2 === 'hh:mm' ? new Date() : moment(timeEnd2, 'HH:mm').toDate()
        }
      />

      {/* end date picker 2*/}
      <DateTimePicker
        cancelTextIOS="Hủy bỏ"
        confirmTextIOS="Xác nhận"
        cancelTextStyle={{color: 'red'}}
        hideTitleContainerIOS={false}
        titleIOS="Từ ngày (Khung giờ 2)"
        is24Hour={true}
        locale="vi_VN"
        isVisible={showDatePickerEnd2}
        date={
          dateEnd2 === 'dd/mm/yyyy'
            ? new Date()
            : moment(dateEnd2, 'DD/MM/YYYY').toDate()
        }
        onConfirm={handleChangedEndDate2}
        onCancel={() => setShowDatePickerEnd2(false)}
        mode={'date'}
        datePickerModeAndroid={'calendar'}
      />
      <View
        style={{
          borderColor: Color.gray,
          borderWidth: 1,
          padding: 10,
          borderRadius: 10,
          marginBottom: 30,
        }}>
        <View
          style={{
            position: 'absolute',
            top: -10,
            left: 10,
            backgroundColor: 'white',
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              color: Color.mainColor,
            }}>
            Khung giờ 1
          </Text>
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <View style={{flex: 1}}>
              <Text>Từ thời gian</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                flex: 2,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={onShowStartTimePopup1}
                style={{
                  padding: 10,
                  backgroundColor: Color.gray,
                  borderRadius: 10,
                  width: 90,
                  marginRight: 10,
                  flexDirection: 'row',
                }}>
                <Icon
                  color={'#ccc'}
                  size={16}
                  name={'clock'}
                  style={{marginRight: 5}}
                />
                <Text
                  style={{
                    color: timeStart1 === 'hh:mm' ? '#ccc' : null,
                  }}>
                  {timeStart1 ? timeStart1 : 'hh:mm'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onShowStartDatePopup1}
                style={{
                  width: 120,
                  padding: 10,
                  backgroundColor: Color.gray,
                  borderRadius: 10,
                  flexDirection: 'row',
                }}>
                <Icon
                  size={16}
                  name={'calendar'}
                  color={'#ccc'}
                  style={{marginRight: 5}}
                />
                <Text
                  style={{
                    color: dateStart1 === 'dd/mm/yyyy' ? '#ccc' : null,
                  }}>
                  {dateStart1}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <View style={{flex: 1}}>
              <Text>Đến thời gian</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={onShowEndTimePopup1}
                style={{
                  width: 90,
                  padding: 10,
                  backgroundColor: Color.gray,
                  borderRadius: 10,
                  marginRight: 10,
                  flexDirection: 'row',
                }}>
                <Icon
                  color={'#ccc'}
                  size={16}
                  name={'clock'}
                  style={{marginRight: 5}}
                />
                <Text
                  style={{
                    color: timeEnd1 === 'hh:mm' ? '#ccc' : null,
                  }}>
                  {timeEnd1 ? timeEnd1 : 'hh:mm'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onShowEndDatePopup1}
                style={{
                  width: 120,
                  padding: 10,
                  backgroundColor: Color.gray,
                  borderRadius: 10,
                  flexDirection: 'row',
                }}>
                <Icon
                  size={16}
                  name={'calendar'}
                  color={'#ccc'}
                  style={{marginRight: 5}}
                />
                <Text
                  style={{
                    color: dateEnd1 === 'dd/mm/yyyy' ? '#ccc' : null,
                  }}>
                  {dateEnd1}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setEat1(!eat1)}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>
              <Icon
                name={eat1 ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={20}
                color={Color.mainColor}
              />
            </Text>
            <Text
              style={{
                flex: 1,
              }}>
              {' '}
              Ăn ca 1
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* 2 */}
      <View
        style={{
          borderColor: Color.gray,
          borderWidth: 1,
          padding: 10,
          borderRadius: 10,
          marginBottom: 30,
        }}>
        <View
          style={{
            position: 'absolute',
            top: -10,
            left: 10,
            backgroundColor: 'white',
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              color: Color.mainColor,
            }}>
            Khung giờ 2
          </Text>
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <View style={{flex: 1}}>
              <Text>Từ thời gian</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                flex: 2,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={onShowStartTimePopup2}
                style={{
                  padding: 10,
                  backgroundColor: Color.gray,
                  borderRadius: 10,
                  width: 90,
                  marginRight: 10,
                  flexDirection: 'row',
                }}>
                <Icon
                  color={'#ccc'}
                  size={16}
                  name={'clock'}
                  style={{marginRight: 5}}
                />
                <Text
                  style={{
                    color: timeStart2 === 'hh:mm' ? '#ccc' : null,
                  }}>
                  {timeStart2 ? timeStart2 : 'hh:mm'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onShowStartDatePopup2}
                style={{
                  width: 120,
                  padding: 10,
                  backgroundColor: Color.gray,
                  borderRadius: 10,
                  flexDirection: 'row',
                }}>
                <Icon
                  size={16}
                  name={'calendar'}
                  color={'#ccc'}
                  style={{marginRight: 5}}
                />
                <Text
                  style={{
                    color: dateStart2 === 'dd/mm/yyyy' ? '#ccc' : null,
                  }}>
                  {dateStart2}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <View style={{flex: 1}}>
              <Text>Đến thời gian</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={onShowEndTimePopup2}
                style={{
                  width: 90,
                  padding: 10,
                  backgroundColor: Color.gray,
                  borderRadius: 10,
                  marginRight: 10,
                  flexDirection: 'row',
                }}>
                <Icon
                  color={'#ccc'}
                  size={16}
                  name={'clock'}
                  style={{marginRight: 5}}
                />
                <Text
                  style={{
                    color: timeEnd2 === 'hh:mm' ? '#ccc' : null,
                  }}>
                  {timeEnd2 ? timeEnd2 : 'hh:mm'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onShowEndDatePopup2}
                style={{
                  width: 120,
                  padding: 10,
                  backgroundColor: Color.gray,
                  borderRadius: 10,
                  flexDirection: 'row',
                }}>
                <Icon
                  size={16}
                  name={'calendar'}
                  color={'#ccc'}
                  style={{marginRight: 5}}
                />
                <Text
                  style={{
                    color: dateEnd2 === 'dd/mm/yyyy' ? '#ccc' : null,
                  }}>
                  {dateEnd2}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setEat2(!eat2)}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>
              <Icon
                name={eat2 ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={20}
                color={Color.mainColor}
              />
            </Text>
            <Text
              style={{
                flex: 1,
              }}>
              {' '}
              Ăn ca 2
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TVSControlPopup>
  );
};

export default TimeSlot;

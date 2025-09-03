import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {Color} from '../../colors/color';

LocaleConfig.locales.vn = {
  monthNames: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ],
  monthNamesShort: [
    'Th.1',
    'Th.2',
    'Th.3',
    'Th.4',
    'Th.5',
    'Th.6',
    'Th.7',
    'Th.8',
    'Th.9',
    'Th.10',
    'Th.11',
    'Th.12 ',
  ],
  dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
  dayNamesShort: ['CN', 'T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7'],
  today: "Hôm nay'HN",
};
LocaleConfig.defaultLocale = 'vn';
const SingleCalendar = props => {
  const [currentMonth] = useState();
  const [marked] = useState();

  const onDayPress = value => {
    props.getStateCalendar(value);
  };

  const onMonthChange = value => {};

  return (
    <View>
      <Calendar
        monthFormat={'MMMM - yyyy'}
        onDayPress={onDayPress}
        onMonthChange={month => {
          onMonthChange(month);
        }}
        hideDayNames={false}
        showWeekNumbers={false}
        hideExtraDays={false}
        firstDay={0}
        current={currentMonth}
        markedDates={marked}
        markingType={'period'}
        theme={{
          textSectionTitleColor: '#b6c1cd',
          todayTextColor: 'orange',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          arrowColor: 'orange',
          monthTextColor: Color.mainColor,
          textDayFontSize: 13,
        }}
      />
    </View>
  );
};

export default SingleCalendar;

import React from 'react';
import {Text} from 'react-native';
// color : mã màu input time in, time out
// stringText : value input time in, time out
const RenderHightLineHPDQ = ({stringText, color = ''}) => {
  return (
    <Text right flex={1}>
      <Text style={{backgroundColor: color}}>{stringText}</Text>
    </Text>
  );
};

export default RenderHightLineHPDQ;

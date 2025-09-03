import React from 'react';
import Block from '../Block';
import Text from '../Text';
import styles from './style';

const OneField = ({value, style, keyColor}) => {
  let key = Object.keys(value)[0];
  let val = value[key];
  return (
    <Block
      row
      borderBottomWidth={1}
      borderBottomColor={'#F4F6F7'}
      paddingLeft={5}
      paddingRight={5}
      paddingTop={10}
      paddingBottom={10}
      style={style}
      justifyContent={'space-between'}>
      <Text style={[styles.myTextSize, {color: keyColor ?? 'black'}]} flex={0}>
        {key}
      </Text>
      <Text style={styles.myTextSize} right flex={1}>
        {val}
      </Text>
    </Block>
  );
};
export default OneField;

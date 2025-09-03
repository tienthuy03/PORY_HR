import React from 'react';
import Block from '../Block';
import Text from '../Text';
import styles from './style';

const OneField = ({value, keyName, style}) => {
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
      <Text style={styles.myTextSize} flex={0}>
        {keyName}
      </Text>
      {value.toString().includes('<color>') ? (
        renderHightLineString(value)
      ) : (
        <Text style={styles.myTextSize} right flex={1}>
          {value}
        </Text>
      )}
    </Block>
  );
};
export default OneField;

const renderHightLineString = stringText => {
  const arrTemp = stringText.split('<color>');
  return (
    <Text style={styles.myTextSize} right flex={1}>
      {arrTemp.map(x => {
        if (x.includes('</color>')) {
          return (
            <>
              <Text
                style={{backgroundColor: x.split('</color>')[0].split('|')[0]}}>
                {x.split('</color>')[0].split('|')[1]}
              </Text>
              <Text>{x.split('</color>')[1]}</Text>
            </>
          );
        } else {
          return <Text>{x}</Text>;
        }
      })}
    </Text>
  );
};

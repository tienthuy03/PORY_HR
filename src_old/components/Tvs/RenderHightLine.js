import React from 'react';
import {Text} from 'react-native';
const RenderHightLine = ({stringText}) => {
  const arrTemp = stringText.split('<color>');
  return (
    <Text right flex={1}>
      {arrTemp.map(x => {
        if (x.includes('</color>')) {
          return (
            <>
              <Text style={{backgroundColor: 'yellow'}}>
                {x.split('</color>')[0]}
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

export default RenderHightLine;

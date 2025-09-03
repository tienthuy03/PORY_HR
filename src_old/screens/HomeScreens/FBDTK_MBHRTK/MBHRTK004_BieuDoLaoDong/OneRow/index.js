import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import styles from './style';
const {width, height} = Dimensions.get('screen');
const OneRow = ({name, color, per, value}) => {
  const percent = per + '%';
  const textColor = per > 15 ? 'white' : 'black';
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {name}: {value}
      </Text>
      <View style={styles.content}>
        <Animatable.View
          animation="fadeInLeft"
          style={[{backgroundColor: color, width: percent}, styles.length]}>
          {per > 15 ? (
            <Animatable.Text
              style={[styles.per, {color: textColor}]}
              animation="fadeIn">
              {percent}
            </Animatable.Text>
          ) : null}
        </Animatable.View>
        {per > 15 ? null : (
          <View style={styles.perOut}>
            <Animatable.Text
              style={[styles.per, {color: textColor}]}
              animation="fadeIn">
              {percent}
            </Animatable.Text>
          </View>
        )}
      </View>
    </View>
  );
};
export default OneRow;

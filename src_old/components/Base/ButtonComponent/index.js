import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import stylesPrimary from './stylePrimary';
import stylesDanger from './styleDanger';
import stylesWarning from './styleWarning';
import stylesDefault from './styleDefault';
import stylesLink from './styleLink';
const ButtonComponent = ({onPress, children, type}) => {
  let styles;
  switch (type) {
    case 'danger':
      styles = stylesDanger;
      break;
    case 'link':
      styles = stylesLink;
      break;
    case 'default':
      styles = stylesDefault;
      break;
    case 'warning':
      styles = stylesWarning;
      break;
    default:
      styles = stylesPrimary;
      break;
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btn}
        onPress={onPress}
        activeOpacity={0.5}>
        <Text style={styles.textBtn}>{children}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonComponent;

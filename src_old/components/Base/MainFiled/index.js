import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
const MainField = ({children}) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    container: {
      marginBottom: 5,
      backgroundColor: Color.inputBackgroundColor,
      borderRadius: 10,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.16,
      shadowRadius: 6,
      elevation: 3,
    },
  });
  return <View style={styles.container}>{children}</View>;
};

export default MainField;

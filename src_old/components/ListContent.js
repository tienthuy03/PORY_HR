/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
// import {Color} from '../colors/color';
import {useSelector} from 'react-redux';
const ListContent = ({PROP, getState}) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    container: {
      marginBottom: 10,
    },
    country: {
      flex: 1,
      flexDirection: 'row',
      paddingLeft: 10,
      alignItems: 'center',
      backgroundColor: '#F3F6F9',
      borderRadius: 6,
      paddingTop: 10,
      paddingBottom: 10,
    },
    selectedRb: {
      width: 15,
      height: 15,
      borderRadius: 50,
      backgroundColor: Color.mainColor,
    },
    result: {
      marginTop: 20,
      color: 'white',
      fontWeight: '600',
      backgroundColor: '#F3FBFE',
    },
  });
  const selectItem = (res) => {
    // setValue(res.absence_code);
    // getState({
    //   pk: res.absence_code,
    //   value: res.absence_nm,
    // });
  };

  return (
    <View style={{width: '100%'}}>
      {PROP.map((res) => {
        return (
          <View key={res.absence_code} style={styles.container}>
            <TouchableOpacity style={styles.country} onPress={selectItem}>
              <Text style={{paddingLeft: 10}}>{res.absence_nm}</Text>
              {/* {value === res.absence_code && null} */}
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default ListContent;

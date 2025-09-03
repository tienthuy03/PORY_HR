import React, {Component, useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import { Color } from '../colors/color';
import Check from '../icons/Check';

const RadioButton = ({PROP, getState, codes}) => {
  const [value, setValue] = useState(codes);

  return (
    <View style={{width: '100%'}}>
      {PROP.map((res) => {
        return (
          <View key={res.code} style={styles.container}>
            <TouchableOpacity
              style={styles.country}
              onPress={() => {
                setValue(res.code),
                  getState({
                    code: res.code,
                    code_nm: res.code_nm,
                  });
              }}>
              <Text style={{paddingLeft: 10}}>{res.code_nm}</Text>
              {value === res.code && (
                <View
                  style={{flex: 1, alignItems: 'flex-end', paddingRight: 10}}>
                  <Check />
                </View>
              )}
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
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

export default RadioButton;

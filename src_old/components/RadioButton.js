import React, {Component, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Color} from '../colors/color';
import Check from '../icons/Check';
const {width, height} = Dimensions.get('screen');
const RadioButton = ({PROP, getState, keys}) => {
  const [value, setValue] = useState(keys);

  return (
    <ScrollView>
      {PROP.map(res => {
        return (
          <View key={res.key} style={styles.container}>
            {/* <TouchableOpacity
              style={styles.radioCircle}
              onPress={() => {
                setValue(res.key),
                  getState({
                    val: res.key,
                    text: res.text,
                    img: res.url,
                  });
              }}>
              {value === res.key && <View style={styles.selectedRb} />}
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.country}
              onPress={() => {
                setValue(res.key),
                  getState({
                    val: res.key,
                    text: res.text,
                    img: res.url,
                  });
              }}>
              <Image style={styles.img} source={res.url} />
              <Text style={{paddingLeft: 10}}>{res.text}</Text>
              {value === res.key && (
                <View
                  style={{flex: 1, alignItems: 'flex-end', paddingRight: 10}}>
                  <Check />
                </View>
              )}
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  country: {
    flexDirection: 'row',
    paddingLeft: 20,
    alignItems: 'center',
    backgroundColor: '#F3F6F9',
    borderRadius: 6,
    padding: 5,
  },
  radioText: {
    marginLeft: 35,
    fontSize: 20,
    color: '#000',
    fontWeight: '700',
  },
  radioCircle: {
    height: 26,
    width: 26,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Color.mainColor,
    alignItems: 'center',
    justifyContent: 'center',
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
  img: {
    width: 40,
    height: 40,
  },
});

export default RadioButton;

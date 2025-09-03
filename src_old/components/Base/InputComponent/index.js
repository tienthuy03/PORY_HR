/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {View, Text, TextInput} from 'react-native';
import stylesDefault from './style';
import stylesError from './styleError';
import Ionicons from 'react-native-vector-icons/Ionicons';
const InputComponent = ({
  editable = true,
  password = false,
  placeholder,
  onChangeText = () => {},
  error = null,
  length = 0,
  required = null,
  value = null,
}) => {
  const [Clean, setClean] = useState(true);
  const [Error, setError] = useState(error);
  useEffect(() => {
    if (!Clean) {
      if (required !== null && length === 0) {
        setError(`${required} không được bỏ trống.`);
      }
    }
  }, []);
  let styles = Error !== null ? stylesError : stylesDefault;
  const handleChangeText = (valueInput) => {
    setClean(false);
    if (length > 0) {
      if (valueInput.length >= length) {
        setError(null);
      } else {
        setError(`Độ dài phải ít nhất ${length} ký tự.`);
        return;
      }
    }
    if (required !== null && length === 0) {
      if (valueInput.length === 0) {
        setError(`${required} không được bỏ trống.`);
        return;
      } else {
        setError(null);
      }
    }
    if (Error === null) {
      onChangeText(valueInput);
    }
  };
  return (
    <>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          editable={editable}
          secureTextEntry={password}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          value={value}
        />
        {Error !== null ? (
          <Ionicons name="warning-outline" color="#6E2C00" />
        ) : null}
      </View>
      {Error !== null ? <Text style={styles.textError}>{Error}</Text> : null}
    </>
  );
};

export default InputComponent;

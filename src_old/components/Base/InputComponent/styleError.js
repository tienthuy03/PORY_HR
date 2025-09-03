import {StyleSheet, Platform} from 'react-native';
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FBEEE6',
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 5,
    borderColor: '#6E2C00',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: Platform.OS === 'android' ? 5 : 10,
  },
  input: {
    flex: 1,
    padding: Platform.OS === 'android' ? 5 : 10,
  },
  textError: {
    fontSize: 12,
    textAlign: 'right',
    color: 'red',
  },
});
export default styles;

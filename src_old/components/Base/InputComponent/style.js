import {StyleSheet, Platform} from 'react-native';
const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F8F9F9',
    padding: Platform.OS === 'android' ? 5 : 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#626567',
  },
});
export default styles;

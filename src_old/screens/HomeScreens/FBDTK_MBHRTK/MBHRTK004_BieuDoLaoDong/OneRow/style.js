import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  length: {
    height: 30,
    borderTopEndRadius: 5,
    borderBottomEndRadius: 5,
    justifyContent: 'center',
    paddingRight: 10,
    alignItems: 'flex-end',
  },
  per: {
    fontWeight: 'bold',
  },
  title: {
    paddingLeft: 5,
    marginBottom: 5,
  },
  content: {flexDirection: 'row'},
  perOut: {justifyContent: 'center', marginLeft: 5, height: 30},
});
export default styles;

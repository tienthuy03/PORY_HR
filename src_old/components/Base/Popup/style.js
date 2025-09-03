import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,.4)',
    width: '100%',
    top: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewPopup: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default styles;

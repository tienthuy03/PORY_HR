import { StyleSheet, Dimensions } from 'react-native';

const createStyles = (Color) =>
  StyleSheet.create({
    container: {
      padding: 10,
      flex: 1,
      backgroundColor: Color.gray,
    },
    avatarView: {
      width: 120,
      height: Dimensions.get('screen').height / 5.5,
    },
    avatar: {
      borderRadius: 10,
      width: '100%',
      height: '100%',
    },
    informationContainer: {
      flexDirection: 'row',
      backgroundColor: Color.white,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingTop: 12,
    },
    informationContainerRight: {
      padding: 10,
      flex: 1,
    },
    oneField: {
      marginTop: 5,
      marginBottom: 10,
      padding: 10,
      borderRadius: 5,
      width: '100%',
      backgroundColor: Color.gray,
    },
    registerFaceContainer: {
      borderRadius: 10,
      padding: 10,
      backgroundColor: Color.white,
    },
    avatarViewRF: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarRF: {
      width: 160,
      height: Dimensions.get('screen').height / 4.1,
      resizeMode: 'cover',
      borderRadius: 12,
      paddingBottom: 4
    },
    footer: {
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnChangeImage: {
      color: Color.mainColor,
      paddingTop: 20,
      paddingBottom: 10,
      gap: 8
    },
    btnStatus: {
      textAlign: 'right',
      fontSize: 12,
      color: Color.btnRed2,
      paddingTop: 4,
      fontStyle: 'italic',
    },
    btnCamera: {
      marginTop: 30,
    },

  });

export default createStyles;

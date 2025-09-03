import React from 'react';
import {View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useDispatch, useSelector} from 'react-redux';
import * as action from '../../../services/redux/Popup/action';
import styles from './style';

const PopupComponent = ({cusStyle}) => {
  const dispatch = useDispatch();
  const isShow = useSelector((state) => state.PopupReducer.isShow);
  const content = useSelector((state) => state.PopupReducer.content);
  const ContentComponent = () => {
    return content;
  };
  const onPress = () => {
    dispatch(action.HidePopup);
  };
  return (
    <>
      {isShow ? (
        <View style={styles.container}>
          <Animatable.View
            duration={500}
            animation="fadeIn"
            style={cusStyle === undefined ? styles.viewPopup : cusStyle}>
            <View activeOpacity={1}>
              <ContentComponent />
            </View>
          </Animatable.View>
        </View>
      ) : null}
    </>
  );
};

export default PopupComponent;

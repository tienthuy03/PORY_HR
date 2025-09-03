import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Dimensions,
    Platform,
    TextInput,
    Alert,
} from 'react-native';
import { Color } from '../../../../../../../colors/colortv';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as AMT from 'react-native-animatable';
import axios from 'axios';
axios.defaults.timeout = 60000;
axios.defaults.timeoutErrorMessage = 'requestTimeout';

const PopupTextInput = ({
    isShow,
    onHide,
    title,
    backgroundColor = 'white',
    onSave,
}) => {
    const [lyDo, setLyDo] = useState('');

    const handleSave = () => {
        if (lyDo.trim() === '') {
            Alert.alert(
                'Thông báo',
                'Vui lòng nhập lý do!',
                [
                    {
                        text: 'Ok',
                    },
                ],
            );
            return;
        }
        onSave(lyDo);
        onHide();
    };

    return (
        <Modal transparent={true} visible={isShow}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(00,00,00,.1)',
                }}>
                <HideArea onHide={() => onHide()} />
                <AMT.View
                    duration={500}
                    animation={'fadeInUp'}
                    style={{
                        backgroundColor: backgroundColor,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 2,
                    }}>
                    <View
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            flexDirection: 'row',
                            backgroundColor: 'rgba(00,00,00,.03)',
                            borderTopRightRadius: 20,
                            borderTopLeftRadius: 20,
                            alignItems: 'flex-end',
                            height:
                                Platform.OS == 'ios'
                                    ? (Dimensions.get('screen').height / 20) * 2
                                    : Dimensions.get('screen').height / 20,
                        }}>
                        <PopupTitle>{title}</PopupTitle>
                        <TouchableOpacity onPress={() => onHide()}>
                            <Icon size={20} color={Color.mainColor} name={'close'} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                        <TextInput
                            placeholder="Nhập lý do"
                            style={{
                                borderWidth: 1,
                                borderColor: 'gray',
                                borderRadius: 5,
                                padding: 10,
                                marginBottom: 10,
                            }}
                            value={lyDo}
                            onChangeText={(text) => setLyDo(text)}
                        />
                        <TouchableOpacity
                            style={{
                                backgroundColor: Color.mainColor,
                                borderRadius: 5,
                                padding: 10,
                                alignItems: 'center',
                            }}
                            onPress={handleSave}>
                            <Text style={{ color: 'white' }}>Xác nhận</Text>
                        </TouchableOpacity>
                    </View>
                </AMT.View>
                <HideArea onHide={() => onHide()} />
            </View>
        </Modal>
    );
};
const PopupTitle = ({ children }) => {
    return (
        <View
            style={{
                flex: 1,
            }}>
            <Text
                style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    color: Color.mainColor,
                }}>
                {children}
            </Text>
        </View>
    );
};
const HideArea = ({ onHide }) => {
    return <TouchableOpacity style={{ flex: 1 }} onPress={onHide} />;
};

export default PopupTextInput;

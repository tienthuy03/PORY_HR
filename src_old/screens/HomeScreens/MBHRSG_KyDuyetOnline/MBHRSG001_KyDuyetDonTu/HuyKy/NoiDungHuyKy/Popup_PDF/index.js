import React, { useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { Color } from '../../../../../../../colors/colortv';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as AMT from 'react-native-animatable';
// import PDFView from 'react-native-view-pdf/lib/index';
import Pdf from 'react-native-pdf';
import axios from 'axios';
import { white } from 'react-native-paper/lib/typescript/styles/colors';
axios.defaults.timeout = 60000;
axios.defaults.timeoutErrorMessage = 'requestTimeout';
// const source = { uri: `data:application/pdf;base64,${dataPDF}` };

const PopupPDF = ({
  isShow,
  onHide,
  title,
  dataPDF,
  maxHeight = Dimensions.get('screen').height,
  minHeight = Dimensions.get('screen').height,
  backgroundColor = 'white',
}) => {
  const { width2, height2 } = Dimensions.get('screen');
  const pdfArray = Array.isArray(dataPDF) ? dataPDF : [dataPDF];

  useEffect(() => {

  }, []);

  return (
    <Modal transparent={true} visible={isShow}>
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          flexDirection: 'row',
          backgroundColor: backgroundColor,
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
      <ScrollView>
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
              backgroundColor: 'rgba(00,00,00,.3)',
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
                borderTopColor: Color.borderColor,
                borderTopWidth: 1,
                borderBottomColor: Color.borderColor,
                borderBottomWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {pdfArray.map((pdf, index) => (
                // <PDFView
                //   key={index}
                //   fadeInDuration={0.0}
                //   style={{
                //     width: '100%',
                //     flex: 1,
                //     minHeight: Dimensions.get('screen').height,
                //   }}
                //   resource={pdf}
                //   resourceType={'base64'}
                //   onLoad={() => console.log('done')}
                //   onError={error => console.log('error pdf ', error)}
                // />
                <Pdf
                    source={{ uri: `data:application/pdf;base64,${dataPDF}` }}
                    onLoadComplete={(numberOfPages,filePath) => {
                        console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages) => {
                        console.log(`Current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link pressed: ${uri}`);
                    }}
                    style={styles.pdf}/>
              ))}
            </View>
          </AMT.View>
          <HideArea onHide={() => onHide()} />
        </View>
      </ScrollView>
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

export default PopupPDF;

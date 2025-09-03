import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useSelector} from 'react-redux';
const OneRecordRecognize = ({item}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    container: {
      marginTop: 10,
    },
    dateView: {
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      backgroundColor: Color.white,
      borderColor: '#ccc',
      borderWidth: 1,
      borderBottomWidth: 0,
    },
    dateTitle: {
      padding: 5,
      color: Color.mainColor,
      alignItems: 'center',
    },
    imageView: {
      width: 80,
      flex: 0,
      height: 100,
    },
    image: {
      width: 80,
      height: 100,
    },
    content: {
      borderColor: '#ccc',
      backgroundColor: Color.white,
      borderWidth: 1,
      flexDirection: 'row',
    },
    header: {
      flexDirection: 'row',
    },
    mapView: {
      borderRadius: 5,
      height: 100,
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  });
  const latitude = parseFloat(item.location.split('|')[0]);
  const longitude = parseFloat(item.location.split('|')[1]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dateView}>
          <Text style={styles.dateTitle}>
            Ngày giờ chấm: {item.time} - {item.work_dt.substr(6, 2)}/
            {item.work_dt.substr(4, 2)}/{item.work_dt.substr(0, 4)}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.imageView}>
          <Image
            style={styles.image}
            source={{uri: 'data:image/webp;base64,' + item.image}}
          />
        </View>
        <View style={styles.mapView}>
          {latitude && longitude ? (
            <MapView
              scrollEnabled={false}
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.map}
              region={{
                latitude,
                longitude,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
              }}>
              <Marker coordinate={{latitude, longitude}} />
            </MapView>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default OneRecordRecognize;

/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import Block from '../components/Block';
import OneField from '../components/OneFieldKeyValue';
import Text from '../components/Text';
import {useSelector} from 'react-redux';
const {width, height} = Dimensions.get('screen');
const ListLSVPCC = ({datas, onReload}) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const data = datas ?? [];
  let [numberRecord, setNumberRecord] = useState(3);
  let lengthDataProps = data.length;
  const handleLoadMore = (lengthData) => {
    let numberRecordRender = numberRecord;
    if (numberRecordRender < lengthData) {
      numberRecordRender += 3;
      setNumberRecord(numberRecordRender);
    }
  };
  const renderItem = ({item}) => {
    const styles = StyleSheet.create({
      container: {marginTop: 5, marginRight: 10, marginLeft: 10},
      pContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(00,00,00,.3)',
        zIndex: 999,
        justifyContent: 'center',
        alignItems: 'center',
      },
      pContent: {
        width: 300,
        height: 400,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
      },
      pOneItem: {
        padding: 10,
        backgroundColor: Color.inputBackgroundColor,
        marginBottom: 5,
        borderRadius: 10,
      },
    });
    const currentItem = item.txtvalue.split('|');
    const label = currentItem[0];
    return (
      <View style={styles.container}>
        {label ? (
          <Block row justifyContent={'space-between'}>
            <Block
              borderTopLeftRadius={6}
              borderTopRightRadius={6}
              backgroundColor={Color.white}
              height={35}
              borderColor={Color.oneContentBorder}
              borderWidth={1}
              borderBottomColor={'white'}
              alignCenter
              justifyCenter
              paddingLeft={10}
              paddingRight={10}>
              <Text color={Color.mainColor} size={14}>
                {label}
              </Text>
            </Block>
            <Text color={Color.white} size={13} />
          </Block>
        ) : null}
        <Block
          backgroundColor={Color.white}
          borderBottomLeftRadius={6}
          borderBottomRightRadius={6}
          borderColor={Color.oneContentBorder}
          borderWidth={1}
          paddingBottom={5}>
          {currentItem.map((j, index) => {
            const tempItem = j.split(':');
            return (
              <>
                {tempItem[0].trim() === 'Tháng' ? null : (
                  <OneField
                    keyName={tempItem[0].trim()}
                    value={tempItem[1].trim()}
                    key={index}
                  />
                )}
              </>
            );
          })}
        </Block>
      </View>
    );
  };
  return (
    <Block flex>
      <FlatList
        onRefresh={onReload}
        refreshing={false}
        data={data.slice(0, numberRecord)}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => handleLoadMore(lengthDataProps)}
        onEndReachedThreshold={0.5}
        extraData={data}
        ListEmptyComponent={() => (
          <Block alignCenter justifyCenter marginTop={20}>
            <Text>Không có dữ liệu !</Text>
          </Block>
        )}
      />
    </Block>
  );
};

export default ListLSVPCC;

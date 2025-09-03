import React, {useState} from 'react';
import {Dimensions, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import Block from '../components/Block';
import OneField from '../components/OneFieldKeyValueNgayCong';
import Text from '../components/Text';
const {width, height} = Dimensions.get('screen');
const ListTTNC_MBHRIN002 = ({datas, onReload}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  let [numberRecord, setNumberRecord] = useState(3);
  function setDateType(value) {
    if (value === 'Ngày lễ') {
      return value;
    } else if (value === 'Chủ nhật') {
      return value;
    } else {
      return 'Thứ ' + value;
    }
  }
  let lengthDataProps = datas.length;
  const handleLoadMore = lengthData => {
    let numberRecordRender = numberRecord;
    if (numberRecordRender < lengthData) {
      numberRecordRender += 3;
      setNumberRecord(numberRecordRender);
    }
  };

  function checkItems(text, name) {
    return (
      <Block
        row
        borderBottomWidth={1}
        borderBottomColor={'#D9DCE3'}
        paddingTop={15}
        paddingBottom={15}
        paddingRight={5}
        paddingLeft={5}
        alignCenter
        justifyContent={'space-between'}>
        <Text color={Color.mainColor} flex={1}>
          {text}
        </Text>
        <Text color={Color.mainColor} flex={1} right flexWrap={'wrap'}>
          {name}
        </Text>
      </Block>
    );
  }
  const renderItem = ({item, index}) => {
    return (
      <Block flex marginLeft={10} marginRight={10} marginBottom={10}>
        <Block row justifyContent={'space-between'}>
          <Block
            borderTopLeftRadius={6}
            borderTopRightRadius={6}
            backgroundColor={Color.white}
            height={35}
            alignCenter
            justifyCenter
            paddingLeft={10}
            paddingRight={10}>
            <Text color={Color.mainColor} size={14}>
              {item.work_date_lb}
            </Text>
          </Block>
          <Text color={Color.white} size={13} />
        </Block>
        <Block
          backgroundColor={Color.white}
          borderBottomLeftRadius={6}
          borderBottomRightRadius={6}
          borderColor={Color.oneContentBorder}
          borderWidth={1}
          paddingBottom={5}>
          {Object.entries(item).map((i, cIndex) => {
            if (i[0].substr(0, 1) === '_') {
              return (
                <OneField
                  keyName={i[0].charAt(1).toUpperCase() + i[0].slice(2)}
                  value={i[1]}
                  key={cIndex}
                />
              );
            } else {
              return null;
            }
          })}
        </Block>
      </Block>
    );
  };
  const onRefresh = () => {
    onReload();
  };
  return (
    <Block flex>
      <FlatList
        onRefresh={onRefresh}
        refreshing={false}
        data={datas.slice(0, numberRecord)}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => handleLoadMore(lengthDataProps)}
        onEndReachedThreshold={0.5}
        extraData={datas}
        ListEmptyComponent={() => (
          <Block flex alignCenter justifyCenter marginTop={20}>
            <Text>Không có dữ liệu !</Text>
          </Block>
        )}
      />
    </Block>
  );
};

export default ListTTNC_MBHRIN002;

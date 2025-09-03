import React, {useState} from 'react';
import {Dimensions, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import Block from '../components/Block';
import OneField from '../components/OneFieldObject';
import Text from '../components/Text';
const {width, height} = Dimensions.get('screen');
const ListTTNN_MBHRIN005 = ({datas, onReload}) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  let [numberRecord, setNumberRecord] = useState(3);

  let lengthDataProps = datas.length;
  const handleLoadMore = (lengthData) => {
    let numberRecordRender = numberRecord;
    if (numberRecordRender < lengthData) {
      numberRecordRender += 3;
      setNumberRecord(numberRecordRender);
    }
  };
  function checkItem(text, name) {
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
              {item.abs_dt}
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
          <OneField value={{'Loại vắng': item.abs_type}} />
          <OneField
            value={{
              'Giờ vào - ra':
                (item.start_hours.length === 0 ? '--:--' : item.start_hours) +
                ' - ' +
                (item.end_hours.length === 0 ? '--:--' : item.end_hours),
            }}
          />
          <OneField value={{'Giờ vắng': item.abs_hours}} />
          <OneField value={{'Lý do vắng': item.description}} />
        </Block>
      </Block>
    );
  };
  return (
    <Block flex>
      <FlatList
        onRefresh={onReload}
        refreshing={false}
        data={datas.slice(0, numberRecord)}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => handleLoadMore(lengthDataProps)}
        onEndReachedThreshold={0.5}
        extraData={datas}
        ListEmptyComponent={() => (
          <Block alignCenter justifyCenter marginTop={20}>
            <Text>Không có dữ liệu !</Text>
          </Block>
        )}
      />
    </Block>
  );
};

export default ListTTNN_MBHRIN005;

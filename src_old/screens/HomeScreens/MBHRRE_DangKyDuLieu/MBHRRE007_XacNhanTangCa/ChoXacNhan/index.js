import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import Block from '../../../../../components/Block';
import OneField from '../../../../../components/OneFieldKeyValue';
import TextInput from '../../../../../components/TextInput';
import TVSButton from '../../../../../components/Tvs/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import OneItemRegis from './oneItemRegis';

const ChoXacNhan = ({data, onReload}) => {
  //initial state
  const [approveInfo, setApproveInfo] = useState([]);

  let thongtinnguoipheduyet = [];
  let limit_reg_date;
  const xntcReducer = useSelector(state => state.xntcReducer);
  const {isLoading} = useSelector(state => state.GlobalLoadingReducer);
  try {
    limit_reg_date = xntcReducer.data.data.limit_reg_date;
    console.log('abc', xntcReducer.data.data.limit_reg_date);
    thongtinnguoipheduyet = xntcReducer.data.data.thongtinnguoipheduyet;
  } catch (error) {}

  //handle when data changed
  useEffect(() => {
    handleApproveInfo();
  }, [data]);

  const handleApproveInfo = () => {
    let arrApproveType = [];
    let arrApproveInfo = [];
    thongtinnguoipheduyet.map(x => {
      if (arrApproveType.indexOf(x.level_name) === -1) {
        arrApproveType.push(x.level_name);
      }
    });
    arrApproveType.map(x => {
      const tempArr = thongtinnguoipheduyet.filter(y => {
        return y.level_name === x;
      });
      let default_yn = null;
      let required_yn = false;
      tempArr.map(z => {
        if (z.required_yn === 'Y') {
          required_yn = true;
        }
        if (default_yn === null && z.default_yn === 'Y') {
          default_yn = z;
        }
      });

      arrApproveInfo.push({
        name: x,
        arr: tempArr,
      });
      default_yn = null;
      required_yn = false;
      return;
    });
    setApproveInfo(arrApproveInfo);
  };
  return isLoading ? null : (
    <FlatList
      style={{
        paddingVertical: 10,
      }}
      onRefresh={() => {
        onReload();
      }}
      showsVerticalScrollIndicator={false}
      refreshing={false}
      data={data}
      renderItem={({item, index}) => (
        <OneItemRegis
          onReload={onReload}
          item={item}
          key={index.toString()}
          approveInfo={approveInfo}
          limit_reg_date={limit_reg_date}
        />
      )}
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={() => (
        <Block flex alignCenter justifyCenter marginTop={20}>
          <Text>Không có dữ liệu !</Text>
        </Block>
      )}
    />
  );
};

export default ChoXacNhan;

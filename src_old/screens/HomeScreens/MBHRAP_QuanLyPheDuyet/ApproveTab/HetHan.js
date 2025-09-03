/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import Block from '../../../../components/Block';
import OneField from '../../../../components/OneFieldKeyValuePheDuyet';
import ModalApproveStatus from '../ModalTinhTrangPheDuyet';
const HetHan = ({data, onReload, approveInfo, approveStatusPopup, pro}) => {
  const {isLoading} = useSelector(state => state.GlobalLoadingReducer);
  return (
    <View
      style={{
        flex: 1,
        marginTop: 10,
      }}>
      {!isLoading && (
        <FlatList
          showsVerticalScrollIndicator={false}
          refreshing={false}
          onRefresh={() => {
            onReload();
          }}
          ListEmptyComponent={() => (
            <View
              style={{
                margin: 10,
                marginTop: 20,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>Không có dữ liệu !</Text>
            </View>
          )}
          data={data}
          keyExtractor={(item, index) => index.toString() + 'e1'}
          renderItem={({item, index}) => (
            <OneItem
              item={item}
              approveInfo={approveInfo}
              key={item['0_pk'].toString()}
              onReload={onReload}
              approveStatusPopup={approveStatusPopup}
              pro={pro}
            />
          )}
        />
      )}
    </View>
  );
};

const OneItem = ({item, approveInfo, approveStatusPopup, pro = {pro}}) => {
  const [showApprovePopup, setShowApprovePopup] = useState(false);
  useEffect(() => {
    handleApproveInfo();
  }, [approveInfo]);
  const handleApproveInfo = () => {
    let arrLevelName = [];
    let arrApproveTemp = [];
    if (approveInfo.length > 0) {
      arrApproveTemp.push({
        name: 'Chọn vai trò phê duyệt',
        thr_reg_pk: '',
        arr: [],
      });
    }

    approveInfo.map(i => {
      if (arrLevelName.indexOf(i.level_name) === -1) {
        arrLevelName.push(i.level_name);
      }
    });
    arrLevelName.map(levelName => {
      let temp = [];
      approveInfo.map(approve => {
        if (
          approve.level_name === levelName &&
          approve.thr_reg_pk === item['0_pk']
        ) {
          temp.push(approve);
        }
      });
      if (temp.length > 0) {
        arrApproveTemp.push({
          name: levelName,
          thr_reg_pk: temp[0].thr_reg_pk,
          arr: temp,
        });
      }
    });

    if (item['0_approve_role_type_next'] && item['0_approve_pk_next']) {
      //handle get approve role info
      const tempInfo = approveInfo.filter(
        x =>
          x.level_type.toString() ===
            item['0_approve_role_type_next'].toString() &&
          x.thr_emp_pk.toString() === item['0_approve_pk_next'].toString(),
      )[0];
      if (tempInfo && arrApproveTemp) {
        setCurrentApprovePerson(tempInfo);
        setCurrentApproveLevel({
          name: tempInfo.level_name,
          arr: arrApproveTemp.filter(x => x.name === tempInfo.level_name)[0]
            .arr,
          thr_reg_pk: tempInfo.thr_reg_pk,
        });
      }
    }
  };
  const Color = useSelector(s => s.SystemReducer.theme);
  return (
    <>
      <ModalApproveStatus
        item={item}
        isShow={showApprovePopup}
        close={() => setShowApprovePopup(false)}
        approveStatus={approveStatusPopup}
      />
      <Block flex marginLeft={10} marginRight={10} marginBottom={10}>
        <Block row justifyContent={'space-between'} alignCenter>
          {item['3_label'] && (
            <Block
              borderTopRightRadius={6}
              borderTopLeftRadius={6}
              backgroundColor={Color.white}
              height={35}
              alignCenter
              justifyCenter
              paddingLeft={10}
              paddingRight={10}>
              <Text style={{color: Color.mainColor}}>{item['3_label']}</Text>
            </Block>
          )}
        </Block>
        <Block
          backgroundColor={Color.white}
          borderColor={Color.oneContentBorder}
          borderWidth={1}
          borderBottomRightRadius={6}
          borderBottomLeftRadius={6}
          paddingBottom={5}>
          <View style={{flexDirection: 'row', padding: 5}}>
            <View
              style={{
                justifyContent: 'center',
              }}>
              <Text>Trạng thái phê duyệt</Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setShowApprovePopup(true);
                }}
                style={{
                  borderRadius: 5,
                  borderColor: Color.mainColor,
                  borderWidth: 1,
                  padding: 5,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: Color.mainColor,
                  }}>
                  {item['0_approve_info']}{' '}
                  <Icon name={'eye-outline'} size={16} />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {Object.entries(item).map(of => {
            if (of[0] === '3_label') {
              return null;
            }
            if (of[0].substr(0, 1) === '2' || of[0].substr(0, 1) === '3') {
              const currentKey =
                of[0].substr(2, 1).toUpperCase() +
                of[0].substr(3, of[0].length);
              return <OneField value={of[1]} keyName={currentKey} />;
            }
            return null;
          })}
          {item['0_note'] ? (
            <View
              style={{
                padding: 10,
              }}>
              <Text style={{color: 'red', fontSize: 12}}>
                <Icon name={'alert'} /> {item['0_note']}
              </Text>
            </View>
          ) : null}
        </Block>
      </Block>
    </>
  );
};

export default HetHan;

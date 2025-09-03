import React from 'react';
import Block from '../components/Block';
import Text from '../components/Text';
import Button from '../components/Button';
import Icon_next from '../icons/Next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {setLanguageItem} from '../Language';
import {Color} from '../colors/color';

const Item = ({item, index, navigation, language}) => {
  return (
    <Block>
      <Button
        shadow
        nextScreen={() => navigation.navigate(item.menu_cd)}
        height={60}
        justifyContent={'space-between'}
        alignCenter
        marginLeft={20}
        marginRight={20}
        marginBottom={10}
        radius={8}
        row
        backgroundColor={Color.tabColor}>
        <Block
          marginLeft={10}
          height={40}
          width={40}
          radius={6}
          alignCenter
          justifyCenter
          backgroundColor={'rgba(255,255,255,0.6)'}>
          <Icon name={item.icon} color={Color.mainColor} size={24} />
        </Block>
        <Text
          flex
          paddingLeft={10}
          height={60}
          size={16}
          color={Color.mainColor}
          fontFamily={'Roboto-Medium'}>
          {setLanguageItem(item, language)}
        </Text>
        <Icon_next color={Color.mainColor} style={{marginRight: 10}} />
      </Button>
    </Block>
  );
};

export default Item;

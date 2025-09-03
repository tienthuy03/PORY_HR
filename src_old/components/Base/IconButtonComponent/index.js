import React from 'react';
import Button from '../ButtonComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const IconButtonComponent = ({onPress, type, children, icon, iconSize = 0}) => {
  const RenderIcon = () => {
    return (
      <MaterialCommunityIcons
        name={icon}
        size={iconSize > 0 ? iconSize : null}
      />
    );
  };
  return (
    <Button type={type} onPress={onPress}>
      <RenderIcon />
      {children ? ` ${children}` : null}
    </Button>
  );
};

export default IconButtonComponent;

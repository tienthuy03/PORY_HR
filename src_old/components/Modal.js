import React from 'react';
import Modal from 'react-native-modal';
import Block from './Block';
const ModalBox = ({children, ...props}) => {
  return (
    <Modal {...props}>
      <Block
        backgroundColor="background"
        padding={21}
        radius={6}
        borderColor="rgba(0, 0, 0, 0.1)">
        {children}
      </Block>
    </Modal>
  );
};

export default ModalBox;
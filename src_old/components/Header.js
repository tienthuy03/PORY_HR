// import React from 'react';
// import {View, Text, Platform} from 'react-native';
// import {Color} from '../colors/color';
// import Block from './Block';
// import Button from './Button';
// import Icon_back from '../icons/Back';

// import {setHeader} from '../Language';


// export default function Header({back, params, data, point, pro}) {
//     function setHeader() {
//     let dataHeader = [];
//     try {
//       data.map((item) => {
//         if (item.menu_cd.length === 6 && item.pk !== 7137 && item.pk !== 7174) {
//           dataHeader.push(item);
//         }
//       });
//     } catch (error) {
//       
//     }
//     if (params === 'ENG' && dataHeader[point].menu_cd === pro) {
//       return dataHeader[point].eng;
//     } else if (params === 'VIE') {
//       return dataHeader[point].vie;
//     } else if (params === 'KOR') {
//       return dataHeader[point].kor;
//     } else if (params === 'CHI') {
//       return dataHeader[point].chi;
//     } else if (params === 'JAP') {
//       return dataHeader[point].jap;
//     } else if (params === 'FRA') {
//       return dataHeader[point].fra;
//     }
//   return (
//     <Block
//       row
//       alignCenter
//       justifyContent={'space-between'}
//       paddingLeft={15}
//       paddingBottom={Platform.OS === 'ios' ? 10 : 15}
//       paddingTop={Platform.OS === 'ios' ? 15 : 5}
//       marginTop={30}>
//       <Button paddingTop={10} width={40} height={40} nextScreen={() => back}>
//         <Icon_back color={Color.white} />
//       </Button>
//       {setHeader()}
//       <Block backgroundColor={Color.white} width={7} height={29} />
//     </Block>
//   );
// }

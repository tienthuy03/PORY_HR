/* eslint-disable prettier/prettier */
import {Alert} from 'react-native';

export function setHeader(params, data, point, pro) {
  let dataHeader = [];
  try {
    data.map(item => {
      if (item.menu_cd.length === 6) {
        dataHeader.push(item);
      }
    });
  } catch (error) {}
  try {
    if (params === 'ENG' && dataHeader[point].menu_cd === pro) {
      return dataHeader[point] ? dataHeader[point].eng : '';
    } else if (params === 'VIE') {
      return dataHeader[point] ? dataHeader[point].vie : '';
    } else if (params === 'KOR') {
      return dataHeader[point] ? dataHeader[point].kor : '';
    } else if (params === 'CHI') {
      return dataHeader[point] ? dataHeader[point].chi : '';
    } else if (params === 'JAP') {
      return dataHeader[point] ? dataHeader[point].jap : '';
    } else if (params === 'FRA') {
      return dataHeader[point] ? dataHeader[point].fra : '';
    } else {
      return dataHeader[point] ? dataHeader[point].eng : '';
    }
  } catch (error) {}
}

export function setHeaderChil(params, data, point, pro, p_pk) {
  let dataHeader = [];
  try {
    data.map(item => {
      if (item.p_pk === p_pk) {
        dataHeader.push(item);
      }
    });
  } catch (error) {}
  if (params === 'ENG' && dataHeader[point].menu_cd === pro) {
    return dataHeader[point] ? dataHeader[point].eng : '';
  } else if (params === 'VIE') {
    return dataHeader[point] ? dataHeader[point].vie : '';
  } else if (params === 'KOR') {
    return dataHeader[point] ? dataHeader[point].kor : '';
  } else if (params === 'CHI') {
    return dataHeader[point] ? dataHeader[point].chi : '';
  } else if (params === 'JAP') {
    return dataHeader[point] ? dataHeader[point].jap : '';
  } else if (params === 'FRA') {
    return dataHeader[point] ? dataHeader[point].fra : '';
  } else {
    return dataHeader[point] ? dataHeader[point].eng : '';
  }
}

export function setHeaderChil2(params, data, pro, p_pk) {
  try {
    return data.filter(x => x.p_pk === p_pk && x.menu_cd === pro)[0][
      params.toLowerCase()
    ];
  } catch (error) {
    Alert.alert('Thông báo', 'Tải ngôn ngữ menu thất bại, ' + pro, [
      {text: 'Huỷ bỏ'},
    ]);
    return null;
  }
}
export function setHeader2(params, data, pro) {
  try {
    return data.filter(x => x.menu_cd === pro)[0][params.toLowerCase()];
  } catch (error) {
    Alert.alert('Thông báo', 'Tải ngôn ngữ menu thất bại', [{text: 'Huỷ bỏ'}]);
    return null;
  }
}
export function setLanguageItem(item, params) {
  if (params === 'ENG') {
    return item.eng;
  } else if (params === 'VIE') {
    return item.vie;
  } else if (params === 'KOR') {
    return item.kor;
  } else if (params === 'CHI') {
    return item.chi;
  } else if (params === 'JAP') {
    return item.jap;
  } else if (params === 'FRA') {
    return item.fra;
  } else {
    return item.eng;
  }
}
export function selectLanguageDM(item, params) {
  if (params === 'ENG') {
    return item.eng;
  } else if (params === 'VIE') {
    return item.vie;
  } else if (params === 'KOR') {
    return item.kor;
  } else if (params === 'CHI') {
    return item.chi;
  } else if (params === 'JAP') {
    return item.jpa;
  } else if (params === 'FRA') {
    return item.fra;
  } else {
    return item.eng;
  }
}

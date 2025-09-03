import React, {useEffect, useState} from 'react';
import {Image, Text, View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../components/Block';
import Button from '../../../../components/Button';

const OneItem = ({item, onCheck}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const [ImageDish, setImageDish] = useState(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAADkklEQVR4nO2aS0hVQRjHf+YjjULDSrMwy15SYVZkpUsp7CEkBG1cRSRtg9r0kKBtbYKyl5kRbloVQo9NED1QgqhVUWak1Sa7aaGm1xbfnM69t3PTrud856bnB8NwZ86Z7z/fnTnnm5kDAQEBAQEBAQFTlBSf7OYB+4D15ncHcAX47JMeVaqBXmA0Jn0BtvmoS4USoB/p8B2gzqS7pqwPWOGbOgWuIh29TvT0SwFumLpLPuhSowvpZIlD3SpT91ZVkTIhpJO5DnW52M8CNaZpGgNem7zKoW5rzDWTkoPIv/wR2BJRXgF8MnX1PuhSIxVoQzoaBl6ZFDZlt9Eflepk8GcMYKUMH3WpYnV4rUnWb3XSFG0tAvbGlMVGfkdM3oq8MicVjcQf+rHpvJYozRFgze824EWca9YA24HpKorQdYDFG8QBOUC2KQsBX4EZ2mK8XA6nIg+4KpMqgcxx3jsMPAfum/QA+OmBRk8ckA/sRwKagojyUeA9MgK6kCXxgKnLBGYjD8pioDBGWzfyXLhIEu8ZLAZagEHsh1kXcBrYiXP8H49cYBdwBnGa1d4AcM3YShqygAbgByJyCFnaVuDOCEtBpk8rMg1Gja0TxravVAKdiKgR4DKw0EN7hUCTsWUtnSs8tPdX6rGHewdQqmi7DHhmbA8CBxRtkw5cwP7XT5oybdKBU9ijoVFDRyr21lU/sNtrg+OgFviOaLqJh7FN5L5dL7DRK0MJUI4EUk77ja5x3BgIkVydt9gMfEM0HnW78Wpkro0AO9xu3EVqsHW6dsaQA3xAPHvMrUY9pAE76swe49pxcc40+BR5CCY7aUA7ovnsRBtbhkRfw8DqiTamSCkyDYaApRNpqAXxZJMLorRpRrQ3J9rAPGTxMQIscUmUJsWI9gFgTiINHEY8eMtFUdpYW/CHErn5sbm51k1FyuxB+vDwX2+ciz18ZrosSpNZSB+GiTMN4p3CbDJ1j5CY/3+lD3iCvL7LnS6I54B1Jm/3QJQ2HSYvc6qM54DlJn/puhx9rD6sdKqM54D5Ju9xXY4+3SbPd6qMXDvXYe/iWt/p1AAbvNGlhtWnEuyjtx4kyPu9bi7A9tRUYQHQY40A69gqhOK5nE/UI6vEqKP4IiRg6PRDkTLWLnYRTIGvMcYidgMxC+cPmCYTUYcplgPCJs8D7qnK8Y8w2A7oRr7QLPJNji7vmHpvvYCAgICAgICAaH4BkibW5yWRECEAAAAASUVORK5CYII=',
  );
  const styles = StyleSheet.create({
    viewImage: {
      width: 80,
      height: 80,
    },
    image: {
      resizeMode: 'contain',
      width: '100%',
      height: '100%',
      borderRadius: 5,
      borderColor: Color.grayPlahoder,
      borderWidth: 1,
      color: Color.grayPlahoder,
    },
    viewContent: {
      flex: 1,
      padding: 10,
    },
    fullname: {
      fontSize: 14,
      fontWeight: 'bold',
      color: Color.mainColor,
      marginBottom: 5,
    },
    checkbox: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Color.mainColor,
    },
    viewCheckbox: {
      marginLeft: 10,
      height: 30,
      width: 30,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.mainColor,
    },
  });
  const dispatch = useDispatch();
  const onChecked = pk => {
    onCheck(pk);
  };
  console.log(item);

  return item.pk === 'pk' ? (
    <Block flex height={140} margin={10} borderRadius={20} justifyCenter />
  ) : (
    <Block
      shadow
      flex={1}
      height={140}
      margin={10}
      borderRadius={20}
      justifyCenter
      backgroundColor={Color.white}>
      <Button nextScreen={() => onChecked(item.pk)}>
        <Block
          style={{
            alignItems: 'center',
          }}>
          <View style={styles.viewImage}>
            <Image
              style={styles.image}
              source={{uri: item.image === '' ? ImageDish : item.image}}
            />
          </View>
        </Block>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              paddingTop: 3,
              color: Color.mainColor,
              fontSize: 14,
              numberOfLines: 1,
            }}>
            {item.name}
          </Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              paddingTop: 3,
              color: Color.mainColor,
              fontSize: 14,
              numberOfLines: 1,
            }}>
            {item.contractor}
          </Text>
        </View>
      </Button>
    </Block>
  );
};

export default OneItem;

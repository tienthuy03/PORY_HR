import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

const Item = ({ item, index, onPress }) => {
    const { monChinh, monPhu, ca } = item;
    //console.log('length: ', monChinh.length);
    const [selectedItem, setSelectedItem] = useState(null);
    const handleItemPress = (item) => {
        onPress(item);
        setSelectedItem(item);
        //console.log('item selected: ', item);
    }

    const isItemSelected = (item) => {
        if (item.item_pk == '') {
            return false;
        }
        return selectedItem && selectedItem.item_pk === item.item_pk;
    };

    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                marginBottom: 10,
            }}
        >
            {
                ca != '' ? <Text style={{ fontWeight: 'bold', color: 'red' }}>{ca}</Text> : null
            }
            {
                monChinh.length > 0 ? monChinh.map((item, index) => {
                    return (
                        <View>
                            {
                                monChinh.length > 0 ? <TouchableOpacity
                                    onPress={() => handleItemPress(item)}
                                >
                                    <View
                                        style={[
                                            styles.itemContainer,
                                            isItemSelected(item) && styles.selectedItemContainer,
                                        ]}
                                    >
                                        <Text style={[{ fontWeight: '700' }]}>{item.menu_name}</Text>
                                        {
                                            item.dayy == '' ? <Text>Chưa có món ăn</Text> : <Text>{item.dayy}</Text>
                                        }
                                        {
                                            item.meal_type == 1 ?
                                                <View>
                                                    {
                                                        monPhu.length > 0 &&
                                                        monPhu.map((item, index) => {
                                                            return (
                                                                <View>
                                                                    {
                                                                        item.dayy == '' ? null : <Text>{item.dayy}</Text>
                                                                    }
                                                                </View>
                                                            )
                                                        })
                                                    }
                                                </View> : null
                                        }

                                    </View>
                                </TouchableOpacity> : null
                            }

                        </View>
                    )
                }) : null
            }
        </View>
    );
}


export default Item

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginBottom: 10,
    },
    caText: {
        fontWeight: 'bold',
        color: 'red',
    },
    itemContainer: {
        flexDirection: 'column',
        borderRadius: 6,
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 5,
    },
    selectedItemContainer: {
        backgroundColor: '#87b8f5', // Màu nền cho mục được chọn
    },
    itemName: {
        fontWeight: '700',
    },
})
import React from "react";
import { useSelector } from "react-redux";
import Block from "../../../components/Block";
import TVSHeader from "../../../components/Tvs/Header";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

const SystemSecurity = ({ navigation: { goBack } }) => {
    const Color = useSelector((s) => s.SystemReducer.theme);
    const navigation = useNavigation();

    return (
        <Block flex backgroundColor={Color.backgroundColor}>
            <TVSHeader goBack={goBack}>Tài khoản và bảo mật</TVSHeader>
            <Block flex backgroundColor={Color.gray} paddingTop={10}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Block marginBottom={20}>
                        <View style={{}}>
                            <Text style={{
                                fontSize: 14,
                                color: 'black',
                                fontWeight: '700',
                                opacity: 0.6,
                                marginBottom: 10,
                                paddingHorizontal: 10
                            }}>
                                Thiết lập tài khoản
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("UpdatePassword")}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    backgroundColor: Color.white,
                                    minHeight: 60,
                                    marginBottom: 2,
                                    paddingHorizontal: 10,
                                }}>
                                    <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <Text style={{
                                            fontSize: 14,
                                            color: 'black',
                                            opacity: 0.8,
                                            marginLeft: 10
                                        }}>
                                            Đổi mật khẩu
                                        </Text>
                                        <Text style={{
                                            fontSize: 13,
                                            color: 'black',
                                            opacity: 0.4,
                                            marginLeft: 10
                                        }}>
                                            Thay đổi mật khẩu đăng nhập tài khoản
                                        </Text>
                                    </View>

                                    <MaterialCommunityIcons
                                        name="chevron-right"
                                        size={24}
                                        style={{
                                            color: 'black',
                                            opacity: 0.8,
                                        }}
                                    />
                                </View>
                            </TouchableOpacity>

                        </View>
                    </Block>
                    <Block marginBottom={20}>
                        <View style={{}}>
                            <Text style={{
                                fontSize: 14,
                                color: 'black',
                                fontWeight: '700',
                                opacity: 0.6,
                                marginBottom: 10,
                                paddingHorizontal: 10
                            }}>
                                Thiết lập thông tin bảo mật
                            </Text>
                            {/* <TouchableOpacity onPress={() => navigation.navigate('SecurityMethod')}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    backgroundColor: Color.white,
                                    minHeight: 60,
                                    marginBottom: 2,
                                    paddingHorizontal: 10,
                                }}>
                                    <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <Text style={{
                                            fontSize: 14,
                                            color: 'black',
                                            opacity: 0.8,
                                            marginLeft: 10
                                        }}>
                                            Thiết lập thông tin bảo mật
                                        </Text>
                                        <Text style={{
                                            fontSize: 13,
                                            color: 'black',
                                            opacity: 0.4,
                                            marginLeft: 10
                                        }}>
                                            Thiết lập email/câu hỏi bảo mật để lấy lại mật khẩu
                                        </Text>
                                    </View>

                                    <MaterialCommunityIcons
                                        name="chevron-right"
                                        size={24}
                                        color={Color.mainColor}
                                        style={{
                                            color: 'black',
                                            opacity: 0.8,
                                        }}
                                    />
                                </View>
                            </TouchableOpacity> */}

                            <TouchableOpacity onPress={() => navigation.navigate(
                                'EmailSecurity', 
                                {first: false}
                            )}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    backgroundColor: Color.white,
                                    minHeight: 60,
                                    marginBottom: 2,
                                    paddingHorizontal: 10,
                                }}>
                                    <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: 'black',
                                        opacity: 0.6,
                                        marginLeft: 10
                                    }}>
                                        Email bảo mật
                                    </Text>
                                    <Text style={{
                                        fontSize: 13,
                                        color: 'black',
                                        opacity: 0.4,
                                        marginLeft: 10
                                    }}>
                                        Thiết lập email bảo mật để lấy lại mật khẩu
                                    </Text>
                                    </View>
                                    
                                    <MaterialCommunityIcons
                                        name="chevron-right"
                                        size={24}
                                        style={{
                                            color: 'black',
                                            opacity: 0.8,
                                        }}
                                    />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate(
                                'QuestionSecurity', 
                                {first: false}
                            )}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    backgroundColor: Color.white,
                                    minHeight: 60,
                                    marginBottom: 2,
                                    paddingHorizontal: 10,
                                }}>
                                    <View style={{ 
                                        flexDirection: 'column', 
                                        alignItems: 'flex-start' 
                                    }}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: 'black',
                                        opacity: 0.6,
                                        marginLeft: 10
                                    }}>
                                        Câu hỏi bảo mật
                                    </Text>
                                    <Text style={{
                                        fontSize: 13,
                                        color: 'black',
                                        opacity: 0.4,
                                        marginLeft: 10
                                    }}>
                                        Thiết lập câu hỏi bảo mật để lấy lại mật khẩu
                                    </Text>
                                    </View>
                                    
                                    <MaterialCommunityIcons
                                        name="chevron-right"
                                        size={24}
                                        style={{
                                            color: 'black',
                                            opacity: 0.8,
                                        }}
                                    />
                                </View>
                            </TouchableOpacity>

                        </View>
                    </Block>
                </ScrollView>
            </Block>
        </Block>
    );
};

export default SystemSecurity;

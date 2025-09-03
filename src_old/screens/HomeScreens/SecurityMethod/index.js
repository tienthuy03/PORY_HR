import React from "react";
import { useSelector } from "react-redux";
import Block from "../../../components/Block";
import TVSHeader from "../../../components/Tvs/Header";
import TVSFieldSet from "../../../components/Tvs/TVSFieldSet";
import EmailMethod from "./EmailMethod";
import QuestionMethod from "./QuestionMethod";
import { ScrollView } from "react-native";

const SecurityMethodComponent = ({ navigation: { goBack } }) => {
  const Color = useSelector((s) => s.SystemReducer.theme);

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>Phương thức bảo mật</TVSHeader>
      <ScrollView 
        style={{ flex: 1, height: "100%", backgroundColor: 'white' }}
        showsVerticalScrollIndicator={false}
      >
        <Block flex={1} backgroundColor={Color.white} paddingTop={10} paddingHorizontal={10}>
          <Block marginBottom={10}>
            <TVSFieldSet 
              textSize={14} 
              label={"Email bảo mật"} 
              colorLabel="black"
              opacity={0.8}
            >
              <EmailMethod />
            </TVSFieldSet>
          </Block>

          <TVSFieldSet 
            textSize={14} 
            label={"Câu hỏi bảo mật"} 
            colorLabel="black"
            opacity={0.8}
          >
            <QuestionMethod />
          </TVSFieldSet>
        </Block>
      </ScrollView>
    </Block>
  );
};

export default SecurityMethodComponent;

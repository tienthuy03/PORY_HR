import React, {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import Block from "../../../components/Block";
import TVSHeader from "../../../components/Tvs/Header";
import TVSFieldSet from "../../../components/Tvs/TVSFieldSet";
import EmailMethod from "./EmailMethod";
import QuestionMethod from "./QuestionMethod";

const QuestionSecurity = ({ navigation: { goBack }, route }) => {
    const Color = useSelector((s) => s.SystemReducer.theme);
    const {first} = route.params;
    const [isFirst, setIsFirst] = useState(false);
  
    useEffect(() => {
      if(first != undefined) {
        setIsFirst(first);
      }
    }, []);
    
    return (
        <Block flex backgroundColor={Color.backgroundColor}>
            <TVSHeader goBack={goBack}>Câu hỏi bảo mật</TVSHeader>
            <Block flex backgroundColor={Color.white} paddingTop={10}>
                {
                    isFirst ? <QuestionMethod isFirst={true} /> : <QuestionMethod isFirst={false} />
                }
            </Block>
        </Block>
    )
}

export default QuestionSecurity
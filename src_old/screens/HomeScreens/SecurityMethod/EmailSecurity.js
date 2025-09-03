import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Block from "../../../components/Block";
import TVSHeader from "../../../components/Tvs/Header";
import EmailMethod from "./EmailMethod";

const EmailSecurity = ({ navigation: { goBack }, route }) => {
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
      <TVSHeader goBack={goBack}>Email bảo mật</TVSHeader>
      <Block flex backgroundColor={Color.white} paddingTop={10}>
        {
          isFirst ? <EmailMethod isFirst={true} /> : <EmailMethod isFirst={false} />
        }
        
      </Block>
    </Block>
  )
}

export default EmailSecurity
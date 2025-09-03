import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';
import {useSelector} from 'react-redux';
function SvgPassword(props) {
  const Color = useSelector((s) => s.SystemReducer.theme);
  return (
    <Svg
      width={14.424}
      height={19.347}
      {...props}
      viewBox={'0 0 14.424 19.347'}>
      <G fill={Color.mainColor}>
        <Path
          data-name="Path 5281"
          d="M9.356 19.345H2.028A2.141 2.141 0 010 17.113V8.672a2.141 2.141 0 012.028-2.234H12.4a2.141 2.141 0 012.028 2.234v7.944a.679.679 0 11-1.352 0V8.672a.714.714 0 00-.676-.744H2.028a.714.714 0 00-.676.745v8.441a.714.714 0 00.676.745h7.328a.748.748 0 010 1.49z"
        />
        <Path
          data-name="Path 5282"
          d="M11 7.938a.676.676 0 01-.649-.7V4.669A3.158 3.158 0 007.325 1.4 3.158 3.158 0 004.3 4.669v2.569a.676.676 0 01-.649.7.676.676 0 01-.651-.7V4.669A4.512 4.512 0 017.325 0a4.512 4.512 0 014.325 4.669v2.569a.676.676 0 01-.65.7z"
        />
      </G>
    </Svg>
  );
}

export default SvgPassword;

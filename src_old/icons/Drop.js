import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';
import {useSelector} from 'react-redux';
function SvgDrop(props) {
  const Color = useSelector((s) => s.SystemReducer.theme);
  return (
    <Svg width={7.064} height={4.008} {...props} viewBox={'0 0 7.064 4.008'}>
      <G data-name="Group 4122">
        <Path
          data-name="Path 5178"
          d="M.015.359C.324-.09.602-.12.989.282L3.308 2.6c.077.077.139.139.232.216.077-.077.155-.139.232-.216L6.076.3a1.655 1.655 0 01.247-.219.452.452 0 01.587.077.432.432 0 01.078.572 1.655 1.655 0 01-.217.247L4.019 3.729c-.371.371-.6.371-.974 0L.293.977A3.262 3.262 0 01-.001.621 1.415 1.415 0 00.015.359z"
          fill={Color.mainColor}
        />
      </G>
    </Svg>
  );
}

export default SvgDrop;

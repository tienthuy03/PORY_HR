import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgCheck({color}) {
  return (
    <Svg height="20pt" viewBox="0 -65 434.677 434" width="20pt">
      <Path
        fill={color}
        d="M152.004 304.344c-5.461 0-10.922-2.09-15.082-6.25L6.258 167.426c-8.344-8.34-8.344-21.824 0-30.164 8.34-8.34 21.82-8.34 30.164 0l115.582 115.582L398.258 6.594c8.34-8.34 21.82-8.34 30.164 0 8.34 8.343 8.34 21.824 0 30.168L167.09 298.094a21.282 21.282 0 01-15.086 6.25zm0 0"
      />
    </Svg>
  );
}

export default SvgCheck;

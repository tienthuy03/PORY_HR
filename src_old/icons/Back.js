import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgBack({props, color}) {
  return (
    <Svg width={10.292} height={18} {...props} viewBox={'0 0 10.292 18'}>
      <Path
        data-name="Icon ionic-ios-arrow-forward"
        d="M3.103 8.997l6.811-6.806a1.281 1.281 0 000-1.817 1.3 1.3 0 00-1.822 0L.375 8.086A1.284 1.284 0 00.337 9.86l7.749 7.765a1.288 1.288 0 101.823-1.821z"
        fill={color}
      />
    </Svg>
  );
}

export default SvgBack;

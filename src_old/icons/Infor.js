import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';
import {useSelector} from 'react-redux';
function SvgInfo(props) {
  const Color = useSelector((s) => s.SystemReducer.theme);
  return (
    <Svg
      width={17.569}
      height={17.569}
      {...props}
      viewBox={'0 0 17.569 17.569'}>
      <G data-name="Group 4135">
        <G data-name="Group 4134" fill={Color.mainColor}>
          <Path
            data-name="Path 5346"
            d="M8.787 2.928a1.464 1.464 0 101.464 1.464 1.466 1.466 0 00-1.464-1.464zm0 2.2a.732.732 0 11.732-.732.733.733 0 01-.732.728z"
          />
          <Path
            data-name="Path 5347"
            d="M9.882 6.588H6.954a.366.366 0 00-.366.366v1.464a.366.366 0 00.366.366h.366v5.49a.366.366 0 00.366.366h2.2a.366.366 0 00.366-.366V6.953a.366.366 0 00-.37-.365zm-.366 7.32H8.052v-5.49a.366.366 0 00-.366-.366H7.32V7.32h2.2v6.588z"
          />
          <Path
            data-name="Path 5348"
            d="M8.785 0a8.785 8.785 0 108.785 8.785A8.795 8.795 0 008.785 0zm0 16.837a8.053 8.053 0 118.053-8.053 8.062 8.062 0 01-8.053 8.053z"
          />
        </G>
      </G>
    </Svg>
  );
}

export default SvgInfo;

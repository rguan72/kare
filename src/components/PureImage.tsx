import React, { memo } from "react";
import { Image } from "react-native";

const PureImage = memo((props) => {
  return <Image {...props} />;
});

export default PureImage;

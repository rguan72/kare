import React, { memo, useEffect } from "react";
import { Image } from "react-native";

const areEqual = (prevProps, nextProps) => {
  return true;
};

const PureImage = (props) => {
  useEffect(() => {
    console.log("rendered");
  });

  return <Image {...props} />;
};

export default React.memo(PureImage, areEqual);

import React, { useState } from "react";
import { Input } from "@ui-kitten/components";
import { Platform } from "react-native";

const HomeSearchBar = (props) => {
  const [focus, setFocus] = useState(false);

  return (
    <Input
      {...props}
      style={{
        marginTop: Platform.OS === "ios" ? 10 : 80,
        paddingLeft: 3,
        paddingRight: 3,
        borderRadius: 20,
        borderStyle: "solid",
        borderColor: focus ? "#8566AA" : "#F7F7F7",
        backgroundColor: focus ? "white" : "#F7F7F7",
      }}
      onFocus={() => {
        setFocus(true);
      }}
      onBlur={() => {
        setFocus(false);
      }}
    />
  );
};

export default HomeSearchBar;

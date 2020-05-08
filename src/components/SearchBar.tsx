import React, { useState } from "react";
import { Input } from "@ui-kitten/components";

const SearchBar = (props) => {
  const [focus, setFocus] = useState(false);

  return (
    <Input
      {...props}
      style={{
        marginTop: 40,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 20,
        borderStyle: "solid",
        borderColor: focus ? "#8566AA" : "#DBDBDB",
        backgroundColor: focus ? "white" : "#DBDBDB",
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

export default SearchBar;

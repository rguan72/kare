import React from "react";
import { Text } from "@ui-kitten/components";
import * as Linking from "expo-linking";

interface AnchorProps {
  href: string;
  onPress?: () => any;
  children?: any;
}

export default function Anchor(props: AnchorProps) {
  const { href, onPress, children } = props;
  const _handlePress = () => {
    Linking.openURL(href);
    onPress && onPress();
  };

  return (
    <Text {...props} onPress={_handlePress}>
      {props.children}
    </Text>
  );
}

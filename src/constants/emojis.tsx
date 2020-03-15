import React from "react";
import { Text } from "react-native";

interface EmojiProps {
  symbol: string;
  label?: string;
}

const Emoji = ({ label, symbol }: EmojiProps) => (
  <Text aria-label={label ? label : ""} aria-hidden={label ? "false" : "true"}>
    {symbol}
  </Text>
);

function HandEmoji() {
  return <Emoji symbol="🖐️" label="hand wave" />;
}

function peaceEmoji() {
  return <Emoji symbol="☮️" label="peace" />;
}

function handsUpEmoji() {
  return <Emoji symbol="🙌🏽" label="hands up" />;
}

function waterWaveEmoji() {
  return <Emoji symbol="🌊" label="water wave" />;
}

function flagEmoji() {
  return <Emoji symbol="🚩" label="flag" />;
}

const emojis = {
  handWave: HandEmoji,
  peace: peaceEmoji,
  handsUp: handsUpEmoji,
  waterWave: waterWaveEmoji,
  flag: flagEmoji
};

export default emojis;

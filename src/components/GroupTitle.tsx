import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import PureImage from "./PureImage";
import ThreadStyles from "../StyleSheets/ThreadStyles";

interface GroupTitleProps {
  title: string;
  image: string;
  description: string;
  num_members: Number;
}

export default function GroupTitle(props: GroupTitleProps) {
  const { title, image, description, num_members } = props;
  return (
    <Layout style={ThreadStyles.header}>
      <Layout style={ThreadStyles.headerTextBox}>
        <Text category="h5">{title}</Text>
        <Text style={{ marginTop: 2, marginRight: 10 }}>{description}</Text>
        <Text style={{ marginTop: 2 }}>{num_members} Members</Text>
      </Layout>
      <Layout style={{ backgroundColor: "#F3EAFF", maxHeight: 100 }}>
        <PureImage
          source={{ uri: image }}
          style={ThreadStyles.icon}
          resizeMode="cover"
        />
      </Layout>
    </Layout>
  );
}

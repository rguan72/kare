import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Layout, Button, Input, Text, Card } from "@ui-kitten/components";
import PeerListenerChatStyles from "../StyleSheets/PeerListenerChatStyles";

export default function PeerListenerChat({navigation}) {

    return (
      <Layout style={PeerListenerChatStyles.container}>
        <Layout style={PeerListenerChatStyles.Heading}>
            <Text category="h5" style={{ alignSelf: "center" }}>Peer Listeners</Text>
        </Layout>
      </Layout>
    );
  }
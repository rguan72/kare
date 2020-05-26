import React, { useState, useContext } from "react";
import { Layout, Button, Input } from "@ui-kitten/components";
import { addComment, incrementGroupConnectors } from "../utils/FirebaseUtils";
import ThreadStyles from "../StyleSheets/ThreadStyles";

import { KareContext } from "../KareContext";

interface ButtonLayoutProps {
  userId: string;
  groupId: string;
}

export default function ButtonLayout(props: ButtonLayoutProps) {
  const { userId, groupId } = props;
  const [value, setValue] = useState("");

  const { state, dispatch } = useContext(KareContext);
  const { user } = state;

  return (
    <Layout style={ThreadStyles.commentBox}>
      <Input
        multiline
        placeholder='Add comment'
        value={value}
        onChangeText={(e) => setValue(e)}
      />
      <Button
        onPress={() => {
          addComment(
            {
              userId: userId,
              text: value,
              reports: 0,
              show: true,
              numReplies: 0,
              color: user.color,
              commenterName: user.name,
            },
            groupId
          );
          incrementGroupConnectors(groupId);
          setValue("");
        }}
        style={ThreadStyles.submitButton}
        disabled={value === ""}
      >
        Submit
      </Button>
    </Layout>
  );
}

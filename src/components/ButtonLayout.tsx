import React, { useState } from "react";
import { Layout, Button, Input } from "@ui-kitten/components";
import { addComment, incrementGroupConnectors } from "../utils/FirebaseUtils";
import ThreadStyles from "../StyleSheets/ThreadStyles";
import { User } from "../Models";

interface ButtonLayoutProps {
  userId: string;
  user: User;
  groupId: string;
}

export default function ButtonLayout(props: ButtonLayoutProps) {
  const { userId, user, groupId } = props;
  const [value, setValue] = useState("");
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

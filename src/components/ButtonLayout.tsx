import React, { useState } from "react";
import { Layout, Button, Input } from "@ui-kitten/components";
import { addComment, incrementGroupConnectors } from "../utils/FirebaseUtils";
import ThreadStyles from "../StyleSheets/ThreadStyles";
import ModModal from "./ModModal";
import { User, ModTypesEnum } from "../Models";
import moderate from "../utils/moderation";

interface ButtonLayoutProps {
  userId: string;
  user: User;
  groupId: string;
}

export default function ButtonLayout(props: ButtonLayoutProps) {
  const { userId, user, groupId } = props;
  const [value, setValue] = useState<string>("");
  const [modVisible, setmodVisible] = useState<boolean>(false);
  const [flagType, setFlagType] = useState<ModTypesEnum>(
    ModTypesEnum.offensive
  );
  return (
    <Layout style={ThreadStyles.commentBox}>
      <Input
        multiline
        placeholder="Add comment"
        value={value}
        onChangeText={(e) => setValue(e)}
      />
      <Button
        onPress={() => {
          const messageProblem = moderate(value);
          if (messageProblem != ModTypesEnum.ok) {
            setmodVisible(true);
            setFlagType(messageProblem);
            return;
          }
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
      <ModModal
        shVisible={modVisible}
        setshVisible={setmodVisible}
        type={flagType}
      />
    </Layout>
  );
}

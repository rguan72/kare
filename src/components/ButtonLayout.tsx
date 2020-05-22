import React, { useState } from "react";
import { Layout, Button, Input } from "@ui-kitten/components";
import assert from "assert";
import { addComment, incrementGroupConnectors } from "../utils/FirebaseUtils";
import ThreadStyles from "../StyleSheets/ThreadStyles";
import ModModal from "./ModModal";
import { User, ModTypesEnum } from "../Models";
import moderate from "../utils/moderation";
import { addCommentLogic, addReplyLogic } from "../utils/commentBusinessLogic";

interface ButtonLayoutProps {
  userId: string;
  user: User;
  groupId?: string;
  commentId?: string;
  commenterId?: string;
  comment?: string;
  date?: string;
}

export default function ButtonLayout(props: ButtonLayoutProps) {
  const {
    userId,
    user,
    groupId,
    commentId,
    commenterId,
    comment,
    date,
  } = props;
  const [value, setValue] = useState<string>("");
  const [modVisible, setmodVisible] = useState<boolean>(false);
  const [flagType, setFlagType] = useState<ModTypesEnum>(
    ModTypesEnum.offensive
  );
  const isReply = commentId && commenterId;
  // easier to do than in Typescript
  if (__DEV__) {
    assert(
      (commentId && commenterId && comment && date) ||
        (commentId === undefined &&
          commenterId === undefined &&
          comment === undefined &&
          date === undefined &&
          groupId)
    );
  }
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
          const { moderateType } = moderate(value);
          if (moderateType != ModTypesEnum.ok) {
            setmodVisible(true);
            setFlagType(moderateType);
            return;
          }
          if (isReply) {
            addReplyLogic(
              userId,
              value,
              commentId,
              commenterId,
              comment,
              date,
              user
            );
          } else {
            addCommentLogic(userId, value, groupId, user);
          }
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

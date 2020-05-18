import React, { useState } from "react";
import { TouchableOpacity, Image } from "react-native";
import { Card, Text, Modal, Button, Input } from "@ui-kitten/components";
import { View } from "react-native";
import PropTypes from "prop-types";
import Colors from "../constants/userColors";
import ListItemStyles from "../StyleSheets/ListItemStyles";
import { manageFollowingComment, editComment } from "../utils/FirebaseUtils";
import { Entypo } from "@expo/vector-icons";

export default function ListItem({
  text,
  onReport,
  date,
  onReply,
  numReplies,
  showReplies,
  commenterName,
  color,
  following,
  commentId,
  userId,
  commenterId,
}) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(text);
  const [editing, setEditing] = useState(false);

  const commentColor = Colors[color];

  const RepliesNumber = () => {
    if (showReplies == "True") {
      return (
        <View>
          <Text>{numReplies ? numReplies : 0} Replies </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <Card style={ListItemStyles.card} onPress={onReply}>
      <View style={{ flexDirection: "row" }}>
        <View
          style={[ListItemStyles.square, { backgroundColor: commentColor }]}
        />
        <Text style={ListItemStyles.userName}>{commenterName}</Text>
        <Text style={ListItemStyles.date}> {date}</Text>
        {/*This space has to be here to separate the date and username*/}
        <TouchableOpacity
          onPress={() => setVisible(true)}
          style={{ position: "absolute", right: 0 }}
        >
          <Entypo
            name='dots-three-horizontal'
            size={20}
            style={{ opacity: 0.7 }}
          />
        </TouchableOpacity>
      </View>
      <Text style={ListItemStyles.comments}>{text}</Text>
      <View style={ListItemStyles.bottomRow}>
        <RepliesNumber></RepliesNumber>
        {showReplies === "False" ? (
          <Text></Text>
        ) : following ? (
          <Image
            source={require("../../assets/unfollow.png")}
            style={ListItemStyles.image}
          />
        ) : (
          <Image
            source={require("../../assets/follow-icon.png")}
            style={ListItemStyles.image}
          />
        )}
        {/*<TouchableOpacity
          onPress={onReport}
          style={{ position: "absolute", right: 0 }}
        >
          <Text style={ListItemStyles.report}> Report</Text>
        </TouchableOpacity>*/}
      </View>
      <Modal
        visible={visible}
        backdropStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onBackdropPress={() => {
          // on touching anything but modal close and reset
          setVisible(false);
          setValue(text);
          setEditing(false);
        }}
      >
        <Card style={ListItemStyles.card}>
          {userId == commenterId ? (
            <>
              {editing ? ( // if editing is pressed edit comment
                <>
                  <Input
                    multiline
                    value={value}
                    onChangeText={(e) => setValue(e)}
                  />
                  <Button
                    onPress={() => {
                      //edit comments and close/reset modal
                      editComment(commentId, value);
                      setVisible(false);
                      setValue(value);
                      setEditing(false);
                    }}
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onPress={() => setEditing(true) /* Set editing true */}
                  >
                    Edit
                  </Button>
                  <Button
                    onPress={
                      onReport /* currently "onReport" to make show false might have to change */
                    }
                    style={{ marginTop: 5 }}
                  >
                    Delete
                  </Button>
                </>
              )}
              <Button
                onPress={() => {
                  // reset everything on cancel
                  setVisible(false);
                  setValue(text);
                  setEditing(false);
                }}
                style={{ marginTop: 30, paddingHorizontal: 85 }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                onPress={
                  onReport /* currently "onReport" to make show false might have to change */
                }
              >
                Report
              </Button>
              {showReplies == "True" ? (
                <Button
                  onPress={() => {
                    manageFollowingComment(following, commentId, userId);
                  }}
                  style={{ marginTop: 5 }}
                >
                  {following ? "Unfollow Post" : "Follow Post"}
                </Button>
              ) : (
                <></>
              )}
              <Button
                onPress={() => {
                  // reset everything on cancel
                  setVisible(false);
                  setValue(text);
                  setEditing(false);
                }}
                style={{ marginTop: 30, paddingHorizontal: 85 }}
              >
                Cancel
              </Button>
            </>
          )}
        </Card>
      </Modal>
    </Card>
  );
}

ListItem.propTypes = {
  text: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  onReport: PropTypes.func.isRequired,
  onReply: PropTypes.func.isRequired,
  commenterName: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  following: PropTypes.bool.isRequired,
  commentId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  commenterId: PropTypes.string.isRequired,
};

interface NewComment {
  color: String;
  commenterName: String;
  numReplies: Number;
  reports: Number;
  show: Boolean;
  text: String;
  userId: String;
}

interface StressItem {
  id: Number;
  title: String;
}

interface User {
  color: String;
  consider: Number;
  groups: Array<String>;
  name: String;
  stress: Array<StressItem>;
  support: Number;
  timestamp: String;
  voice: Number;
}

interface UserWithId {
  id: String;
  color: String;
  consider: Number;
  groups: Array<String>;
  name: String;
  stress: Array<StressItem>;
  support: Number;
  timestamp: String;
  voice: Number;
}

export { User, NewComment, UserWithId };

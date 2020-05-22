interface NewComment {
  color: string;
  commenterName: string;
  numReplies: number;
  reports: number;
  show: boolean;
  text: string;
  userId: string;
}

interface StressItem {
  id: number;
  title: string;
}

interface User {
  color: string;
  consider: number;
  groups: Array<string>;
  name: string;
  stress: Array<StressItem>;
  support: number;
  timestamp: string;
  voice: number;
}

enum ModTypesEnum {
  selfHarm,
  offensive,
  ok,
}

export { User, NewComment, ModTypesEnum };

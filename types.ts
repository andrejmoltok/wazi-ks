export type Session = {
  itemId: string;
  listKey: string;
  data: {
    id: string;
    name: string;
    isAdmin: boolean;
    isDM: boolean;
    isUser: boolean;
  };
};

export type ListAccessArgs = {
  itemId?: string;
  session?: Session;
};

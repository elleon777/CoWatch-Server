export type TUser = {
  id: string;
  username: string;
  currentTime: number | null;
  currentRoomId: string | null;
};

export type TRoom = {
  id: string;
  currentSources: string | null;
  usersId: string[];
};

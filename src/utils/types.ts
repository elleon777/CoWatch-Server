import { RoomRole } from "./enums";

export type TUser = {
  id: string;
  username: string;
  roomRole: RoomRole | null;
  currentTime: number | null;
  currentRoomId: string | null;
  readyPlay: boolean;
};

export type TRoom = {
  id: string;
  currentSources: string | null;
  usersId: string[];
};

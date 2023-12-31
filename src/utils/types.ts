import { RoomRole } from "./enums";

export type TUser = {
  id: string;
  username: string;
  roomRole: RoomRole | null;
  currentRoomId: string | null;
  readyPlay: boolean;
};

export type TRoom = {
  id: string;
  usersId: string[];
  currentSources: any | null;
};

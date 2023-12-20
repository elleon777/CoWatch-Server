import { RoomRole } from '../utils/enums';
import { TUser } from '../utils/types';

const users: TUser[] = [];

export class User {
  id: string;
  username: string;
  roomRole: RoomRole | null;
  currentTime: number | null;
  currentRoomId: string | null;
  readyPlay: boolean;

  constructor(id: string, username: string) {
    this.id = id;
    this.username = username;
    this.roomRole = null;
    this.currentTime = null;
    this.currentRoomId = null;
    this.readyPlay = false;
  }

  save() {
    users.push(this);
  }

  static findUser(userId: string): TUser | undefined {
    const currentUser = users.find((user) => user.id === userId);
    if (!currentUser) {
      console.log(new Error('Пользователь не найден'));
    }
    return currentUser;
  }

  static leaveUser(userId: string) {
    const currentUser = User.findUser(userId);
    if (currentUser) {
      const currentUserIndex = users.indexOf(currentUser);
      users.splice(currentUserIndex, 1);
    }
  }

  static setRoom(userId: string, roomId: string) {
    const currentUser = User.findUser(userId);
    if (currentUser) {
      currentUser.currentRoomId = roomId;
    }
  }

  static findUsersFromRoom(roomId: string) {
    return users.filter((user) => user.currentRoomId === roomId);
  }

  static setReadyPlay(userId: string) {
    const currentUser = User.findUser(userId);
    if (currentUser) {
      currentUser.readyPlay = true;
    }
  }

  static setRoomRole(userId: string) {
    const currentUser = User.findUser(userId);
    if (!currentUser || !currentUser?.currentRoomId) {
      return;
    }
    const roomUsers = User.findUsersFromRoom(currentUser?.currentRoomId);
    const isHost = roomUsers.some((user) => user.roomRole === RoomRole.Host);
    if (isHost) {
      currentUser.roomRole = RoomRole.Member;
    } else {
      currentUser.roomRole = RoomRole.Host;
    }
    console.log('Роль обновлена', currentUser);
  }

  static getUsers() {
    return users;
  }
}

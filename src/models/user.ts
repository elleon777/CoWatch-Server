import { RoomRole } from '../utils/enums';
import { TUser } from '../utils/types';

const users: TUser[] = [];

export class User {
  id: string;
  username: string;
  roomRole: RoomRole | null;
  currentRoomId: string | null;
  readyPlay: boolean;

  constructor(id: string, username: string) {
    this.id = id;
    this.username = username;
    this.roomRole = null;
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

  static setRoom(userId: string, roomId: string | null) {
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

  static getRoomRole(userId: string): RoomRole | undefined {
    const currentUser = User.findUser(userId);
    if (!currentUser || !currentUser?.roomRole) {
      return;
    }
    return currentUser.roomRole;
  }
  static removeRoomRole(userId: string): void {
    const currentUser = User.findUser(userId);
    if (!currentUser || !currentUser?.roomRole) {
      return;
    }
    currentUser.roomRole = null;
  }

  static passHostRole(roomId: string): void {
    const roomUsers = User.findUsersFromRoom(roomId);
    // console.log('roomUsers', roomUsers);
    const isHost = roomUsers.some((user) => user.roomRole === RoomRole.Host);
    if (isHost || roomUsers.length === 0) {
      return;
    }
    const newHostUser = User.findUser(roomUsers[0].id);
    if (newHostUser) {
      newHostUser.roomRole = RoomRole.Host;
    }
  }

  static getUsers() {
    return users;
  }
}

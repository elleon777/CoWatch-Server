import { TUser } from '../utils/types';
import { Room } from './room';

const users: TUser[] = [];

export class User {
  id: string;
  username: string;
  currentTime: number | null;
  currentRoomId: string | null;

  constructor(id: string, username: string) {
    this.id = id;
    this.username = username;
    this.currentTime = null;
    this.currentRoomId = null;
  }

  save() {
    users.push(this);
  }

  static findUser(userId: string): TUser | undefined {
    const currentUser = users.find((user) => user.id === userId);
    if (!currentUser) {
      console.log('Пользователь не найден');
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

  static getUsers() {
    return users;
  }
}

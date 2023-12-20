import { TRoom, TUser } from '../utils/types';
import { User } from './User';

type RoomArg = { roomId: string; userId: string };

const rooms: TRoom[] = [];

export class Room {
  id: string;
  usersId: string[];
  currentSources: string | null;

  constructor() {
    this.id = String(rooms.length + 1);
    this.usersId = [];
    this.currentSources = null;
  }

  save() {
    rooms.push(this);
  }

  static findRoom(roomId: string): TRoom | undefined {
    const currentRoom = rooms.find((room) => room.id === roomId);
    if (!currentRoom) {
      console.log('Комната не найдена');
    }
    return currentRoom;
  }

  static addUserToRoom({ roomId, userId }: RoomArg): void {
    User.setRoom(userId, roomId);
    const currentRoom = Room.findRoom(roomId);
    currentRoom?.usersId.push(userId);
    console.log('добавлен пользователь', currentRoom?.usersId);
  }

  // срабатывает два раза
  static removeUserFromRoom({ roomId, userId }: RoomArg): void {
    const currentRoom = Room.findRoom(roomId);
    const currentUserIndex = currentRoom?.usersId.indexOf(userId);
    console.log('before delete', currentRoom?.usersId);
    if (typeof currentUserIndex !== 'undefined') {
      currentRoom?.usersId.splice(currentUserIndex, 1);
      console.log('after delete', currentRoom?.usersId);
    }
  }

  static leaveRoom({ roomId, userId }: RoomArg, callback?: () => void): void {
    const currentRoom = Room.findRoom(roomId);
    Room.removeUserFromRoom({ roomId, userId });
    if (currentRoom?.usersId.length === 0) {
      Room.deleteRoom(roomId);
      if (callback) {
        callback();
      }
    }
  }

  static deleteRoom(roomId: string): void {
    const currentRoom = Room.findRoom(roomId);
    if (!currentRoom) {
      console.log('Ошибка удаления комнаты. Комната не найдена');
      return;
    }
    const currentRoomIndex = rooms.indexOf(currentRoom);
    rooms.splice(currentRoomIndex, 1);
  }

  static getLastIndexRoom() {
    return String(rooms.length);
  }

  static getAllRooms() {
    return rooms;
  }
}

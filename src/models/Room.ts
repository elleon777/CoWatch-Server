import { TRoom, TUser } from '../utils/types';
import { User } from './User';

type RoomArg = { roomId: string; userId: string };

const rooms: TRoom[] = [];

export class Room {
  id: string;
  usersId: string[];
  currentSources: any | null;

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
    User.setRoomRole(userId);
    console.log('добавлен пользователь', currentRoom?.usersId);
  }

  // срабатывает два раза
  static removeUserFromRoom({ roomId, userId }: RoomArg): void {
    const currentRoom = Room.findRoom(roomId);
    const currentUserIndex = currentRoom?.usersId.indexOf(userId);
    if (typeof currentUserIndex !== 'undefined') {
      currentRoom?.usersId.splice(currentUserIndex, 1);
      User.setRoom(userId, null);
    }
  }

  static leaveRoom({ roomId, userId }: RoomArg, callback?: () => void): void {
    console.log(userId, 'вышел из комнаты', roomId);
    const currentRoom = Room.findRoom(roomId);
    User.removeRoomRole(userId);
    Room.removeUserFromRoom({ roomId, userId });
    User.passHostRole(roomId);
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

  static setSources(roomId: string, sources: any): void {
    const currentRoom = Room.findRoom(roomId);
    if (!currentRoom) {
      console.log('Ошибка установки источников. Комната не найдена');
      return;
    }
    currentRoom.currentSources = sources;
  }
  static getSources(roomId: string): void {
    const currentRoom = Room.findRoom(roomId);
    if (!currentRoom) {
      console.log('Ошибка получения источников. Комната не найдена');
      return;
    }
    return currentRoom.currentSources;
  }
}

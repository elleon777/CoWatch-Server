import { RoomRole } from '../../utils/enums';
import { User } from '../User';
describe('User model', () => {
  const users = [
    {
      id: '1',
      username: 'anton',
      roomRole: 'host',
      currentRoomId: '1',
      readyPlay: false,
    },
    {
      id: '2',
      username: 'olegus',
      roomRole: 'member',
      currentRoomId: '1',
      readyPlay: false,
    },
  ];
  beforeEach(() => {
    new User('1', 'anton').save();
    new User('2', 'olegus').save();
  });

  afterEach(() => {
    User.getUsers().length = 0;
  });

  test('user leave', () => {
    User.leaveUser('1');
    expect(User.getUsers()).not.toContain([users[0]]);
  });

  test('set RoomRole on User when he join', () => {
    User.setRoom('1', '1');
    User.setRoomRole('1')

    User.setRoom('2', '1');
    User.setRoomRole('2')


    expect(User.getUsers()).toEqual(users);
  })
  test('passHostRole when host is leaving', () => {
    User.setRoom('1', '1');
    User.setRoomRole('1')

    User.setRoom('2', '1');
    User.setRoomRole('2')

    users[1].roomRole = RoomRole.Host;
    User.leaveUser('1');
    User.passHostRole('1')

    expect(User.getUsers()).toEqual([users[1]]);
  })
});

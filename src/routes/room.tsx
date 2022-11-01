export interface RoomDataType {
  creatorId: string;
  creatorNickname: string;
  name: string;
  users: { [index: string]: { nickname: string } };
  questions: { [index: string]: { content: string; creatorId: string; creatorNickname: string } };
}

const Room: React.FC = () => {
  return <div>Room</div>;
};

export default Room;

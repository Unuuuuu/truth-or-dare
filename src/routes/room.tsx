import { onValue, ref, remove, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { database } from "../utils/firebase";
import { useAppSelector } from "../redux/hooks";
import { Avatar, AvatarGroup, Box, Fade, Skeleton, Text, useToast } from "@chakra-ui/react";
import Main from "../components/Main";
import { ReactComponent as VipCrownFill } from "../assets/vip-crown-fill.svg";

export interface RoomDataType {
  creatorId: string;
  creatorNickname: string;
  name: string;
  users: { [index: string]: { nickname: string } };
  questions: { [index: string]: { content: string; creatorId: string; creatorNickname: string } };
}

const Room: React.FC = () => {
  const { isLoading: isUserLoading, isSignedIn, id: userId, nickname } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const toast = useToast();
  const { roomId } = useParams();
  const [room, setRoom] = useState<RoomDataType | null>(null);
  const [isRoomLoading, setIsRoomLoading] = useState(true);

  useEffect(() => {
    if (!isUserLoading && !isSignedIn) {
      navigate("/");
      toast({
        title: "You need to enter nickname",
        status: "warning",
        position: "top",
        duration: 1500,
      });
    }
  }, [isUserLoading, isSignedIn]);

  useEffect(() => {
    if (isUserLoading) {
      return;
    }

    const unsubscribe = onValue(ref(database, `rooms/${roomId}`), (snapshot) => {
      if (isRoomLoading) {
        setIsRoomLoading(false);
      }

      const data: RoomDataType | null = snapshot.val();
      if (data === null) {
        navigate("/lobby");
        toast({
          title: "There is no room",
          status: "warning",
          position: "top",
          duration: 1500,
        });
        return;
      }

      setRoom(data);
    });

    return () => {
      unsubscribe();
    };
  }, [isUserLoading, isRoomLoading]);

  useEffect(() => {
    if (isUserLoading || isRoomLoading) {
      return;
    }

    set(ref(database, `rooms/${roomId}/users/${userId}`), { nickname });

    return () => {
      if (userId === room?.creatorId) {
        remove(ref(database, `rooms/${roomId}`));
        return;
      }

      remove(ref(database, `rooms/${roomId}/users/${userId}`));
    };
  }, [isUserLoading, isRoomLoading, userId, room?.creatorId]);

  let users: [string, { nickname: string }][] = [];
  let isUserIdIncluded = false;
  if (room !== null && room.users !== undefined) {
    const usersAsArray = Object.entries(room.users);
    const creatorIndex = usersAsArray.findIndex(([userId]) => userId === room.creatorId);
    users = [
      usersAsArray[creatorIndex],
      ...usersAsArray.slice(0, creatorIndex),
      ...usersAsArray.slice(creatorIndex + 1),
    ];

    isUserIdIncluded = users.find(([userIdFromDatabase]) => userIdFromDatabase === userId) !== undefined;
  }

  return (
    <Main h={"calc(100% - 64px)"}>
      {!isUserLoading && (isRoomLoading || !isUserIdIncluded) && <Skeleton borderRadius={"md"} height="106px" />}
      {!isUserLoading && !isRoomLoading && room !== null && isUserIdIncluded && (
        <Fade in={true}>
          <Box p={4} bg={"bg.surface"} boxShadow={"dark"} borderRadius={"md"}>
            <Text mb={3} fontSize={"xl"} fontWeight={"medium"}>
              {room.name}
            </Text>
            <AvatarGroup size="sm" spacing={"-0.5em"}>
              {users.map(([userId, user]) => (
                <Avatar key={userId} name={user.nickname} boxShadow={"dark"}>
                  {userId === room.creatorId && (
                    <Box
                      position={"absolute"}
                      top={"-6px"}
                      left={"50%"}
                      transform={"auto"}
                      translateX={"-50%"}
                      fill={"yellow.300"}
                      sx={{
                        svg: {
                          width: 3,
                          height: 3,
                        },
                      }}
                    >
                      <VipCrownFill />
                    </Box>
                  )}
                </Avatar>
              ))}
            </AvatarGroup>
          </Box>
        </Fade>
      )}
    </Main>
  );
};

export default Room;

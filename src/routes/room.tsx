import { onValue, ref, remove, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { database } from "../utils/firebase";
import { useAppSelector } from "../redux/hooks";
import { Box, Button, Flex, Progress, Skeleton, Tag, Text, useToast } from "@chakra-ui/react";
import Main from "../components/Main";
import Footer from "../components/Footer";

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
    if (isUserLoading) {
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
  }, [isUserLoading, room?.creatorId]);

  return (
    <div>
      <div>name: {room?.name}</div>
      <div>creator nickname: {room?.creatorNickname}</div>
      <div>users: {JSON.stringify(room?.users)}</div>
    </div>
  );
};

export default Room;

import { Button, Box, useToast, Skeleton, Fade, Flex, Text, Center } from "@chakra-ui/react";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CreateRoomModal from "../components/CreateRoomModal";
import { useAppSelector } from "../redux/hooks";
import { database } from "../utils/firebase";
import { RoomDataType } from "./room";
import { ReactComponent as DoorOpenFill } from "../assets/door-open-fill.svg";
import Main from "../components/Main";
import Footer from "../components/Footer";

interface RoomsDataType {
  [index: string]: RoomDataType;
}

const Lobby: React.FC = () => {
  const { isLoading: isUserLoading, isSignedIn } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const toast = useToast();
  const [isCreateRoomModalOpened, setIsCreateRoomModalOpened] = useState(false);
  const [rooms, setRooms] = useState<RoomsDataType | null>(null);
  const [isRoomsLoading, setIsRoomsLoading] = useState(true);

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
  }, [!isUserLoading, isSignedIn]);

  useEffect(() => {
    const unsubscribe = onValue(ref(database, "rooms/"), (snapshot) => {
      if (isRoomsLoading) {
        setIsRoomsLoading(false);
      }
      const data = snapshot.val();
      setRooms(data);
    });

    return () => {
      unsubscribe();
    };
  }, [isRoomsLoading]);

  const handleCreateRoomButtonClick = () => {
    setIsCreateRoomModalOpened(true);
  };

  const handleCreateRoomModalClose = () => {
    setIsCreateRoomModalOpened(false);
  };

  return (
    <>
      <Main h={"calc(100% - 128px)"}>
        {!isUserLoading && isRoomsLoading && (
          <Flex direction={"column"} gap={4}>
            {[...Array(12).keys()].map((index) => (
              <Skeleton key={index} borderRadius={"md"} height="80px" />
            ))}
          </Flex>
        )}
        {!isUserLoading && !isRoomsLoading && rooms === null && (
          <Center h={"full"}>
            <Fade in={true}>
              <Flex direction={"column"} align={"center"} color={"gray.500"} fill={"gray.700"}>
                <DoorOpenFill width={"96px"} height={"96px"} />
                <Text fontSize={"xl"} fontWeight={"medium"}>
                  There are no rooms here!
                </Text>
                <Text fontSize={"md"} textAlign={"center"}>
                  Start creating your room.
                </Text>
              </Flex>
            </Fade>
          </Center>
        )}
        {!isUserLoading && !isRoomsLoading && rooms !== null && (
          <Flex direction={"column"} gap={4}>
            {Object.entries(rooms).map(([roomId, room]) => (
              <Fade key={roomId} in={true}>
                <Link to={`/rooms/${roomId}`}>
                  <Box w={"full"} p={4} bg={"bg.surface"} boxShadow={"dark"} borderRadius={"md"}>
                    <Text noOfLines={1} fontSize={"lg"} fontWeight={"medium"}>
                      {room.name}
                    </Text>
                    <Text noOfLines={1} fontSize={"sm"} color={"muted"}>
                      {room.creatorNickname}
                    </Text>
                  </Box>
                </Link>
              </Fade>
            ))}
          </Flex>
        )}
      </Main>
      <Footer>
        <Button w={"full"} colorScheme={"teal"} onClick={handleCreateRoomButtonClick}>
          Create Room
        </Button>
      </Footer>
      <CreateRoomModal isOpen={isCreateRoomModalOpened} onClose={handleCreateRoomModalClose} />
    </>
  );
};

export default Lobby;

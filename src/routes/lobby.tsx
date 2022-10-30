import { Button, Box, useToast, Skeleton, Fade, Flex, Text } from "@chakra-ui/react";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateRoomModal from "../components/CreateRoomModal";
import { useAppSelector } from "../redux/hooks";
import { database } from "../utils/firebase";

interface Rooms {
  [index: string]: { creatorId: string; creatorNickname: string; name: string };
}

const Lobby: React.FC = () => {
  const { isLoading: isUserLoading, isSignedIn } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const toast = useToast();
  const [isCreateRoomModalOpened, setIsCreateRoomModalOpened] = useState(false);
  const [rooms, setRooms] = useState<Rooms>({});
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
      const data = snapshot.val() ?? {};
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
      <Box
        as={"main"}
        h={"calc(100% - 128px)"}
        overflowY={"scroll"}
        sx={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          ["::-webkit-scrollbar"]: {
            display: "none",
          },
        }}
      >
        {!isUserLoading && isRoomsLoading && (
          <Flex direction={"column"} gap={4}>
            {[...Array(12)].map(() => (
              <Skeleton borderRadius={"md"} height="80px" />
            ))}
          </Flex>
        )}
        {!isRoomsLoading && Object.keys(rooms).length === 0 ? (
          <div>empty</div>
        ) : (
          <Flex direction={"column"} gap={4}>
            {Object.entries(rooms).map(([roomId, room]) => (
              <Fade key={roomId} in={true}>
                <Box w={"full"} p={4} bg={"gray.100"} boxShadow={"sm"} borderRadius={"md"}>
                  <Text noOfLines={1} fontSize={"lg"} color={"gray.900"} fontWeight={"medium"}>
                    {room.name}
                  </Text>
                  <Text noOfLines={1} fontSize={"sm"} color={"gray.600"}>
                    {room.creatorNickname}
                  </Text>
                </Box>
              </Fade>
            ))}
          </Flex>
        )}
      </Box>
      <Box as={"footer"} py={3}>
        <Button w={"full"} colorScheme={"teal"} onClick={handleCreateRoomButtonClick}>
          Create Room
        </Button>
      </Box>
      <CreateRoomModal isOpen={isCreateRoomModalOpened} onClose={handleCreateRoomModalClose} />
    </>
  );
};

export default Lobby;

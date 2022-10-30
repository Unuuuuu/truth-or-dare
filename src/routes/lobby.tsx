import { Button, Box, useToast, Skeleton, Stack, Fade } from "@chakra-ui/react";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateRoomModal from "../components/CreateRoomModal";
import { useAppSelector } from "../redux/hooks";
import { database } from "../utils/firebase";

const Lobby: React.FC = () => {
  const { isLoading: isUserLoading, isSignedIn } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const toast = useToast();
  const [isCreateRoomModalOpened, setIsCreateRoomModalOpened] = useState(false);
  const [rooms, setRooms] = useState<{ [index: string]: { creatorId: string; name: string } }>({});
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
        {isRoomsLoading && (
          <Stack>
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </Stack>
        )}
        {!isRoomsLoading && Object.keys(rooms).length === 0 ? (
          <div>empty</div>
        ) : (
          Object.entries(rooms).map(([roomId, room]) => (
            <Fade key={roomId} in={true}>
              {room.name}
            </Fade>
          ))
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

import { Button, Box, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

const Lobby: React.FC = () => {
  const { isInitialLoadCompleted, isSignedIn } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (isInitialLoadCompleted && !isSignedIn) {
      navigate("/");
      toast({
        title: "You need to enter nickname.",
        status: "warning",
        position: "top",
        duration: 1500,
      });
    }
  }, [isInitialLoadCompleted, isSignedIn]);

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
      ></Box>
      <Box as={"footer"} py={3}>
        <Button w={"full"} colorScheme={"teal"}>
          Create
        </Button>
      </Box>
    </>
  );
};

export default Lobby;

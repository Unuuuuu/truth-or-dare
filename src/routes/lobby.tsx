import { Button, Box } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

const Lobby: React.FC = () => {
  const { isInitialLoadCompleted, isSignedIn } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialLoadCompleted && !isSignedIn) {
      navigate("/");
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

import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";

interface MainProps extends BoxProps {}

const Main: React.FC<MainProps> = (props) => {
  return (
    <Box
      as={"main"}
      overflowY={"scroll"}
      sx={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        ["::-webkit-scrollbar"]: {
          display: "none",
        },
      }}
      {...props}
    />
  );
};

export default Main;

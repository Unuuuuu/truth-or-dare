import { Grid, GridItem, Text } from "@chakra-ui/react";
import React from "react";

const Logo: React.FC = () => {
  return (
    <Grid mb={4} templateRows="repeat(2, 1fr)" templateColumns="repeat(2, 1fr)" columnGap={1}>
      <GridItem display={"flex"} alignItems={"flex-end"} justifyContent={"flex-end"}>
        <Text userSelect={"none"} fontWeight={700} fontFamily={"Cinzel"} fontSize={"4xl"} lineHeight={1}>
          TRUTH
        </Text>
      </GridItem>
      <GridItem rowStart={2} display={"flex"} alignItems={"flex-start"} justifyContent={"flex-end"}>
        <Text
          userSelect={"none"}
          fontWeight={700}
          fontFamily={"Cinzel"}
          fontSize={"1xl"}
          lineHeight={1}
          letterSpacing={2}
        >
          OR
        </Text>
      </GridItem>
      <GridItem rowStart={2} colStart={2} display={"flex"} alignItems={"flex-start"} justifyContent={"flex-start"}>
        <Text
          userSelect={"none"}
          fontWeight={700}
          fontFamily={"Cinzel"}
          fontSize={"4xl"}
          lineHeight={1}
          transform={"auto"}
          translateY={"-2px"}
        >
          DARE
        </Text>
      </GridItem>
    </Grid>
  );
};

export default Logo;

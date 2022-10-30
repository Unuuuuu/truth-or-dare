import { Button, Fade, Flex, Heading, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

const Header = () => {
  const { isSignedIn, nickname } = useAppSelector((state) => state.user);

  return (
    <Flex as={"header"} h={"64px"} align={"center"} justify={"space-between"}>
      <Heading noOfLines={1} fontFamily={"Cinzel"} userSelect={"none"}>
        Truth or Dare
      </Heading>
      {isSignedIn && (
        <Flex gap={2}>
          <Menu placement={"bottom-end"} offset={[0, 10]} autoSelect={false}>
            <Fade in={true}>
              <MenuButton as={Button} size={"xs"}>
                {nickname}
              </MenuButton>
            </Fade>
            <MenuList>
              <Link to={"/"}>
                <MenuItem>Change nickname</MenuItem>
              </Link>
            </MenuList>
          </Menu>
        </Flex>
      )}
    </Flex>
  );
};

export default Header;

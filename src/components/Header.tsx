import { Button, Flex, Heading, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

const Header = () => {
  const user = useAppSelector((state) => state.user);

  return (
    <Flex as={"header"} h={"64px"} align={"center"} justify={"space-between"}>
      <Heading fontFamily={"Cinzel"}>Truth or Dare</Heading>
      {user.isSignedIn && (
        <Flex gap={2}>
          <Menu placement={"bottom-end"} offset={[0, 12]} autoSelect={false}>
            <MenuButton as={Button} size={"xs"}>
              {user.nickname}
            </MenuButton>
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

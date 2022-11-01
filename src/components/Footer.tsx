import { Flex, FlexProps } from "@chakra-ui/react";
import React from "react";

interface FooterProps extends FlexProps {}

const Footer: React.FC<FooterProps> = (props) => {
  return <Flex as={"footer"} h={16} align={"center"} {...props} />;
};

export default Footer;

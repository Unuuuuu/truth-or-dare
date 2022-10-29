import { Container } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const LayoutWithHeader = () => {
  return (
    <Container h={"full"} maxW={"container.sm"}>
      <Header />
      <Outlet />
    </Container>
  );
};

export default LayoutWithHeader;

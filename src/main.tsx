import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import "./utils/firebase";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Home from "./routes/home";
import { extendTheme } from "@chakra-ui/react";
import "./index.css";
import Lobby from "./routes/lobby";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";
import LayoutWithHeader from "./components/LayoutWithHeader";
import Room from "./routes/room";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    muted: "var(--chakra-colors-gray-300)",
    bg: {
      canvas: "var(--chakra-colors-gray-900)",
      surface: "var(--chakra-colors-gray-800)",
    },
  },
  shadows: {
    dark: "0px 2px 4px rgba(11, 12, 17, 0.9)",
  },
  styles: {
    global: {
      html: {
        height: "full",
      },
      body: {
        bg: "var(--chakra-colors-bg-canvas)",
      },
    },
  },
  fonts: {
    body: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;',
  },
});

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        element: <LayoutWithHeader />,
        children: [
          {
            path: "lobby",
            element: <Lobby />,
          },
          {
            path: "rooms/:roomId",
            element: <Room />,
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to={"/"} replace />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme} resetCSS>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ChakraProvider>
  </React.StrictMode>
);

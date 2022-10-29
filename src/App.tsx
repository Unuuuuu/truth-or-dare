import { Center, Portal, Spinner } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { completeInitialLoad, signIn } from "./redux/userSlice";
import { auth } from "./utils/firebase";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const isInitialLoadCompleted = useAppSelector((state) => state.user.isInitialLoadCompleted);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!isInitialLoadCompleted) {
        dispatch(completeInitialLoad());
      }

      if (user && user.displayName) {
        // When user is signed in
        dispatch(signIn({ id: user.uid, nickname: user.displayName }));
      } else {
        // When user is signed out
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <Outlet />
      {!isInitialLoadCompleted && (
        <Portal>
          <Center pos={"absolute"} inset={"0px"} bg={"blackAlpha.300"}>
            <Spinner size={"xl"} thickness={"4px"} />
          </Center>
        </Portal>
      )}
    </>
  );
};

export default App;

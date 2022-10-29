import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { FormControl, Input, Button, useToast, Flex, Container } from "@chakra-ui/react";
import { signInAnonymously, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { signIn } from "../redux/userSlice";
import { useEffect } from "react";

interface FieldValues {
  nickname: string;
}

const Home: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FieldValues>();
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const nickname = useAppSelector((state) => state.user.nickname);

  useEffect(() => {
    if (nickname) {
      setValue("nickname", nickname);
    }
  }, [nickname]);

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    const { nickname } = values;
    console.log(nickname);
    await signInAnonymously(auth)
      .then(({ user }) => {
        toast({
          title: `Welcome, ${nickname}!`,
          status: "success",
          position: "top",
          duration: 3000,
        });
        updateProfile(user, {
          displayName: nickname,
        });
        dispatch(signIn({ id: user.uid, nickname }));
        navigate("/lobby");
      })
      .catch(() => {
        toast({
          title: "Something went wrong.",
          status: "error",
          position: "top",
          duration: 3000,
        });
      });
  };

  const onError: SubmitErrorHandler<FieldValues> = (errors) => {
    toast({
      title: errors.nickname?.message,
      status: "error",
      position: "top",
      duration: 3000,
    });
  };

  return (
    <Container h={"full"} maxW={"container.sm"}>
      <Flex
        as={"main"}
        h={"full"}
        align={"center"}
        sx={{
          form: {
            w: "full",
          },
        }}
      >
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <FormControl mb={4} isInvalid={Object.keys(errors).length > 0}>
            <Input
              placeholder="Enter nickname"
              {...register("nickname", {
                required: "Nickname is required",
              })}
            />
          </FormControl>
          <Button mb={14} colorScheme={"teal"} isLoading={isSubmitting} type="submit" w={"full"}>
            Enter
          </Button>
        </form>
      </Flex>
    </Container>
  );
};

export default Home;

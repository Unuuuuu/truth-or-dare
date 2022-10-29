import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { FormControl, Input, Button, useToast, Flex, Container, Grid, GridItem, Text } from "@chakra-ui/react";
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
        direction={"column"}
        justify={"center"}
        align={"center"}
        sx={{
          form: {
            w: "320px",
          },
        }}
      >
        <Grid mb={4} templateRows="repeat(2, 1fr)" templateColumns="repeat(2, 1fr)" columnGap={1}>
          <GridItem display={"flex"} alignItems={"flex-end"} justifyContent={"flex-end"}>
            <Text fontWeight={700} fontFamily={"Cinzel"} fontSize={"4xl"} lineHeight={1}>
              TRUTH
            </Text>
          </GridItem>
          <GridItem rowStart={2} display={"flex"} alignItems={"flex-start"} justifyContent={"flex-end"}>
            <Text fontWeight={700} fontFamily={"Cinzel"} fontSize={"1xl"} lineHeight={1} letterSpacing={2}>
              OR
            </Text>
          </GridItem>
          <GridItem rowStart={2} colStart={2} display={"flex"} alignItems={"flex-start"} justifyContent={"flex-start"}>
            <Text
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
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <FormControl mb={4} isInvalid={Object.keys(errors).length > 0}>
            <Input
              placeholder="Nickname"
              {...register("nickname", {
                required: "Nickname is required",
              })}
            />
          </FormControl>
          <Button mb={"144px"} colorScheme={"teal"} isLoading={isSubmitting} type="submit" w={"full"}>
            Enter
          </Button>
        </form>
      </Flex>
    </Container>
  );
};

export default Home;

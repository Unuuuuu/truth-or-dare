import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  useToast,
} from "@chakra-ui/react";
import { push, ref, set } from "firebase/database";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { database } from "../utils/firebase";

interface CreateRoomModalProps extends Pick<ModalProps, "isOpen" | "onClose"> {}

interface FieldValues {
  name: string;
}

const FORM_ID = "create-room-form";

const CreateRoomModal: React.FC<CreateRoomModalProps> = (props) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FieldValues>();
  const { id: userId, nickname: userNickname } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const toast = useToast();

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    const { name } = values;

    const roomsRef = ref(database, "rooms");
    const newRoomRef = push(roomsRef);
    await set(newRoomRef, {
      creatorId: userId,
      creatorNickname: userNickname,
      name,
      users: {
        [userId!]: {
          nickname: userNickname,
        },
      },
    })
      .then(() => {
        navigate(`/rooms/${newRoomRef.key}`);
      })
      .catch(() => {
        toast({
          title: "Something went wrong",
          status: "error",
          position: "top",
          duration: 1500,
        });
      });
  };

  return (
    <Modal {...props} isCentered size={"xs"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Room</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)}>
            <FormControl mb={4} isInvalid={errors.name !== undefined}>
              <FormLabel>Name</FormLabel>
              <Input
                {...register("name", {
                  required: "Name is required",
                })}
              />
              {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button w={"full"} colorScheme="blue" form={FORM_ID} type="submit" isLoading={isSubmitting}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateRoomModal;

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
} from "@chakra-ui/react";
import { push, ref, set } from "firebase/database";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppSelector } from "../redux/hooks";
import { database } from "../utils/firebase";

interface CreateRoomModalProps extends Pick<ModalProps, "isOpen" | "onClose"> {}

interface FieldValues {
  name: string;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = (props) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FieldValues>();
  const { id: userId, nickname: userNickname } = useAppSelector((state) => state.user);

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    const { name } = values;

    const roomsRef = ref(database, "rooms");
    const newRoomRef = push(roomsRef);
    await set(newRoomRef, {
      creatorId: userId,
      creatorNickname: userNickname,
      name,
    });
  };

  return (
    <Modal {...props} isCentered size={"xs"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Room</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="create-room-form" onSubmit={handleSubmit(onSubmit)}>
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
          <Button w={"full"} colorScheme="blue" form="create-room-form" type="submit" isLoading={isSubmitting}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateRoomModal;

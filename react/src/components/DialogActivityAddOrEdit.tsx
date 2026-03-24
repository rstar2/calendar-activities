import React, { useCallback, useEffect } from "react";
import { useSetState } from "react-use";
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
  NumberInput,
  NumberInputField,
  Select,
} from "@chakra-ui/react";

import { z } from "zod";
import type { Activity } from "../types/Activity";

const activityTypes = [
  { value: "climbing", label: "🧗 climbing" },
  { value: "horse-riding", label: "🏇 horse-riding" },
  { value: "dance", label: "💃 dance" },
  { value: "karate", label: "🥷 karate" },
  { value: "swimming", label: "🏊‍♀️ swimming" },
  { value: "music", label: "🎵 music" },
] as const;

const nameSchema = z
  .string()
  .min(1, { message: "Name is required" })
  .max(50, { message: "Name must be 50 characters or less" });

const positiveNumberSchema = z
  .number()
  .positive({ message: "Must be a positive number" })
  .or(z.literal(undefined));

const safeParse = (schema: z.Schema, value: unknown): string => {
  const result = schema.safeParse(value);
  if (result.success) return "";
  return result.error.errors[0]?.message || "Invalid value";
};

interface FormState {
  name: string;
  type: string;
  total: string;
  cycle: string;
  nameError: string;
  totalError: string;
  cycleError: string;
}

interface DialogActivityAddOrEditProps {
  open: boolean;
  onClose: (value?: Partial<Activity>) => void;
  activity?: Activity;
}

function DialogActivityAddOrEdit({
  open,
  onClose,
  activity,
}: DialogActivityAddOrEditProps) {
  const [localState, setLocalState] = useSetState<FormState>({
    name: "",
    type: "climbing",
    total: "",
    cycle: "",
    nameError: "",
    totalError: "",
    cycleError: "",
  });

  // Populate form when activity changes
  useEffect(() => {
    if (activity) {
      setLocalState({
        name: activity.name,
        type: activity.type,
        total: activity.total?.toString() || "",
        cycle: activity.cycle?.toString() || "",
        nameError: "",
        totalError: "",
        cycleError: "",
      });
    } else {
      setLocalState({
        name: "",
        type: "climbing",
        total: "",
        cycle: "",
        nameError: "",
        totalError: "",
        cycleError: "",
      });
    }
  }, [activity, open, setLocalState]);

  const handleNameChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        const name = e.target.value;
        setLocalState({
          name,
          nameError: safeParse(nameSchema, name),
        });
      },
      [setLocalState],
    );

  const handleTypeChange: React.ChangeEventHandler<HTMLSelectElement> =
    useCallback(
      (e) => {
        setLocalState({ type: e.target.value });
      },
      [setLocalState],
    );

  const handleTotalChange = useCallback(
    (valueAsString: string, valueAsNumber: number) => {
      setLocalState({
        total: valueAsString,
        totalError: safeParse(positiveNumberSchema, valueAsNumber),
      });
    },
    [setLocalState],
  );

  const handleCycleChange = useCallback(
    (valueAsString: string, valueAsNumber: number) => {
      setLocalState({
        cycle: valueAsString,
        cycleError: safeParse(positiveNumberSchema, valueAsNumber),
      });
    },
    [setLocalState],
  );

  const handleClose = () => {
    onClose();
  };

  const handleOk = () => {
    // Validate all fields
    const nameError = safeParse(nameSchema, localState.name);
    const totalError = safeParse(
      positiveNumberSchema,
      localState.total ? Number(localState.total) : undefined,
    );
    const cycleError = safeParse(
      positiveNumberSchema,
      localState.cycle ? Number(localState.cycle) : undefined,
    );

    if (nameError || totalError || cycleError) {
      setLocalState({ nameError, totalError, cycleError });
      return;
    }

    onClose({
      name: localState.name,
      type: localState.type,
      total: localState.total ? Number(localState.total) : undefined,
      cycle: localState.cycle ? Number(localState.cycle) : undefined,
    });
  };

  const hasErrors =
    !!localState.nameError ||
    !!localState.totalError ||
    !!localState.cycleError;

  return (
    <Modal
      onClose={onClose}
      isOpen={open}
      closeOnOverlayClick={false}
      closeOnEsc
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{activity ? "Edit Activity" : "Add Activity"}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormControl isRequired isInvalid={!!localState.nameError}>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Activity name"
              value={localState.name}
              onChange={handleNameChange}
            />
            <FormErrorMessage>{localState.nameError}</FormErrorMessage>
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>Type</FormLabel>
            <Select value={localState.type} onChange={handleTypeChange}>
              {activityTypes.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mt={4} isInvalid={!!localState.totalError}>
            <FormLabel>Total (optional)</FormLabel>
            <NumberInput
              value={localState.total}
              onChange={handleTotalChange}
              min={1}
            >
              <NumberInputField placeholder="Total count" />
            </NumberInput>
            <FormErrorMessage>{localState.totalError}</FormErrorMessage>
          </FormControl>

          <FormControl mt={4} isInvalid={!!localState.cycleError}>
            <FormLabel>Cycle (optional)</FormLabel>
            <NumberInput
              value={localState.cycle}
              onChange={handleCycleChange}
              min={1}
            >
              <NumberInputField placeholder="Cycle count" />
            </NumberInput>
            <FormErrorMessage>{localState.cycleError}</FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleOk}
            ml={6}
            variant="solid"
            isDisabled={hasErrors || !localState.name}
          >
            {activity ? "Save" : "Add"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DialogActivityAddOrEdit;

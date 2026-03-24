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
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";

import { z } from "zod";
import type { Activity } from "../types/Activity";

// Type for dialog output - allows both current and left as optional
// because we may be setting just one of them
type ActivityInput = {
  name?: string;
  type?: string;
  total?: number;
  cycle?: number;
  current?: number;
  left?: number;
};

const activityTypes = [
  { value: "climbing", label: "🧗 climbing" },
  { value: "horse-riding", label: "🏇 horse-riding" },
  { value: "dance", label: "💃 dance" },
  { value: "karate", label: "🥷 karate" },
  { value: "swimming", label: "🏊‍♀️ swimming" },
  { value: "music", label: "🎵 music" },
] as const;

type CounterType = "current" | "left" | null;

const nameSchema = z
  .string()
  .min(1, { message: "Name is required" })
  .max(50, { message: "Name must be 50 characters or less" });

const nonNegativeNumberSchema = z
  .number()
  .nonnegative({ message: "Must be zero or positive" })
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
  counterType: CounterType;
  current: string;
  left: string;
  nameError: string;
  totalError: string;
  cycleError: string;
  counterError: string;
}

interface DialogActivityAddOrEditProps {
  open: boolean;
  disabled: boolean;
  onClose: (value?: ActivityInput) => void;
  activity?: Activity;
}

export default function DialogActivityAddOrEdit({
  open,
  disabled,
  onClose,
  activity,
}: DialogActivityAddOrEditProps) {
  const [localState, setLocalState] = useSetState<FormState>({
    name: "",
    type: "climbing",
    total: "",
    cycle: "",
    counterType: null,
    current: "",
    left: "",
    nameError: "",
    totalError: "",
    cycleError: "",
    counterError: "",
  });

  // Populate form when activity changes
  useEffect(() => {
    if (activity) {
      // Determine counter type from existing activity
      const counterType: CounterType = "left" in activity ? "left" : "current";

      setLocalState({
        name: activity.name,
        type: activity.type,
        total: activity.total?.toString() || "",
        cycle: activity.cycle?.toString() || "",
        counterType,
        current: "current" in activity ? activity.current.toString() : "",
        left: "left" in activity ? activity.left.toString() : "",
        nameError: "",
        totalError: "",
        cycleError: "",
        counterError: "",
      });
    } else {
      setLocalState({
        name: "",
        type: "climbing",
        total: "",
        cycle: "",
        counterType: null,
        current: "",
        left: "",
        nameError: "",
        totalError: "",
        cycleError: "",
        counterError: "",
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
        totalError: safeParse(nonNegativeNumberSchema, valueAsNumber),
      });
    },
    [setLocalState],
  );

  const handleCycleChange = useCallback(
    (valueAsString: string, valueAsNumber: number) => {
      setLocalState({
        cycle: valueAsString,
        cycleError: safeParse(nonNegativeNumberSchema, valueAsNumber),
      });
    },
    [setLocalState],
  );

  const handleCounterTypeChange = useCallback(
    (value: string) => {
      setLocalState({
        counterType: value as CounterType,
        current: "",
        left: "",
        counterError: "",
      });
    },
    [setLocalState],
  );

  const handleCurrentChange = useCallback(
    (valueAsString: string, valueAsNumber: number) => {
      setLocalState({
        current: valueAsString,
        counterError: safeParse(
          nonNegativeNumberSchema,
          isNaN(valueAsNumber) ? undefined : valueAsNumber,
        ),
      });
    },
    [setLocalState],
  );

  const handleLeftChange = useCallback(
    (valueAsString: string, valueAsNumber: number) => {
      setLocalState({
        left: valueAsString,
        counterError: safeParse(
          nonNegativeNumberSchema,
          isNaN(valueAsNumber) ? undefined : valueAsNumber,
        ),
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
      nonNegativeNumberSchema,
      localState.total ? Number(localState.total) : undefined,
    );
    const cycleError = safeParse(
      nonNegativeNumberSchema,
      localState.cycle ? Number(localState.cycle) : undefined,
    );

    // Validate counter field based on counter type
    let counterError = "";
    if (!activity) {
      // New activity - must have counter type selected and value
      if (!localState.counterType) {
        counterError = "Please select a counter type";
      } else {
        const counterValue =
          localState.counterType === "current"
            ? localState.current
            : localState.left;
        counterError = safeParse(
          nonNegativeNumberSchema,
          counterValue ? Number(counterValue) : undefined,
        );
      }
    } else {
      // Editing - only validate if counter type is being set
      const counterValue =
        localState.counterType === "current"
          ? localState.current
          : localState.left;
      counterError = safeParse(
        nonNegativeNumberSchema,
        counterValue ? Number(counterValue) : undefined,
      );
    }

    if (nameError || totalError || cycleError || counterError) {
      setLocalState({ nameError, totalError, cycleError, counterError });
      return;
    }

    const result: ActivityInput = {
      name: localState.name,
      type: localState.type,
      total: localState.total ? Number(localState.total) : undefined,
      cycle: localState.cycle ? Number(localState.cycle) : undefined,
    };

    // Add counter value if provided
    if (localState.counterType === "current" && localState.current) {
      result.current = Number(localState.current);
    } else if (localState.counterType === "left" && localState.left) {
      result.left = Number(localState.left);
    }

    onClose(result);
  };

  const hasErrors =
    !!localState.nameError ||
    !!localState.totalError ||
    !!localState.cycleError ||
    !!localState.counterError;

  // For editing: check if counter can be changed (only if currently undefined)
  const canEditCounter =
    !activity ||
    (localState.counterType === "current" && !("current" in activity)) ||
    (localState.counterType === "left" && !("left" in activity));

  // Show counter type selector only for new activities
  const showCounterTypeSelector = !activity;

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

          {localState.counterType === "current" && (
            <FormControl
              mt={4}
              isRequired={showCounterTypeSelector}
              isInvalid={!!localState.counterError}
            >
              <FormLabel>Current</FormLabel>
              <NumberInput
                value={localState.current}
                onChange={handleCurrentChange}
                min={0}
              >
                <NumberInputField placeholder="Current count" />
              </NumberInput>
              <FormErrorMessage>{localState.counterError}</FormErrorMessage>
            </FormControl>
          )}

          {localState.counterType === "left" && (
            <FormControl
              mt={4}
              isRequired={showCounterTypeSelector}
              isInvalid={!!localState.counterError}
            >
              <FormLabel>Left</FormLabel>
              <NumberInput
                value={localState.left}
                onChange={handleLeftChange}
                min={0}
              >
                <NumberInputField placeholder="Left count" />
              </NumberInput>
              <FormErrorMessage>{localState.counterError}</FormErrorMessage>
            </FormControl>
          )}
          {showCounterTypeSelector ? (
            <FormControl
              mt={4}
              isRequired
              isInvalid={!!localState.counterError}
            >
              <RadioGroup
                value={localState.counterType || ""}
                onChange={handleCounterTypeChange}
              >
                <Stack direction="row">
                  <Radio value="current">Current (counts up)</Radio>
                  <Radio value="left">Left (counts down)</Radio>
                </Stack>
              </RadioGroup>
              <FormErrorMessage>{localState.counterError}</FormErrorMessage>
            </FormControl>
          ) : (
            <FormControl mt={4}>
              <Text color="gray.500">
                {localState.counterType === "current"
                  ? "Current (counts up)"
                  : "Left (counts down)"}
                {" - "}
                {canEditCounter ? "can be set" : "cannot be changed"}
              </Text>
            </FormControl>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleOk}
            ml={6}
            variant="solid"
            isDisabled={disabled || hasErrors || !localState.name}
          >
            {activity ? "Save" : "Add"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

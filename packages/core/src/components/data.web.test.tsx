/* oxlint-disable react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- smoke tests */
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SuperStylingProvider, defaultSystem } from "../";
import {
  Table,
  TableContainer,
  NumberInput,
  PinInput,
  Slider,
  RangeSlider,
  Progress,
  CircularProgress,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stat,
  Editable,
  Text,
} from "./index";

function wrap(ui: React.ReactNode) {
  return render(<SuperStylingProvider system={defaultSystem}>{ui}</SuperStylingProvider>);
}

describe("Phase 13 data & forms", () => {
  it("renders Table compound with caption + header + body", () => {
    const { container } = wrap(
      <TableContainer>
        <Table>
          <Table.Caption>Users</Table.Caption>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th isNumeric>Age</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>Ada</Table.Td>
              <Table.Td isNumeric>36</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Grace</Table.Td>
              <Table.Td isNumeric>85</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </TableContainer>,
    );
    expect(container.textContent).toContain("Users");
    expect(container.textContent).toContain("Name");
    expect(container.textContent).toContain("Ada");
    expect(container.textContent).toContain("Grace");
  });

  it("renders NumberInput with field + steppers", () => {
    const { container } = wrap(
      <NumberInput defaultValue={5} min={0} max={10} step={1}>
        <NumberInput.Field />
        <NumberInput.Stepper>
          <NumberInput.IncrementStepper />
          <NumberInput.DecrementStepper />
        </NumberInput.Stepper>
      </NumberInput>,
    );
    expect(container.querySelector("input")).toBeTruthy();
    expect(container.querySelector('[aria-label="Increment"]')).toBeTruthy();
    expect(container.querySelector('[aria-label="Decrement"]')).toBeTruthy();
  });

  it("renders PinInput with N fields", () => {
    const { container } = wrap(
      <PinInput length={4}>
        <PinInput.Field />
        <PinInput.Field />
        <PinInput.Field />
        <PinInput.Field />
      </PinInput>,
    );
    expect(container.querySelectorAll("input").length).toBe(4);
  });

  it("renders Slider compound", () => {
    const { container } = wrap(
      <Slider defaultValue={[50]}>
        <Slider.Track>
          <Slider.FilledTrack />
        </Slider.Track>
        <Slider.Thumb index={0} />
      </Slider>,
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("renders RangeSlider compound with two thumbs", () => {
    const { container } = wrap(
      <RangeSlider defaultValue={[20, 80]}>
        <RangeSlider.Track>
          <RangeSlider.FilledTrack />
        </RangeSlider.Track>
        <RangeSlider.Thumb index={0} />
        <RangeSlider.Thumb index={1} />
      </RangeSlider>,
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("renders Progress + CircularProgress", () => {
    const { container } = wrap(
      <>
        <Progress value={60} />
        <CircularProgress value={40}>
          <CircularProgress.Label>40%</CircularProgress.Label>
        </CircularProgress>
      </>,
    );
    expect(container.textContent).toContain("40%");
  });

  it("renders Skeleton / SkeletonCircle / SkeletonText placeholders", () => {
    const { container } = wrap(
      <>
        <Skeleton height={20} width={200} />
        <SkeletonCircle size={40} />
        <SkeletonText noOfLines={3} />
      </>,
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("Skeleton reveals children when isLoaded", () => {
    const { container } = wrap(
      <Skeleton isLoaded>
        <Text>Loaded</Text>
      </Skeleton>,
    );
    expect(container.textContent).toContain("Loaded");
  });

  it("renders Stat compound with arrow", () => {
    const { container } = wrap(
      <Stat.Group>
        <Stat>
          <Stat.Label>MRR</Stat.Label>
          <Stat.Number>$12,340</Stat.Number>
          <Stat.HelpText>
            <Stat.Arrow type="increase" />
            +12%
          </Stat.HelpText>
        </Stat>
        <Stat>
          <Stat.Label>Churn</Stat.Label>
          <Stat.Number>1.4%</Stat.Number>
          <Stat.HelpText>
            <Stat.Arrow type="decrease" />
            -0.3%
          </Stat.HelpText>
        </Stat>
      </Stat.Group>,
    );
    expect(container.textContent).toContain("MRR");
    expect(container.textContent).toContain("$12,340");
    expect(container.textContent).toContain("▲");
    expect(container.textContent).toContain("▼");
  });

  it("renders Editable.Preview when not editing", () => {
    const { container } = wrap(
      <Editable defaultValue="Untitled">
        <Editable.Preview />
        <Editable.Input />
      </Editable>,
    );
    expect(container.textContent).toContain("Untitled");
  });

  it("renders Editable.Input when startWithEditView", () => {
    const { container } = wrap(
      <Editable defaultValue="Hello" startWithEditView>
        <Editable.Preview />
        <Editable.Input />
      </Editable>,
    );
    expect(container.querySelector("input")).toBeTruthy();
  });
});

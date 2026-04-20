/* oxlint-disable react-perf/jsx-no-new-function-as-prop, react-perf/jsx-no-jsx-as-prop, unicorn/consistent-function-scoping -- perf rules are noise in tests */
import { describe, expect, test } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { SuperStylingProvider } from "../SuperStylingProvider";
import { Checkbox, FormControl, Input, Radio, RadioGroup, Switch, Textarea } from "./index";
import type { ReactNode } from "react";

function wrap(children: ReactNode) {
  return render(<SuperStylingProvider>{children}</SuperStylingProvider>);
}

describe("FormControl", () => {
  test("renders Label, HelperText, ErrorMessage", () => {
    const { getByText, queryByText } = wrap(
      <FormControl>
        <FormControl.Label>Email</FormControl.Label>
        <FormControl.HelperText>We never share this.</FormControl.HelperText>
        <FormControl.ErrorMessage>Required</FormControl.ErrorMessage>
      </FormControl>,
    );
    expect(getByText("Email")).toBeDefined();
    expect(getByText("We never share this.")).toBeDefined();
    // Error hidden when not invalid
    expect(queryByText("Required")).toBeNull();
  });

  test("ErrorMessage renders only when isInvalid", () => {
    const { getByText } = wrap(
      <FormControl isInvalid>
        <FormControl.ErrorMessage>Required</FormControl.ErrorMessage>
      </FormControl>,
    );
    expect(getByText("Required")).toBeDefined();
  });

  test("Required adds asterisk to label", () => {
    const { getByText } = wrap(
      <FormControl isRequired>
        <FormControl.Label>Email</FormControl.Label>
      </FormControl>,
    );
    expect(getByText("*")).toBeDefined();
  });
});

describe("Input", () => {
  test("renders with placeholder", () => {
    const { container } = wrap(<Input placeholder="Name" />);
    const input = container.querySelector("input");
    expect(input?.getAttribute("placeholder")).toBe("Name");
  });

  test("calls onChangeText when user types", () => {
    let captured = "";
    const { container } = wrap(<Input onChangeText={(v) => (captured = v)} placeholder="x" />);
    const input = container.querySelector("input")!;
    fireEvent.change(input, { target: { value: "hello" } });
    expect(captured).toBe("hello");
  });

  test("picks up FormControl isInvalid via aria-invalid", () => {
    const { container } = wrap(
      <FormControl isInvalid>
        <Input placeholder="x" />
      </FormControl>,
    );
    const input = container.querySelector("input");
    expect(input?.getAttribute("aria-invalid")).toBe("true");
  });

  test("picks up FormControl id for input element", () => {
    const { container } = wrap(
      <FormControl id="my-field">
        <Input placeholder="x" />
      </FormControl>,
    );
    const input = container.querySelector("input");
    expect(input?.getAttribute("id")).toBe("my-field");
  });
});

describe("Textarea", () => {
  test("renders textarea element", () => {
    const { container } = wrap(<Textarea placeholder="Bio" rows={4} />);
    const el = container.querySelector("textarea");
    expect(el).not.toBeNull();
    expect(el?.getAttribute("placeholder")).toBe("Bio");
  });
});

describe("Checkbox", () => {
  test("renders label", () => {
    const { getByText } = wrap(<Checkbox>Agree</Checkbox>);
    expect(getByText("Agree")).toBeDefined();
  });

  test("calls onChange when clicked", () => {
    let val: boolean | null = null;
    const { container } = wrap(<Checkbox onChange={(v) => (val = v)}>Agree</Checkbox>);
    const btn = container.querySelector("button");
    if (btn) fireEvent.click(btn);
    expect(val).toBe(true);
  });
});

describe("Switch", () => {
  test("renders and toggles", () => {
    let val: boolean | null = null;
    const { container } = wrap(<Switch onChange={(v) => (val = v)}>Dark mode</Switch>);
    const btn = container.querySelector("button");
    if (btn) fireEvent.click(btn);
    expect(val).toBe(true);
  });
});

describe("RadioGroup + Radio", () => {
  test("renders radio items and propagates selection", () => {
    let val = "";
    const { getByText, container } = wrap(
      <RadioGroup onChange={(v) => (val = v)} defaultValue="a">
        <Radio value="a">A</Radio>
        <Radio value="b">B</Radio>
      </RadioGroup>,
    );
    expect(getByText("A")).toBeDefined();
    expect(getByText("B")).toBeDefined();
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBe(2);
    fireEvent.click(buttons[1]);
    expect(val).toBe("b");
  });
});

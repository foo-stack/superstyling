/* oxlint-disable react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- smoke tests */
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SuperStylingProvider, defaultSystem } from "../";
import {
  Tabs,
  Accordion,
  Breadcrumb,
  Stepper,
  useSteps,
  Fade,
  ScaleFade,
  Slide,
  Collapse,
  Text,
  Box,
} from "./index";

function wrap(ui: React.ReactNode) {
  return render(<SuperStylingProvider system={defaultSystem}>{ui}</SuperStylingProvider>);
}

describe("Phase 12 navigation & disclosure", () => {
  it("renders Tabs compound", () => {
    const { container } = wrap(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">Tab A</Tabs.Tab>
          <Tabs.Tab value="b">Tab B</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel value="a">
            <Text>Panel A</Text>
          </Tabs.Panel>
          <Tabs.Panel value="b">
            <Text>Panel B</Text>
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>,
    );
    expect(container.textContent).toContain("Tab A");
    expect(container.textContent).toContain("Tab B");
  });

  it("renders Accordion with items", () => {
    const { container } = wrap(
      <Accordion defaultValue="q1">
        <Accordion.Item value="q1">
          <Accordion.Button>
            <Text>Question 1</Text>
            <Accordion.Icon />
          </Accordion.Button>
          <Accordion.Panel>
            <Text>Answer 1</Text>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>,
    );
    expect(container.textContent).toContain("Question 1");
  });

  it("renders Breadcrumb with auto separators", () => {
    const { container } = wrap(
      <Breadcrumb>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item isCurrentPage>
          <Breadcrumb.Link href="#">Current</Breadcrumb.Link>
        </Breadcrumb.Item>
      </Breadcrumb>,
    );
    expect(container.textContent).toContain("Home");
    expect(container.textContent).toContain("Docs");
    expect(container.textContent).toContain("Current");
    expect(container.textContent).toContain("/");
  });

  it("renders Stepper with multiple steps", () => {
    const { container } = wrap(
      <Stepper index={1}>
        <Stepper.Step>
          <Stepper.Indicator>
            <Stepper.Number />
          </Stepper.Indicator>
          <Box>
            <Stepper.Title>Account</Stepper.Title>
          </Box>
          <Stepper.Separator />
        </Stepper.Step>
        <Stepper.Step>
          <Stepper.Indicator>
            <Stepper.Number />
          </Stepper.Indicator>
          <Box>
            <Stepper.Title>Profile</Stepper.Title>
          </Box>
          <Stepper.Separator />
        </Stepper.Step>
        <Stepper.Step>
          <Stepper.Indicator>
            <Stepper.Number />
          </Stepper.Indicator>
          <Box>
            <Stepper.Title>Confirm</Stepper.Title>
          </Box>
        </Stepper.Step>
      </Stepper>,
    );
    expect(container.textContent).toContain("Account");
    expect(container.textContent).toContain("Profile");
    expect(container.textContent).toContain("Confirm");
  });

  it("useSteps returns goToNext / goToPrevious / reset helpers", () => {
    let steps: ReturnType<typeof useSteps> | undefined;
    function Capture() {
      steps = useSteps({ count: 3 });
      return null;
    }
    wrap(<Capture />);
    expect(steps!.activeStep).toBe(0);
    expect(typeof steps!.goToNext).toBe("function");
    expect(typeof steps!.goToPrevious).toBe("function");
    expect(typeof steps!.reset).toBe("function");
    expect(steps!.isActiveStep(0)).toBe(true);
    expect(steps!.isCompleteStep(0)).toBe(false);
  });

  it("renders Fade / ScaleFade / Slide / Collapse when in", () => {
    const { container } = wrap(
      <>
        <Fade in>
          <Text>faded</Text>
        </Fade>
        <ScaleFade in>
          <Text>scaled</Text>
        </ScaleFade>
        <Slide in direction="bottom">
          <Text>slid</Text>
        </Slide>
        <Collapse in>
          <Text>collapsed</Text>
        </Collapse>
      </>,
    );
    expect(container.textContent).toContain("faded");
    expect(container.textContent).toContain("scaled");
    expect(container.textContent).toContain("slid");
    expect(container.textContent).toContain("collapsed");
  });
});

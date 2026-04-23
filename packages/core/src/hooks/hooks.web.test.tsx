/* oxlint-disable react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- smoke tests */
import { act, renderHook, render } from "@testing-library/react";
import { useRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { SuperStylingProvider, defaultSystem } from "../";
import {
  useBoolean,
  useBreakpointValue,
  useClipboard,
  useControllableState,
  useDisclosure,
  useMediaQuery,
  useMergeRefs,
  useOutsideClick,
  useTheme,
  useToken,
} from "./index";

function wrap({ children }: { children: React.ReactNode }) {
  return <SuperStylingProvider system={defaultSystem}>{children}</SuperStylingProvider>;
}

describe("Phase 14 hooks", () => {
  it("useDisclosure — open/close/toggle", () => {
    const { result } = renderHook(() => useDisclosure({ defaultIsOpen: false }));
    expect(result.current.isOpen).toBe(false);
    act(() => result.current.onOpen());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.onClose());
    expect(result.current.isOpen).toBe(false);
    act(() => result.current.onToggle());
    expect(result.current.isOpen).toBe(true);
    expect(result.current.getButtonProps()["aria-expanded"]).toBe(true);
    expect(result.current.getDisclosureProps().hidden).toBe(false);
  });

  it("useDisclosure — controlled mode ignores internal state", () => {
    const onOpen = vi.fn();
    const { result, rerender } = renderHook(
      ({ isOpen }: { isOpen: boolean }) => useDisclosure({ isOpen, onOpen }),
      { initialProps: { isOpen: false } },
    );
    expect(result.current.isOpen).toBe(false);
    act(() => result.current.onOpen());
    expect(onOpen).toHaveBeenCalled();
    // controlled — still false until parent updates `isOpen`
    expect(result.current.isOpen).toBe(false);
    rerender({ isOpen: true });
    expect(result.current.isOpen).toBe(true);
  });

  it("useBoolean — tuple return with on/off/toggle", () => {
    const { result } = renderHook(() => useBoolean(false));
    expect(result.current[0]).toBe(false);
    act(() => result.current[1].on());
    expect(result.current[0]).toBe(true);
    act(() => result.current[1].toggle());
    expect(result.current[0]).toBe(false);
    act(() => result.current[1].off());
    expect(result.current[0]).toBe(false);
  });

  it("useControllableState — uncontrolled", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState<number>({ defaultValue: 0, onChange }),
    );
    expect(result.current[0]).toBe(0);
    act(() => result.current[1](5));
    expect(result.current[0]).toBe(5);
    expect(onChange).toHaveBeenCalledWith(5);
    act(() => result.current[1]((prev) => prev + 1));
    expect(result.current[0]).toBe(6);
  });

  it("useControllableState — controlled respects parent value", () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }: { value: number }) =>
        useControllableState<number>({ value, defaultValue: 0, onChange }),
      { initialProps: { value: 10 } },
    );
    expect(result.current[0]).toBe(10);
    act(() => result.current[1](20));
    expect(onChange).toHaveBeenCalledWith(20);
    // controlled — value didn't change
    expect(result.current[0]).toBe(10);
    rerender({ value: 20 });
    expect(result.current[0]).toBe(20);
  });

  it("useMergeRefs — assigns to all passed refs", () => {
    let functionRefNode: HTMLElement | null = null;
    function Host() {
      const objectRef = useRef<HTMLDivElement | null>(null);
      const functionRef = (n: HTMLDivElement | null) => {
        functionRefNode = n;
      };
      const merged = useMergeRefs(objectRef, functionRef);
      return <div ref={merged} data-testid="target" />;
    }
    const { getByTestId } = render(<Host />);
    const target = getByTestId("target");
    expect(functionRefNode).toBe(target);
  });

  it("useMediaQuery — reads matchMedia snapshot", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 1px)"));
    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current.length).toBe(1);
  });

  it("useBreakpointValue — returns a value from the input map", () => {
    const { result } = renderHook(() => useBreakpointValue({ base: "small", lg: "big" }), {
      wrapper: wrap,
    });
    // happy-dom window may match a larger breakpoint; verify result is in the map
    expect(["small", "big"]).toContain(result.current);
  });

  it("useClipboard — tracks hasCopied transient state", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    const { result } = renderHook(() => useClipboard("hi", { timeout: 50 }));
    expect(result.current.hasCopied).toBe(false);
    await act(async () => {
      result.current.onCopy();
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(writeText).toHaveBeenCalledWith("hi");
    expect(result.current.hasCopied).toBe(true);
  });

  it("useTheme — returns active theme object", () => {
    const { result } = renderHook(() => useTheme(), { wrapper: wrap });
    expect(result.current).toBeTruthy();
    expect(result.current.colors).toBeTruthy();
    expect(result.current.space).toBeTruthy();
  });

  it("useToken — resolves colors.blue.500", () => {
    const { result } = renderHook(() => useToken("colors", "blue.500"), { wrapper: wrap });
    expect(typeof result.current).toBe("string");
  });

  it("useToken — array input returns array output", () => {
    const { result } = renderHook(() => useToken("space", ["2", "4"]), { wrapper: wrap });
    expect(Array.isArray(result.current)).toBe(true);
    expect((result.current as string[]).length).toBe(2);
  });

  it("useOutsideClick — fires handler on outside mousedown", () => {
    const handler = vi.fn();
    function Host() {
      const ref = useRef<HTMLDivElement | null>(null);
      useOutsideClick({ ref, handler });
      return (
        <>
          <div ref={ref} data-testid="inside">
            inside
          </div>
          <div data-testid="outside">outside</div>
        </>
      );
    }
    const { getByTestId } = render(<Host />);
    // Click inside — handler should NOT fire
    getByTestId("inside").dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();
    // Click outside — handler fires
    getByTestId("outside").dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);
  });
});

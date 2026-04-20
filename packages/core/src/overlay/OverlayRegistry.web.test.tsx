import { describe, expect, test, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { OverlayRegistryProvider, useOverlayRegistry } from "./OverlayRegistry";

function wrapper({ children }: { children: ReactNode }) {
  return <OverlayRegistryProvider>{children}</OverlayRegistryProvider>;
}

describe("OverlayRegistry", () => {
  test("registers an overlay and reports it as topmost", () => {
    const { result } = renderHook(() => useOverlayRegistry(), { wrapper });
    let unregister: (() => void) | undefined;
    act(() => {
      unregister = result.current.register({ id: "modal-1" });
    });
    expect(result.current.isTopmost("modal-1")).toBe(true);
    expect(result.current.getTopmost()).toBe("modal-1");
    expect(result.current.size()).toBe(1);
    act(() => unregister?.());
    expect(result.current.getTopmost()).toBeNull();
  });

  test("stacks nested overlays and reports the newest as topmost", () => {
    const { result } = renderHook(() => useOverlayRegistry(), { wrapper });
    let off1: (() => void) | undefined;
    let off2: (() => void) | undefined;
    act(() => {
      off1 = result.current.register({ id: "modal" });
      off2 = result.current.register({ id: "popover" });
    });
    expect(result.current.isTopmost("popover")).toBe(true);
    expect(result.current.isTopmost("modal")).toBe(false);
    expect(result.current.size()).toBe(2);
    act(() => off2?.());
    expect(result.current.isTopmost("modal")).toBe(true);
    act(() => off1?.());
    expect(result.current.size()).toBe(0);
  });

  test("dismissTopmost invokes the top entry's onDismiss handler", () => {
    const { result } = renderHook(() => useOverlayRegistry(), { wrapper });
    const dismissModal = vi.fn();
    const dismissPopover = vi.fn();
    act(() => {
      result.current.register({ id: "modal", onDismiss: dismissModal });
      result.current.register({ id: "popover", onDismiss: dismissPopover });
    });
    act(() => result.current.dismissTopmost());
    expect(dismissPopover).toHaveBeenCalledOnce();
    expect(dismissModal).not.toHaveBeenCalled();
  });

  test("useOverlayRegistry throws outside of the provider", () => {
    expect(() => renderHook(() => useOverlayRegistry())).toThrow(
      /must be called inside <SuperStylingProvider>/,
    );
  });
});

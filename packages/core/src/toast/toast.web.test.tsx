/* oxlint-disable react-perf/jsx-no-new-function-as-prop -- smoke tests */
import { render, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useEffect } from "react";
import { SuperStylingProvider, defaultSystem } from "../";
import { useToast } from "./ToastProvider";

function Trigger({ onReady }: { onReady: (t: ReturnType<typeof useToast>) => void }) {
  const toast = useToast();
  useEffect(() => {
    onReady(toast);
  }, [toast, onReady]);
  return null;
}

function wrap(ui: React.ReactNode) {
  return render(<SuperStylingProvider system={defaultSystem}>{ui}</SuperStylingProvider>);
}

describe("useToast", () => {
  it("returns an imperative API and renders a toast", () => {
    let api: ReturnType<typeof useToast> | undefined;
    const { container } = wrap(<Trigger onReady={(t) => (api = t)} />);
    expect(typeof api).toBe("function");

    act(() => {
      api!({ title: "Hello from toast", status: "success" });
    });

    expect(container.textContent).toContain("Hello from toast");
  });

  it("supports close() and closeAll()", () => {
    let api: ReturnType<typeof useToast> | undefined;
    const { container } = wrap(<Trigger onReady={(t) => (api = t)} />);

    let id = "";
    act(() => {
      id = api!({ title: "Closable", duration: null, isClosable: true });
    });
    expect(container.textContent).toContain("Closable");

    act(() => api!.close(id));
    expect(container.textContent).not.toContain("Closable");

    act(() => {
      api!({ title: "One" });
      api!({ title: "Two" });
    });
    act(() => api!.closeAll());
    expect(container.textContent).not.toContain("One");
    expect(container.textContent).not.toContain("Two");
  });
});

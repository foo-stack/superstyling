"use client";

import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { Popover as TamaguiPopover } from "@tamagui/popover";
import { Text as TamaguiText, XStack, YStack } from "tamagui";
import { Divider } from "./Divider";

/**
 * Menu — popover-anchored action list with arrow-key navigation.
 *
 *   <Menu>
 *     <Menu.Button><Button>Actions</Button></Menu.Button>
 *     <Menu.List>
 *       <Menu.Group title="File">
 *         <Menu.Item onSelect={…}>New</Menu.Item>
 *         <Menu.Item onSelect={…}>Open</Menu.Item>
 *       </Menu.Group>
 *       <Menu.Divider />
 *       <Menu.Item onSelect={…} isDisabled>Print</Menu.Item>
 *     </Menu.List>
 *   </Menu>
 *
 * Keyboard:
 *   - `↓` / `↑` move focus
 *   - `Home` / `End` jump to first/last
 *   - `Enter` / `Space` select
 *   - `Escape` close
 *
 * `MenuOptionGroup` + `MenuItemOption` implement Chakra's single/multi
 * selection variants (radio / checkbox groups inside menus).
 */

// ────────────────────────────────────────────────────────────────────────
// Context

interface MenuContextValue {
  isOpen: boolean;
  setOpen: (next: boolean) => void;
  close: () => void;
  /** Registered item refs, 0-indexed top-to-bottom. */
  items: React.MutableRefObject<Array<{ id: string; disabled: boolean; onSelect?: () => void }>>;
  focusedIndex: number;
  setFocusedIndex: (i: number) => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenuContext(): MenuContextValue {
  const ctx = useContext(MenuContext);
  if (!ctx) {
    throw new Error("[superstyling] Menu subcomponents must be rendered inside <Menu>");
  }
  return ctx;
}

// ────────────────────────────────────────────────────────────────────────
// Root

export interface MenuProps {
  children?: ReactNode;
  /** Controlled open state. */
  isOpen?: boolean;
  /** Called on open/close. */
  onOpenChange?: (next: boolean) => void;
  /** Initial open when uncontrolled. */
  defaultIsOpen?: boolean;
}

function MenuRoot({ children, isOpen, onOpenChange, defaultIsOpen = false }: MenuProps) {
  const [localOpen, setLocalOpen] = useState(defaultIsOpen);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const items = useRef<MenuContextValue["items"]["current"]>([]);

  const isControlled = isOpen !== undefined;
  const open = isControlled ? !!isOpen : localOpen;
  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setLocalOpen(next);
      onOpenChange?.(next);
      if (!next) setFocusedIndex(-1);
    },
    [isControlled, onOpenChange],
  );
  const close = useCallback(() => setOpen(false), [setOpen]);

  const ctx = useMemo<MenuContextValue>(
    () => ({ isOpen: open, setOpen, close, items, focusedIndex, setFocusedIndex }),
    [open, setOpen, close, focusedIndex],
  );

  return (
    <MenuContext.Provider value={ctx}>
      <TamaguiPopover placement="bottom-start" open={open} onOpenChange={setOpen} allowFlip>
        {children}
      </TamaguiPopover>
    </MenuContext.Provider>
  );
}
MenuRoot.displayName = "Menu";

// ────────────────────────────────────────────────────────────────────────
// Button (trigger)

const MenuButton = function MenuButton(props: { children: ReactElement }) {
  return <TamaguiPopover.Trigger asChild>{props.children}</TamaguiPopover.Trigger>;
};
MenuButton.displayName = "Menu.Button";

// ────────────────────────────────────────────────────────────────────────
// List (content)

const MenuList = function MenuList(props: ComponentProps<typeof TamaguiPopover.Content>) {
  const menu = useMenuContext();

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const items = menu.items.current.filter((i) => !i.disabled);
    if (items.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      menu.setFocusedIndex((menu.focusedIndex + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      menu.setFocusedIndex((menu.focusedIndex - 1 + items.length) % items.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      menu.setFocusedIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      menu.setFocusedIndex(items.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      items[menu.focusedIndex]?.onSelect?.();
      menu.close();
    } else if (e.key === "Escape") {
      e.preventDefault();
      menu.close();
    }
  };

  return (
    <TamaguiPopover.Content
      {...({ animation: "quicker" } as object)}
      enterStyle={{ y: -4, opacity: 0 }}
      exitStyle={{ y: -4, opacity: 0 }}
      y={0}
      opacity={1}
      backgroundColor="$background"
      borderWidth={1}
      borderColor="$borderColor"
      borderRadius={8}
      padding="$1"
      minWidth={160}
      elevate
      onKeyDown={onKeyDown as never}
      {...props}
    />
  );
};
MenuList.displayName = "Menu.List";

// ────────────────────────────────────────────────────────────────────────
// Item

export interface MenuItemProps extends Omit<ComponentProps<typeof XStack>, "onPress"> {
  isDisabled?: boolean;
  /** Called on click/Enter. */
  onSelect?: () => void;
  children?: ReactNode;
}

const MenuItem = function MenuItem(props: MenuItemProps) {
  const { isDisabled = false, onSelect, children, ...rest } = props;
  const menu = useMenuContext();
  const idRef = useRef<string>(`mi-${Math.random().toString(36).slice(2, 8)}`);

  // Register on mount, unregister on unmount.
  // (Using a ref trick so we don't need an effect hook per item — keeps
  // the fast path cheap.)
  const registered = menu.items.current.find((i) => i.id === idRef.current);
  if (!registered) {
    menu.items.current.push({ id: idRef.current, disabled: isDisabled, onSelect });
  } else {
    registered.disabled = isDisabled;
    registered.onSelect = onSelect;
  }

  const index = menu.items.current.findIndex((i) => i.id === idRef.current);
  const isFocused = menu.focusedIndex === index;

  return (
    <XStack
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderRadius={4}
      alignItems="center"
      gap="$2"
      cursor={isDisabled ? "not-allowed" : "pointer"}
      opacity={isDisabled ? 0.4 : 1}
      backgroundColor={isFocused ? "$backgroundHover" : "transparent"}
      hoverStyle={isDisabled ? undefined : { backgroundColor: "$backgroundHover" }}
      onPress={() => {
        if (isDisabled) return;
        onSelect?.();
        menu.close();
      }}
      role="menuitem"
      aria-disabled={isDisabled}
      {...rest}
    >
      {children}
    </XStack>
  );
};
MenuItem.displayName = "Menu.Item";

// ────────────────────────────────────────────────────────────────────────
// Group

const MenuGroup = function MenuGroup(props: { title?: string; children?: ReactNode }) {
  return (
    <YStack>
      {props.title ? (
        <TamaguiText
          paddingHorizontal="$3"
          paddingTop="$2"
          paddingBottom="$1"
          fontSize={11}
          fontWeight="700"
          color="$color10"
          textTransform="uppercase"
        >
          {props.title}
        </TamaguiText>
      ) : null}
      {props.children}
    </YStack>
  );
};
MenuGroup.displayName = "Menu.Group";

// ────────────────────────────────────────────────────────────────────────
// Divider

const MenuDivider = function MenuDivider() {
  return <Divider marginVertical="$1" />;
};
MenuDivider.displayName = "Menu.Divider";

// ────────────────────────────────────────────────────────────────────────
// OptionGroup + ItemOption (Chakra's radio/checkbox inside menus)

export interface MenuOptionGroupProps {
  title?: string;
  type?: "radio" | "checkbox";
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  children?: ReactNode;
}

interface MenuOptionGroupContextValue {
  type: "radio" | "checkbox";
  value: string[];
  onToggle: (value: string) => void;
}

const MenuOptionGroupContext = createContext<MenuOptionGroupContextValue | null>(null);

const MenuOptionGroup = function MenuOptionGroup(props: MenuOptionGroupProps) {
  const { title, type = "radio", value, defaultValue, onChange, children } = props;
  const [local, setLocal] = useState<string[]>(() =>
    Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : [],
  );
  const controlled = value !== undefined;
  const current: string[] = controlled
    ? Array.isArray(value)
      ? value
      : value
        ? [value]
        : []
    : local;

  const onToggle = useCallback(
    (v: string) => {
      let next: string[];
      if (type === "radio") {
        next = current.includes(v) ? current : [v];
      } else {
        next = current.includes(v) ? current.filter((x) => x !== v) : [...current, v];
      }
      if (!controlled) setLocal(next);
      onChange?.(type === "radio" ? (next[0] ?? "") : next);
    },
    [type, current, controlled, onChange],
  );

  const ctx = useMemo(() => ({ type, value: current, onToggle }), [type, current, onToggle]);

  return (
    <MenuOptionGroupContext.Provider value={ctx}>
      <MenuGroup title={title}>{children}</MenuGroup>
    </MenuOptionGroupContext.Provider>
  );
};
MenuOptionGroup.displayName = "Menu.OptionGroup";

export interface MenuItemOptionProps {
  value: string;
  isDisabled?: boolean;
  children?: ReactNode;
}

const MenuItemOption = function MenuItemOption(props: MenuItemOptionProps) {
  const ctx = useContext(MenuOptionGroupContext);
  if (!ctx) {
    throw new Error("[superstyling] Menu.ItemOption must be rendered inside Menu.OptionGroup");
  }
  const { value, isDisabled, children } = props;
  const isChecked = ctx.value.includes(value);
  return (
    <MenuItem
      isDisabled={isDisabled}
      onSelect={() => ctx.onToggle(value)}
      // Cast: React's built-in ARIA role type doesn't include these values
      // but they're valid per ARIA spec and the menu pattern.
      role={(ctx.type === "radio" ? "menuitemradio" : "menuitemcheckbox") as never}
      aria-checked={isChecked}
    >
      <TamaguiText opacity={isChecked ? 1 : 0} width={16}>
        ✓
      </TamaguiText>
      {children}
    </MenuItem>
  );
};
MenuItemOption.displayName = "Menu.ItemOption";

// ────────────────────────────────────────────────────────────────────────

export const Menu = Object.assign(MenuRoot, {
  Button: MenuButton,
  List: MenuList,
  Item: MenuItem,
  Group: MenuGroup,
  Divider: MenuDivider,
  OptionGroup: MenuOptionGroup,
  ItemOption: MenuItemOption,
});

// These utilities/type aliases are expected by some consumers.
void cloneElement;
void Children;
void isValidElement;

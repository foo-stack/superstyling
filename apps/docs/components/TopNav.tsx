"use client";

import { useState } from "react";
import { Box, Drawer, HStack, IconButton, Link, Text } from "@superstyling/core";
import { MenuIcon } from "@superstyling/icons";
import { VersionSwitcher } from "./VersionSwitcher";
import { Search } from "./Search";
import { ColorModeToggle } from "./ColorModeToggle";
import { DocsMenuContents } from "./DocsMenuContents";

/**
 * Top navigation strip. Wordmark on the left, search + version + color-mode +
 * github + (mobile) hamburger on the right. The hamburger only shows below
 * `$md`; it opens a `Drawer` containing the same nav as the desktop sidebar.
 */
export function TopNav() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <HStack
        position="sticky"
        top={0}
        zIndex={10}
        height={56}
        alignItems="center"
        paddingHorizontal="$4"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        backgroundColor="$background"
        gap="$3"
      >
        <Link href="/" textDecorationLine="none">
          <Text fontSize={18} fontWeight="700" color="$color">
            Superstyling
          </Text>
        </Link>
        <Box flex={1} />
        <Search />
        <Box display="none" $md={{ display: "flex" }}>
          <VersionSwitcher />
        </Box>
        <ColorModeToggle />
        <Link
          href="https://github.com/foo-stack/superstyling"
          isExternal
          textDecorationLine="none"
          display="none"
          $md={{ display: "flex" }}
        >
          <Text fontSize={14} color="$color">
            GitHub
          </Text>
        </Link>
        <Box display="flex" $md={{ display: "none" }}>
          <IconButton
            aria-label="Open navigation"
            icon={<MenuIcon size={18} />}
            variant="ghost"
            size="sm"
            onPress={() => setNavOpen(true)}
          />
        </Box>
      </HStack>

      <Drawer isOpen={navOpen} onClose={() => setNavOpen(false)} placement="left" size="sm">
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.CloseButton />
          <Drawer.Body>
            <DocsMenuContents onNavigate={() => setNavOpen(false)} />
          </Drawer.Body>
        </Drawer.Content>
      </Drawer>
    </>
  );
}

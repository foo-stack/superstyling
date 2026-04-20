/* oxlint-disable react-perf/jsx-no-new-object-as-prop, react-perf/jsx-no-jsx-as-prop, react-perf/jsx-no-new-function-as-prop -- sample app */
import { useState } from "react";
import { Box } from "@superstyling/core";
import { LoginScreen } from "./LoginScreen";
import { TodoScreen } from "./TodoScreen";

export interface Session {
  email: string;
}

/**
 * Phase 8 dogfood app. A tiny TODO-with-auth flow built from only
 * Superstyling primitives. Any rough edge hit while writing this is a
 * candidate GitHub issue; see the list at the bottom of `TodoScreen.tsx`.
 */
export function App() {
  const [session, setSession] = useState<Session | null>(null);
  return (
    <Box flex={1} minHeight={720} backgroundColor="$background">
      {session === null ? (
        <LoginScreen onSignIn={(s) => setSession(s)} />
      ) : (
        <TodoScreen session={session} onSignOut={() => setSession(null)} />
      )}
    </Box>
  );
}

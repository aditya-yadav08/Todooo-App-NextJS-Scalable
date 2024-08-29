"use client";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode, useMemo } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function convexTokenFromSession(session: Session | null): string | null {
  return session?.convexToken ?? null;
}

function useAuth() {
  const { data: session, update } = useSession();

  const convexToken = convexTokenFromSession(session);
  return useMemo(
    () => ({
      isLoading: false,
      isAuthenticated: session !== null,
      fetchAccessToken: async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
        if (forceRefreshToken) {
          const updatedSession = await update();
          return convexTokenFromSession(updatedSession);
        }
        return convexToken;
      },
    }),
    [convexToken, session, update] // Include all necessary dependencies
  );
}

export function Providers({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <ConvexProviderWithAuth client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithAuth>
    </SessionProvider>
  );
}

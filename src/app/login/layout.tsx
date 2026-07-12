import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — TransitOps",
  description:
    "Sign in to the TransitOps Smart Transport Operations Platform.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

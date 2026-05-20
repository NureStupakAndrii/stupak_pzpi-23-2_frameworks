import type { ReactElement, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/cn";

type LinkButtonProps = Readonly<{
  to: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}>;

export function LinkButton(props: LinkButtonProps): ReactElement {
  return (
    <Link
      to={props.to}
      className={cn(
        "inline-flex items-center justify-center",
        props.variant === "primary" ? "button-primary" : "button-secondary",
      )}
    >
      {props.children}
    </Link>
  );
}

import type { AnchorHTMLAttributes, ReactNode } from "react";

type ExternalLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "target" | "rel"
> & {
  href: string;
  children: ReactNode;
};

export const ExternalLink = ({ children, ...props }: ExternalLinkProps) => {
  return (
    <a {...props} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
};

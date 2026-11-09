import type { HTMLAttributes } from "react";

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "header" | "footer" | "article";
  size?: "wide" | "read";
};

const SIZE = {
  wide: "max-w-[1120px]",
  read: "max-w-[680px]",
} as const;

export function Container({ as: Tag = "div", size = "wide", className = "", ...rest }: ContainerProps) {
  return <Tag className={`mx-auto w-full px-5 md:px-8 lg:px-12 ${SIZE[size]} ${className}`} {...rest} />;
}

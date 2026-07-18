import { Fragment, type CSSProperties } from "react";

type Props = {
  /** Full headline. */
  text: string;
  /** Word/phrase inside `text` to render in the italic serif accent. */
  accent: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  accentClassName?: string;
  style?: CSSProperties;
};

/**
 * Signature typographic move: geometric sans headline with a single
 * italic-serif emerald word. Case-insensitive match on the accent phrase.
 */
export function AccentText({
  text,
  accent,
  as: Tag = "h1",
  className = "",
  accentClassName = "",
  style,
}: Props) {
  const idx = accent ? text.toLowerCase().indexOf(accent.toLowerCase()) : -1;
  const before = idx >= 0 ? text.slice(0, idx) : text;
  const match = idx >= 0 ? text.slice(idx, idx + accent.length) : "";
  const after = idx >= 0 ? text.slice(idx + accent.length) : "";

  return (
    <Tag className={className} style={{ fontFamily: "var(--font-display)", ...style }}>
      {before}
      {match ? (
        <Fragment>
          <span
            className={"italic text-emerald " + accentClassName}
            style={{ fontFamily: "var(--font-accent)", fontWeight: 400 }}
          >
            {match}
          </span>
          {after}
        </Fragment>
      ) : null}
    </Tag>
  );
}

import type { ReactElement } from "react";

export function VideoSearchBar(
  props: Readonly<{ value: string; onChange: (value: string) => void }>,
): ReactElement {
  return (
    <label className="grid w-full max-w-2xl gap-2 text-accent">
      <span className="text-lg font-black uppercase tracking-[0.28em]">
        Search the videos
      </span>
      <input
        type="search"
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        placeholder="Search..."
        className="w-full rounded-full border-2 text-lg border-accent bg-white px-5 py-3 text-accent outline-none transition placeholder:text-accent/40 focus:ring-2 focus:ring-[rgba(75,13,102,0.15)]"
      />
    </label>
  );
}

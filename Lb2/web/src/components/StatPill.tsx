import type { ReactElement } from "react";

type StatPillProps = Readonly<{
  label: string;
  value: number;
}>;

export function StatPill(props: StatPillProps): ReactElement {
  return (
    <div className="rounded-3xl border-4 border-accent bg-paper-soft p-4 text-accent shadow-pop">
      <p className="text-[10px] font-black uppercase tracking-[0.28em]">
        {props.label}
      </p>
      <p className="mt-2 text-2xl font-black tracking-[-0.06em]">
        {props.value}
      </p>
    </div>
  );
}

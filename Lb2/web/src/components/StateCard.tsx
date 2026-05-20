import type { ReactElement } from "react";

type StateCardProps = Readonly<{
  title: string;
  description?: string;
}>;

export function StateCard(props: StateCardProps): ReactElement {
  return (
    <div className="inner-panel p-4">
      <h3 className="text-xl font-black uppercase tracking-[-0.04em] text-accent">
        {props.title}
      </h3>
      {props.description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-accent/80">
          {props.description}
        </p>
      )}
    </div>
  );
}

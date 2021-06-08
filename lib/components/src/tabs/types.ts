export type TabChildRenderProps = {
  key: string;
  active: boolean;
  id: string;
  index: number;
  selected: string;
};

export type TabListChildProps = {
  id: string;
  color: string;
  title: string | (() => string);
} & React.HTMLAttributes<HTMLDivElement>;

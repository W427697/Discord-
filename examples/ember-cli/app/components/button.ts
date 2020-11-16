import Component from '@glimmer/component';

export type ButtonArgs = {
  emoji?: string;
  onClick: (event: Event) => void;
};

class Button extends Component<ButtonArgs> {}

export default Button;

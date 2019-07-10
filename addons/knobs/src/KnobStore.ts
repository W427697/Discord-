import Types, {
  TextTypeKnob,
  NumberTypeKnob,
  ColorTypeKnob,
  BooleanTypeKnob,
  ObjectTypeKnob,
  SelectTypeKnob,
  RadiosTypeKnob,
  ArrayTypeKnob,
  DateTypeKnob,
  ButtonTypeOnClickProp,
  FileTypeKnob,
  OptionsTypeKnob,
} from './components/types';

type Callback = () => any;

type KnobPlus<T extends keyof typeof Types, K> = K & { type: T; groupId: string };

export type Knob =
  | KnobPlus<'text', Pick<TextTypeKnob, 'value' | 'onChange'>>
  | KnobPlus<'boolean', Pick<BooleanTypeKnob, 'value' | 'onChange'>>
  | KnobPlus<
      'number',
      Pick<NumberTypeKnob, 'value' | 'range' | 'min' | 'max' | 'step' | 'onChange'>
    >
  | KnobPlus<'color', Pick<ColorTypeKnob, 'value' | 'onChange'>>
  | KnobPlus<'object', Pick<ObjectTypeKnob<any>, 'value' | 'onChange'>>
  | KnobPlus<'select', Pick<SelectTypeKnob, 'value' | 'options' | 'onChange'> & { selectV2: true }>
  | KnobPlus<'radios', Pick<RadiosTypeKnob, 'value' | 'options' | 'onChange'>>
  | KnobPlus<'array', Pick<ArrayTypeKnob, 'value' | 'separator' | 'onChange'>>
  | KnobPlus<'date', Pick<DateTypeKnob, 'value' | 'onChange'>>
  | KnobPlus<'files', Pick<FileTypeKnob, 'value' | 'accept' | 'onChange'>>
  | KnobPlus<
      'button',
      { value?: unknown; callback: ButtonTypeOnClickProp; hideLabel: true; onChange: any }
    >
  | KnobPlus<
      'options',
      Pick<OptionsTypeKnob<any>, 'options' | 'value' | 'optionsObj' | 'onChange'>
    >;

export type KnobStoreKnob = Knob & {
  name: string;
  label: string;
  used?: boolean;
  defaultValue?: any;
  hideLabel?: boolean;
  callback?: () => any;
  onChange: (...args: any[]) => any;
};

const callArg = (fn: Callback) => fn();
const callAll = (fns: Callback[]) => fns.forEach(callArg);

export default class KnobStore {
  store: Record<string, KnobStoreKnob> = {};

  callbacks: Callback[] = [];

  timer: NodeJS.Timeout;

  has(key: string) {
    return this.store[key] !== undefined;
  }

  set(key: string, value: KnobStoreKnob) {
    this.store[key] = {
      ...value,
      used: true,
      groupId: value.groupId,
      onChange: value.onChange,
    };

    // debounce the execution of the callbacks for 50 milliseconds
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(callAll, 50, this.callbacks);
  }

  get(key: string) {
    const knob = this.store[key];
    if (knob) {
      knob.used = true;
    }
    return knob;
  }

  getAll() {
    return this.store;
  }

  reset() {
    this.store = {};
  }

  markAllUnused() {
    Object.keys(this.store).forEach(knobName => {
      this.store[knobName].used = false;
    });
  }

  subscribe(cb: Callback) {
    this.callbacks.push(cb);
  }

  unsubscribe(cb: Callback) {
    const index = this.callbacks.indexOf(cb);
    this.callbacks.splice(index, 1);
  }
}

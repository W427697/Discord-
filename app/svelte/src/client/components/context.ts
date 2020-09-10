import { getContext, setContext } from 'svelte';

const REGISTER = '__STORYBOOK_register';

export const setRegister = (value: any) => setContext(REGISTER, value);

export const getRegister = () => getContext(REGISTER);

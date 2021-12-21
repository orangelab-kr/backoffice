import { useState } from 'react';

export const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);
  const toggle = (value) => () => setState(value);
  return [state, toggle];
};

import { Dispatch, SetStateAction, useState } from "react";

export default function useStateSet<T>(
  iterable?: Iterable<T> | null | undefined,
): [Set<T>, Dispatch<SetStateAction<Set<T>>>, Dispatch<T>, Dispatch<T>] {
  const [state, setState] = useState<Set<T>>(new Set(iterable));

  const addState: Dispatch<T> = (state) => {
    setState((previousState) => {
      previousState.add(state);

      return new Set(previousState);
    });
  };

  const removeState: Dispatch<T> = (state) => {
    setState((previousState) => {
      previousState.delete(state);

      return new Set(previousState);
    });
  };

  return [state, setState, addState, removeState];
}

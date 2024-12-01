class Void {}

export interface Result<T = Void> {
  value: T | null;
  error: string | null;
}

interface Success<T = Void> extends Result<T> {
  value: T;
  error: null;
}

interface Failure extends Result {
  value: null;
  error: string;
}

export const isSuccess = <T>(result: Result<T>): result is Success<T> => {
  return result.value !== null;
};

export const isFailure = <T>(result: Result<T>): result is Failure => {
  return result.error !== null;
};

export const getValueOrThrow = <T>(result: Result<T>): T => {
  if (isSuccess(result)) {
    return result.value;
  }
  if (isFailure(result)) {
    throw new Error(result.error);
  }
  throw new Error("value and error cannot both be null.");
};

export const success = <T>(value: T): Success<T> => ({
  value,
  error: null,
});

export const emptySuccess = (): Success => ({ value: new Void(), error: null });

export const failure = (error: string): Failure => ({ value: null, error });

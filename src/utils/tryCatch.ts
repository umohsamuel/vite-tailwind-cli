type Success<T> = {
  success: true;
  data: T;
  error: null;
};

type Failure<E> = {
  success: false;
  data: null;
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

export async function tryCatch<T, E>(
  fn: Promise<T> | T,
  options?: {
    onError?: (error: unknown) => void;
    rethrow?: boolean;
    onFinally?: () => void;
  }
): Promise<Result<T, E>> {
  const { onError, rethrow, onFinally } = options || {};

  try {
    const data = await fn;
    return { success: true, data, error: null };
  } catch (error) {
    if (onError) {
      onError(error);
    } else {
      console.error("An error occurred:", error);
    }

    if (rethrow) throw error;

    return { success: false, data: null, error: error as E };
  } finally {
    if (onFinally) onFinally();
  }
}

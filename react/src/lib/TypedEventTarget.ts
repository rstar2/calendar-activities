type TypedEventListener<T> = (evt: CustomEvent<T>) => void;

type TypedEventListenerObject<T> = {
  handleEvent(evt: CustomEvent<T>): void;
};

// The type of our listener receives the CustomEvent with our specific data
type TypedEventListenerOrEventListenerObject<T> =
  | TypedEventListener<T>
  | TypedEventListenerObject<T>;

export class TypedEventTarget<M extends Record<string, unknown>> {
  private readonly target = new EventTarget();

  addEventListener<K extends keyof M>(
    type: K & string,
    listener: TypedEventListenerOrEventListenerObject<M[K]>,
    options?: boolean | AddEventListenerOptions,
  ) {
    // NOTE: cast to EventListenerOrEventListenerObject
    // because the browser expects the base Event type
    this.target.addEventListener(
      type,
      listener as EventListenerOrEventListenerObject,
      options,
    );
  }

  removeEventListener<K extends keyof M>(
    type: K & string,
    listener: TypedEventListenerOrEventListenerObject<M[K]>,
    options?: boolean | EventListenerOptions,
  ) {
    // NOTE: cast to EventListenerOrEventListenerObject
    // because the browser expects the base Event type
    this.target.removeEventListener(
      type,
      listener as EventListenerOrEventListenerObject,
      options,
    );
  }

  // A helper to ensure we always dispatch a properly formatted CustomEvent
  dispatchEvent<K extends keyof M>(
    type: K,
    ...args: M[K] extends void ? [detail?: undefined] : [detail: M[K]]
  ) {
    const [detail] = args;

    return this.target.dispatchEvent(new CustomEvent(String(type), { detail }));
  }
}

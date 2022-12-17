/**
 * Helper class for caching a single value.
 * Mainly exists for easier testability of things which rely on caching.
 */
export class CachedValue {
  #cached = null;

  constructor(initialValue = null) {
    this.#cached = initialValue;
  }

  get value() {
    return this.#cached;
  }

  get hasValue() {
    return !!this.#cached;
  }

  setValue(value) {
    this.#cached = value;
  }
}

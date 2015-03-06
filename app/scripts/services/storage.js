'use strict';

export var Lifetime = Object.freeze({
  /**
   * A value that lives until the User manually clears it
   */
  Unlimited: 0,
  /**
   * A value that lives during the session (disappears on browser close)
   */
  Session: 1,
  /**
   * A value that lives while the app lives (disappears on reload)
   */
  Instance: 2,
});

/**
 * A service for abstracting storage and notifications
 */
class Storage {
	constructor(rx) {
    this.rx = rx;
    this.subjects = {};
  }

  /**
   * Sets the key to value and notifies all observers of that value
   *
   * @param {String} key
   * @param value
   * @param [lifetime] Optional lifetime of the value, defaults to instance lifetime
   */
  set(key, value, lifetime = Lifetime.Instance) {
    switch (lifetime) {
      case Lifetime.Unlimited:
        window.localStorage.setItem(key, JSON.stringify(value));
        break;
      case Lifetime.Session:
        window.sessionStorage.setItem(key, JSON.stringify(value));
        break;
    }

    this._set(key, value);
  }

  /**
   * Checks if a value with key exists
   *
   * @param {String} key
   * @returns {boolean}
   */
  has(key) {
    return !!this.subjects[key];
  }

  /**
   * Observe the value with key
   *
   * @param {String} key
   * @param [defaultValue] Optional default value if the key is not yet set
   * @returns {Rx.Observable}
   */
  observe(key, defaultValue = null) {
    if (!this.subjects[key]) {
      let value = window.sessionStorage.getItem(key);
      if (value === null) {
        value = window.localStorage.getItem(key);
      }
      if (value === null) {
        value = defaultValue;
      } else {
        value = JSON.parse(value);
      }

      this._set(key, value);
    }

    return this.subjects[key].asObservable();
  }

  /**
   * Pushes the value to the end of the array in key and notifies all observers
   *
   * @param {String} key
   * @param value
   */
  push(key, value) {
    this.observe(key).first(array => {
      this._set(key, array.push(value));
    });
  }

  _set(key, value) {
    if (!this.subjects[key]) {
      this.subjects[key] = new this.rx.ReplaySubject(1);

      if (value !== null) {
        this.subjects[key].onNext(value);
      }
    } else {
      this.subjects[key].onNext(value);
    }
  }
}

export default angular.module('storage', [])
	.service('storage', Storage );

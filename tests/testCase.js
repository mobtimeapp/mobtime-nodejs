import test from 'ava';

export default class TestCase {
  constructor() {
  }

  #gatherTests() {
  }

  execute() {
    for (const testFn in this.#gatherTests) {
      setup();
      test(testFn.name, testFn);
      teardown();
    }
  }

  setup() {
  }

  teardown() {
  }
};

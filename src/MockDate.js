export default class MockDate extends Date {
  static getDate;

  constructor(...args) {
    if (args[0] != null) {
      return super(...args);
    }

    return MockDate.getDate();
  }
};
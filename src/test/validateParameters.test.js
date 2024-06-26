const { EMSError } = require('../main/EMSError');
const { PRIMITIVE_TYPES } = require('../main/Enums');
const { validateParameters } = require('../main/validateParameters');

// Define a custom class for testing
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

const fullObject = {
  str: "str",
  num: 1,
  bool: false,
  person: new Person("name", "age"),
  callingUser: { username: "user", type: "type", exams: [{stem: "str"}] },
  nest1: { str: "str", nest2: { str: "str", num: 1 } },
  stringArray: ["one", "two"],
  personArray: [new Person("John", 30), new Person("Doe", 40)]
};

const emptyObject = {};
const emptyNested = { nest1: {} };

describe('validateParameters', () => {
  // String Object Tests
  test('should pass with valid string object', () => {
    const expectedObj = { str: PRIMITIVE_TYPES.STRING };
    expect(() => validateParameters(fullObject, expectedObj)).not.toThrow();
  });

  test('should fail with invalid string object', () => {
    const expectedObj = { str: PRIMITIVE_TYPES.STRING };
    expect(() => validateParameters(emptyObject, expectedObj)).toThrow(EMSError);
  });

  // Multiple Primitive Object Tests
  test('should pass with valid multiple primitive object', () => {
    const expectedObj = { str: PRIMITIVE_TYPES.STRING, num: PRIMITIVE_TYPES.NUMBER, bool: PRIMITIVE_TYPES.BOOLEAN };
    expect(() => validateParameters(fullObject, expectedObj)).not.toThrow();
  });

  test('should fail with invalid multiple primitive object', () => {
    const expectedObj = { str: PRIMITIVE_TYPES.STRING, num: PRIMITIVE_TYPES.NUMBER, isAdmin: PRIMITIVE_TYPES.BOOLEAN };
    expect(() => validateParameters(emptyObject, expectedObj)).toThrow(EMSError);
  });

  // Object with a Class Tests
  test('should pass with valid object with a class', () => {
    const expectedObj = { person: Person };
    expect(() => validateParameters(fullObject, expectedObj)).not.toThrow();
  });

  test('should fail with invalid object with a class', () => {
    const expectedObj = { person: Person };
    expect(() => validateParameters(emptyObject, expectedObj)).toThrow(EMSError);
  });

  // Nested Object Tests
  test('should pass with valid nested object', () => {
    const expectedObj = { nest1: { str: PRIMITIVE_TYPES.STRING, nest2: { str: PRIMITIVE_TYPES.STRING, num: PRIMITIVE_TYPES.NUMBER } } };
    expect(() => validateParameters(fullObject, expectedObj)).not.toThrow();
  });

  test('should fail with invalid nested object', () => {
    const expectedObj = { nest1: { str: PRIMITIVE_TYPES.STRING, nest2: { str: PRIMITIVE_TYPES.STRING, num: PRIMITIVE_TYPES.NUMBER } } };
    expect(() => validateParameters(emptyObject, expectedObj)).toThrow(EMSError);
  });

  // Array Tests
  test('should pass with valid array of primitives', () => {
    const expectedObj = { stringArray: [PRIMITIVE_TYPES.STRING] };
    expect(() => validateParameters(fullObject, expectedObj)).not.toThrow();
  });

  test('should fail with invalid array of primitives', () => {
    const expectedObj = { stringArray: [PRIMITIVE_TYPES.STRING] };
    const invalidObject = { stringArray: [1, 2, 3] };
    expect(() => validateParameters(invalidObject, expectedObj)).toThrow(EMSError);
  });

  test('should pass with valid array of class instances', () => {
    const expectedObj = { personArray: [Person] };
    expect(() => validateParameters(fullObject, expectedObj)).not.toThrow();
  });

  test('should fail with invalid array of class instances', () => {
    const expectedObj = { personArray: [Person] };
    const invalidObject = { personArray: [{ name: "Not a Person" }] };
    expect(() => validateParameters(invalidObject, expectedObj)).toThrow(EMSError);
  });

  test('should pass with empty array', () => {
    const expectedObj = { stringArray: [PRIMITIVE_TYPES.STRING] };
    const emptyArrayObject = { stringArray: [] };
    expect(() => validateParameters(emptyArrayObject, expectedObj, true, false)).not.toThrow();
  });

  test('should pass with nested callingUser fields', () => {
    const expectedObj = { callingUser: { exams: [{stem: PRIMITIVE_TYPES.STRING}] } };
    expect(() => validateParameters(fullObject, expectedObj)).not.toThrow();
  })

  test('should fail with invalid nested callingUser fields', () => {
    const expectedObj = { callingUser: { exams: [{stem: PRIMITIVE_TYPES.STRING}] } };
    const invalidObject = { callingUser: { exams: [{stem: 1}] } };
    expect(() => validateParameters(invalidObject, expectedObj)).toThrow(EMSError);
  })
});
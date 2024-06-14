const {EMSError, FUNCTION_PARAMETERS_ERROR_CODES: ERROR_CODES} = require("./EMSError");
const {FUNCTION_PARAMETERS_ERROR_MSGS: ERROR_MSGS} = require("./ErrorMessages");

/**
 * Validates that the keys and types of the properties in `realObj` match the specifications in `expectedObj`.
 *
 * @param {Object} realObj - The object to be validated.
 * @param {Object} expectedObj - An object where each key corresponds to a key in `realObj`, 
 * and the value is either a string representing a primitive type (e.g., "string", "number", "boolean") 
 * or a constructor function (class) representing the expected type.
 *
 * @throws {Error} If a key in `expectedObj` is missing from `realObj`.
 * @throws {Error} If the type of a property in `realObj` does not match the expected type in `expectedObj`.
 * @throws {Error} If an unsupported type specification is encountered in `expectedObj`.
 *
 * @returns {boolean} Returns true if all keys and types match as expected.
 *
 * @example
 * // Primitive types validation
 * const realObj = { name: "John", age: 30, isAdmin: true };
 * const expectedObj = { name: "string", age: "number", isAdmin: "boolean" };
 * validateParameters(realObj, expectedObj); // returns true
 *
 * @example
 * // Class instance validation
 * class Person {
 *   constructor(name, age) {
 *     this.name = name;
 *     this.age = age;
 *   }
 * }
 * const realObj = { profile: new Person("John", 30) };
 * const expectedObj = { profile: Person };
 * validateParameters(realObj, expectedObj); // returns true
 */
function validateParameters(realObj, expectedObj) {
    for (const key in expectedObj) {
        // Check if the key exists in realObj
        if (!realObj.hasOwnProperty(key)) {
          throw new EMSError(ERROR_MSGS.MISSING_KEY(key),ERROR_CODES.MISSING_KEY);
        }
  
        // Get the expected type
        const expectedType = expectedObj[key];
        const realValue = realObj[key];
  
        // Check the type
        if (typeof expectedType === 'string') {
          // Primitive type check
          if (typeof realValue !== expectedType) {
            throw new EMSError(ERROR_MSGS.TYPE_MISMATCH(key, expectedType, typeof realValue),ERROR_CODES.TYPE_MISMATCH);
          }
        } else if (typeof expectedType === 'function') { // Class type is 'function'
          if (!(realValue instanceof expectedType)) {
            throw new EMSError(ERROR_MSGS.TYPE_MISMATCH(key, expectedType.name, realValue.constructor.name),ERROR_CODES.TYPE_MISMATCH);
          }
        } else {
          throw new EMSError(ERROR_MSGS.UNSUPPORTED_TYPE(key),ERROR_CODES.UNSUPPORTED_TYPE);
        }
    }
    return true; // If all validations pass
}

module.exports = {validateParameters}
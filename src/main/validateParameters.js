const { EMSError, FUNCTION_PARAMETERS_ERROR_CODES: ERROR_CODES } = require("./EMSError");
const { PRIMITIVE_TYPES } = require("./Enums");
const { FUNCTION_PARAMETERS_ERROR_MSGS: ERROR_MSGS } = require("./ErrorMessages");

/**
 * 
 * 
 * @returns the name of the function that has called the caller 
 * 
 * 
 * @example 
 * function foo: calling goo()
 * function goo: calling getCallingFunctionName()
 * getCallingFunctionName return "foo":
 */
function getCallingFunctionName() {
  // Create an error to get the stack trace
  const err = new Error();
  
  // Parse the stack trace
  const stackLines = err.stack.split('\n');
  
  // The third line in the stack trace should contain the caller function name
  // The format is usually like "    at functionName (file:line:column)"
  const callerLine = stackLines[3];
  // Extract the function name from the stack trace line
  const match = callerLine.trim().match(/^at (\w+)\.(\w+)/);
  
  // Return the function name if it exists
  return match ? JSON.stringify(match[0]) : undefined;
}

/**
 * Validates that the keys and types of the properties in `realObj` match the specifications in `expectedObj`.
 *
 * @param {Object} realObj - The object to be validated.
 * @param {Object} expectedObj - An object where each key corresponds to a key in `realObj`, 
 * and the value is either a string representing a primitive type (e.g., "string", "number", "boolean") 
 * or a constructor function (class) representing the expected type.
 * @param {boolean} [prohibitNull=true] - Whether to prohibit null values.
 * @param {boolean} [checkCallingUserData=true] - Whether to check for calling user data.
 *
 * @throws {EMSError} If a key in `expectedObj` is missing from `realObj`.
 * @throws {EMSError} If the type of a property in `realObj` does not match the expected type in `expectedObj`.
 * @throws {EMSError} If an unsupported type specification is encountered in `expectedObj`.
 *
 *
 * @example
 * // Primitive types validation
 * const realObj = { name: "John", age: 30, isAdmin: true };
 * const expectedObj = { name: "string", age: "number", isAdmin: "boolean" };
 * validateParameters(realObj, expectedObj); // pass validation
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
 * validateParameters(realObj, expectedObj); // pass validation
 * 
 *  * @example
 * // Array validation
 * const realObj = { numbers: [1, 2, 3], people: [new Person("John", 30), new Person("Jane", 25)] };
 * const expectedObj = { numbers: ["number"], people: [Person] };
 * validateParameters(realObj, expectedObj); // pass validation
 */
function validateParameters(realObj, expectedObj, prohibitNull = true, checkCallingUserData = true) {

  const callingFunctionName = getCallingFunctionName()
  if (!realObj) throw new EMSError(ERROR_MSGS.NULL_OBJECT(callingFunctionName), ERROR_CODES.NULL_OBJECT);

  // Add callingUserData to expectedObj if needed
  if (checkCallingUserData) {
    expectedObj = {
      ...expectedObj,
      callingUser: {
        username: PRIMITIVE_TYPES.STRING,
        type: PRIMITIVE_TYPES.STRING,
        ... expectedObj.callingUser ? expectedObj.callingUser : undefined
      },
    };
  }

  for (const key in expectedObj) {
      // Check if the key exists in realObj
      if (!realObj.hasOwnProperty(key)) {
        throw new EMSError(ERROR_MSGS.MISSING_KEY(key,callingFunctionName), ERROR_CODES.MISSING_KEY);
      }

      // Get the expected type
      const expectedType = expectedObj[key];
      const realValue = realObj[key];

      if (prohibitNull && realValue === null) {
        throw new EMSError(ERROR_MSGS.NULL_VALUE(key,callingFunctionName), ERROR_CODES.NULL_VALUE);
      }

      // Check the type

      // Check for array type
      if (Array.isArray(expectedType)) {
        if (!Array.isArray(realValue)) {
          throw new EMSError(ERROR_MSGS.TYPE_MISMATCH(key, 'array', typeof realValue, callingFunctionName), ERROR_CODES.TYPE_MISMATCH);
        }
        if (realValue.length > 0) {
          const arrayExpectedType = expectedType[0];
          for (const element of realValue) {
            // make sure that every element in the array is from the expected Type.
            // wrap the element in an object so it will be in validateParameters params format
            validateParameters({ element }, { element: arrayExpectedType }, prohibitNull, false);
          }
        }
        // empty array is from 'any' type, so it pass.
        continue;
      }
      // Primitive type check
      else if (Object.values(PRIMITIVE_TYPES).includes(expectedType)) {
        if (typeof realValue !== expectedType) {
          throw new EMSError(ERROR_MSGS.TYPE_MISMATCH(key, expectedType, typeof realValue,callingFunctionName), ERROR_CODES.TYPE_MISMATCH);
        }
      } 
        // Class type check
        else if (typeof expectedType === 'function') {
        if (!(realValue instanceof expectedType)) {
          throw new EMSError(ERROR_MSGS.TYPE_MISMATCH(key, expectedType.name, realValue.constructor.name,callingFunctionName), ERROR_CODES.TYPE_MISMATCH);
        }
      }
        // Nested object type check
        else if (typeof expectedType === 'object') {
          validateParameters(realValue, expectedType, prohibitNull, false);
      } 
      else {
        throw new EMSError(ERROR_MSGS.UNSUPPORTED_TYPE(key,callingFunctionName), ERROR_CODES.UNSUPPORTED_TYPE);
      }
  }
}

function validateParametersWithoutCallingUser(realObj, expectedObj, prohibitNull = true) {
  validateParameters(realObj, expectedObj, prohibitNull, false);
}

module.exports = { validateParameters,validateParametersWithoutCallingUser };

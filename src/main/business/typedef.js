// SObjects means Server Object

/**
 * @typedef {Object} CallingUser
 * @property {number} username - The connected username
 * @property {string} type - the connected user type
 */

/**
 * @typedef {string} SKeyword
 */


/**
 * @typedef {Object} SAppendix
 * @property {string} tag
 * @property {string} title
 * @property {string} content
 * @property {SKeyword[]} keywords
  */

/**
 * @typedef {Object} SAnswer
 * @property {number} id
 * @property {string} tag
 * @property {string} text
 * @property {string} explanation
 * @property {SKeyword} keywords
 */

/**
 * @typedef {Object} SMetaQuestion
 * @property {number} id
 * @property {string} stem
 * @property {SAnswer[]} keys
 * @property {SAnswer[]} distractors
 * @property {SKeyword} keywords
 * @property {SAppendix} appendix
 */


/**
 * @typedef {Object} SSelectedMetaQuestion
 * @property {number} id
 * @property {string} stem
 * @property {SAppendix} appendix
 * @property {SAnswer} selectedKey
 * @property {SAnswer[]} selectedDistractor
 */

/**
 * @typedef {Object} SExamAnswer
 * @property {number} id
 * @property {string} text
 * @property {string} tag
 * @property {string} explanation
 * @property {number} ordinal
 * @property {number} version
 */

/**
 * @typedef {Object} SQuestion
 * @property {number} id
 * @property {number} mqId
 * @property {string} stem
 * @property {number} ordinal
 * @property {SAppendix?} appendix
 * @property {SExamAnswer[]} answers
 */

/**
 * @typedef {Object} SExam
 * @property {number} examId
 * @property {SQuestion[]} questions
 * @property {number}  numVersions number of version for this exam
 * @property {string} examReason
 */

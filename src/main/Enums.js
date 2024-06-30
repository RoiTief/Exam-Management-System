
const USER_TYPES = {
    ADMIN: 'Admin',
    LECTURER: 'Lecturer',
    TA: 'TA',
}

const ANSWER_TYPES = {
    KEY: 'key',
    DISTRACTOR: 'distractor',
}

const META_QUESTION_TYPES = {
    SIMPLE: 'simple',
    APPENDIX: 'appendix',
    APPENDIX_PLUS: 'appendix+',
}

const PRIMITIVE_TYPES = {
    STRING: "string",
    BOOLEAN: "boolean",
    NUMBER: "number",
  };

const GENERATED_TASK_TYPES = {
    TAG_ANSWER: 'tag-answer'
}

module.exports = {USER_TYPES, ANSWER_TYPES, META_QUESTION_TYPES, PRIMITIVE_TYPES, GENERATED_TASK_TYPES};
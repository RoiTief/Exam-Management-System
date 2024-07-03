
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

const CREATED_TASK_SUPER_TYPES = {
    ROLE_SPECIFIC: 'role-specific',
    USER_SPECIFIC: 'user_specific',
}

const CREATED_TASK_TYPES = {
    EXPLANATION_COMPARISON: 'explanation-comparison',
    TAG_REVIEW: 'tag-review',
}

module.exports = {USER_TYPES, ANSWER_TYPES, META_QUESTION_TYPES, PRIMITIVE_TYPES, GENERATED_TASK_TYPES, CREATED_TASK_SUPER_TYPES, CREATED_TASK_TYPES};
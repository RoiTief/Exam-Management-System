export const APP_NAME = "Exam Management System";

export const APP_HEADER = "Exam Management";

export const HELLO_USER = (username) => `Hello, ${username}`
export const ACCOUNT = {
  ACCOUNT: "Account",
  ACCOUNT_SETTINGS: "Account Settings",
  SIGN_OUT: "Sign out",
  PASSWORDS_DO_NOT_MATCH: "Passwords do not match",
  ILLEGAL_PASSWORD: "Password must be at least 5 letters",
  FIRST_NAME: "First name",
  LAST_NAME: "Last Name",
  EMAIL: "Email Address",
  CHANGE_PASSWORD: "Change Password",
  CURRENT_PASSWORD: "Current Password",
  NEW_PASSWORD: "New Password",
  CONFIRM_PASSWORD: "Confirm New Password",
  FAILED: error => `${error}`
};

export const SIDE_BAR = {
  HOME_PAGE: "Home Page",
  MANAGE_USERS: "Manage Users",
  CREATE_META_QUESTION: "Create Meta-Question",
  SIMPLE_META_QUESTION: "Simple Meta-Question",
  APPENDIX_META_QUESTION: "Appendix Meta-Question",
  APPENDIX_PLUS_META_QUESTION: "Appendix plus Meta-Question",
  META_QUESTIONS_CATALOG: "Questions Catalog",
  META_QUESTIONS: "Meta Questions",
  APPENDICES: "Appendices",
  MANAGE_COURSE_STAFF: "Manage Course Staff",
  GENERATE_EXAM: "generate exams"
}

export const CALENDAR = {
  CALENDAR: "Calender"
}

export const FAQ = {
  FAQ: "FAQ"
}

export const QUESTIONS_TIPS = {
  QUESTIONS_TIPS: "Question Tips"
}

export const TASK_PROGRESS = {
  TASK_PROGRESS: "Task Progress"
}

export const TASK = {
  MY_TASKS_TITLE: "My Tasks",
  TASK_FINISHED_MESSAGE: "Task Finished!",
  TASK_ID_LABEL: "Task ID: ",
  PRIORITY_LABEL: "Priority: ",
  NEED_MORE_INFORMATION: "Need more information?",
  SUBMIT_BUTTON: "Submit",
  ENTER_ANSWER_PLACEHOLDER: "Enter your answer...",
  RESPONSE_MESSAGE: "Your response was: ",
};

export const USERS = {
  USERNAME_REQUIRED: "Username is required",
  FIRST_NAME_REQUIRED: "First name is required",
  LAST_NAME_REQUIRED: 'Last name is required',
  EMAIL_REQUIRED: 'Email is required',
  TYPE_REQUIRED: 'Type is required',
  INVALID_EMAIL:'Invalid email',
  INVALID_TYPE: 'Invalid type',
  ADD_USER: "Add User",
  INSERT_USER_DETAILS: "Insert User Details",
  SUBMIT: "Submit",
  EDIT_USER: "Edit User",
  USERNAME: "Username",
  FIRST_NAME: "First Name",
  LAST_NAME: "Last Name",
  EMAIL: "Email",
  TYPE: "Type",
  ACTIONS: "Actions",
  LECTURER: "Lecturer",
  TA: "TA",
  ADMIN: "Admin",
  CANCEL_ACTION: "Cancel",
  RESET_PASSWORD: "Reset Password",
  SAVE_ACTION: "Save Changes",
  CONFIRM_DELETION: "Confirm Deletion",
  CONFIRM_DELETION_MSG: (username) => `Are you sure you want to delete the user ${username}?`,
  CONFIRM_RESET_PASSWORD: "Confirm Reset Password",
  CONFIRM_RESET_PASSWORD_MSG: (username) => `Are you sure you want to reset the password of user ${username}?`,
}

export const LOGIN = {
  PAGE_TITLE: "Login",
  HEADING: "Login",
  USERNAME_LABEL: "Username",
  PASSWORD_LABEL: "Password",
  CONTINUE_BUTTON: "Continue",
  CHANGE_PASSWORD_TITLE: "Change Password",
  NEW_PASSWORD_LABEL: "New Password",
  CONFIRM_NEW_PASSWORD_LABEL: "Confirm New Password",
  CANCEL_BUTTON: "Cancel",
  CHANGE_PASSWORD_BUTTON: "Change Password",
  PASSWORDS_DO_NOT_MATCH: "Passwords do not match",
  ILLEGAL_PASSWORD: "Password must be at least 5 letters",
  FAILED_TO_CHANGE_PASSWORD: "Failed to change password:"
};

export const EDIT_QUESTION = "Edit Question"

export const CREATE_QUESTION = {
  CREATE_SIMPLE_TITLE: "Create Simple Meta-Question",
  CREATE_APPENDIX_PLUS_TITLE: "Create Simple Meta-Question",
  CREATE_APPENDIX_TITLE: "Create Meta-Question Based On Existing Appendix",
  SUBMIT_BUTTON: "Submit",
  VIEW_PDF_BUTTON: "View Question As PDF",
  STEM_REQUIRED: "Stem is required",
  CORRECT_ANSWER_REQUIRED: "The key cannot be empty, please fill it or delete it",
  EXPLANATION_REQUIRED: "Explanation is required",
  DISTRACTOR_REQUIRED: "The Distractor cannot be empty, please fill it or delete it",
  APPENDIX_TITLE_REQUIRED: "Title is required",
  APPENDIX_TAG_REQUIRED: "Tag is required",
  APPENDIX_CONTENT_REQUIRED: "Content is required",
  SELECT_QUESTION_HEADING: "Select a Question:",
  SELECT_KEY_HEADING: "Select The Correct Key",
  SELECT_DISTRACTORS_HEADING: "Select Distractors",
  SAVE_QUESTION_BUTTON: "Save Question",
  APPENDIX_TITLE: "Title: ",
  APPENDIX_CONTENT: "Content: ",
  META_QUESTION_TITLE: "Meta-Question: ",
  KEYWORDS_TITLE: "Keywords",
  KEY_TITLE: "Keys: ",
  DISTRACTOR_TITLE: "Distractors: ",
  NO_KEYS_MESSAGE_1: "There are no available keys for this question!",
  NO_KEYS_MESSAGE_2: "Please choose a different question",
  NO_DISTRACTORS_MESSAGE_1: "There are no available distractors for this question!",
  NO_DISTRACTORS_MESSAGE_2: "Please choose a different question",
};


export const QUESTIONS_CATALOG = {
  PAGE_TITLE: "Meta-Questions Catalog",
  HEADING: "Meta-Questions Catalog",
  CREATE_SIMPLE_BUTTON: "Create Simple MetaQuestion",
  CREATE_APPENDIX_BUTTON: "Create Appendix+MetaQuestion",
  META_QUESTION_TITLE: "Meta Question",
  APPENDIX_TITLE: "Appendix",
  SHOW_MORE_ANSWERS: "Show more answers",
  SHOW_LESS_ANSWERS: "Show less answers",
  SHOW_MORE_DISTRACTORS: "Show more distractors",
  SHOW_LESS_DISTRACTORS: "Show less distractors",
  STEM_HEADING: "Stem",
  KEYWORDS_HEADING: "Keywords",
  CORRECT_ANSWERS_HEADING: "Correct Answers",
  DISTRACTORS_HEADING: "Distractors",
  SEARCH_PLACEHOLDER: "Search question by keyword",
  ACTION: "Action",
  VIEW_PDF_BUTTON: "View PDF",
};

export const APPENDICES_CATALOG = {
  PAGE_TITLE: 'Appendices Catalog',
  HEADING: 'Appendices',
  CREATE_APPENDIX_BUTTON: 'Create Appendix',
  TITLE_HEADING: 'Title',
  TAG_HEADING: 'Tag',
  CONTENT_HEADING: 'Content',
  VIEW_PDF_BUTTON: 'View PDF',
  SEARCH_PLACEHOLDER: 'Search appendices...',
  RELATED_QUESION: 'The Appendix Is Attached To Those Questions:',
  NO_RELATED_QUESTIONS: 'The Appendix Has No Related Questions',
  SEARCH_TYPE_LABEL: 'Search Type',
  OPEN_TEXT: 'Open Text',
  TAG: 'Tag',
}

export const COURSE_STAFF = {
  PAGE_TITLE: "Course Staff",
  HEADING: "Course Management",
  LECTURERS_HEADING: "Lecturers",
  TAS_HEADING: "TAs",
  SHOW_MORE_ADMINS: "Show more admins",
  SHOW_LESS_ADMINS: "Show less admins",
  SHOW_MORE_TAS: "Show more TAs",
  SHOW_LESS_TAS: "Show less TAs",
  ADD_LECTURER_BUTTON: "Add Lecturer",
  ADD_TA_BUTTON: "Add TA",
  ADD_PERSONAL_TITLE: "Add Personal To Course",
  ADD_PERSONAL_BUTTON: "Add Personal",
  USERNAME_LABEL: "Username",
  USERNAME_REQUIRED: "Username is required",
};

export const EXAM = {
  PAGE_TITLE: "Create Exam",
  ADD_QUESTION_BUTTON: "+ Add Question",
  SAVE_TEST_BUTTON: "Save Exam",
  EXAM_PREVIEW_BUTTON: "Exam Preview",
  CREATED_QUESTIONS_HEADING: "Created Questions",
  MANUAL_STATE: "Manual Answer Generator",
  AUTOMATIC_STATE: "Automatic Answer Generator",
  NO_KEYS_MESSAGE_1: "There are no available keys for this question!",
  NO_KEYS_MESSAGE_2: "Please choose a different question",
  NO_DISTRACTORS_MESSAGE_1: "There are no available distractors for this question!",
  NO_DISTRACTORS_MESSAGE_2: "Please choose a different question",
  APPENDIX_HEADING: "Appendix",
  QUESTION_HEADING: "Question",
  ANSWER_HEADING: "Answer",
  DISTRACTORS_HEADING: "Distractors",
  SELECT_QUESTION_HEADING: "Select a Question:",
  SELECT_STEM_HEADING: "Select a Stem:",
  SELECT_KEY_HEADING: "Select The Correct Key:",
  SELECT_DISTRACTORS_HEADING: "Select Distractors:",
  SAVE_QUESTION_BUTTON: "Save Question",
  APPENDIX_TITLE: "Appendix: ",
  APPENDIX_CONTENT: "Content: ",
  META_QUESTION_TITLE: "Meta-Question: ",
  KEY_TITLE: "Key: ",
  DISTRACTOR_TITLE: "Distractors: ",
  NEXT: "Next",
  DESELECT_QUESTION: "Deselect Question",
  MAX_DISTRACTOR_NUMBER: 2,
  get SELECT_DISTRACTORS_BODY() {
    return `Please select up to ${this.MAX_DISTRACTOR_NUMBER} distractors`;
  },
  get DISTRACTORS_MAX_AMOUNT() {
    return `You have selected the maximum number of distractors (${this.MAX_DISTRACTOR_NUMBER}).`;
  }
};
const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!email || !email.includes('@')) {
    errors.push('Valid email is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: errors.join(', ')
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push('Email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: errors.join(', ')
    });
  }

  next();
};

const validateFormCreation = (req, res, next) => {
  const { title, questions } = req.body;
  const errors = [];

  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }

  if (!Array.isArray(questions)) {
    errors.push('Questions must be an array');
  } else {
    if (questions.length < 3 || questions.length > 5) {
      errors.push('Forms must have between 3 and 5 questions');
    }

    questions.forEach((question, index) => {
      if (!question.questionText || question.questionText.trim().length < 5) {
        errors.push(`Question ${index + 1}: Question text must be at least 5 characters long`);
      }

      if (!question.type || !['text', 'multiple-choice'].includes(question.type)) {
        errors.push(`Question ${index + 1}: Type must be either 'text' or 'multiple-choice'`);
      }

      if (question.type === 'multiple-choice') {
        if (!Array.isArray(question.options) || question.options.length < 2) {
          errors.push(`Question ${index + 1}: Multiple-choice questions must have at least 2 options`);
        } else {
          question.options.forEach((option, optIndex) => {
            if (!option || option.trim().length === 0) {
              errors.push(`Question ${index + 1}, Option ${optIndex + 1}: Option text cannot be empty`);
            }
          });
        }
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: errors.join(', ')
    });
  }

  next();
};

const validateFormResponse = (req, res, next) => {
  const { answers } = req.body;
  const errors = [];

  if (!Array.isArray(answers)) {
    errors.push('Answers must be an array');
  } else {
    answers.forEach((answer, index) => {
      if (typeof answer.questionIndex !== 'number' || answer.questionIndex < 0) {
        errors.push(`Answer ${index + 1}: Invalid question index`);
      }

      if (answer.answer === undefined || answer.answer === null || answer.answer === '') {
        errors.push(`Answer ${index + 1}: Answer cannot be empty`);
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: errors.join(', ')
    });
  }

  next();
};

const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format'
    });
  }

  next();
};

const validateFormId = (req, res, next) => {
  const { formId } = req.params;
  
  if (!formId || formId.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Form ID is required'
    });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateFormCreation,
  validateFormResponse,
  validateObjectId,
  validateFormId
}; 
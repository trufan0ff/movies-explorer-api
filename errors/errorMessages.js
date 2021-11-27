module.exports = {
  email: {
    'any.custom': 'Почта не прошла валидацию',
    'any.required': 'Не указана почта',
    'string.empty': 'Поле "почта" не содержит информацию',
  },
  password: {
    'string.min': 'Пароль должен содержать не менее {#limit} символов',
    'any.required': 'Не указан пароль',
    'string.empty': 'Поле "пароль" не содержит информацию',
  },
  string: {
    'any.required': 'Не указано поле {#label}',
    'string.empty': 'Поле {#label} не содержит информацию',
    'sting.base': 'Поле {#label} должно иметь тип string',
  },
  number:
    {
      'any.required': 'Не указано поле {#label}',
      'string.empty': 'Поле {#label} не содержит информацию',
      'number.min': '{#label} не может быть меньше 1',
      'number.base': 'Поле {#label} должно иметь тип number',
    },
  url: {
    'any.required': 'Не указано поле {#label}',
    'any.custom': 'Ссылка в поле {#label} не прошла валидацию',
    'string.empty': 'Поле {#label} не содержит информацию',
    'sting.base': 'Поле {#label} должно иметь тип sting',
  },

};

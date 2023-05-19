/* eslint-disable camelcase */
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate';
import {
  alpha_dash,
  alpha_spaces,
  confirmed,
  email,
  max,
  max_value,
  min,
  numeric,
  required,
  required_if,
} from 'vee-validate/dist/rules';
import Vue from 'vue';

Vue.component('validation-observer', ValidationObserver);
Vue.component('validation-provider', ValidationProvider);

extend('required', {
  ...required,
  message: 'The {_field_} field is required',
});

extend('required_if', {
  ...required_if,
  message: 'The {_field_} field is required',
});

extend('confirmed', {
  ...confirmed,
  message: 'The {_field_} field confirmation does not match',
});

extend('max', {
  ...max,
  message: 'The {_field_} field may not be greater than {length} characters',
});

extend('max_value', {
  ...max_value,
  message: 'The {_field_} field must be {max} or less',
});

extend('min', {
  ...min,
  message: 'The {_field_} field must be at least {length} characters',
});

extend('email', {
  ...email,
  message: 'The {_field_} field must be a valid email',
});

extend('numeric', {
  ...numeric,
  message: 'The {_field_} field may only contain numeric characters',
});

extend('alpha_dash', {
  ...alpha_dash,
  message:
    'The {_field_} field may contain alpha-numeric characters as well as dashes and underscores',
});

extend('alpha_spaces', {
  ...alpha_spaces,
  message:
    'The {_field_} field may only contain alphabetic characters as well as spaces',
});

extend('mobile', (value) => {
  const regex = /(^([+]{1}[8]{2}|0088)?(01)(3|7|8|6|9|5)\d{8})$/;
  const result = regex.exec(value);

  if (result != null && result[0] === value) {
    return true;
  }

  return 'The {_field_} field must be a valid mobile number.';
});

extend('decimal', {
  validate(value, { decimals = '*', separator = '.' } = {}) {
    // if is 0.
    if (Number(decimals) === 0) {
      return /^-?\d*$/.test(value);
    }

    const regexPart = decimals === '*' ? '+' : `{1,${decimals}}`;
    const regex = new RegExp(
      `^[-+]?\\d*(\\${separator}\\d${regexPart})?([eE]{1}[-]?\\d+)?$`
    );

    if (!regex.test(value)) {
      return false;
    }

    const parsedValue = parseFloat(value);

    // eslint-disable-next-line
    return parsedValue === parsedValue;
  },
  params: ['decimals', 'separator'],
  message:
    'The {_field_} field must be numeric and may contain {decimals} decimal points.',
});

export const isBetweenMessage = (min: number, max: number, decimals = 0) =>
  `The value must be between ${formatNumber(min, decimals)} and ${formatNumber(max, decimals)}`;

export const isGreaterThanMessage = (value: number, decimals = 0) =>
  `The value must be greater than ${formatNumber(value, decimals)}`;

export const isGreaterThanOrEqualsMessage = (value: number, decimals = 0) =>
  `The value must be greater than or equal to ${formatNumber(value, decimals)}`;

export const isLessThanMessage = (value: number, decimals = 0) =>
  `The value must be less than ${formatNumber(value, decimals)}`;

export const isLessThanOrEqualsMessage = (value: number, decimals = 0) =>
  `The value must be less than or equal to ${formatNumber(value, decimals)}`;

export const isLongerThanOrEqualsMessage = (value: number, field = 'value') =>
  `The ${field} must be at least ${value} characters long`;

export const isPositiveMessage = () => 'The value must be a positive number';

export const isRequiredMessage = () => 'The value is required';

export const isRequiredTrueMessage = () => 'Acceptance is required';

export const isShorterThanOrEqualsMessage = (value: number, field = 'value') =>
  `The ${field} can not be more than ${value} characters long`;

export const isValidEmailMessage = () =>
  'The value must be a valid email address';

export const isValidPhoneNumberMessage = () =>
  'Please enter your mobile phone number in international format, for example: +3585551234';

export const isOrganizationalEmailMessage = (domain: string) =>
  `Please provide an email address from your organization's domain instead of ${domain}. If your organization does not provide an email address, please contact service desk to complete your registration.`;

export const isFutureDateMessage = () => 'The value must be a future date';

export const isInAllowedDateRangeMessage = (limit: number) =>
  `The value must be within ${limit} months from today`;

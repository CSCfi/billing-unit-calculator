import type { SuiteRunResult } from 'vest';

export const createValidation = (
  validation: SuiteRunResult<string, string> | undefined,
  validate: (name: string, only?: string) => Promise<void | any>,
  field: string,
  immediate = false,
) => ({
  valid: !validation?.hasErrors(field),
  validation: validation?.getErrors(field)[0],
  'data-error': !!validation?.hasErrors(field),
  onInput: () => (immediate || validation) && validate(field),
});

export const gotoError = () => {
  const error = document.querySelector('[data-error="true"]');

  if (error) {
    error.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
};

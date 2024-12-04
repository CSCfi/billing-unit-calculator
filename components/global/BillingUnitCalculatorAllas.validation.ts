import { create, test, enforce, only } from 'vest';
import {
  isRequiredMessage,
  isBetweenMessage,
  isPositiveMessage,
} from '@/utils/validationMessages';

export const billingUnitClaculatorAllasSuite = create((data, name?: string) => {
  only(name);

  test('name', isRequiredMessage(), () => {
    enforce(data.value.name).isNotBlank();
  });

  test('amountOfTiB', isRequiredMessage(), () => {
    enforce(data.value.amountOfTiB).isNotBlank();
  });

  test('amountOfTiB', isBetweenMessage(0.1, 1000), () => {
    enforce(data.value.amountOfTiB).isBetween(0.1, 1000);
  });

  test('runningTime', isRequiredMessage(), () => {
    enforce(data.value.runningTime).isNotEmpty();
  });

  test('runningTime', isPositiveMessage(), () => {
    enforce(data.value.runningTime).isPositive();
  });
});

export default billingUnitClaculatorAllasSuite;

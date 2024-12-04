import { create, test, enforce, only } from 'vest';
import {
  isRequiredMessage,
  isBetweenMessage,
  isPositiveMessage,
} from '@/utils/validationMessages';

export const billingUnitCalculatorRahtiSuite = create((data, name?: string) => {
  only(name);

  test('name', isRequiredMessage(), () => {
    enforce(data.value.name).isNotEmpty();
  });

  test('amountOfPods', isRequiredMessage(), () => {
    enforce(data.value.amountOfPods).isNotBlank();
  });

  test('amountOfPods', isBetweenMessage(1, 100), () => {
    enforce(data.value.amountOfPods).isBetween(1, 100);
  });

  test('numberOfCpuCoresPerPod', isRequiredMessage(), () => {
    enforce(data.value.numberOfCpuCoresPerPod).isNotBlank();
  });

  test('numberOfCpuCoresPerPod', isBetweenMessage(0.1, 100), () => {
    enforce(data.value.numberOfCpuCoresPerPod).isBetween(0.1, 100);
  });

  test('ramPerPod', isRequiredMessage(), () => {
    enforce(data.value.ramPerPod).isNotBlank();
  });

  test('ramPerPod', isBetweenMessage(0.1, 500), () => {
    enforce(data.value.ramPerPod).isBetween(0.1, 500);
  });

  test('tibOfStorage', isRequiredMessage(), () => {
    enforce(data.value.tibOfStorage).isNotBlank();
  });

  test('tibOfStorage', isBetweenMessage(0, 100), () => {
    enforce(data.value.tibOfStorage).isBetween(0, 100);
  });

  test('runningTime', isRequiredMessage(), () => {
    enforce(data.value.runningTime).isNotEmpty();
  });

  test('runningTime', isPositiveMessage(), () => {
    enforce(data.value.runningTime).isPositive();
  });
});

export default billingUnitCalculatorRahtiSuite;

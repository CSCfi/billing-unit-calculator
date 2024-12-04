import { create, test, enforce, only, each } from 'vest';
import {
  isRequiredMessage,
  isBetweenMessage,
  isPositiveMessage,
} from '@/utils/validationMessages';

export const billingUnitCalculatorCPoutaSuite = create(
  (data, name?: string) => {
    only(name);

    each(data.items.value, (item: any, index) => {
      test(
        `name-${index}`,
        isRequiredMessage(),
        () => {
          enforce(item.name).isNotEmpty();
        },
        `${item.id}-name`,
      );

      test(
        `selectedSize-${index}`,
        isRequiredMessage(),
        () => {
          enforce(item.selectedSize).isNotBlank();
        },
        `${item.id}-selectedSize`,
      );

      test(
        `floatingIps-${index}`,
        isRequiredMessage(),
        () => {
          enforce(item.floatingIps).isNotEmpty();
        },
        `${item.id}-floatingIps`,
      );

      test(
        `floatingIps-${index}`,
        isBetweenMessage(0, 20),
        () => {
          enforce(item.floatingIps).isBetween(0, 20);
        },
        `${item.id}-floatingIps-between`,
      );

      test(
        `tibOfStorage-${index}`,
        isRequiredMessage(),
        () => {
          enforce(item.tibOfStorage).isNotEmpty();
        },
        `${item.id}-tibOfStorage`,
      );

      test(
        `tibOfStorage-${index}`,
        isBetweenMessage(0, 100),
        () => {
          enforce(item.tibOfStorage).isBetween(0, 100);
        },
        `${item.id}-tibOfStorage-between`,
      );

      test(
        `runningTime-${index}`,
        isRequiredMessage(),
        () => {
          enforce(item.runningTime).isNotEmpty();
        },
        `${item.id}-runningTime`,
      );

      test(
        `runningTime-${index}`,
        isPositiveMessage(),
        () => {
          enforce(item.runningTime).isPositive();
        },
        `${item.id}-runningTime-positive`,
      );
    });
  },
);

export default billingUnitCalculatorCPoutaSuite;

import { create, test, enforce, only, each } from 'vest';
import {
  isRequiredMessage,
  isPositiveMessage,
} from '@/utils/validationMessages';

export const billingUnitCalculatorSdDesktopSuite = create(
  (data, name?: string) => {
    only(name);

    each(data.items.value, (item: any, index) => {
      only(name);
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

export default billingUnitCalculatorSdDesktopSuite;

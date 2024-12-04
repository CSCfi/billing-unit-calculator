import { create, test, enforce, only, each, omitWhen } from 'vest';
import {
  isRequiredMessage,
  isBetweenMessage,
  isPositiveMessage,
} from '@/utils/validationMessages';

export const billingUnitCalculatorMahtiSuite = create((data, name?: string) => {
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
      `partition-${index}`,
      isRequiredMessage(),
      () => {
        enforce(item.partition).isNotEmpty();
      },
      `${item.id}-partition`,
    );

    omitWhen(item.partition !== 'normal', () => {
      test(
        `numberOfNodes-${index}`,
        isRequiredMessage(),
        () => {
          enforce(item.numberOfNodes).isNotEmpty();
        },
        `${item.id}-numberOfNodes`,
      );

      test(
        `numberOfNodes-${index}`,
        isBetweenMessage(1, 700),
        () => {
          enforce(item.numberOfNodes).isBetween(1, 700);
        },
        `${item.id}-numberOfNodes-between`,
      );
    });

    omitWhen(item.partition !== 'interactive', () => {
      test(
        `numberOfCores-${index}`,
        isRequiredMessage(),
        () => {
          enforce(item.numberOfCores).isNotEmpty();
        },
        `${item.id}-numberOfCores`,
      );

      test(
        `numberOfCores-${index}`,
        isBetweenMessage(1, 8),
        () => {
          enforce(item.numberOfCores).isBetween(1, 8);
        },
        `${item.id}-numberOfCores-between`,
      );
    });

    omitWhen(item.partition !== 'gpu', () => {
      test(
        `numberOfGpus-${index}`,
        isRequiredMessage(),
        () => {
          enforce(item.numberOfGpus).isNotEmpty();
        },
        `${item.id}-numberOfGpus`,
      );

      test(
        `numberOfGpus-${index}`,
        isBetweenMessage(1, 24),
        () => {
          enforce(item.numberOfGpus).isBetween(1, 24);
        },
        `${item.id}-numberOfGpus-between`,
      );
    });

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
});

export default billingUnitCalculatorMahtiSuite;

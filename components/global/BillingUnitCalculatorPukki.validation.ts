import { create, test, enforce, only, each } from 'vest';
import {
  isRequiredMessage,
  isPositiveMessage,
} from '@/utils/validationMessages';

export const billingUnitCalculatorPukkiSuite = create((data, name?: string) => {
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
      `volumeSize-${index}`,
      isRequiredMessage(),
      () => {
        enforce(item.volumeSize).isNotEmpty();
      },
      `${item.id}-runningTime`,
    );

    test(
      `volumeSize-${index}`,
      isPositiveMessage(),
      () => {
        enforce(item.volumeSize).isPositive();
      },
      `${item.id}-volumeSize-positive`,
    );

    test(
      `volumeSize-${index}`,
      isBetweenMessage(1, 50),
      () => {
        enforce(item.volumeSize).isBetween(1, 50);
      },
      `${item.id}-volumeSize-max`,
    );

    test(
      `runningTime-${index}`,
      isRequiredMessage(),
      () => {
        enforce(item.runningTime).isNotEmpty();
      },
      `${item.id}-runningTime-pukki`,
    );

    test(
      `runningTime-${index}`,
      isPositiveMessage(),
      () => {
        enforce(item.runningTime).isPositive();
      },
      `${item.id}-runningTime-pukki-positive`,
    );
  });
});

export default billingUnitCalculatorPukkiSuite;

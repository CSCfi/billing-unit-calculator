import { create, test, enforce, only, each } from 'vest';
import {
  isRequiredMessage,
  isBetweenMessage,
  isPositiveMessage,
} from '@/utils/validationMessages';

export const billingUnitCalculatorPuhtiSuite = create((data, name?: string) => {
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
      `numberOfCpuCores-${index}`,
      isRequiredMessage(),
      () => {
        enforce(item.numberOfCpuCores).isNotEmpty();
      },
      `${item.id}-numberOfCpuCores`,
    );

    test(
      `numberOfCpuCores-${index}`,
      isBetweenMessage(1, 40000),
      () => {
        enforce(item.numberOfCpuCores).isBetween(1, 40000);
      },
      `${item.id}-numberOfCpuCores-between`,
    );

    test(
      `numberOfGpus-${index}`,
      isRequiredMessage(),
      () => {
        enforce(item.numberOfGpus).isNotBlank();
      },
      `${item.id}-numberOfGpus`,
    );

    test(
      `numberOfGpus-${index}`,
      isBetweenMessage(0, 320),
      () => {
        enforce(item.numberOfGpus).isBetween(0, 320);
      },
      `${item.id}-numberOfGpus-between`,
    );

    test(
      `totalMemory-${index}`,
      isRequiredMessage(),
      () => {
        enforce(item.totalMemory).isNotEmpty();
      },
      `${item.id}-totalMemory`,
    );

    test(
      `totalMemory-${index}`,
      isBetweenMessage(1, 250000000),
      () => {
        enforce(item.totalMemory).isBetween(1, 250000000);
      },
      `${item.id}-totalMemory-between`,
    );

    test(
      `NVMe-${index}`,
      isRequiredMessage(),
      () => {
        enforce(item.NVMe).isNotBlank();
      },
      `${item.id}-NVMe`,
    );

    test(
      `NVMe-${index}`,
      isBetweenMessage(0, 432000),
      () => {
        enforce(item.NVMe).isBetween(0, 432000);
      },
      `${item.id}-NVMe-between`,
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
});

export default billingUnitCalculatorPuhtiSuite;

export type TotalConsumption = {
  estimatedPackages: number;
  estimatedPrice: number;
  totalBillingUnits: number;
  recommendedPackage: {
    label: string;
    name: string;
    description: string;
  };
};

export type EstimateEvent = {
  type: keyof Estimates;
  key: 'jobs' | 'storage' | 'configurations';
  value: any[];
};

export type Storage = {
  consumption: string;
  description: string;
  storageTimeInHours: number;
};

export type MahtiJob = {
  consumption: number;
  description: string;
  name: string;
  numberOfCores: number;
  numberOfGpus: number;
  numberOfNodes: number;
  partition: string;
  runningTimeInHours: number;
};

export type PuhtiJob = {
  consumption: number;
  description: string;
  name: string;
  numberOfCpuCores: number;
  numberOfGpus: number;
  NVMe: number;
  runningTimeInHours: number;
  totalMemory: number;
};

export type AllasConfiguration = {
  consumption: string;
  description: string;
  name: string;
  runningTimeInHours: number;
  extra?: {
    name: string;
    description: string;
    subtitle: string;
    buh: number;
  };
};

export type BaseEstimate = {
  configurations?: any[];
  jobs?: any[];
  storage?: any[];
  type: string;
  icon?: string;
};

export type MahtiEstimate = BaseEstimate & {
  jobs: MahtiJob[];
  storage: Storage[];
};

export type PuhtiEstimate = BaseEstimate & {
  jobs: PuhtiJob[];
  storage: Storage[];
};

export type AllasEstimate = BaseEstimate & {
  configurations: AllasConfiguration[];
};

export type RahtiEstimate = BaseEstimate & {
  configurations: AllasConfiguration[];
};

export type CPoutaEstimate = BaseEstimate & {
  configurations: AllasConfiguration[];
};

export type SdDesktopEstimate = BaseEstimate & {
  configurations: AllasConfiguration[];
};

export type PukkiEstimate = BaseEstimate & {
  configurations: AllasConfiguration[];
};

export type Estimates = {
  Allas: AllasEstimate;
  CPouta: CPoutaEstimate;
  Mahti: MahtiEstimate;
  Puhti: PuhtiEstimate;
  Rahti: RahtiEstimate;
  SdDesktop: SdDesktopEstimate;
  Pukki: PukkiEstimate;
};

export type Estimate =
  | AllasEstimate
  | CPoutaEstimate
  | MahtiEstimate
  | PuhtiEstimate
  | RahtiEstimate
  | SdDesktopEstimate
  | PukkiEstimate;

export type Job = MahtiJob | PuhtiJob;

export type Configuration = AllasConfiguration;

export type EstimateItem = Job | Configuration | Storage;

export type EmailPayload = {
  selectedServices: SelectedService[];
  totalBillingUnits: number;
  recommendedResourcePackage: string;
  resourcePackageDetails: string;
  estimatedPrice: number;
  packagesRequired: number;
  email: string;
  recaptchaResponse: string;
};

export type SelectedService = {
  type: string;
  configurations?: Configuration[];
  storage?: Storage[];
  jobs?: Job[];
};

export type Partition = {
  name: string;
  value: string;
};

import type {
  BillingCycle,
  SubscriptionStatus,
} from '../../../../subscription/domain/entities/subscription.entity';
export interface GetMyProfileResult {
  person: {
    id: string;
    fullName: string;
    email: string | null;
  };
  primaryMembership: {
    residentialComplex: {
      id: string;
      name: string;
    };
    role: {
      code: string;
      name: string;
    };
  } | null;
  memberships: Array<{
    residentialComplex: {
      id: string;
      name: string;
    };
    role: {
      code: string;
      name: string;
    };
  }>;
  subscription: {
    id: string;
    billingCycle: BillingCycle;
    price: number;
    status: SubscriptionStatus;
    startDate: Date;
    nextBillingDate: Date | null;
    plan: {
      code: string;
      name: string;
      maxComplexes: number;
      maxUnits: number;
    };
  } | null;
}

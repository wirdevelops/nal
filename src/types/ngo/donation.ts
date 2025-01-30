// types/donation.ts
import { Type, Static } from '@sinclair/typebox';
import { UUID_PATTERN } from '../common';

// ===== Schemas =====
export const DonationFrequencySchema = Type.Union([
  Type.Literal('one_time'),
  Type.Literal('monthly'),
  Type.Literal('annually'),
  Type.Literal('quarterly')
]);

export const PaymentStatusSchema = Type.Union([
  Type.Literal('pending'),
  Type.Literal('completed'),
  Type.Literal('failed'),
  Type.Literal('refunded')
]);

export const ReceiptSchema = Type.Object({
  id: Type.RegExp(UUID_PATTERN),
  date: Type.String({ format: 'date-time' }),
  url: Type.String(),
  details: Type.Optional(Type.String())
});

export const ImpactMetricSchema = Type.Object({
  metric: Type.String(),
  value: Type.Number(),
  date: Type.String({ format: 'date-time' }),
  details: Type.Optional(Type.String())
});

export const DonationAllocationSchema = Type.Object({
  projectId: Type.RegExp(UUID_PATTERN),
  percentage: Type.Number({ minimum: 0, maximum: 100 })
});

export const DonorInfoSchema = Type.Object({
  avatar: Type.Optional(Type.String({ format: 'uri' })),
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  anonymous: Type.Boolean()
});

export const DonationSchema = Type.Object({
  id: Type.RegExp(UUID_PATTERN),
  donorId: Type.RegExp(UUID_PATTERN),
  projectId: Type.Optional(Type.RegExp(UUID_PATTERN)),
  amount: Type.Number({ minimum: 0 }),
  frequency: DonationFrequencySchema,
  status: PaymentStatusSchema,
  receipt: Type.Optional(ReceiptSchema),
  impact: Type.Optional(Type.Array(ImpactMetricSchema)),
  donationDate: Type.String({ format: 'date-time' }),
  paymentMethod: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  currency: Type.String({ minLength: 3, maxLength: 3 }),
  allocation: Type.Array(DonationAllocationSchema),
  donor: DonorInfoSchema,
  anonymous: Type.Boolean(),
  tier: Type.Optional(Type.String()),
  message: Type.Optional(Type.String()),
  date: Type.String({ format: 'date-time' })
});

// ===== Derived Types =====
export type DonationFrequency = Static<typeof DonationFrequencySchema>;
export type PaymentStatus = Static<typeof PaymentStatusSchema>;
export type Receipt = Static<typeof ReceiptSchema>;
export type ImpactMetric = Static<typeof ImpactMetricSchema>;
export type DonationAllocation = Static<typeof DonationAllocationSchema>;
export type DonorInfo = Static<typeof DonorInfoSchema>;
export type Donation = Static<typeof DonationSchema>;

// ===== Validation Helpers =====
export const validateDonationFrequency = (
    frequency: unknown
  ): frequency is DonationFrequency => {
    const validFrequencies = DonationFrequencySchema.anyOf.map(
      s => s.const as DonationFrequency
    );
    return typeof frequency === 'string' && validFrequencies.includes(frequency as DonationFrequency);
  };
  
  export const validatePaymentStatus = (
    status: unknown
  ): status is PaymentStatus => {
    const validStatuses = PaymentStatusSchema.anyOf.map(
      s => s.const as PaymentStatus
    );
    return typeof status === 'string' && validStatuses.includes(status as PaymentStatus);
  };
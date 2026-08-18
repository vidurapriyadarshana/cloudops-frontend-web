export interface StandardResponse<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}

// Client & Billing
export interface Client {
  id: string;
  companyName: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

export interface ClientRequest {
  companyName: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
}

export interface Subscription {
  id: string;
  clientId: string;
  companyName?: string;
  productId: string;
  planTier: 'BASIC' | 'PRO' | 'ENTERPRISE';
  monthlyAmount: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
  startDate: string;
  nextBillingDate: string;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  createdAt?: string;
}

export interface SubscriptionRequest {
  clientId: string;
  productId: string;
  planTier: string;
  monthlyAmount: number;
  billingCycle?: string;
  startDate: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  companyName?: string;
  subscriptionId?: string;
  invoiceNumber: string;
  amountDue: number;
  taxAmount: number;
  totalAmount: number;
  status: 'DRAFT' | 'UNPAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  issueDate: string;
  dueDate: string;
  gcsPdfUrl?: string;
  createdAt?: string;
}

export interface InvoiceGenerateRequest {
  clientId: string;
  subscriptionId?: string;
  amountDue: number;
  taxAmount?: number;
  dueDate: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber?: string;
  amountPaid: number;
  paymentMethod: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'PAYPAL';
  transactionReference?: string;
  status: 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentDate: string;
  createdAt?: string;
}

export interface PaymentRequest {
  invoiceId: string;
  amountPaid: number;
  paymentMethod: string;
  transactionReference?: string;
}

// Products & Licenses
export interface PricingTier {
  tier: 'BASIC' | 'PRO' | 'ENTERPRISE';
  monthlyPrice: number;
  maxUsers: number;
}

export interface Product {
  id: string;
  productId: string;
  name: string;
  category: string;
  description?: string;
  version?: string;
  features?: string[];
  pricingTiers?: PricingTier[];
  gcsManualUrl?: string;
  gcsInstallerUrl?: string;
  status: 'ACTIVE' | 'DEPRECATED' | 'ARCHIVED';
  createdAt?: string;
}

export interface ProductRequest {
  productId: string;
  name: string;
  category: string;
  description?: string;
  version?: string;
  features?: string[];
  pricingTiers?: PricingTier[];
}

export interface License {
  id: string;
  licenseKey: string;
  clientId: string;
  productId: string;
  planTier: string;
  maxSeats: number;
  assignedSeats: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdAt?: string;
}

export interface LicenseRequest {
  clientId: string;
  productId: string;
  planTier: string;
  maxSeats: number;
  validFrom: string;
  validUntil: string;
}

// Service Desk
export interface Attachment {
  fileName: string;
  fileType: string;
  fileSize: number;
  gcsUrl: string;
}

export interface TimelineEntry {
  action: string;
  performedBy: string;
  details?: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  clientId: string;
  productId?: string;
  subject: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'PENDING_CLIENT' | 'RESOLVED' | 'CLOSED';
  slaTargetHours: number;
  assignedAgent?: string;
  attachments?: Attachment[];
  timeline?: TimelineEntry[];
  createdAt: string;
  updatedAt?: string;
}

export interface TicketRequest {
  clientId: string;
  productId?: string;
  subject: string;
  description: string;
  priority: string;
}

export interface Comment {
  id: string;
  ticketId: string;
  senderType: 'CLIENT' | 'AGENT' | 'SYSTEM';
  senderName: string;
  message: string;
  attachments?: Attachment[];
  createdAt: string;
}

export interface CommentRequest {
  senderType: string;
  senderName: string;
  message: string;
}

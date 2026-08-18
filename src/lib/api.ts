import {
  StandardResponse,
  Client,
  ClientRequest,
  Subscription,
  SubscriptionRequest,
  Invoice,
  InvoiceGenerateRequest,
  Payment,
  PaymentRequest,
  Product,
  ProductRequest,
  License,
  LicenseRequest,
  Ticket,
  TicketRequest,
  Comment,
  CommentRequest,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (options.body instanceof FormData) {
    delete (defaultHeaders as Record<string, string>)['Content-Type'];
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || `API Error: ${response.statusText}`);
    } catch {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }
  }

  const result: StandardResponse<T> = await response.json();
  return result.data;
}

export const api = {
  // Clients
  getClients: (status?: string) =>
    fetchApi<Client[]>(`/clients${status ? `?status=${status}` : ''}`),
  getClientById: (id: string) => fetchApi<Client>(`/clients/${id}`),
  createClient: (data: ClientRequest) =>
    fetchApi<Client>('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Subscriptions
  getSubscriptions: () => fetchApi<Subscription[]>('/subscriptions'),
  getSubscriptionsByClient: (clientId: string) =>
    fetchApi<Subscription[]>(`/subscriptions/client/${clientId}`),
  createSubscription: (data: SubscriptionRequest) =>
    fetchApi<Subscription>('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  cancelSubscription: (id: string) =>
    fetchApi<Subscription>(`/subscriptions/${id}/cancel`, {
      method: 'PATCH',
    }),

  // Invoices
  getInvoices: (status?: string) =>
    fetchApi<Invoice[]>(`/invoices${status ? `?status=${status}` : ''}`),
  getInvoiceById: (id: string) => fetchApi<Invoice>(`/invoices/${id}`),
  getInvoicesByClient: (clientId: string) =>
    fetchApi<Invoice[]>(`/invoices/client/${clientId}`),
  generateInvoice: (data: InvoiceGenerateRequest) =>
    fetchApi<Invoice>('/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Payments
  getPayments: () => fetchApi<Payment[]>('/payments'),
  getPaymentsByInvoice: (invoiceId: string) =>
    fetchApi<Payment[]>(`/payments/invoice/${invoiceId}`),
  recordPayment: (data: PaymentRequest) =>
    fetchApi<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Products
  getProducts: (status?: string, category?: string) => {
    const query = new URLSearchParams();
    if (status) query.append('status', status);
    if (category) query.append('category', category);
    return fetchApi<Product[]>(`/products${query.toString() ? `?${query.toString()}` : ''}`);
  },
  getProductById: (id: string) => fetchApi<Product>(`/products/${id}`),
  createProduct: (data: ProductRequest, manualFile?: File, installerFile?: File) => {
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (manualFile) formData.append('manual', manualFile);
    if (installerFile) formData.append('installer', installerFile);

    return fetchApi<Product>('/products', {
      method: 'POST',
      body: formData,
    });
  },

  // Licenses
  getLicenses: () => fetchApi<License[]>('/licenses'),
  getLicensesByClient: (clientId: string) =>
    fetchApi<License[]>(`/licenses/client/${clientId}`),
  issueLicense: (data: LicenseRequest) =>
    fetchApi<License>('/licenses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  revokeLicense: (id: string) =>
    fetchApi<void>(`/licenses/${id}/revoke`, {
      method: 'PATCH',
    }),

  // Tickets
  getTickets: (clientId?: string, status?: string, priority?: string) => {
    const query = new URLSearchParams();
    if (clientId) query.append('clientId', clientId);
    if (status) query.append('status', status);
    if (priority) query.append('priority', priority);
    return fetchApi<Ticket[]>(`/tickets${query.toString() ? `?${query.toString()}` : ''}`);
  },
  getTicketById: (id: string) => fetchApi<Ticket>(`/tickets/${id}`),
  createTicket: (data: TicketRequest, files?: File[]) => {
    const formData = new FormData();
    formData.append('ticket', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (files && files.length > 0) {
      files.forEach((f) => formData.append('files', f));
    }
    return fetchApi<Ticket>('/tickets', {
      method: 'POST',
      body: formData,
    });
  },
  updateTicket: (id: string, updateData: Partial<Ticket> & { performedBy?: string }) =>
    fetchApi<Ticket>(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    }),

  // Comments
  getCommentsByTicket: (ticketId: string) => fetchApi<Comment[]>(`/tickets/${ticketId}/comments`),
  addComment: (ticketId: string, data: CommentRequest, files?: File[]) => {
    const formData = new FormData();
    formData.append('comment', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (files && files.length > 0) {
      files.forEach((f) => formData.append('files', f));
    }
    return fetchApi<Comment>(`/tickets/${ticketId}/comments`, {
      method: 'POST',
      body: formData,
    });
  },
};

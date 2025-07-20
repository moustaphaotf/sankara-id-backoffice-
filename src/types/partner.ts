export interface Partner {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  tier: 'basic' | 'premium' | 'enterprise';
  apiKey: string;
  createdAt: string;
  lastActivity: string;
  totalDocuments: number;
  monthlyQuota: number;
  usedQuota: number;
  webhookUrl?: string;
  settings: {
    autoApproval: boolean;
    notificationEmail: boolean;
    maxFileSize: number;
  };
}

export interface Document {
  id: string;
  partnerId: string;
  partnerName: string;
  type: 'passport' | 'id_card' | 'driving_license' | 'utility_bill';
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  confidence: number;
  extractedData: Record<string, any>;
  rejectionReason?: string;
}

export interface Analytics {
  totalPartners: number;
  activePartners: number;
  totalDocuments: number;
  pendingDocuments: number;
  approvalRate: number;
  averageProcessingTime: number;
  monthlyGrowth: number;
  dailyStats: Array<{
    date: string;
    documents: number;
    approvals: number;
    rejections: number;
  }>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'reviewer' | 'manager';
  avatar?: string;
}
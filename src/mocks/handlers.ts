import { http, HttpResponse } from 'msw';
import { mockPartners, mockDocuments, mockAnalytics, mockUser } from './data';
import { FilterParams } from '../types/api';

export const handlers = [
  // Authentification
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    
    if (body.email === 'admin@company.com' && body.password === 'password123') {
      return HttpResponse.json({
        success: true,
        data: {
          user: mockUser,
          token: 'mock_jwt_token_12345',
        },
        message: 'Connexion réussie',
      });
    }
    
    return HttpResponse.json(
      {
        success: false,
        message: 'Identifiants invalides',
      },
      { status: 401 }
    );
  }),

  // Analytics
  http.get('/api/analytics', () => {
    return HttpResponse.json({
      success: true,
      data: mockAnalytics,
      message: 'Analytics récupérées avec succès',
    });
  }),

  // Partenaires
  http.get('/api/partners', ({ request }) => {
    const url = new URL(request.url);
    const filters: FilterParams = {
      search: url.searchParams.get('search') || undefined,
      status: url.searchParams.get('status') || undefined,
      tier: url.searchParams.get('tier') || undefined,
      page: parseInt(url.searchParams.get('page') || '1'),
      limit: parseInt(url.searchParams.get('limit') || '10'),
    };

    let filteredPartners = [...mockPartners];

    if (filters.search) {
      filteredPartners = filteredPartners.filter(p => 
        p.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        p.email.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.status) {
      filteredPartners = filteredPartners.filter(p => p.status === filters.status);
    }

    if (filters.tier) {
      filteredPartners = filteredPartners.filter(p => p.tier === filters.tier);
    }

    const total = filteredPartners.length;
    const totalPages = Math.ceil(total / filters.limit!);
    const startIndex = (filters.page! - 1) * filters.limit!;
    const endIndex = startIndex + filters.limit!;
    const paginatedPartners = filteredPartners.slice(startIndex, endIndex);

    return HttpResponse.json({
      success: true,
      data: paginatedPartners,
      pagination: {
        page: filters.page!,
        limit: filters.limit!,
        total,
        totalPages,
      },
    });
  }),

  http.get('/api/partners/:id', ({ params }) => {
    const partner = mockPartners.find(p => p.id === params.id);
    
    if (!partner) {
      return HttpResponse.json(
        { success: false, message: 'Partenaire non trouvé' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: partner,
      message: 'Partenaire récupéré avec succès',
    });
  }),

  // Documents
  http.get('/api/documents', ({ request }) => {
    const url = new URL(request.url);
    const filters: FilterParams = {
      search: url.searchParams.get('search') || undefined,
      status: url.searchParams.get('status') || undefined,
      page: parseInt(url.searchParams.get('page') || '1'),
      limit: parseInt(url.searchParams.get('limit') || '10'),
    };

    let filteredDocuments = [...mockDocuments];

    if (filters.search) {
      filteredDocuments = filteredDocuments.filter(d => 
        d.fileName.toLowerCase().includes(filters.search!.toLowerCase()) ||
        d.partnerName.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.status) {
      filteredDocuments = filteredDocuments.filter(d => d.status === filters.status);
    }

    const total = filteredDocuments.length;
    const totalPages = Math.ceil(total / filters.limit!);
    const startIndex = (filters.page! - 1) * filters.limit!;
    const endIndex = startIndex + filters.limit!;
    const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

    return HttpResponse.json({
      success: true,
      data: paginatedDocuments,
      pagination: {
        page: filters.page!,
        limit: filters.limit!,
        total,
        totalPages,
      },
    });
  }),

  http.put('/api/documents/:id/status', async ({ params, request }) => {
    const body = await request.json() as { status: string; rejectionReason?: string };
    const documentIndex = mockDocuments.findIndex(d => d.id === params.id);
    
    if (documentIndex === -1) {
      return HttpResponse.json(
        { success: false, message: 'Document non trouvé' },
        { status: 404 }
      );
    }

    mockDocuments[documentIndex] = {
      ...mockDocuments[documentIndex],
      status: body.status as any,
      reviewedAt: new Date().toISOString(),
      reviewedBy: mockUser.name,
      rejectionReason: body.rejectionReason,
    };

    return HttpResponse.json({
      success: true,
      data: mockDocuments[documentIndex],
      message: 'Statut du document mis à jour',
    });
  }),
];
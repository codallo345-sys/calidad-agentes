// Data Management Module
// Handles all data operations including authentication, teams, agents, audits, and metrics

const DataManager = {
  // Storage keys
  STORAGE_KEYS: {
    USER: 'calidad_user',
    AUDITS: 'calidad_audits',
    TEAMS: 'calidad_teams',
    METRICS: 'calidad_metrics',
    WEEKLY_METRICS: 'calidad_weekly_metrics',
    WEEK_CONFIG: 'calidad_week_config',
    AUDIT_VIEWS: 'calidad_audit_views',
    AUDIT_COMMENTS: 'calidad_audit_comments'
  },

  // Team definitions
  TEAMS: [
    { id: 'soporte-usuarios', name: 'Soporte Usuarios', color: '#38CEA6', email: 'soporte.usuarios@ridery.com' },
    { id: 'soporte-conductores', name: 'Soporte Conductores', color: '#06b6d4', email: 'soporte.conductores@ridery.com' },
    { id: 'soporte-ecr', name: 'Soporte de ECR', color: '#a855f7', email: 'soporte.ecr@ridery.com' },
    { id: 'soporte-corporativo', name: 'Soporte de Corporativo', color: '#f59e0b', email: 'soporte.corporativo@ridery.com' },
    { id: 'soporte-delivery', name: 'Soporte de Delivery Zupper', color: '#ef4444', email: 'soporte.delivery@ridery.com' }
  ],

  // Default agents (Complete team examples with all shifts)
  DEFAULT_AGENTS: {
    'soporte-usuarios': [
      { name: 'María González', email: 'maria.gonzalez@ridery.com', team: 'soporte-usuarios', shift: 'AM' },
      { name: 'Carlos Ramírez', email: 'carlos.ramirez@ridery.com', team: 'soporte-usuarios', shift: 'PM' },
      { name: 'Lucía Morales', email: 'lucia.morales@ridery.com', team: 'soporte-usuarios', shift: 'Madrugada Semana Completa' },
      { name: 'Diego Torres', email: 'diego.torres@ridery.com', team: 'soporte-usuarios', shift: 'Madrugada Entre Semana' },
      { name: 'Isabella Rojas', email: 'isabella.rojas@ridery.com', team: 'soporte-usuarios', shift: 'Fin de Semana AM' },
      { name: 'Andrés Vargas', email: 'andres.vargas@ridery.com', team: 'soporte-usuarios', shift: 'Fin de Semana PM' }
    ],
    'soporte-conductores': [
      { name: 'Ana Martínez', email: 'ana.martinez@ridery.com', team: 'soporte-conductores', shift: 'AM' },
      { name: 'Luis Fernández', email: 'luis.fernandez@ridery.com', team: 'soporte-conductores', shift: 'PM' },
      { name: 'Allen Castro', email: 'allen.castro@ridery.com', team: 'soporte-conductores', shift: 'Fin de Semana AM' }
    ],
    'soporte-ecr': [
      { name: 'Pedro Sánchez', email: 'pedro.sanchez@ridery.com', team: 'soporte-ecr', shift: 'AM' },
      { name: 'Laura Torres', email: 'laura.torres@ridery.com', team: 'soporte-ecr', shift: 'Fin de Semana PM' }
    ],
    'soporte-corporativo': [
      { name: 'Miguel Ángel Silva', email: 'miguel.silva@ridery.com', team: 'soporte-corporativo', shift: 'PM' },
      { name: 'Carmen Díaz', email: 'carmen.diaz@ridery.com', team: 'soporte-corporativo', shift: 'AM' }
    ],
    'soporte-delivery': [
      { name: 'Roberto Medina', email: 'roberto.medina@ridery.com', team: 'soporte-delivery', shift: 'AM' },
      { name: 'Sofía Rivas', email: 'sofia.rivas@ridery.com', team: 'soporte-delivery', shift: 'Fin de Semana AM' }
    ]
  },

  // Test accounts with roles
  TEST_ACCOUNTS: {
    'editor@ridery.com': { email: 'editor@ridery.com', role: 'editor' },
    'lector@ridery.com': { email: 'lector@ridery.com', role: 'viewer' },
    // Team-specific accounts
    'soporte.usuarios@ridery.com': { email: 'soporte.usuarios@ridery.com', role: 'viewer', team: 'soporte-usuarios' },
    'soporte.conductores@ridery.com': { email: 'soporte.conductores@ridery.com', role: 'viewer', team: 'soporte-conductores' },
    'soporte.ecr@ridery.com': { email: 'soporte.ecr@ridery.com', role: 'viewer', team: 'soporte-ecr' },
    'soporte.corporativo@ridery.com': { email: 'soporte.corporativo@ridery.com', role: 'viewer', team: 'soporte-corporativo' },
    'soporte.delivery@ridery.com': { email: 'soporte.delivery@ridery.com', role: 'viewer', team: 'soporte-delivery' }
  },

  // Initialize data
  init() {
    // Initialize audits with sample data for soporte-usuarios team
    if (!localStorage.getItem(this.STORAGE_KEYS.AUDITS)) {
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const sampleAudits = [
        {
          id: this.generateId(),
          agentName: 'María González',
          agentEmail: 'maria.gonzalez@ridery.com',
          ticketId: 'TKT-10234',
          ticketDate: new Date(thisMonth.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          date: new Date(thisMonth.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          tipificacion: 'Consulta de Servicio',
          score: 92,
          empatiaScore: 46,
          gestionScore: 46,
          ticketSummary: 'Cliente consultó sobre cambio de plan. Gestión efectiva con buena empatía.',
          observations: '',
          createdAt: new Date().toISOString()
        },
        {
          id: this.generateId(),
          agentName: 'Carlos Ramírez',
          agentEmail: 'carlos.ramirez@ridery.com',
          ticketId: 'TKT-10245',
          ticketDate: new Date(thisMonth.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          date: new Date(thisMonth.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          tipificacion: 'Problema Técnico',
          score: 75,
          empatiaScore: 38,
          gestionScore: 37,
          ticketSummary: 'Problema de conectividad resuelto. Mejorar seguimiento.',
          observations: '',
          createdAt: new Date().toISOString()
        },
        {
          id: this.generateId(),
          agentName: 'Lucía Morales',
          agentEmail: 'lucia.morales@ridery.com',
          ticketId: 'TKT-10256',
          ticketDate: new Date(thisMonth.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          date: new Date(thisMonth.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          tipificacion: 'Consulta General',
          score: 96,
          empatiaScore: 48,
          gestionScore: 48,
          ticketSummary: 'Excelente manejo de consulta nocturna. Cliente muy satisfecho.',
          observations: '',
          createdAt: new Date().toISOString()
        },
        {
          id: this.generateId(),
          agentName: 'Diego Torres',
          agentEmail: 'diego.torres@ridery.com',
          ticketId: 'TKT-10267',
          ticketDate: new Date(thisMonth.getTime() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          date: new Date(thisMonth.getTime() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          tipificacion: 'Reclamo',
          score: 67,
          empatiaScore: 33,
          gestionScore: 34,
          ticketSummary: 'Gestión de reclamo. Requiere mejorar empatía con cliente molesto.',
          observations: '',
          createdAt: new Date().toISOString()
        },
        {
          id: this.generateId(),
          agentName: 'Isabella Rojas',
          agentEmail: 'isabella.rojas@ridery.com',
          ticketId: 'TKT-10278',
          ticketDate: new Date(thisMonth.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          date: new Date(thisMonth.getTime() + 11 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          tipificacion: 'Consulta de Servicio',
          score: 88,
          empatiaScore: 44,
          gestionScore: 44,
          ticketSummary: 'Atención de fin de semana efectiva. Buen uso de herramientas.',
          observations: '',
          createdAt: new Date().toISOString()
        },
        {
          id: this.generateId(),
          agentName: 'Andrés Vargas',
          agentEmail: 'andres.vargas@ridery.com',
          ticketId: 'TKT-10289',
          ticketDate: new Date(thisMonth.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          date: new Date(thisMonth.getTime() + 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          tipificacion: 'Soporte Urgente',
          score: 79,
          empatiaScore: 40,
          gestionScore: 39,
          ticketSummary: 'Urgencia resuelta en fin de semana. Mejorar velocidad de respuesta.',
          observations: '',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.STORAGE_KEYS.AUDITS, JSON.stringify(sampleAudits));
    }
    
    // Initialize teams with default agents
    if (!localStorage.getItem(this.STORAGE_KEYS.TEAMS)) {
      const teamsData = {};
      this.TEAMS.forEach(team => {
        teamsData[team.id] = {
          ...team,
          members: this.DEFAULT_AGENTS[team.id] || []
        };
      });
      localStorage.setItem(this.STORAGE_KEYS.TEAMS, JSON.stringify(teamsData));
    }

    // Initialize metrics
    if (!localStorage.getItem(this.STORAGE_KEYS.METRICS)) {
      localStorage.setItem(this.STORAGE_KEYS.METRICS, JSON.stringify({}));
    }

    // Initialize weekly metrics storage with sample data for soporte-usuarios
    if (!localStorage.getItem(this.STORAGE_KEYS.WEEKLY_METRICS)) {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const sampleMetrics = {
        [`${currentYear}-${currentMonth}`]: {
          'María González': {
            0: { tickets: 125, ticketsBad: 8, ticketsGood: 95, firstResponse: 45, resolutionTime: 12, ticketsPerHour: 6.2, shift: 'AM' },
            1: { tickets: 118, ticketsBad: 6, ticketsGood: 92, firstResponse: 42, resolutionTime: 11, ticketsPerHour: 5.9, shift: 'AM' },
            2: { tickets: 132, ticketsBad: 10, ticketsGood: 98, firstResponse: 48, resolutionTime: 13, ticketsPerHour: 6.6, shift: 'AM' },
            3: { tickets: 120, ticketsBad: 7, ticketsGood: 95, firstResponse: 44, resolutionTime: 12, ticketsPerHour: 6.0, shift: 'AM' }
          },
          'Carlos Ramírez': {
            0: { tickets: 110, ticketsBad: 12, ticketsGood: 85, firstResponse: 52, resolutionTime: 15, ticketsPerHour: 5.5, shift: 'PM' },
            1: { tickets: 105, ticketsBad: 10, ticketsGood: 82, firstResponse: 50, resolutionTime: 14, ticketsPerHour: 5.2, shift: 'PM' },
            2: { tickets: 115, ticketsBad: 11, ticketsGood: 88, firstResponse: 53, resolutionTime: 15, ticketsPerHour: 5.8, shift: 'PM' },
            3: { tickets: 108, ticketsBad: 9, ticketsGood: 86, firstResponse: 51, resolutionTime: 14, ticketsPerHour: 5.4, shift: 'PM' }
          },
          'Lucía Morales': {
            0: { tickets: 95, ticketsBad: 5, ticketsGood: 75, firstResponse: 38, resolutionTime: 10, ticketsPerHour: 4.8, shift: 'Madrugada Semana Completa' },
            1: { tickets: 88, ticketsBad: 4, ticketsGood: 70, firstResponse: 36, resolutionTime: 9, ticketsPerHour: 4.4, shift: 'Madrugada Semana Completa' },
            2: { tickets: 92, ticketsBad: 6, ticketsGood: 72, firstResponse: 40, resolutionTime: 10, ticketsPerHour: 4.6, shift: 'Madrugada Semana Completa' },
            3: { tickets: 90, ticketsBad: 5, ticketsGood: 71, firstResponse: 37, resolutionTime: 9, ticketsPerHour: 4.5, shift: 'Madrugada Semana Completa' }
          },
          'Diego Torres': {
            0: { tickets: 78, ticketsBad: 8, ticketsGood: 60, firstResponse: 55, resolutionTime: 16, ticketsPerHour: 3.9, shift: 'Madrugada Entre Semana' },
            1: { tickets: 75, ticketsBad: 7, ticketsGood: 58, firstResponse: 53, resolutionTime: 15, ticketsPerHour: 3.8, shift: 'Madrugada Entre Semana' },
            2: { tickets: 80, ticketsBad: 9, ticketsGood: 62, firstResponse: 56, resolutionTime: 17, ticketsPerHour: 4.0, shift: 'Madrugada Entre Semana' },
            3: { tickets: 77, ticketsBad: 8, ticketsGood: 59, firstResponse: 54, resolutionTime: 16, ticketsPerHour: 3.9, shift: 'Madrugada Entre Semana' }
          },
          'Isabella Rojas': {
            0: { tickets: 65, ticketsBad: 4, ticketsGood: 52, firstResponse: 48, resolutionTime: 14, ticketsPerHour: 5.4, shift: 'Fin de Semana AM' },
            1: { tickets: 62, ticketsBad: 3, ticketsGood: 50, firstResponse: 46, resolutionTime: 13, ticketsPerHour: 5.2, shift: 'Fin de Semana AM' },
            2: { tickets: 68, ticketsBad: 5, ticketsGood: 54, firstResponse: 49, resolutionTime: 14, ticketsPerHour: 5.7, shift: 'Fin de Semana AM' },
            3: { tickets: 64, ticketsBad: 4, ticketsGood: 51, firstResponse: 47, resolutionTime: 13, ticketsPerHour: 5.3, shift: 'Fin de Semana AM' }
          },
          'Andrés Vargas': {
            0: { tickets: 58, ticketsBad: 6, ticketsGood: 45, firstResponse: 58, resolutionTime: 17, ticketsPerHour: 4.8, shift: 'Fin de Semana PM' },
            1: { tickets: 55, ticketsBad: 5, ticketsGood: 43, firstResponse: 56, resolutionTime: 16, ticketsPerHour: 4.6, shift: 'Fin de Semana PM' },
            2: { tickets: 60, ticketsBad: 7, ticketsGood: 46, firstResponse: 59, resolutionTime: 18, ticketsPerHour: 5.0, shift: 'Fin de Semana PM' },
            3: { tickets: 57, ticketsBad: 6, ticketsGood: 44, firstResponse: 57, resolutionTime: 17, ticketsPerHour: 4.8, shift: 'Fin de Semana PM' }
          }
        }
      };
      localStorage.setItem(this.STORAGE_KEYS.WEEKLY_METRICS, JSON.stringify(sampleMetrics));
    }

    // Initialize week configuration storage
    if (!localStorage.getItem(this.STORAGE_KEYS.WEEK_CONFIG)) {
      localStorage.setItem(this.STORAGE_KEYS.WEEK_CONFIG, JSON.stringify({}));
    }
  },

  // Teams management
  getAllTeams() {
    const teamsStr = localStorage.getItem(this.STORAGE_KEYS.TEAMS);
    return teamsStr ? JSON.parse(teamsStr) : {};
  },

  getTeamById(teamId) {
    const teams = this.getAllTeams();
    return teams[teamId] || null;
  },

  getAllAgents() {
    const teams = this.getAllTeams();
    const agents = [];
    Object.values(teams).forEach(team => {
      team.members.forEach(member => {
        agents.push({ ...member, teamName: team.name, teamColor: team.color });
      });
    });
    return agents;
  },

  addTeamMember(teamId, memberData) {
    const teams = this.getAllTeams();
    if (teams[teamId]) {
      teams[teamId].members.push({
        ...memberData,
        team: teamId,
        addedAt: new Date().toISOString()
      });
      localStorage.setItem(this.STORAGE_KEYS.TEAMS, JSON.stringify(teams));
      return true;
    }
    return false;
  },

  removeTeamMember(teamId, memberEmail) {
    const teams = this.getAllTeams();
    if (teams[teamId]) {
      teams[teamId].members = teams[teamId].members.filter(m => m.email !== memberEmail);
      localStorage.setItem(this.STORAGE_KEYS.TEAMS, JSON.stringify(teams));
      return true;
    }
    return false;
  },

  // Authentication
  login(email) {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if it's a test account
    if (this.TEST_ACCOUNTS[normalizedEmail]) {
      const user = this.TEST_ACCOUNTS[normalizedEmail];
      localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
      return user;
    }
    
    // Check if user is a team member (editors only)
    const teams = this.getAllTeams();
    for (let teamId in teams) {
      const member = teams[teamId].members.find(m => m.email === normalizedEmail);
      if (member) {
        const user = { email: normalizedEmail, role: 'viewer', team: teamId };
        localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
        return user;
      }
    }
    
    // Default to viewer role for any other email
    const user = { email: normalizedEmail, role: 'viewer' };
    localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  },

  logout() {
    localStorage.removeItem(this.STORAGE_KEYS.USER);
  },

  getCurrentUser() {
    const userStr = localStorage.getItem(this.STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  },

  isEditor() {
    const user = this.getCurrentUser();
    return user && user.role === 'editor';
  },

  getUserTeam() {
    const user = this.getCurrentUser();
    return user ? user.team : null;
  },

  // Audit CRUD operations with new structure
  getAllAudits() {
    const auditsStr = localStorage.getItem(this.STORAGE_KEYS.AUDITS);
    return auditsStr ? JSON.parse(auditsStr) : [];
  },

  getAuditById(id) {
    const audits = this.getAllAudits();
    return audits.find(audit => audit.id === id);
  },

  createAudit(auditData) {
    const audits = this.getAllAudits();
    const newAudit = {
      id: this.generateId(),
      ...auditData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    audits.push(newAudit);
    localStorage.setItem(this.STORAGE_KEYS.AUDITS, JSON.stringify(audits));
    return newAudit;
  },

  updateAudit(id, auditData) {
    const audits = this.getAllAudits();
    const index = audits.findIndex(audit => audit.id === id);
    if (index !== -1) {
      audits[index] = {
        ...audits[index],
        ...auditData,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_KEYS.AUDITS, JSON.stringify(audits));
      return audits[index];
    }
    return null;
  },

  deleteAudit(id) {
    const audits = this.getAllAudits();
    const filtered = audits.filter(audit => audit.id !== id);
    localStorage.setItem(this.STORAGE_KEYS.AUDITS, JSON.stringify(filtered));
    return true;
  },

  // Get audits by month
  getAuditsByMonth(year, month) {
    const audits = this.getAllAudits();
    let filteredAudits = audits.filter(audit => {
      const auditDate = new Date(audit.date);
      return auditDate.getFullYear() === year && auditDate.getMonth() === month;
    });
    
    // Apply team-based filtering for team users
    const userTeam = this.getUserTeam();
    if (userTeam) {
      filteredAudits = filteredAudits.filter(audit => audit.teamId === userTeam);
    }
    
    return filteredAudits;
  },

  // Search and filter
  searchAudits(searchTerm, teamFilter) {
    let audits = this.getAllAudits();
    
    // Apply team-based filtering for team users
    const userTeam = this.getUserTeam();
    if (userTeam) {
      // If user belongs to a specific team, only show audits from that team
      audits = audits.filter(audit => audit.teamId === userTeam);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      audits = audits.filter(audit => 
        audit.agentName.toLowerCase().includes(term) ||
        (audit.ticketId && audit.ticketId.toLowerCase().includes(term)) ||
        (audit.observations && audit.observations.toLowerCase().includes(term)) ||
        (audit.ticketSummary && audit.ticketSummary.toLowerCase().includes(term))
      );
    }
    
    if (teamFilter) {
      audits = audits.filter(audit => audit.teamId === teamFilter);
    }
    
    return audits;
  },

  // Calculate score based on new pillar system with STRICT 2-error rule
  // Rule: 2 or more errors = 0 points (no partial scores)
  calculateAuditScore(evaluationData) {
    // Count total errors (unchecked items)
    const empatiaCriteria = [
      'metodoRided', 'lenguajePositivo', 'acompanamiento', 
      'personalizacion', 'estructura', 'usoIaOrtografia'
    ];
    
    const gestionTicketCriteria = [
      'estadosTicket', 'ausenciaCliente', 'validacionHistorial', 
      'tipificacionCriterio', 'retencionTickets', 'tiempoRespuesta', 'tiempoGestion'
    ];
    
    const conocimientoCriteria = [
      'serviciosPromociones', 'informacionVeraz', 
      'parlamentosContingencia', 'honestidadTransparencia'
    ];
    
    const herramientasCriteria = [
      'rideryOffice', 'adminZendesk', 'driveManuales', 
      'slack', 'generacionReportes', 'cargaIncidencias'
    ];

    // Count errors (unchecked = error)
    let totalErrors = 0;
    
    empatiaCriteria.forEach(criterion => {
      if (!evaluationData.empatia?.[criterion]) totalErrors++;
    });
    
    gestionTicketCriteria.forEach(criterion => {
      if (!evaluationData.gestion?.ticket?.[criterion]) totalErrors++;
    });
    
    conocimientoCriteria.forEach(criterion => {
      if (!evaluationData.gestion?.conocimiento?.[criterion]) totalErrors++;
    });
    
    herramientasCriteria.forEach(criterion => {
      if (!evaluationData.gestion?.herramientas?.[criterion]) totalErrors++;
    });

    // STRICT RULE: 2 or more errors = 0 points
    if (totalErrors >= 2) {
      return 0;
    }

    // If 0 or 1 error, calculate normal score
    // Pilar Empatía (50%) - 6 criterios x 8.33 puntos = 50%
    const empatiaScore = empatiaCriteria.reduce((sum, criterion) => {
      return sum + (evaluationData.empatia?.[criterion] ? 8.33 : 0);
    }, 0);

    // Pilar Gestión (50%)
    // Gestión de ticket (33% of 50% = 16.67%)
    const gestionTicketScore = gestionTicketCriteria.reduce((sum, criterion) => {
      return sum + (evaluationData.gestion?.ticket?.[criterion] ? (16.67 / 7) : 0);
    }, 0);

    // Conocimiento Integral (33% of 50% = 16.67%)
    const conocimientoScore = conocimientoCriteria.reduce((sum, criterion) => {
      return sum + (evaluationData.gestion?.conocimiento?.[criterion] ? (16.67 / 4) : 0);
    }, 0);

    // Uso estratégico de herramientas (33% of 50% = 16.67%)
    const herramientasScore = herramientasCriteria.reduce((sum, criterion) => {
      return sum + (evaluationData.gestion?.herramientas?.[criterion] ? (16.67 / 6) : 0);
    }, 0);

    const totalScore = empatiaScore + gestionTicketScore + conocimientoScore + herramientasScore;
    return Math.round(totalScore * 100) / 100;
  },

  // Metrics calculations
  getWeeklyMetrics() {
    const audits = this.getAllAudits();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyAudits = audits.filter(audit => 
      new Date(audit.date) >= oneWeekAgo
    );
    
    return this.calculateMetrics(weeklyAudits);
  },

  getMonthlyMetrics() {
    const audits = this.getAllAudits();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    const monthlyAudits = audits.filter(audit => {
      const auditDate = new Date(audit.date);
      return auditDate.getFullYear() === currentYear && auditDate.getMonth() === currentMonth;
    });
    
    return this.calculateMetrics(monthlyAudits);
  },

  getAnnualMetrics() {
    const audits = this.getAllAudits();
    const currentYear = new Date().getFullYear();
    
    const annualAudits = audits.filter(audit => 
      new Date(audit.date).getFullYear() === currentYear
    );
    
    return this.calculateMetrics(annualAudits);
  },

  calculateMetrics(audits) {
    const total = audits.length;
    
    if (total === 0) {
      return {
        total: 0,
        avgScore: 0,
        uniqueAgents: 0,
        byAgent: {},
        byTeam: {},
        byDate: {}
      };
    }
    
    // Calculate average score
    const totalScore = audits.reduce((sum, audit) => sum + parseFloat(audit.score || 0), 0);
    const avgScore = (totalScore / total).toFixed(1);
    
    // Get unique agents
    const uniqueAgents = [...new Set(audits.map(audit => audit.agentName))];
    
    // Group by agent
    const byAgent = {};
    audits.forEach(audit => {
      if (!byAgent[audit.agentName]) {
        byAgent[audit.agentName] = {
          count: 0,
          totalScore: 0,
          lastAudit: audit.date,
          teamId: audit.teamId,
          audits: []
        };
      }
      byAgent[audit.agentName].count++;
      byAgent[audit.agentName].totalScore += parseFloat(audit.score || 0);
      byAgent[audit.agentName].audits.push(audit);
      if (new Date(audit.date) > new Date(byAgent[audit.agentName].lastAudit)) {
        byAgent[audit.agentName].lastAudit = audit.date;
      }
    });
    
    // Calculate average for each agent
    Object.keys(byAgent).forEach(agentName => {
      byAgent[agentName].avgScore = (byAgent[agentName].totalScore / byAgent[agentName].count).toFixed(1);
    });

    // Group by team
    const byTeam = {};
    audits.forEach(audit => {
      if (!audit.teamId) return;
      if (!byTeam[audit.teamId]) {
        byTeam[audit.teamId] = {
          count: 0,
          totalScore: 0,
          agents: new Set()
        };
      }
      byTeam[audit.teamId].count++;
      byTeam[audit.teamId].totalScore += parseFloat(audit.score || 0);
      byTeam[audit.teamId].agents.add(audit.agentName);
    });

    // Calculate average for each team
    Object.keys(byTeam).forEach(teamId => {
      byTeam[teamId].avgScore = (byTeam[teamId].totalScore / byTeam[teamId].count).toFixed(1);
      byTeam[teamId].uniqueAgents = byTeam[teamId].agents.size;
      delete byTeam[teamId].agents;
    });
    
    // Group by date
    const byDate = {};
    audits.forEach(audit => {
      const date = audit.date;
      if (!byDate[date]) {
        byDate[date] = { count: 0, totalScore: 0 };
      }
      byDate[date].count++;
      byDate[date].totalScore += parseFloat(audit.score || 0);
    });
    
    return {
      total,
      avgScore: parseFloat(avgScore),
      uniqueAgents: uniqueAgents.length,
      byAgent,
      byTeam,
      byDate,
      audits
    };
  },

  getMonthlyBreakdown() {
    const audits = this.getAllAudits();
    const currentYear = new Date().getFullYear();
    
    const monthlyData = {};
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    // Initialize all months
    months.forEach((month, index) => {
      monthlyData[month] = { count: 0, totalScore: 0 };
    });
    
    // Populate with data
    audits.forEach(audit => {
      const auditDate = new Date(audit.date);
      if (auditDate.getFullYear() === currentYear) {
        const monthIndex = auditDate.getMonth();
        const monthName = months[monthIndex];
        monthlyData[monthName].count++;
        monthlyData[monthName].totalScore += parseFloat(audit.score || 0);
      }
    });
    
    return monthlyData;
  },

  // Get all weeks from January to current date (Monday-Friday only)
  getWeeksOfYear() {
    const currentYear = new Date().getFullYear();
    const weeks = [];
    let weekNumber = 1;
    
    // Start from January 1st
    let currentDate = new Date(currentYear, 0, 1);
    
    // Find the first Monday of the year
    while (currentDate.getDay() !== 1) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const now = new Date();
    
    while (currentDate <= now) {
      const weekStart = new Date(currentDate);
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(weekEnd.getDate() + 4); // Friday (Monday + 4 days)
      
      // Only add weeks that have started
      if (weekStart <= now) {
        weeks.push({
          weekNumber: weekNumber,
          startDate: weekStart.toISOString().split('T')[0],
          endDate: weekEnd > now ? now.toISOString().split('T')[0] : weekEnd.toISOString().split('T')[0],
          label: `Semana ${weekNumber}: ${weekStart.getDate()}-${weekStart.getMonth() + 1}-${currentYear} a ${(weekEnd > now ? now : weekEnd).getDate()}-${(weekEnd > now ? now : weekEnd).getMonth() + 1}-${currentYear}`
        });
        weekNumber++;
      }
      
      // Move to next Monday
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    return weeks;
  },

  // Get weeks for a specific month
  getWeeksOfMonth(year, month) {
    const weeks = [];
    
    // Get first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const now = new Date();
    
    // Start from the first day of the month, regardless of day of week
    let currentDate = new Date(firstDayOfMonth);
    
    let weekNumber = 1;
    while (currentDate <= lastDayOfMonth && currentDate <= now) {
      const weekStart = new Date(currentDate);
      let weekEnd = new Date(currentDate);
      
      // Add 6 days to get end of week (Sunday)
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      // Don't go past the end of the month
      if (weekEnd > lastDayOfMonth) {
        weekEnd = new Date(lastDayOfMonth);
      }
      
      // Don't go past today
      if (weekEnd > now) {
        weekEnd = new Date(now);
      }
      
      weeks.push({
        weekNumber: weekNumber,
        startDate: weekStart.toISOString().split('T')[0],
        endDate: weekEnd.toISOString().split('T')[0],
        label: `Semana ${weekStart.getDate()}/${month + 1} al ${weekEnd.getDate()}/${month + 1}`
      });
      
      weekNumber++;
      
      // Move to next week (7 days from week start)
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    return weeks;
  },

  // Get audits for a specific week
  getAuditsByWeek(weekStartDate, weekEndDate) {
    const audits = this.getAllAudits();
    return audits.filter(audit => {
      const auditDate = audit.date;
      return auditDate >= weekStartDate && auditDate <= weekEndDate;
    });
  },

  // Get metrics by week
  getWeeklyMetricsByWeek(weekStartDate, weekEndDate) {
    const weekAudits = this.getAuditsByWeek(weekStartDate, weekEndDate);
    return this.calculateMetrics(weekAudits);
  },

  getDailyBreakdownLastWeek() {
    const audits = this.getAllAudits();
    const dailyData = {};
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      const dateStr = date.toISOString().split('T')[0];
      
      dailyData[`${dayName} ${date.getDate()}`] = { 
        count: 0, 
        totalScore: 0,
        date: dateStr
      };
    }
    
    // Populate with data
    audits.forEach(audit => {
      const auditDate = new Date(audit.date);
      const dayName = days[auditDate.getDay()];
      const dayLabel = `${dayName} ${auditDate.getDate()}`;
      
      Object.keys(dailyData).forEach(key => {
        if (dailyData[key].date === audit.date) {
          dailyData[key].count++;
          dailyData[key].totalScore += parseFloat(audit.score || 0);
        }
      });
    });
    
    return dailyData;
  },

  // Get top agent per team
  getTopAgentsByTeam() {
    const metrics = this.calculateMetrics(this.getAllAudits());
    const topByTeam = {};

    Object.entries(metrics.byAgent).forEach(([agentName, data]) => {
      const teamId = data.teamId;
      if (!teamId) return;
      
      if (!topByTeam[teamId] || parseFloat(data.avgScore) > parseFloat(topByTeam[teamId].avgScore)) {
        topByTeam[teamId] = {
          agentName,
          avgScore: data.avgScore,
          count: data.count
        };
      }
    });

    return topByTeam;
  },

  // Weekly Metrics Management (Manual Input)
  getWeeklyMetricsData(year, month) {
    const key = `${year}-${month}`;
    const allData = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.WEEKLY_METRICS) || '{}');
    return allData[key] || {};
  },

  saveWeeklyMetricsData(year, month, data) {
    const key = `${year}-${month}`;
    const allData = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.WEEKLY_METRICS) || '{}');
    allData[key] = data;
    localStorage.setItem(this.STORAGE_KEYS.WEEKLY_METRICS, JSON.stringify(allData));
  },

  getWeekConfig(year, month) {
    const key = `${year}-${month}`;
    const allConfigs = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.WEEK_CONFIG) || '{}');
    return allConfigs[key] || this.getWeeksOfMonth(year, month);
  },

  saveWeekConfig(year, month, weeks) {
    const key = `${year}-${month}`;
    const allConfigs = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.WEEK_CONFIG) || '{}');
    allConfigs[key] = weeks;
    localStorage.setItem(this.STORAGE_KEYS.WEEK_CONFIG, JSON.stringify(allConfigs));
  },

  // Audit Views Tracking
  markAuditAsViewed(auditId, viewerEmail) {
    const views = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.AUDIT_VIEWS) || '{}');
    if (!views[auditId]) {
      views[auditId] = [];
    }
    if (!views[auditId].includes(viewerEmail)) {
      views[auditId].push(viewerEmail);
      localStorage.setItem(this.STORAGE_KEYS.AUDIT_VIEWS, JSON.stringify(views));
    }
  },

  hasViewedAudit(auditId, viewerEmail) {
    const views = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.AUDIT_VIEWS) || '{}');
    return views[auditId] && views[auditId].includes(viewerEmail);
  },

  // Audit Comments (Agent feedback on their audits)
  saveAuditComment(auditId, agentEmail, comment) {
    const comments = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.AUDIT_COMMENTS) || '{}');
    comments[auditId] = {
      agentEmail,
      comment,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEYS.AUDIT_COMMENTS, JSON.stringify(comments));
  },

  getAuditComment(auditId) {
    const comments = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.AUDIT_COMMENTS) || '{}');
    return comments[auditId] || null;
  },

  // Add or update team member with shift information
  addTeamMemberWithShift(teamId, memberData) {
    const teams = this.getAllTeams();
    if (teams[teamId]) {
      // Ensure shift is included
      const member = {
        ...memberData,
        team: teamId,
        shift: memberData.shift || 'AM',
        addedAt: new Date().toISOString()
      };
      teams[teamId].members.push(member);
      localStorage.setItem(this.STORAGE_KEYS.TEAMS, JSON.stringify(teams));
      return true;
    }
    return false;
  },

  // Utility
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-VE', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  },

  // Calculate satisfaction percentage for an agent based on weekly metrics
  calculateAgentSatisfaction(agentName, year, month) {
    const weeklyData = this.getWeeklyMetricsData(year, month);
    if (!weeklyData[agentName]) return 0;
    
    let totalTickets = 0;
    let totalGood = 0;
    
    Object.values(weeklyData[agentName]).forEach(weekData => {
      if (weekData.tickets) {
        totalTickets += weekData.tickets || 0;
        totalGood += weekData.ticketsGood || 0;
      }
    });
    
    if (totalTickets === 0) return 0;
    return Math.round((totalGood / totalTickets) * 100);
  },

  // Get agent email by name (from teams)
  getAgentEmailByName(agentName) {
    const teams = this.getAllTeams();
    for (const team of Object.values(teams)) {
      if (team.members) {
        const member = team.members.find(m => m.name === agentName);
        if (member) return member.email;
      }
    }
    return null;
  },

  // Delete a specific week from configuration
  deleteWeekFromConfig(year, month, weekIndex) {
    const key = `weekConfig_${year}_${month}`;
    const stored = localStorage.getItem(key);
    
    if (!stored) {
      console.error(`No config found for key: ${key}`);
      alert(`No se encontró configuración para ${month}/${year}. Por favor, configure las semanas primero.`);
      return false;
    }
    
    const config = JSON.parse(stored);
    
    console.log(`Attempting to delete week ${weekIndex} from config with ${config.weeks?.length || 0} weeks`);
    
    // Require at least 2 weeks to allow deletion (must keep at least 1)
    if (!config.weeks || config.weeks.length <= 1) {
      alert('No se puede eliminar la última semana. Debe haber al menos una semana configurada.');
      return false;
    }
    
    // Check if the week index is valid
    if (weekIndex < 0 || weekIndex >= config.weeks.length) {
      console.error(`Invalid week index: ${weekIndex}, config has ${config.weeks.length} weeks`);
      alert(`Índice de semana inválido (${weekIndex}). La configuración tiene ${config.weeks.length} semanas.`);
      return false;
    }
    
    // Remove the week
    config.weeks.splice(weekIndex, 1);
    
    // Save back to localStorage
    localStorage.setItem(key, JSON.stringify(config));
    
    console.log(`Week ${weekIndex} deleted successfully. New count: ${config.weeks.length}`);
    return true;
  }
};

// Initialize on load
DataManager.init();

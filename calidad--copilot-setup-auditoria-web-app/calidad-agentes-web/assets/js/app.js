// Main Application Logic
// Handles UI interactions, view management, and charts

const App = {
  currentView: 'dashboard',
  charts: {},

  // Initialize application
  init() {
    // Check if user is logged in
    const user = DataManager.getCurrentUser();
    
    if (user) {
      this.showMainApp(user);
    } else {
      this.showAuthScreen();
    }

    this.setupEventListeners();
  },

  // Setup all event listeners
  setupEventListeners() {
    // Authentication
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    const clearSessionBtn = document.getElementById('clearSessionBtn');
    if (clearSessionBtn) {
      clearSessionBtn.addEventListener('click', () => this.handleClearSession());
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    // Navigation
    const navBtns = document.querySelectorAll('.nav-btn[data-view]');
    navBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-view');
        this.switchView(view);
      });
    });

    // Audit management
    const createAuditBtn = document.getElementById('createAuditBtn');
    if (createAuditBtn) {
      createAuditBtn.addEventListener('click', () => this.openAuditModal());
    }

    const auditForm = document.getElementById('auditForm');
    if (auditForm) {
      auditForm.addEventListener('submit', (e) => this.handleAuditSubmit(e));
    }

    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => this.closeAuditModal());
    }
    if (cancelModalBtn) {
      cancelModalBtn.addEventListener('click', () => this.closeAuditModal());
    }

    // Search and filter
    const searchAudit = document.getElementById('searchAudit');
    const filterTeam = document.getElementById('filterTeam');
    const filterMonth = document.getElementById('filterMonth');
    const filterMonthMetrics = document.getElementById('filterMonthMetrics');
    if (searchAudit) {
      searchAudit.addEventListener('input', () => this.filterAudits());
    }
    if (filterTeam) {
      filterTeam.addEventListener('change', () => this.filterAudits());
    }
    if (filterMonth) {
      filterMonth.addEventListener('change', () => this.filterAudits());
    }
    if (filterMonthMetrics) {
      filterMonthMetrics.addEventListener('change', () => this.loadWeeklyMetrics());
    }

    // Team filter for weekly metrics
    const filterTeamWeekly = document.getElementById('filterTeamWeekly');
    if (filterTeamWeekly) {
      filterTeamWeekly.addEventListener('change', () => this.loadWeeklyMetrics());
    }

    // Monthly metrics filter
    const filterMonthlyMetrics = document.getElementById('filterMonthlyMetrics');
    if (filterMonthlyMetrics) {
      filterMonthlyMetrics.addEventListener('change', () => this.loadMonthlyMetrics());
    }

    // Team filter for monthly metrics
    const filterTeamMonthly = document.getElementById('filterTeamMonthly');
    if (filterTeamMonthly) {
      filterTeamMonthly.addEventListener('change', () => this.loadMonthlyMetrics());
    }

    // Team quality selector for dashboard
    const teamQualitySelector = document.getElementById('teamQualitySelector');
    if (teamQualitySelector) {
      teamQualitySelector.addEventListener('change', () => this.loadTeamQualityMetrics());
    }

    // Close modal on overlay click
    const auditModal = document.getElementById('auditModal');
    if (auditModal) {
      auditModal.addEventListener('click', (e) => {
        if (e.target === auditModal) {
          this.closeAuditModal();
        }
      });
    }

    // View modal close button
    const closeViewModalBtn = document.getElementById('closeViewModalBtn');
    if (closeViewModalBtn) {
      closeViewModalBtn.addEventListener('click', () => this.closeViewModal());
    }

    // Close view modal on overlay click
    const auditViewModal = document.getElementById('auditViewModal');
    if (auditViewModal) {
      auditViewModal.addEventListener('click', (e) => {
        if (e.target === auditViewModal) {
          this.closeViewModal();
        }
      });
    }

    // Week configuration modal
    // Use event delegation to ensure button works even if DOM changes
    document.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'configWeeksBtn') {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.openWeekConfigModal();
      }
    });

    const closeWeekConfigBtn = document.getElementById('closeWeekConfigBtn');
    const cancelWeekConfigBtn = document.getElementById('cancelWeekConfigBtn');
    if (closeWeekConfigBtn) {
      closeWeekConfigBtn.addEventListener('click', () => this.closeWeekConfigModal());
    }
    if (cancelWeekConfigBtn) {
      cancelWeekConfigBtn.addEventListener('click', () => this.closeWeekConfigModal());
    }

    const saveWeekConfigBtn = document.getElementById('saveWeekConfigBtn');
    if (saveWeekConfigBtn) {
      saveWeekConfigBtn.addEventListener('click', () => this.saveWeekConfig());
    }

    // Manual metrics modal
    const closeManualMetricsBtn = document.getElementById('closeManualMetricsBtn');
    const cancelManualMetricsBtn = document.getElementById('cancelManualMetricsBtn');
    if (closeManualMetricsBtn) {
      closeManualMetricsBtn.addEventListener('click', () => this.closeManualMetricsModal());
    }
    if (cancelManualMetricsBtn) {
      cancelManualMetricsBtn.addEventListener('click', () => this.closeManualMetricsModal());
    }

    const manualMetricsForm = document.getElementById('manualMetricsForm');
    if (manualMetricsForm) {
      manualMetricsForm.addEventListener('submit', (e) => this.handleManualMetricsSubmit(e));
    }
    
    // Keyboard navigation for table scrolling
    this.setupTableKeyboardNavigation();

    // Close modals on overlay click
    const weekConfigModal = document.getElementById('weekConfigModal');
    if (weekConfigModal) {
      weekConfigModal.addEventListener('click', (e) => {
        if (e.target === weekConfigModal) {
          this.closeWeekConfigModal();
        }
      });
    }

    const manualMetricsModal = document.getElementById('manualMetricsModal');
    if (manualMetricsModal) {
      manualMetricsModal.addEventListener('click', (e) => {
        if (e.target === manualMetricsModal) {
          this.closeManualMetricsModal();
        }
      });
    }
  },
  
  // Setup keyboard navigation for table scrolling
  setupTableKeyboardNavigation() {
    // Add event listeners to all .table-scroll elements
    document.addEventListener('keydown', (e) => {
      const activeElement = document.activeElement;
      
      // Check if a table-scroll element or its child has focus
      const tableScroll = activeElement.classList.contains('table-scroll') 
        ? activeElement 
        : activeElement.closest('.table-scroll');
      
      if (tableScroll) {
        const scrollAmount = 50; // pixels to scroll
        
        switch(e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            tableScroll.scrollLeft -= scrollAmount;
            break;
          case 'ArrowRight':
            e.preventDefault();
            tableScroll.scrollLeft += scrollAmount;
            break;
          case 'ArrowUp':
            e.preventDefault();
            tableScroll.scrollTop -= scrollAmount;
            break;
          case 'ArrowDown':
            e.preventDefault();
            tableScroll.scrollTop += scrollAmount;
            break;
        }
      }
    });
    
    // Make table-scroll elements focusable
    const makeTablesFocusable = () => {
      const tables = document.querySelectorAll('.table-scroll');
      tables.forEach(table => {
        if (!table.hasAttribute('tabindex')) {
          table.setAttribute('tabindex', '0');
        }
      });
    };
    
    // Run initially and on view changes
    makeTablesFocusable();
    
    // Use MutationObserver to detect when tables are added to DOM
    const observer = new MutationObserver(makeTablesFocusable);
    observer.observe(document.body, { childList: true, subtree: true });
  },

  // Authentication handlers
  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('emailInput').value;
    const user = DataManager.login(email);
    this.showMainApp(user);
  },

  handleLogout() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
      DataManager.logout();
      this.showAuthScreen();
    }
  },

  handleClearSession() {
    if (confirm('¿Está seguro que desea limpiar todos los datos y la sesión? Esta acción no se puede deshacer.')) {
      // Clear all localStorage
      localStorage.clear();
      // Reinitialize data
      DataManager.init();
      // Show auth screen
      this.showAuthScreen();
      // Clear email input
      const emailInput = document.getElementById('emailInput');
      if (emailInput) {
        emailInput.value = '';
      }
      alert('Sesión y datos limpiados exitosamente. Por favor, inicie sesión nuevamente.');
    }
  },

  showAuthScreen() {
    document.getElementById('authScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
  },

  showMainApp(user) {
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');

    // Update user info
    document.getElementById('userEmail').textContent = user.email;
    const roleBadge = document.getElementById('userRoleBadge');
    
    if (user.role === 'editor') {
      roleBadge.textContent = 'Editor';
      roleBadge.className = 'badge badge-editor';
      // Show editor-only elements
      document.querySelectorAll('.only-editor').forEach(el => {
        el.style.display = 'block';
      });
    } else {
      roleBadge.textContent = 'Lector';
      roleBadge.className = 'badge badge-viewer';
      // Hide editor-only elements
      document.querySelectorAll('.only-editor').forEach(el => {
        el.style.display = 'none';
      });
    }

    // Initialize team dropdowns
    this.initializeTeamFilters();

    // Initialize OverlayScrollbars for smooth scrolling
    this.initializeOverlayScrollbars();

    // Load initial view
    this.switchView('dashboard');
  },

  initializeTeamFilters() {
    const teams = DataManager.getAllTeams();
    
    // Populate weekly metrics team filter
    const filterTeamWeekly = document.getElementById('filterTeamWeekly');
    if (filterTeamWeekly) {
      // Clear existing options except the first one
      while (filterTeamWeekly.options.length > 1) {
        filterTeamWeekly.remove(1);
      }
      
      Object.values(teams).forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = team.name;
        filterTeamWeekly.appendChild(option);
      });
    }

    // Populate monthly metrics team filter
    const filterTeamMonthly = document.getElementById('filterTeamMonthly');
    if (filterTeamMonthly) {
      // Clear existing options except the first one
      while (filterTeamMonthly.options.length > 1) {
        filterTeamMonthly.remove(1);
      }
      
      Object.values(teams).forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = team.name;
        filterTeamMonthly.appendChild(option);
      });
    }
  },

  initializeOverlayScrollbars() {
    // Initialize OverlayScrollbars on table scroll containers
    if (typeof OverlayScrollbars !== 'undefined') {
      // Apply to all elements with .table-scroll class
      document.querySelectorAll('.table-scroll').forEach(element => {
        OverlayScrollbars(element, {
          scrollbars: {
            theme: 'os-theme-dark',
            visibility: 'auto',
            autoHide: 'never',
            autoHideDelay: 800
          }
        });
      });
    }
  },

  // View management
  switchView(viewName) {
    // Update active nav button
    document.querySelectorAll('.nav-btn[data-view]').forEach(btn => {
      if (btn.getAttribute('data-view') === viewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Hide all views
    document.querySelectorAll('.view-section').forEach(view => {
      view.classList.add('hidden');
    });

    // Show selected view
    this.currentView = viewName;
    
    switch(viewName) {
      case 'dashboard':
        document.getElementById('dashboardView').classList.remove('hidden');
        this.loadDashboard();
        break;
      case 'audits':
        document.getElementById('auditsView').classList.remove('hidden');
        this.loadAuditsView();
        break;
      case 'teams':
        document.getElementById('teamsView').classList.remove('hidden');
        this.loadTeamsView();
        break;
      case 'metrics-weekly':
        document.getElementById('metricsWeeklyView').classList.remove('hidden');
        this.loadWeeklyMetrics();
        break;
      case 'metrics-monthly':
        document.getElementById('metricsMonthlyView').classList.remove('hidden');
        this.loadMonthlyMetrics();
        break;
    }
  },

  // Dashboard
  loadDashboard() {
    const user = DataManager.getCurrentUser();
    const userTeam = DataManager.getUserTeam();
    const isEditor = DataManager.isEditor();
    const allAudits = DataManager.getAllAudits();
    
    // For team users: filter to PERSONAL audits only (agentName matches current user's expected agent name)
    // For editors: show all audits
    let filteredAudits = allAudits;
    let personalAudits = [];
    
    if (userTeam && !isEditor) {
      const teams = DataManager.getAllTeams();
      const team = teams[userTeam];
      
      // Find which agent this user represents
      // Assuming user email maps to agent email
      let userAgentName = null;
      if (team && team.members) {
        const member = team.members.find(m => m.email === user.email);
        if (member) {
          userAgentName = member.name;
        }
      }
      
      // Filter to ONLY this user's personal audits
      if (userAgentName) {
        personalAudits = allAudits.filter(audit => audit.agentName === userAgentName);
        filteredAudits = personalAudits;
      } else {
        filteredAudits = [];
      }
    }
    
    const allMetrics = DataManager.calculateMetrics(filteredAudits);
    
    // Calculate this week's audits (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyAudits = filteredAudits.filter(audit => new Date(audit.date) >= oneWeekAgo);
    
    // Calculate quality accumulated this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyAudits = filteredAudits.filter(audit => {
      const auditDate = new Date(audit.date);
      return auditDate.getMonth() === currentMonth && auditDate.getFullYear() === currentYear;
    });
    const qualityThisMonth = monthlyAudits.length > 0
      ? Math.round(monthlyAudits.reduce((sum, a) => sum + parseFloat(a.score || 0), 0) / monthlyAudits.length)
      : 0;

    // Update summary stats
    document.getElementById('totalAuditsCount').textContent = allMetrics.total;
    document.getElementById('weeklyAuditsCount').textContent = weeklyAudits.length;
    
    // Change the third stat to show quality percentage
    const totalAgentsElement = document.getElementById('totalAgentsCount');
    if (totalAgentsElement) {
      const parentCard = totalAgentsElement.closest('.stat-card');
      if (parentCard) {
        const labelElement = parentCard.querySelector('.stat-label');
        if (labelElement) {
          labelElement.innerHTML = '<i class="fas fa-star"></i> % Calidad Acumulado Este Mes';
        }
        totalAgentsElement.textContent = qualityThisMonth + '%';
      }
    }

    // Load recent activity
    this.loadRecentActivity();

    // Load top agents
    this.loadTopAgents();

    // Load team quality metrics selector and initial display
    this.initializeTeamQualitySelector();
    this.loadTeamQualityMetrics();
    
    // Load quality comparison chart (only for team users)
    if (userTeam && !isEditor) {
      this.loadQualityComparisonChart();
    }
  },

  loadRecentActivity() {
    const user = DataManager.getCurrentUser();
    const userTeam = DataManager.getUserTeam();
    const isEditor = DataManager.isEditor();
    const allAudits = DataManager.getAllAudits();
    
    // For team users: show ONLY personal audits
    // For editors: show all audits
    let audits = allAudits;
    
    if (userTeam && !isEditor) {
      const teams = DataManager.getAllTeams();
      const team = teams[userTeam];
      
      // Find which agent this user represents
      let userAgentName = null;
      if (team && team.members) {
        const member = team.members.find(m => m.email === user.email);
        if (member) {
          userAgentName = member.name;
        }
      }
      
      // Filter to ONLY this user's personal audits
      if (userAgentName) {
        audits = allAudits.filter(audit => audit.agentName === userAgentName);
      } else {
        audits = [];
      }
    }
    
    const recentAudits = audits
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const container = document.getElementById('recentActivity');
    
    if (recentAudits.length === 0) {
      container.innerHTML = '<p class="empty">No hay actividad reciente</p>';
      return;
    }

    container.innerHTML = recentAudits.map(audit => `
      <div style="padding: 0.5rem 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
        <div style="display: flex; justify-content: space-between; gap: 0.5rem;">
          <span style="font-weight: 600; color: var(--text-primary);">${audit.agentName}</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);">${DataManager.formatDate(audit.date)}</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-muted);">
          ${audit.type} - Puntuación: ${audit.score}
        </div>
      </div>
    `).join('');
  },

  loadTopAgents() {
    const user = DataManager.getCurrentUser();
    const userTeam = DataManager.getUserTeam();
    const isEditor = DataManager.isEditor();
    const allAudits = DataManager.getAllAudits();
    const teams = DataManager.getAllTeams();
    
    // Filter audits to current month only
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const firstDayOfMonth = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const lastDayString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(lastDayOfMonth.getDate()).padStart(2, '0')}`;
    
    const currentMonthAudits = allAudits.filter(audit => {
      return audit.date >= firstDayOfMonth && audit.date <= lastDayString;
    });
    
    const container = document.getElementById('topAgents');
    
    // Update heading to show top 2 and bottom 3
    const headingElement = container.parentElement.querySelector('h3');
    if (headingElement) {
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      headingElement.innerHTML = `<i class="fas fa-star"></i> Mejores y Puntos de Mejora - ${monthNames[currentMonth]} ${currentYear}`;
    }
    
    // For editors: show top 2 and bottom 3 from each team
    // For team users: show top 2 and bottom 3 from their team only
    if (isEditor) {
      // Show top 2 and bottom 3 from each team
      const teamRankings = {};
      
      Object.entries(teams).forEach(([teamId, team]) => {
        const teamMemberNames = team.members ? team.members.map(m => m.name) : [];
        const teamAudits = currentMonthAudits.filter(audit => teamMemberNames.includes(audit.agentName));
        
        // Calculate agent scores
        const agentScores = {};
        teamAudits.forEach(audit => {
          if (!agentScores[audit.agentName]) {
            agentScores[audit.agentName] = { total: 0, count: 0 };
          }
          agentScores[audit.agentName].total += parseFloat(audit.score || 0);
          agentScores[audit.agentName].count++;
        });
        
        // Get all agents sorted by score
        const sortedAgents = Object.entries(agentScores)
          .map(([name, data]) => ({
            name,
            avgScore: Math.round(data.total / data.count),
            count: data.count
          }))
          .sort((a, b) => b.avgScore - a.avgScore);
        
        // Get top 2 and bottom 3
        const top2 = sortedAgents.slice(0, 2);
        const bottom3 = sortedAgents.slice(-3).reverse();
        
        teamRankings[teamId] = { team, top2, bottom3 };
      });
      
      container.innerHTML = Object.entries(teamRankings).map(([teamId, data]) => {
        if (!data.top2.length && !data.bottom3.length) return '';
        
        return `
          <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 2px solid ${data.team.color};">
            <div style="font-weight: 700; color: ${data.team.color}; margin-bottom: 0.5rem;">
              ${data.team.name}
            </div>
            ${data.top2.length > 0 ? `
              <div style="margin-bottom: 0.5rem;">
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">✨ TOP 2 MEJORES</div>
                ${data.top2.map((agent, index) => `
                  <div style="padding: 0.4rem 0; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <span style="font-size: 1.2rem; margin-right: 0.5rem;">${index === 0 ? '🥇' : '🥈'}</span>
                      <span style="font-weight: 600; color: var(--text-primary);">${agent.name}</span>
                      <span style="font-size: 0.85rem; color: var(--text-muted);"> • ${agent.count} auditorías</span>
                    </div>
                    <div style="font-weight: 700; color: #38CEA6; font-size: 1rem;">
                      ${agent.avgScore}%
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            ${data.bottom3.length > 0 ? `
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">📊 PUNTOS DE MEJORA (3 MÁS BAJOS)</div>
                ${data.bottom3.map((agent) => `
                  <div style="padding: 0.4rem 0; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <span style="font-size: 1rem; margin-right: 0.5rem;">📉</span>
                      <span style="font-weight: 600; color: var(--text-primary);">${agent.name}</span>
                      <span style="font-size: 0.85rem; color: var(--text-muted);"> • ${agent.count} auditorías</span>
                    </div>
                    <div style="font-weight: 700; color: #f59e0b; font-size: 1rem;">
                      ${agent.avgScore}%
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
      
    } else if (userTeam) {
      // Show top 2 and bottom 3 from user's team only
      const team = teams[userTeam];
      const teamMemberNames = team && team.members ? team.members.map(m => m.name) : [];
      const teamAudits = currentMonthAudits.filter(audit => teamMemberNames.includes(audit.agentName));
      
      // Calculate agent scores
      const agentScores = {};
      teamAudits.forEach(audit => {
        if (!agentScores[audit.agentName]) {
          agentScores[audit.agentName] = { total: 0, count: 0 };
        }
        agentScores[audit.agentName].total += parseFloat(audit.score || 0);
        agentScores[audit.agentName].count++;
      });
      
      // Get all agents sorted by score
      const sortedAgents = Object.entries(agentScores)
        .map(([name, data]) => ({
          name,
          avgScore: Math.round(data.total / data.count),
          count: data.count
        }))
        .sort((a, b) => b.avgScore - a.avgScore);
      
      // Get top 2 and bottom 3
      const top2 = sortedAgents.slice(0, 2);
      const bottom3 = sortedAgents.slice(-3).reverse();
      
      if (top2.length === 0 && bottom3.length === 0) {
        container.innerHTML = '<p class="empty">No hay datos disponibles</p>';
        return;
      }
      
      container.innerHTML = `
        ${top2.length > 0 ? `
          <div style="margin-bottom: 0.75rem;">
            <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.5rem;">✨ TOP 2 MEJORES</div>
            ${top2.map((agent, index) => `
              <div style="padding: 0.5rem 0; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <span style="font-size: 1.3rem; margin-right: 0.5rem;">${index === 0 ? '🥇' : '🥈'}</span>
                  <span style="font-weight: 600; color: var(--text-primary);">${agent.name}</span>
                  <div style="font-size: 0.85rem; color: ${team.color};">
                    ${team.name} • ${agent.count} auditorías
                  </div>
                </div>
                <div style="font-weight: 700; color: #38CEA6; font-size: 1.1rem;">
                  ${agent.avgScore}%
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${bottom3.length > 0 ? `
          <div>
            <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.5rem;">📊 PUNTOS DE MEJORA (3 MÁS BAJOS)</div>
            ${bottom3.map((agent) => `
              <div style="padding: 0.5rem 0; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <span style="font-size: 1rem; margin-right: 0.5rem;">📉</span>
                  <span style="font-weight: 600; color: var(--text-primary);">${agent.name}</span>
                  <div style="font-size: 0.85rem; color: ${team.color};">
                    ${team.name} • ${agent.count} auditorías
                  </div>
                </div>
                <div style="font-weight: 700; color: #f59e0b; font-size: 1.1rem;">
                  ${agent.avgScore}%
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      `;
    } else {
      // For viewers without a team, show empty state
      container.innerHTML = '<p class="empty">No hay datos disponibles</p>';
    }
  },

  initializeTeamQualitySelector() {
    const selector = document.getElementById('teamQualitySelector');
    if (!selector) return;

    const teams = DataManager.getAllTeams();
    
    // Clear and add options
    selector.innerHTML = '<option value="">Acumulado Global</option>';
    Object.entries(teams).forEach(([teamId, team]) => {
      const option = document.createElement('option');
      option.value = teamId;
      option.textContent = team.name;
      selector.appendChild(option);
    });
  },

  loadTeamQualityMetrics() {
    const selector = document.getElementById('teamQualitySelector');
    const content = document.getElementById('teamQualityContent');
    if (!selector || !content) return;

    const selectedTeam = selector.value;
    const allAudits = DataManager.getAllAudits();
    const teams = DataManager.getAllTeams();
    
    // Get current month audits
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentMonthAudits = allAudits.filter(audit => {
      const auditDate = new Date(audit.date);
      return auditDate.getFullYear() === currentYear && auditDate.getMonth() === currentMonth;
    });

    if (selectedTeam === '') {
      // Show global accumulated metrics
      const teamMetrics = {};
      
      Object.entries(teams).forEach(([teamId, team]) => {
        const teamMemberNames = team.members ? team.members.map(m => m.name) : [];
        const teamAudits = currentMonthAudits.filter(audit => teamMemberNames.includes(audit.agentName));
        
        if (teamAudits.length > 0) {
          const avgQuality = Math.round(teamAudits.reduce((sum, a) => sum + parseFloat(a.score || 0), 0) / teamAudits.length);
          teamMetrics[teamId] = {
            team,
            count: teamAudits.length,
            avgQuality,
            agents: new Set(teamAudits.map(a => a.agentName)).size
          };
        }
      });

      content.innerHTML = `
        <div style="font-size: 0.9rem; margin-bottom: 1rem; color: var(--text-muted);">
          <i class="fas fa-globe"></i> Acumulado global de todos los equipos - ${now.toLocaleDateString('es-VE', { month: 'long', year: 'numeric' })}
        </div>
        <div style="display: grid; gap: 1rem;">
          ${Object.entries(teamMetrics).map(([teamId, data]) => `
            <div style="background: ${data.team.color}15; border-left: 4px solid ${data.team.color}; padding: 1rem; border-radius: 0.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h4 style="margin: 0; font-weight: 700; color: ${data.team.color};">${data.team.name}</h4>
                <div style="font-size: 1.5rem; font-weight: 700; color: ${data.team.color};">${data.avgQuality}%</div>
              </div>
              <div style="font-size: 0.85rem; color: var(--text-muted);">
                <i class="fas fa-clipboard-check"></i> ${data.count} auditorías • 
                <i class="fas fa-users"></i> ${data.agents} agentes evaluados
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      // Show detailed metrics for selected team
      const team = teams[selectedTeam];
      if (!team) return;

      const teamMemberNames = team.members ? team.members.map(m => m.name) : [];
      const teamAudits = currentMonthAudits.filter(audit => teamMemberNames.includes(audit.agentName));
      
      // Calculate per-agent metrics
      const agentMetrics = {};
      teamAudits.forEach(audit => {
        if (!agentMetrics[audit.agentName]) {
          agentMetrics[audit.agentName] = { count: 0, totalScore: 0, audits: [] };
        }
        agentMetrics[audit.agentName].count++;
        agentMetrics[audit.agentName].totalScore += parseFloat(audit.score || 0);
        agentMetrics[audit.agentName].audits.push(audit);
      });

      const sortedAgents = Object.entries(agentMetrics)
        .map(([name, data]) => ({
          name,
          count: data.count,
          avgScore: Math.round(data.totalScore / data.count)
        }))
        .sort((a, b) => b.avgScore - a.avgScore);

      const teamAvgQuality = teamAudits.length > 0
        ? Math.round(teamAudits.reduce((sum, a) => sum + parseFloat(a.score || 0), 0) / teamAudits.length)
        : 0;

      content.innerHTML = `
        <div style="background: ${team.color}15; border: 2px solid ${team.color}; padding: 1.5rem; border-radius: 0.75rem; margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h4 style="margin: 0; font-weight: 700; font-size: 1.2rem; color: ${team.color};">
              <i class="fas fa-users"></i> ${team.name}
            </h4>
            <div>
              <div style="text-align: right;">
                <div style="font-size: 0.75rem; color: var(--text-muted);">PROMEDIO CALIDAD</div>
                <div style="font-size: 2rem; font-weight: 700; color: ${team.color};">${teamAvgQuality}%</div>
              </div>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; font-size: 0.9rem; color: var(--text-muted);">
            <div><i class="fas fa-clipboard-check"></i> <strong>${teamAudits.length}</strong> auditorías</div>
            <div><i class="fas fa-user-friends"></i> <strong>${sortedAgents.length}</strong> agentes evaluados</div>
            <div><i class="fas fa-calendar"></i> ${now.toLocaleDateString('es-VE', { month: 'long', year: 'numeric' })}</div>
          </div>
        </div>
        
        <h5 style="font-weight: 700; color: var(--text-primary); margin: 0 0 0.75rem 0;">
          <i class="fas fa-chart-bar"></i> Detalle por Agente
        </h5>
        <div style="display: grid; gap: 0.5rem;">
          ${sortedAgents.map(agent => {
            const scoreColor = agent.avgScore >= 80 ? '#38CEA6' : agent.avgScore >= 60 ? '#f59e0b' : '#ef4444';
            return `
              <div style="background: white; border: 1px solid #e5e7eb; padding: 0.75rem; border-radius: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 600; color: var(--text-primary);">${agent.name}</div>
                  <div style="font-size: 0.85rem; color: var(--text-muted);">
                    <i class="fas fa-clipboard-check"></i> ${agent.count} auditorías realizadas
                  </div>
                </div>
                <div style="font-size: 1.5rem; font-weight: 700; color: ${scoreColor};">
                  ${agent.avgScore}%
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
  },
  
  loadQualityComparisonChart() {
    const user = DataManager.getCurrentUser();
    const userTeam = DataManager.getUserTeam();
    const isEditor = DataManager.isEditor();
    
    if (!userTeam || isEditor) {
      // Only for team users, not editors
      return;
    }
    
    const teams = DataManager.getAllTeams();
    const team = teams[userTeam];
    const allAudits = DataManager.getAllAudits();
    
    // Find which agent this user represents
    let userAgentName = null;
    if (team && team.members) {
      const member = team.members.find(m => m.email === user.email);
      if (member) {
        userAgentName = member.name;
      }
    }
    
    if (!userAgentName) return;
    
    // Calculate personal quality
    const personalAudits = allAudits.filter(audit => audit.agentName === userAgentName);
    const personalQuality = personalAudits.length > 0 
      ? Math.round(personalAudits.reduce((sum, a) => sum + parseFloat(a.score || 0), 0) / personalAudits.length)
      : 0;
    
    // Calculate team average quality
    const teamMemberNames = team && team.members ? team.members.map(m => m.name) : [];
    const teamAudits = allAudits.filter(audit => teamMemberNames.includes(audit.agentName));
    
    const teamQuality = teamAudits.length > 0 
      ? Math.round(teamAudits.reduce((sum, a) => sum + parseFloat(a.score || 0), 0) / teamAudits.length)
      : 0;
    
    // Check if chart already exists
    let chartContainer = document.getElementById('qualityComparisonChart');
    if (!chartContainer) {
      chartContainer = document.createElement('div');
      chartContainer.id = 'qualityComparisonChart';
      chartContainer.className = 'glass';
      chartContainer.style.cssText = 'padding: 1.5rem; margin-bottom: 1.5rem;';
      
      chartContainer.innerHTML = `
        <h3 style="font-size: 1.1rem; font-weight: 700; margin: 0 0 1rem 0;">
          <i class="fas fa-chart-pie"></i> Comparación de Calidad del Equipo
        </h3>
        <div style="max-width: 250px; margin: 0 auto;">
          <canvas id="qualityComparisonCanvas"></canvas>
        </div>
        <p style="text-align: center; margin-top: 1rem; font-size: 0.9rem; color: var(--text-muted);">
          Tu calidad: <strong style="color: #38CEA6; font-size: 1.2rem;">${personalQuality}%</strong> vs 
          Promedio del equipo: <strong style="color: #0ea5e9; font-size: 1.2rem;">${teamQuality}%</strong>
        </p>
      `;
      
      // Insert next to "Resumen Rápido" - find the hero section
      const heroSection = document.querySelector('#dashboardView .hero');
      if (heroSection && heroSection.nextElementSibling) {
        heroSection.parentElement.insertBefore(chartContainer, heroSection.nextElementSibling);
      }
    } else {
      // Update existing chart text
      const textElement = chartContainer.querySelector('p');
      if (textElement) {
        textElement.innerHTML = `
          Tu calidad: <strong style="color: #38CEA6; font-size: 1.2rem;">${personalQuality}%</strong> vs 
          Promedio del equipo: <strong style="color: #0ea5e9; font-size: 1.2rem;">${teamQuality}%</strong>
        `;
      }
    }
    
    // Render doughnut chart
    setTimeout(() => {
      const ctx = document.getElementById('qualityComparisonCanvas');
      if (!ctx) return;
      
      // Destroy existing chart
      if (this.charts.qualityComparison) {
        this.charts.qualityComparison.destroy();
      }
      
      this.charts.qualityComparison = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Tu Calidad', 'Promedio del Equipo', 'Meta (100%)'],
          datasets: [{
            data: [personalQuality, teamQuality, Math.max(0, 100 - Math.max(personalQuality, teamQuality))],
            backgroundColor: ['#38CEA6', '#0ea5e9', '#e5e7eb'],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                font: {
                  size: 11
                }
              }
            }
          },
          cutout: '65%'
        }
      });
    }, 100);
  },

  // Audits View
  loadAuditsView() {
    // Populate team filter
    const filterTeam = document.getElementById('filterTeam');
    if (filterTeam && filterTeam.options.length === 1) {
      const teams = DataManager.getAllTeams();
      Object.values(teams).forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = team.name;
        filterTeam.appendChild(option);
      });
    }
    
    this.filterAudits();
  },

  filterAudits() {
    const searchTerm = document.getElementById('searchAudit').value;
    const teamFilter = document.getElementById('filterTeam').value;
    const monthFilter = document.getElementById('filterMonth').value;
    
    let audits = DataManager.searchAudits(searchTerm, teamFilter);
    
    // Apply month filter
    if (monthFilter !== '') {
      const currentYear = new Date().getFullYear();
      const month = parseInt(monthFilter);
      audits = audits.filter(audit => {
        const auditDate = new Date(audit.date);
        return auditDate.getFullYear() === currentYear && auditDate.getMonth() === month;
      });
    }
    
    this.renderAuditsTable(audits);
  },

  renderAuditsTable(audits) {
    const tbody = document.getElementById('auditsTableBody');
    const isEditor = DataManager.isEditor();
    const teams = DataManager.getAllTeams();
    
    if (audits.length === 0) {
      tbody.innerHTML = `<tr><td colspan="12" class="empty">No se encontraron auditorías</td></tr>`;
      return;
    }

    // Sort by date (newest first)
    const sortedAudits = audits.sort((a, b) => new Date(b.date) - new Date(a.date));

    tbody.innerHTML = sortedAudits.map(audit => {
      const team = teams[audit.teamId];
      const teamName = team ? team.name : 'N/A';
      const teamColor = team ? team.color : '#6b7280';
      const empatiaScore = audit.empatiaScore || 0;
      const gestionScore = audit.gestionScore || 0;
      const totalScore = audit.score || 0;
      const tipificacion = audit.tipificacion || '-';
      
      // Truncate long text for display but keep full text in title
      const truncate = (text, maxLen) => {
        if (!text || text === '-') return text;
        return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
      };
      
      return `
        <tr>
          <td style="min-width: 140px;"><strong>${audit.agentName}</strong></td>
          <td style="min-width: 120px;"><span style="color: ${teamColor}; font-weight: 600; font-size: 0.85rem;">${teamName.replace('Soporte ', '')}</span></td>
          <td style="max-width: 140px; white-space: normal; font-size: 0.85rem;" title="${tipificacion}">${truncate(tipificacion, 30)}</td>
          <td style="min-width: 90px; font-size: 0.9rem;">${audit.ticketId || '-'}</td>
          <td style="min-width: 95px; font-size: 0.85rem;">${audit.ticketDate ? DataManager.formatDate(audit.ticketDate).replace(' de ', ' ') : '-'}</td>
          <td style="min-width: 95px; font-size: 0.85rem;">${DataManager.formatDate(audit.date).replace(' de ', ' ')}</td>
          <td style="text-align: center; min-width: 70px;"><strong style="color: #38CEA6; font-size: 0.95rem;">${empatiaScore}%</strong></td>
          <td style="text-align: center; min-width: 70px;"><strong style="color: #f59e0b; font-size: 0.95rem;">${gestionScore}%</strong></td>
          <td style="text-align: center; min-width: 60px;"><strong style="color: #10b981; font-size: 1rem;">${totalScore}</strong></td>
          <td style="min-width: 250px; max-width: 350px; white-space: normal; font-size: 0.85rem; line-height: 1.4;" title="${audit.ticketSummary || ''}">
            ${truncate(audit.ticketSummary, 100) || '-'}
          </td>
          <td style="min-width: 250px; max-width: 350px; white-space: normal; font-size: 0.85rem; line-height: 1.4;" title="${audit.observations || ''}">
            ${truncate(audit.observations, 100) || '-'}
          </td>
          <td style="min-width: 200px;">
            <div style="display: flex; gap: 0.4rem; flex-wrap: nowrap;">
              <button class="btn-mini" onclick="App.viewAudit('${audit.id}')" title="Ver detalles completos" style="background: #38CEA6; color: white; border: none; font-size: 0.8rem; padding: 0.35rem 0.6rem;">
                <i class="fas fa-eye"></i> Leer
              </button>
              ${isEditor ? `
                <button class="btn-mini" onclick="App.editAudit('${audit.id}')" title="Editar auditoría" style="background: #0ea5e9; color: white; border: none; font-size: 0.8rem; padding: 0.35rem 0.6rem;">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-mini danger" onclick="App.deleteAudit('${audit.id}')" title="Eliminar auditoría" style="background: #ef4444; color: white; border: none; font-size: 0.8rem; padding: 0.35rem 0.6rem;">
                  <i class="fas fa-trash"></i>
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  // Teams Management View
  loadTeamsView() {
    const teams = DataManager.getAllTeams();
    const container = document.getElementById('teamsContainer');
    
    container.innerHTML = Object.values(teams).map(team => `
      <div class="glass" style="padding: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 2px solid ${team.color};">
          <div>
            <h3 style="font-size: 1.1rem; font-weight: 700; margin: 0 0 0.25rem 0; color: ${team.color};">
              <i class="fas fa-users"></i> ${team.name}
            </h3>
            <div style="font-size: 0.85rem; color: var(--text-muted);">
              <i class="fas fa-envelope"></i> ${team.email || 'No hay email configurado'}
            </div>
          </div>
          <button class="btn-accent" onclick="App.showAddMemberModal('${team.id}')" style="background: ${team.color}; color: white; border: none; cursor: pointer; font-size: 0.85rem; padding: 0.5rem 1rem;">
            <i class="fas fa-plus"></i> Agregar Integrante
          </button>
        </div>
        
        <div style="display: grid; gap: 0.5rem;">
          ${team.members.length === 0 ? '<p class="empty">No hay integrantes en este equipo</p>' : ''}
          ${team.members.map(member => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #f9fafb; border-radius: 0.5rem; border-left: 3px solid ${team.color};">
              <div>
                <div style="font-weight: 600; color: var(--text-primary);">${member.name}</div>
                <div style="font-size: 0.85rem; color: var(--text-muted);">${member.email}</div>
              </div>
              <button class="btn-mini danger" onclick="App.removeMember('${team.id}', '${member.email}')" title="Eliminar">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  },

  showAddMemberModal(teamId) {
    const team = DataManager.getTeamById(teamId);
    if (!team) return;
    
    const name = prompt(`Agregar integrante a ${team.name}\n\nNombre completo:`);
    if (!name || !name.trim()) return;
    
    const email = prompt(`Email del integrante:`);
    if (!email || !email.trim() || !email.includes('@')) {
      alert('Por favor ingrese un email válido');
      return;
    }
    
    const success = DataManager.addTeamMember(teamId, {
      name: name.trim(),
      email: email.toLowerCase().trim()
    });
    
    if (success) {
      this.loadTeamsView();
      alert('Integrante agregado exitosamente');
    } else {
      alert('Error al agregar integrante');
    }
  },

  removeMember(teamId, memberEmail) {
    if (confirm(`¿Está seguro que desea eliminar este integrante del equipo?`)) {
      const success = DataManager.removeTeamMember(teamId, memberEmail);
      if (success) {
        this.loadTeamsView();
      } else {
        alert('Error al eliminar integrante');
      }
    }
  },

  // Audit Modal
  openAuditModal(auditId = null) {
    const modal = document.getElementById('auditModal');
    const form = document.getElementById('auditForm');
    const modalTitle = document.getElementById('modalTitle');
    
    form.reset();
    
    // Reset all checkboxes
    document.querySelectorAll('input[type="checkbox"][name="empatia"], input[type="checkbox"][name="gestion"]').forEach(cb => {
      cb.checked = false;
    });
    
    // Populate agent dropdown
    const agentSelect = document.getElementById('agentSelect');
    agentSelect.innerHTML = '<option value="">Seleccionar agente...</option>';
    
    const teams = DataManager.getAllTeams();
    Object.values(teams).forEach(team => {
      if (team.members.length > 0) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = team.name;
        team.members.forEach(member => {
          const option = document.createElement('option');
          option.value = JSON.stringify({ name: member.name, teamId: team.id });
          option.textContent = member.name;
          optgroup.appendChild(option);
        });
        agentSelect.appendChild(optgroup);
      }
    });
    
    if (auditId) {
      const audit = DataManager.getAuditById(auditId);
      if (audit) {
        modalTitle.textContent = 'Editar Auditoría de Chat';
        document.getElementById('auditId').value = audit.id;
        
        // Set agent select
        const agentData = JSON.stringify({ name: audit.agentName, teamId: audit.teamId });
        agentSelect.value = agentData;
        
        document.getElementById('ticketId').value = audit.ticketId || '';
        document.getElementById('ticketDate').value = audit.ticketDate || '';
        document.getElementById('auditDate').value = audit.date;
        document.getElementById('tipificacion').value = audit.tipificacion || '';
        document.getElementById('ticketSummary').value = audit.ticketSummary || '';
        document.getElementById('observations').value = audit.observations || '';
        document.getElementById('calculatedScore').value = audit.score || 0;
        
        // Load evaluation data if exists
        if (audit.evaluationData) {
          // Empatía checkboxes
          if (audit.evaluationData.empatia) {
            Object.keys(audit.evaluationData.empatia).forEach(key => {
              if (audit.evaluationData.empatia[key]) {
                const checkbox = document.getElementById(key);
                if (checkbox) checkbox.checked = true;
              }
            });
          }
          
          // Gestión checkboxes
          if (audit.evaluationData.gestion) {
            ['ticket', 'conocimiento', 'herramientas'].forEach(category => {
              if (audit.evaluationData.gestion[category]) {
                Object.keys(audit.evaluationData.gestion[category]).forEach(key => {
                  if (audit.evaluationData.gestion[category][key]) {
                    const checkbox = document.getElementById(key);
                    if (checkbox) checkbox.checked = true;
                  }
                });
              }
            });
          }
        }
        
        // Recalculate score with loaded data
        this.calculateScore();
      }
    } else {
      modalTitle.textContent = 'Nueva Auditoría de Chat';
      document.getElementById('auditId').value = '';
      // Set today's date as default
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('auditDate').value = today;
      document.getElementById('ticketDate').value = today;
      document.getElementById('calculatedScore').value = 0;
      this.calculateScore();
    }
    
    modal.classList.remove('hidden');
  },

  closeAuditModal() {
    document.getElementById('auditModal').classList.add('hidden');
  },

  handleAuditSubmit(e) {
    e.preventDefault();
    
    const auditId = document.getElementById('auditId').value;
    const agentSelectValue = document.getElementById('agentSelect').value;
    
    if (!agentSelectValue) {
      alert('Por favor seleccione un agente');
      return;
    }
    
    const agentData = JSON.parse(agentSelectValue);
    
    // Collect evaluation data
    const evaluationData = {
      empatia: {
        metodoRided: document.getElementById('metodoRided')?.checked || false,
        lenguajePositivo: document.getElementById('lenguajePositivo')?.checked || false,
        acompanamiento: document.getElementById('acompanamiento')?.checked || false,
        personalizacion: document.getElementById('personalizacion')?.checked || false,
        estructura: document.getElementById('estructura')?.checked || false,
        usoIaOrtografia: document.getElementById('usoIaOrtografia')?.checked || false
      },
      gestion: {
        ticket: {
          estadosTicket: document.getElementById('estadosTicket')?.checked || false,
          ausenciaCliente: document.getElementById('ausenciaCliente')?.checked || false,
          validacionHistorial: document.getElementById('validacionHistorial')?.checked || false,
          tipificacionCriterio: document.getElementById('tipificacionCriterio')?.checked || false,
          retencionTickets: document.getElementById('retencionTickets')?.checked || false,
          tiempoRespuesta: document.getElementById('tiempoRespuesta')?.checked || false,
          tiempoGestion: document.getElementById('tiempoGestion')?.checked || false
        },
        conocimiento: {
          serviciosPromociones: document.getElementById('serviciosPromociones')?.checked || false,
          informacionVeraz: document.getElementById('informacionVeraz')?.checked || false,
          parlamentosContingencia: document.getElementById('parlamentosContingencia')?.checked || false,
          honestidadTransparencia: document.getElementById('honestidadTransparencia')?.checked || false
        },
        herramientas: {
          rideryOffice: document.getElementById('rideryOffice')?.checked || false,
          adminZendesk: document.getElementById('adminZendesk')?.checked || false,
          driveManuales: document.getElementById('driveManuales')?.checked || false,
          slack: document.getElementById('slack')?.checked || false,
          generacionReportes: document.getElementById('generacionReportes')?.checked || false,
          cargaIncidencias: document.getElementById('cargaIncidencias')?.checked || false
        }
      }
    };
    
    const auditData = {
      agentName: agentData.name,
      teamId: agentData.teamId,
      ticketId: document.getElementById('ticketId').value,
      ticketDate: document.getElementById('ticketDate').value,
      date: document.getElementById('auditDate').value,
      tipificacion: document.getElementById('tipificacion').value,
      ticketSummary: document.getElementById('ticketSummary').value,
      observations: document.getElementById('observations').value,
      score: parseFloat(document.getElementById('calculatedScore').value) || 0,
      empatiaScore: parseFloat(document.getElementById('empatiaScore').value) || 0,
      gestionScore: parseFloat(document.getElementById('gestionScore').value) || 0,
      evaluationData: evaluationData,
      type: 'Chat', // All audits are chat
      status: 'Completada'
    };

    if (auditId) {
      DataManager.updateAudit(auditId, auditData);
    } else {
      DataManager.createAudit(auditData);
    }

    this.closeAuditModal();
    
    // Refresh current view
    if (this.currentView === 'audits') {
      this.loadAuditsView();
    } else if (this.currentView === 'dashboard') {
      this.loadDashboard();
    }
  },

  editAudit(auditId) {
    this.openAuditModal(auditId);
  },

  deleteAudit(auditId) {
    if (confirm('¿Está seguro que desea eliminar esta auditoría?')) {
      DataManager.deleteAudit(auditId);
      this.loadAuditsView();
      
      // Refresh dashboard if that's the current view
      if (this.currentView === 'dashboard') {
        this.loadDashboard();
      }
    }
  },

  // View audit details
  viewAudit(auditId) {
    const audit = DataManager.getAuditById(auditId);
    if (!audit) return;

    const teams = DataManager.getAllTeams();
    const team = teams[audit.teamId];
    const teamName = team ? team.name : 'N/A';

    // Build criteria display for Empatía
    const empatiaCriteria = {
      'metodoRided': 'MÉTODO RIDED',
      'lenguajePositivo': 'LENGUAJE POSITIVO',
      'acompanamiento': 'ACOMPAÑAMIENTO',
      'personalizacion': 'PERSONALIZACIÓN',
      'estructura': 'ESTRUCTURA',
      'usoIaOrtografia': 'USO DE IA, ORTOGRAFÍA Y EMOJIS'
    };

    let empatiaHTML = '<div style="display: grid; gap: 0.5rem;">';
    Object.entries(empatiaCriteria).forEach(([key, label]) => {
      const checked = audit.evaluationData?.empatia?.[key];
      const icon = checked ? '✓' : '✗';
      const color = checked ? '#38CEA6' : '#ef4444';
      empatiaHTML += `
        <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: ${checked ? '#f0fdf4' : '#fef2f2'}; border-radius: 0.5rem;">
          <span style="font-size: 1.2rem; color: ${color}; font-weight: bold;">${icon}</span>
          <span style="flex: 1; color: var(--text-primary);">${label}</span>
        </div>
      `;
    });
    empatiaHTML += '</div>';

    // Build criteria display for Gestión
    const gestionCategories = {
      'ticket': {
        title: 'Gestión de ticket',
        criteria: {
          'estadosTicket': 'Estados del Ticket',
          'ausenciaCliente': 'Ausencia del Cliente',
          'validacionHistorial': 'Validación del Historial',
          'tipificacionCriterio': 'Tipificación',
          'retencionTickets': 'Retención de Tickets',
          'tiempoRespuesta': 'Tiempo de Respuesta',
          'tiempoGestion': 'Tiempo de Gestión'
        }
      },
      'conocimiento': {
        title: 'Conocimiento Integral de la marca',
        criteria: {
          'serviciosPromociones': 'Servicios y Promociones',
          'informacionVeraz': 'Información Veraz',
          'parlamentosContingencia': 'Parlamentos de Contingencia',
          'honestidadTransparencia': 'Honestidad y Transparencia'
        }
      },
      'herramientas': {
        title: 'Uso estratégico de herramientas',
        criteria: {
          'rideryOffice': 'Ridery Office',
          'adminZendesk': 'Admin y Zendesk',
          'driveManuales': 'Drive y Manuales',
          'slack': 'Slack',
          'generacionReportes': 'Generación de Reportes',
          'cargaIncidencias': 'Carga de Incidencias'
        }
      }
    };

    let gestionHTML = '';
    Object.entries(gestionCategories).forEach(([categoryKey, category]) => {
      gestionHTML += `
        <div style="margin-bottom: 1rem;">
          <h4 style="font-size: 0.9rem; font-weight: 700; margin: 0 0 0.5rem 0; color: #f59e0b;">
            ${category.title}
          </h4>
          <div style="display: grid; gap: 0.35rem;">
      `;
      Object.entries(category.criteria).forEach(([key, label]) => {
        const checked = audit.evaluationData?.gestion?.[categoryKey]?.[key];
        const icon = checked ? '✓' : '✗';
        const color = checked ? '#38CEA6' : '#ef4444';
        gestionHTML += `
          <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem; background: ${checked ? '#f0fdf4' : '#fef2f2'}; border-radius: 0.35rem;">
            <span style="font-size: 1rem; color: ${color}; font-weight: bold;">${icon}</span>
            <span style="flex: 1; font-size: 0.85rem; color: var(--text-primary);">${label}</span>
          </div>
        `;
      });
      gestionHTML += '</div></div>';
    });

    const content = `
      <div style="display: grid; gap: 1.5rem;">
        <!-- Basic Information -->
        <div style="background: #f0f9ff; padding: 1.5rem; border-radius: 0.75rem;">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin: 0 0 1rem 0; color: var(--ridery-mint);">
            <i class="fas fa-info-circle"></i> Información Básica
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem;">Agente</div>
              <div style="font-weight: 600;">${audit.agentName}</div>
            </div>
            <div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem;">Equipo</div>
              <div style="font-weight: 600; color: ${team?.color || '#6b7280'};">${teamName}</div>
            </div>
            <div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem;">Tipificación</div>
              <div style="font-weight: 600;">${audit.tipificacion || '-'}</div>
            </div>
            <div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem;">N° Ticket</div>
              <div style="font-weight: 600;">${audit.ticketId || '-'}</div>
            </div>
            <div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem;">Fecha del Ticket</div>
              <div style="font-weight: 600;">${audit.ticketDate ? DataManager.formatDate(audit.ticketDate) : '-'}</div>
            </div>
            <div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem;">Fecha de la Auditoría</div>
              <div style="font-weight: 600;">${DataManager.formatDate(audit.date)}</div>
            </div>
            <div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem;">Calificación del Ticket</div>
              <div style="font-weight: 700; font-size: 1.2rem; color: #10b981;">${audit.score || 0}</div>
            </div>
          </div>
        </div>

        <!-- Resumen and Observations -->
        <div>
          <div style="margin-bottom: 1rem;">
            <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0 0 0.5rem 0; color: var(--text-primary);">
              <i class="fas fa-file-alt"></i> Resumen del Ticket
            </h4>
            <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid #e5e7eb; white-space: pre-wrap; line-height: 1.6;">
              ${audit.ticketSummary || 'No hay resumen disponible'}
            </div>
          </div>
          <div>
            <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0 0 0.5rem 0; color: var(--text-primary);">
              <i class="fas fa-comment"></i> Observaciones
            </h4>
            <div style="background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid #e5e7eb; white-space: pre-wrap; line-height: 1.6;">
              ${audit.observations || 'No hay observaciones disponibles'}
            </div>
          </div>
        </div>

        <!-- Evaluation Criteria -->
        <div style="background: #f0f9ff; padding: 1.5rem; border-radius: 0.75rem; border-left: 4px solid #38CEA6;">
          <h3 style="font-size: 1rem; font-weight: 700; margin: 0 0 1rem 0; color: #38CEA6;">
            <i class="fas fa-heart"></i> Pilar Empatía (${audit.empatiaScore || 0}%)
          </h3>
          ${empatiaHTML}
        </div>

        <div style="background: #fef3f2; padding: 1.5rem; border-radius: 0.75rem; border-left: 4px solid #f59e0b;">
          <h3 style="font-size: 1rem; font-weight: 700; margin: 0 0 1rem 0; color: #f59e0b;">
            <i class="fas fa-cogs"></i> Pilar Gestión (${audit.gestionScore || 0}%)
          </h3>
          ${gestionHTML}
        </div>

        <!-- Total Score Summary -->
        <div style="background: #f0fdf4; padding: 1.5rem; border-radius: 0.75rem; border: 2px solid #38CEA6; text-align: center;">
          <h3 style="font-size: 1rem; font-weight: 700; margin: 0 0 0.5rem 0; color: var(--text-primary);">
            <i class="fas fa-chart-pie"></i> Puntuación Total
          </h3>
          <div style="font-size: 3rem; font-weight: 800; color: #10b981;">${audit.score || 0}</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
            <div style="background: white; padding: 0.75rem; border-radius: 0.5rem;">
              <div style="font-size: 0.8rem; color: var(--text-muted);">Empatía</div>
              <div style="font-size: 1.5rem; font-weight: 700; color: #38CEA6;">${audit.empatiaScore || 0}%</div>
            </div>
            <div style="background: white; padding: 0.75rem; border-radius: 0.5rem;">
              <div style="font-size: 0.8rem; color: var(--text-muted);">Gestión</div>
              <div style="font-size: 1.5rem; font-weight: 700; color: #f59e0b;">${audit.gestionScore || 0}%</div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('auditViewContent').innerHTML = content;
    document.getElementById('auditViewModal').classList.remove('hidden');
  },

  closeViewModal() {
    document.getElementById('auditViewModal').classList.add('hidden');
  },

  // Weekly Metrics
  loadWeeklyMetrics() {
    const filterMonthMetrics = document.getElementById('filterMonthMetrics');
    const selectedMonth = filterMonthMetrics ? filterMonthMetrics.value : '';
    
    if (!selectedMonth) {
      const container = document.getElementById('weeklyMetricsContainer');
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
          <i class="fas fa-calendar-week" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i>
          <p>Seleccione un mes para ver las métricas semanales</p>
        </div>
      `;
      return;
    }
    
    const currentYear = new Date().getFullYear();
    const month = parseInt(selectedMonth);
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const monthName = monthNames[month];
    
    // Get all audits for the selected month
    const audits = DataManager.getAuditsByMonth(currentYear, month);
    
    // Get weeks for the month
    const weeks = DataManager.getWeeksOfMonth(currentYear, month);
    
    // Calculate metrics for each week
    const weekMetrics = weeks.map(week => {
      const weekAudits = audits.filter(audit => {
        return audit.date >= week.startDate && audit.date <= week.endDate;
      });
      
      // Calculate agent metrics for this week
      const agentMetrics = {};
      weekAudits.forEach(audit => {
        if (!agentMetrics[audit.agentName]) {
          agentMetrics[audit.agentName] = {
            tickets: 0,
            totalScore: 0,
            empatiaTotal: 0,
            gestionTotal: 0,
            sumFirstResponse: 0,
            sumResolution: 0,
            connectionHours: 0
          };
        }
        agentMetrics[audit.agentName].tickets++;
        agentMetrics[audit.agentName].totalScore += parseFloat(audit.score || 0);
        agentMetrics[audit.agentName].empatiaTotal += parseFloat(audit.empatiaScore || 0);
        agentMetrics[audit.agentName].gestionTotal += parseFloat(audit.gestionScore || 0);
      });
      
      return {
        week: week,
        audits: weekAudits,
        agentMetrics: agentMetrics
      };
    });
    
    // Calculate monthly accumulated metrics
    const monthlyAgentMetrics = {};
    audits.forEach(audit => {
      if (!monthlyAgentMetrics[audit.agentName]) {
        monthlyAgentMetrics[audit.agentName] = {
          tickets: 0,
          totalScore: 0,
          empatiaTotal: 0,
          gestionTotal: 0
        };
      }
      monthlyAgentMetrics[audit.agentName].tickets++;
      monthlyAgentMetrics[audit.agentName].totalScore += parseFloat(audit.score || 0);
      monthlyAgentMetrics[audit.agentName].empatiaTotal += parseFloat(audit.empatiaScore || 0);
      monthlyAgentMetrics[audit.agentName].gestionTotal += parseFloat(audit.gestionScore || 0);
    });
    
    // Render the table
    this.renderWeeklyMetricsTable(monthName, weekMetrics, monthlyAgentMetrics);
  },

  renderWeeklyMetricsTable(monthName, weekMetrics, monthlyAgentMetrics) {
    const container = document.getElementById('weeklyMetricsContainer');
    const isEditor = DataManager.isEditor();
    const userTeam = DataManager.getUserTeam();
    const teams = DataManager.getAllTeams();
    
    // Get team filter selection (for editors)
    const filterTeamWeekly = document.getElementById('filterTeamWeekly');
    const selectedTeamFilter = filterTeamWeekly ? filterTeamWeekly.value : '';
    
    // Get manual metrics data
    const filterMonthMetrics = document.getElementById('filterMonthMetrics');
    const currentYear = new Date().getFullYear();
    const month = parseInt(filterMonthMetrics.value);
    const manualData = DataManager.getWeeklyMetricsData(currentYear, month);
    const weeks = DataManager.getWeekConfig(currentYear, month);
    
    // Get all unique agents from audits AND manual data AND team members
    const allAgents = new Set();
    
    // Add agents from audits
    weekMetrics.forEach(wm => {
      Object.keys(wm.agentMetrics).forEach(agent => allAgents.add(agent));
    });
    Object.keys(monthlyAgentMetrics).forEach(agent => allAgents.add(agent));
    
    // Add agents from manual metrics
    Object.keys(manualData).forEach(agent => allAgents.add(agent));
    
    // Determine which team to show
    let teamToShow = userTeam; // For non-editors, use their assigned team
    if (isEditor && selectedTeamFilter) {
      teamToShow = selectedTeamFilter; // For editors, use selected filter
    }
    
    // Add all team members based on filter
    if (teamToShow) {
      // Show only specific team
      const team = teams[teamToShow];
      if (team && team.members) {
        team.members.forEach(member => allAgents.add(member.name));
      }
    } else if (isEditor && !selectedTeamFilter) {
      // Editor with no filter - show all teams
      Object.values(teams).forEach(team => {
        if (team.members) {
          team.members.forEach(member => allAgents.add(member.name));
        }
      });
    }
    
    let agentsList = Array.from(allAgents).sort();
    
    // Filter agents by team
    if (teamToShow) {
      const team = teams[teamToShow];
      const teamMemberNames = team && team.members ? team.members.map(m => m.name) : [];
      agentsList = agentsList.filter(agent => teamMemberNames.includes(agent));
    }
    
    if (agentsList.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
          <i class="fas fa-inbox" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i>
          <p>No hay agentes registrados para ${monthName}</p>
        </div>
      `;
      return;
    }
    
    // Build table HTML
    let tableHTML = `
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.2rem; font-weight: 700; margin: 0 0 0.5rem 0; color: var(--text-primary);">
          <i class="fas fa-calendar-alt"></i> Mes de ${monthName}
        </h3>
      </div>
      
      <div class="table-scroll">
        <table class="data-table" style="font-size: 0.85rem;">
          <thead>
            <tr>
              <th rowspan="2" style="vertical-align: middle; min-width: 150px;">Nombre del Agente</th>
    `;
    
    // Add week headers - USE ALL CONFIGURED WEEKS
    weeks.forEach((week, index) => {
      tableHTML += `
        <th colspan="${isEditor ? 8 : 7}" style="background: #f0f9ff; text-align: center; font-size: 0.8rem; padding: 0.5rem;">
          Semana ${index + 1}: ${week.startDate.split('-')[2]}/${week.startDate.split('-')[1]} al ${week.endDate.split('-')[2]}/${week.endDate.split('-')[1]}
        </th>
      `;
    });
    
    // Add accumulated month header
    tableHTML += `
      <th colspan="${isEditor ? 8 : 7}" style="background: #f0fdf4; text-align: center; font-weight: 700; font-size: 0.8rem; padding: 0.5rem;">
        ACUMULADO DEL MES
      </th>
    `;
    
    tableHTML += `</tr><tr>`;
    
    // Add metric subheaders for each week
    weeks.forEach(() => {
      tableHTML += `
        <th style="font-size: 0.7rem; background: #f8fafc; white-space: nowrap;">Tickets</th>
        <th style="font-size: 0.7rem; background: #f8fafc; white-space: nowrap;">Calif. Malos</th>
        <th style="font-size: 0.7rem; background: #f8fafc; white-space: nowrap;">Calif. Buena</th>
        <th style="font-size: 0.7rem; background: #f8fafc; white-space: nowrap;">T. Resp. (s)</th>
        <th style="font-size: 0.7rem; background: #f8fafc; white-space: nowrap;">T. Resol. (m)</th>
        <th style="font-size: 0.7rem; background: #f8fafc; white-space: nowrap;">% Calif.</th>
        <th style="font-size: 0.7rem; background: #f8fafc; white-space: nowrap;">% Calidad</th>
        ${isEditor ? '<th style="font-size: 0.7rem; background: #f8fafc;">Acción</th>' : ''}
      `;
    });
    
    // Add accumulated subheaders
    tableHTML += `
      <th style="font-size: 0.7rem; background: #f0fdf4; white-space: nowrap;">Tickets</th>
      <th style="font-size: 0.7rem; background: #f0fdf4; white-space: nowrap;">Calif. Malos</th>
      <th style="font-size: 0.7rem; background: #f0fdf4; white-space: nowrap;">Calif. Buena</th>
      <th style="font-size: 0.7rem; background: #f0fdf4; white-space: nowrap;">T. Resp. (s)</th>
      <th style="font-size: 0.7rem; background: #f0fdf4; white-space: nowrap;">T. Resol. (m)</th>
      <th style="font-size: 0.7rem; background: #f0fdf4; white-space: nowrap;">% Calif.</th>
      <th style="font-size: 0.7rem; background: #f0fdf4; white-space: nowrap;">% Calidad</th>
      ${isEditor ? '<th style="font-size: 0.7rem; background: #f0fdf4;"></th>' : ''}
    `;
    
    tableHTML += `</tr></thead><tbody>`;
    
    // Add rows for each agent
    agentsList.forEach(agentName => {
      tableHTML += `<tr><td><strong>${agentName}</strong></td>`;
      
      // Calculate monthly totals
      let monthlyTotals = {
        tickets: 0,
        ticketsBad: 0,
        ticketsGood: 0,
        firstResponse: 0,
        resolutionTime: 0,
        quality: 0,
        qualityCount: 0,
        weekCount: 0
      };
      
      // Add data for EACH configured week
      weeks.forEach((week, weekIndex) => {
        // Find matching audit data for this week
        const weekMetric = weekMetrics.find(wm => 
          wm.week.startDate === week.startDate && wm.week.endDate === week.endDate
        );
        const audits = weekMetric && weekMetric.agentMetrics[agentName] ? weekMetric.agentMetrics[agentName] : null;
        const manual = manualData[agentName] && manualData[agentName][weekIndex] ? manualData[agentName][weekIndex] : {};
        
        // Quality percentage from audits (automatic)
        let qualityPercent = '-';
        if (audits && audits.tickets > 0) {
          const avgScore = Math.round(audits.totalScore / audits.tickets);
          qualityPercent = avgScore + '%';
          monthlyTotals.quality += avgScore;
          monthlyTotals.qualityCount++;
        }
        
        // Manual metrics
        const tickets = manual.tickets || 0;
        const ticketsBad = manual.ticketsBad || 0;
        const ticketsGood = manual.ticketsGood || 0;
        const firstResponse = manual.firstResponse || 0;
        const resolutionTime = manual.resolutionTime || 0;
        
        // Calculate % Calif automatically: (ticketsBad + ticketsGood) / tickets * 100
        let percentCalif = '-';
        if (tickets > 0) {
          const ratedTickets = ticketsBad + ticketsGood;
          percentCalif = ((ratedTickets / tickets) * 100).toFixed(1) + '%';
        }
        
        // Accumulate for monthly totals
        if (tickets > 0 || ticketsBad > 0 || ticketsGood > 0 || firstResponse > 0 || resolutionTime > 0) {
          monthlyTotals.tickets += tickets;
          monthlyTotals.ticketsBad += ticketsBad;
          monthlyTotals.ticketsGood += ticketsGood;
          monthlyTotals.firstResponse += firstResponse;
          monthlyTotals.resolutionTime += resolutionTime;
          monthlyTotals.weekCount++;
        }
        
        tableHTML += `
          <td style="text-align: center;">${tickets || '-'}</td>
          <td style="text-align: center;">${ticketsBad || '-'}</td>
          <td style="text-align: center;">${ticketsGood || '-'}</td>
          <td style="text-align: center;">${firstResponse || '-'}</td>
          <td style="text-align: center;">${resolutionTime || '-'}</td>
          <td style="text-align: center; font-weight: 600; color: #0ea5e9;">${percentCalif}</td>
          <td style="text-align: center; color: #38CEA6; font-weight: 600;">${qualityPercent}</td>
          ${isEditor ? `<td style="text-align: center;"><button class="btn-mini" onclick="App.openManualMetricsModal('${agentName}', ${weekIndex}, ${currentYear}, ${month})" title="Editar métricas"><i class="fas fa-edit"></i></button></td>` : ''}
        `;
      });
      
      // Add accumulated data
      const avgFirstResponse = monthlyTotals.weekCount > 0 ? Math.round(monthlyTotals.firstResponse / monthlyTotals.weekCount) : 0;
      const avgResolutionTime = monthlyTotals.weekCount > 0 ? Math.round(monthlyTotals.resolutionTime / monthlyTotals.weekCount) : 0;
      const avgQuality = monthlyTotals.qualityCount > 0 ? Math.round(monthlyTotals.quality / monthlyTotals.qualityCount) : 0;
      
      // Calculate total % Calif: (total rated / total tickets) * 100
      const totalRated = monthlyTotals.ticketsBad + monthlyTotals.ticketsGood;
      const totalPercentCalif = monthlyTotals.tickets > 0 ? ((totalRated / monthlyTotals.tickets) * 100).toFixed(1) : 0;
      
      tableHTML += `
        <td style="text-align: center; background: #f0fdf4; font-weight: 700;">${monthlyTotals.tickets || '-'}</td>
        <td style="text-align: center; background: #f0fdf4; font-weight: 700;">${monthlyTotals.ticketsBad || '-'}</td>
        <td style="text-align: center; background: #f0fdf4; font-weight: 700;">${monthlyTotals.ticketsGood || '-'}</td>
        <td style="text-align: center; background: #f0fdf4; font-weight: 700;">${avgFirstResponse || '-'}</td>
        <td style="text-align: center; background: #f0fdf4; font-weight: 700;">${avgResolutionTime || '-'}</td>
        <td style="text-align: center; background: #f0fdf4; font-weight: 700; color: #0ea5e9;">${totalPercentCalif}%</td>
        <td style="text-align: center; background: #f0fdf4; color: #38CEA6; font-weight: 700;">${avgQuality || '-'}%</td>
        ${isEditor ? '<td style="background: #f0fdf4;"></td>' : ''}
      `;
      
      tableHTML += `</tr>`;
    });
    
    tableHTML += `</tbody></table></div>`;
    
    container.innerHTML = tableHTML;
  },

  renderWeeklyChart(metrics, weekData = null) {
    // This function is no longer used with the new weekly metrics view
    // Kept for compatibility
  },

  renderWeeklyAgentsTable(metrics) {
    // This function is no longer used with the new weekly metrics view
    // Kept for compatibility
  },

  // Monthly Metrics
  loadMonthlyMetrics() {
    const filterMonthlyMetrics = document.getElementById('filterMonthlyMetrics');
    const selectedMonth = filterMonthlyMetrics ? filterMonthlyMetrics.value : '';
    
    if (!selectedMonth) {
      const container = document.getElementById('monthlyMetricsContent');
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
          <i class="fas fa-chart-bar" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i>
          <p>Seleccione un mes para ver las métricas mensuales</p>
        </div>
      `;
      return;
    }

    const currentYear = new Date().getFullYear();
    const month = parseInt(selectedMonth);
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const monthName = monthNames[month];

    // Get audits for the selected month
    const audits = DataManager.getAuditsByMonth(currentYear, month);
    const metrics = DataManager.calculateMetrics(audits);
    
    // Calculate active weeks - use configured weeks
    const weeks = DataManager.getWeekConfig(currentYear, month);
    const activeWeeks = weeks.length;

    // Render the content
    this.renderMonthlyMetricsContent(monthName, metrics, activeWeeks, audits, weeks, currentYear, month);
  },

  renderMonthlyMetricsContent(monthName, metrics, activeWeeks, audits, weeks, year, month) {
    const container = document.getElementById('monthlyMetricsContent');
    const isEditor = DataManager.isEditor();
    const userTeam = DataManager.getUserTeam();
    const teams = DataManager.getAllTeams();
    const manualData = DataManager.getWeeklyMetricsData(year, month);
    
    // Get team filter selection (for editors)
    const filterTeamMonthly = document.getElementById('filterTeamMonthly');
    const selectedTeamFilter = filterTeamMonthly ? filterTeamMonthly.value : '';
    
    // Get all agents with their week data
    const allAgents = new Set();
    audits.forEach(audit => allAgents.add(audit.agentName));
    Object.keys(manualData).forEach(agent => allAgents.add(agent));
    
    // Determine which team to show
    let teamToShow = userTeam; // For non-editors, use their assigned team
    if (isEditor && selectedTeamFilter) {
      teamToShow = selectedTeamFilter; // For editors, use selected filter
    }
    
    // Add team members based on filter
    if (teamToShow) {
      const team = teams[teamToShow];
      if (team && team.members) {
        team.members.forEach(member => allAgents.add(member.name));
      }
    } else if (isEditor && !selectedTeamFilter) {
      // Editor with no filter - show all teams
      Object.values(teams).forEach(team => {
        if (team.members) {
          team.members.forEach(member => allAgents.add(member.name));
        }
      });
    }
    
    let agentsList = Array.from(allAgents).sort();
    
    // Filter by team
    if (teamToShow) {
      const team = teams[teamToShow];
      const teamMemberNames = team && team.members ? team.members.map(m => m.name) : [];
      agentsList = agentsList.filter(agent => teamMemberNames.includes(agent));
    }
    
    let content = `
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.2rem; font-weight: 700; margin: 0 0 0.5rem 0; color: var(--text-primary);">
          ${monthName} ${year} - Métricas Mensuales
        </h3>
      </div>
      
      <div class="table-scroll">
        <table class="data-table" style="font-size: 0.85rem;">
          <thead>
            <tr>
              <th style="min-width: 140px;">Nombre del Agente</th>
              <th>Tickets</th>
              <th>Calif. Malos</th>
              <th>Calif. Buena</th>
              <th>T. Resp. (s)</th>
              <th>T. Resol. (m)</th>
              <th>% Calif.</th>
              <th>% Calidad</th>
              <th>% Calif. Positivos</th>
              <th>% Satisfacción</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    // Process each agent - accumulate totals across ALL weeks
    agentsList.forEach(agentName => {
      // Accumulate data for this agent across all weeks
      let totalTickets = 0;
      let totalTicketsBad = 0;
      let totalTicketsGood = 0;
      let totalFirstResponse = 0;
      let totalResolutionTime = 0;
      let qualitySum = 0;
      let qualityCount = 0;
      let weekCount = 0;
      
      weeks.forEach((week, weekIndex) => {
        const manual = manualData[agentName] && manualData[agentName][weekIndex] ? manualData[agentName][weekIndex] : {};
        
        // Get quality from audits for this week
        const weekAudits = audits.filter(audit => {
          return audit.agentName === agentName && audit.date >= week.startDate && audit.date <= week.endDate;
        });
        
        // Accumulate manual metrics
        if (manual.tickets || weekAudits.length > 0) {
          totalTickets += manual.tickets || 0;
          totalTicketsBad += manual.ticketsBad || 0;
          totalTicketsGood += manual.ticketsGood || 0;
          totalFirstResponse += manual.firstResponse || 0;
          totalResolutionTime += manual.resolutionTime || 0;
          weekCount++;
        }
        
        // Accumulate quality scores
        if (weekAudits.length > 0) {
          const totalScore = weekAudits.reduce((sum, a) => sum + parseFloat(a.score || 0), 0);
          qualitySum += totalScore / weekAudits.length;
          qualityCount++;
        }
      });
      
      // Calculate averages and percentages for the agent
      const avgFirstResponse = weekCount > 0 ? Math.round(totalFirstResponse / weekCount) : 0;
      const avgResolutionTime = weekCount > 0 ? Math.round(totalResolutionTime / weekCount) : 0;
      const avgQuality = qualityCount > 0 ? Math.round(qualitySum / qualityCount) : 0;
      
      // Calculate % Calif (automatically based on good + bad / total tickets)
      let percentCalif = 0;
      if (totalTickets > 0) {
        percentCalif = ((totalTicketsBad + totalTicketsGood) / totalTickets * 100).toFixed(1);
      }
      
      // Calculate % Calif Positivos (good tickets / total rated tickets)
      let percentCalifPositivos = 0;
      const totalRated = totalTicketsBad + totalTicketsGood;
      if (totalRated > 0) {
        percentCalifPositivos = (totalTicketsGood / totalRated * 100).toFixed(1);
      }
      
      // % Satisfacción (good tickets / total tickets)
      let percentSatisfaccion = 0;
      if (totalTickets > 0) {
        percentSatisfaccion = (totalTicketsGood / totalTickets * 100).toFixed(1);
      }
      
      // Display one row per agent with accumulated totals
      content += `
        <tr>
          <td><strong>${agentName}</strong></td>
          <td style="text-align: center;">${totalTickets || '-'}</td>
          <td style="text-align: center;">${totalTicketsBad || '-'}</td>
          <td style="text-align: center;">${totalTicketsGood || '-'}</td>
          <td style="text-align: center;">${avgFirstResponse || '-'}</td>
          <td style="text-align: center;">${avgResolutionTime || '-'}</td>
          <td style="text-align: center; font-weight: 600; color: #0ea5e9;">${percentCalif ? percentCalif + '%' : '-'}</td>
          <td style="text-align: center; color: #38CEA6; font-weight: 600;">${avgQuality || '-'}${avgQuality ? '%' : ''}</td>
          <td style="text-align: center; color: #10b981; font-weight: 600;">${percentCalifPositivos ? percentCalifPositivos + '%' : '-'}</td>
          <td style="text-align: center; color: #0ea5e9; font-weight: 600;">${percentSatisfaccion ? percentSatisfaccion + '%' : '-'}</td>
        </tr>
      `;
    });
    
    // Add totals/averages row
    let grandTotalTickets = 0, grandTotalBad = 0, grandTotalGood = 0;
    let grandTotalFirstResp = 0, grandTotalResol = 0;
    let grandQualitySum = 0, grandQualityCount = 0;
    let agentCount = 0;
    
    agentsList.forEach(agentName => {
      let agentHasData = false;
      let agentTotalFirstResp = 0;
      let agentTotalResol = 0;
      let agentWeekCount = 0;
      
      weeks.forEach((week, weekIndex) => {
        const manual = manualData[agentName] && manualData[agentName][weekIndex] ? manualData[agentName][weekIndex] : {};
        const weekAudits = audits.filter(audit => {
          return audit.agentName === agentName && audit.date >= week.startDate && audit.date <= week.endDate;
        });
        
        if (manual.tickets || weekAudits.length > 0) {
          agentHasData = true;
          grandTotalTickets += manual.tickets || 0;
          grandTotalBad += manual.ticketsBad || 0;
          grandTotalGood += manual.ticketsGood || 0;
          agentTotalFirstResp += manual.firstResponse || 0;
          agentTotalResol += manual.resolutionTime || 0;
          agentWeekCount++;
        }
        
        if (weekAudits.length > 0) {
          const totalScore = weekAudits.reduce((sum, a) => sum + parseFloat(a.score || 0), 0);
          grandQualitySum += totalScore / weekAudits.length;
          grandQualityCount++;
        }
      });
      
      if (agentHasData) {
        agentCount++;
        if (agentWeekCount > 0) {
          grandTotalFirstResp += agentTotalFirstResp / agentWeekCount;
          grandTotalResol += agentTotalResol / agentWeekCount;
        }
      }
    });
    
    const avgFirstResp = agentCount > 0 ? Math.round(grandTotalFirstResp / agentCount) : 0;
    const avgResol = agentCount > 0 ? Math.round(grandTotalResol / agentCount) : 0;
    const avgQuality = grandQualityCount > 0 ? Math.round(grandQualitySum / grandQualityCount) : 0;
    const grandTotalRated = grandTotalBad + grandTotalGood;
    const percentCalifTotal = grandTotalTickets > 0 ? ((grandTotalRated / grandTotalTickets) * 100).toFixed(1) : 0;
    const percentCalifPositivosTotal = grandTotalRated > 0 ? ((grandTotalGood / grandTotalRated) * 100).toFixed(1) : 0;
    const percentSatisfaccionTotal = grandTotalTickets > 0 ? ((grandTotalGood / grandTotalTickets) * 100).toFixed(1) : 0;
    
    content += `
            <tr style="background: #f0fdf4; font-weight: 700;">
              <td><strong>PROMEDIO / TOTAL</strong></td>
              <td style="text-align: center;">${grandTotalTickets}</td>
              <td style="text-align: center;">${grandTotalBad}</td>
              <td style="text-align: center;">${grandTotalGood}</td>
              <td style="text-align: center;">${avgFirstResp}</td>
              <td style="text-align: center;">${avgResol}</td>
              <td style="text-align: center;">${percentCalifTotal}%</td>
              <td style="text-align: center; color: #38CEA6;">${avgQuality}%</td>
              <td style="text-align: center; color: #10b981;">${percentCalifPositivosTotal}%</td>
              <td style="text-align: center; color: #0ea5e9;">${percentSatisfaccionTotal}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
    
    container.innerHTML = content;
  },

  renderMonthlyChart(weeks, audits) {
    const ctx = document.getElementById('monthlyChart');
    if (!ctx) return;

    // Destroy existing chart
    if (this.charts.monthly) {
      this.charts.monthly.destroy();
    }
    
    const labels = weeks.map((w, i) => `Sem ${i + 1}`);
    const counts = [];
    const avgScores = [];
    
    // Calculate metrics for each week
    weeks.forEach(week => {
      const weekAudits = audits.filter(audit => {
        return audit.date >= week.startDate && audit.date <= week.endDate;
      });
      
      counts.push(weekAudits.length);
      
      if (weekAudits.length === 0) {
        avgScores.push(0);
      } else {
        const totalScore = weekAudits.reduce((sum, audit) => sum + parseFloat(audit.score || 0), 0);
        avgScores.push((totalScore / weekAudits.length).toFixed(1));
      }
    });

    this.charts.monthly = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Auditorías por Semana',
            data: counts,
            backgroundColor: 'rgba(56, 206, 166, 0.7)',
            borderColor: '#38CEA6',
            borderWidth: 2,
            yAxisID: 'y'
          },
          {
            label: 'Puntuación Promedio',
            data: avgScores,
            type: 'line',
            borderColor: '#0b8f6a',
            backgroundColor: 'rgba(11, 143, 106, 0.1)',
            tension: 0.4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Cantidad'
            },
            beginAtZero: true
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Puntuación'
            },
            min: 0,
            max: 100,
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });
  },

  // Utility functions for audit scoring
  countCheckedCriteria(criteriaIds) {
    let checked = 0;
    criteriaIds.forEach(id => {
      const checkbox = document.getElementById(id);
      if (checkbox && checkbox.checked) checked++;
    });
    return checked;
  },

  calculateScore() {
    // STRICT 2-ERROR RULE: Count total errors (unchecked boxes)
    const empatiaCriteria = ['metodoRided', 'lenguajePositivo', 'acompanamiento', 'personalizacion', 'estructura', 'usoIaOrtografia'];
    const gestionTicketCriteria = ['estadosTicket', 'ausenciaCliente', 'validacionHistorial', 'tipificacionCriterio', 'retencionTickets', 'tiempoRespuesta', 'tiempoGestion'];
    const conocimientoCriteria = ['serviciosPromociones', 'informacionVeraz', 'parlamentosContingencia', 'honestidadTransparencia'];
    const herramientasCriteria = ['rideryOffice', 'adminZendesk', 'driveManuales', 'slack', 'generacionReportes', 'cargaIncidencias'];
    
    // Count total errors
    const allCriteria = [...empatiaCriteria, ...gestionTicketCriteria, ...conocimientoCriteria, ...herramientasCriteria];
    const totalErrors = allCriteria.reduce((count, criterionId) => {
      const checkbox = document.getElementById(criterionId);
      return count + (checkbox && !checkbox.checked ? 1 : 0);
    }, 0);

    // Apply strict rule: 2 or more errors = 0 points
    if (totalErrors >= 2) {
      // Set all scores to 0
      document.getElementById('empatiaPercent').textContent = '0%';
      document.getElementById('empatiaTotalPercent').textContent = '0%';
      document.getElementById('empatiaFinalPercent').textContent = '0%';
      document.getElementById('gestionPercent').textContent = '0%';
      document.getElementById('gestionTotalPercent').textContent = '0%';
      document.getElementById('gestionFinalPercent').textContent = '0%';
      document.getElementById('totalScoreDisplay').textContent = '0';
      document.getElementById('calculatedScore').value = 0;
      document.getElementById('empatiaScore').value = 0;
      document.getElementById('gestionScore').value = 0;
      
      // Show warning message
      const warningDiv = document.getElementById('strictRuleWarning');
      if (warningDiv) {
        warningDiv.style.display = 'block';
        warningDiv.textContent = `⚠️ REGLA ESTRICTA: ${totalErrors} errores detectados = 0 puntos (se requiere máximo 1 error)`;
      }
      
      this.updateSubcategoryCheckboxes();
      return;
    }

    // Hide warning if less than 2 errors
    const warningDiv = document.getElementById('strictRuleWarning');
    if (warningDiv) {
      warningDiv.style.display = 'none';
    }

    // Calculate normal scores (0 or 1 error)
    const empatiaChecked = this.countCheckedCriteria(empatiaCriteria);
    const empatiaPercent = (empatiaChecked / empatiaCriteria.length) * 100; // % del pilar
    const empatiaTotalPercent = (empatiaChecked / empatiaCriteria.length) * 50; // % del total
    
    // Calculate Gestión (50% total) - 3 subcategories of 33.33% each
    const gestionTicketChecked = this.countCheckedCriteria(gestionTicketCriteria);
    const gestionTicketScore = (gestionTicketChecked / gestionTicketCriteria.length) * 16.67;
    
    const conocimientoChecked = this.countCheckedCriteria(conocimientoCriteria);
    const conocimientoScore = (conocimientoChecked / conocimientoCriteria.length) * 16.67;
    
    const herramientasChecked = this.countCheckedCriteria(herramientasCriteria);
    const herramientasScore = (herramientasChecked / herramientasCriteria.length) * 16.67;
    
    // Total gestión
    const gestionTotalPercent = gestionTicketScore + conocimientoScore + herramientasScore;
    const gestionPercent = (gestionTotalPercent / 50) * 100; // % del pilar
    
    // Total score
    const totalScore = Math.round(empatiaTotalPercent + gestionTotalPercent);
    
    // Update displays
    document.getElementById('empatiaPercent').textContent = Math.round(empatiaPercent) + '%';
    document.getElementById('empatiaTotalPercent').textContent = Math.round(empatiaTotalPercent) + '%';
    document.getElementById('empatiaFinalPercent').textContent = Math.round(empatiaTotalPercent) + '%';
    
    document.getElementById('gestionPercent').textContent = Math.round(gestionPercent) + '%';
    document.getElementById('gestionTotalPercent').textContent = Math.round(gestionTotalPercent) + '%';
    document.getElementById('gestionFinalPercent').textContent = Math.round(gestionTotalPercent) + '%';
    
    document.getElementById('totalScoreDisplay').textContent = totalScore;
    document.getElementById('calculatedScore').value = totalScore;
    
    // Store individual scores
    document.getElementById('empatiaScore').value = Math.round(empatiaTotalPercent);
    document.getElementById('gestionScore').value = Math.round(gestionTotalPercent);
    
    // Update subcategory "Marcar" checkboxes
    this.updateSubcategoryCheckboxes();
  },

  updateSubcategoryCheckboxes() {
    // Update Gestión de ticket checkbox
    const gestionTicketAll = document.getElementById('gestionTicketAll');
    if (gestionTicketAll) {
      const gestionTicketCheckboxes = document.querySelectorAll('.gestionTicket');
      const allChecked = Array.from(gestionTicketCheckboxes).every(cb => cb.checked);
      gestionTicketAll.checked = allChecked;
    }
    
    // Update Conocimiento Integral checkbox
    const conocimientoAll = document.getElementById('conocimientoIntegralAll');
    if (conocimientoAll) {
      const conocimientoCheckboxes = document.querySelectorAll('.conocimientoIntegral');
      const allChecked = Array.from(conocimientoCheckboxes).every(cb => cb.checked);
      conocimientoAll.checked = allChecked;
    }
    
    // Update Herramientas checkbox
    const herramientasAll = document.getElementById('herramientasAll');
    if (herramientasAll) {
      const herramientasCheckboxes = document.querySelectorAll('.herramientas');
      const allChecked = Array.from(herramientasCheckboxes).every(cb => cb.checked);
      herramientasAll.checked = allChecked;
    }
  },

  toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const iconId = sectionId.replace('Section', 'ToggleIcon');
    const icon = document.getElementById(iconId);
    
    if (section.style.display === 'none') {
      section.style.display = 'block';
      icon.className = 'fas fa-chevron-up';
    } else {
      section.style.display = 'none';
      icon.className = 'fas fa-chevron-down';
    }
  },

  toggleAllCheckboxes(groupName, checked) {
    const checkboxes = document.querySelectorAll(`input[name="${groupName}"]`);
    checkboxes.forEach(checkbox => {
      checkbox.checked = checked;
    });
    this.calculateScore();
  },
  
  toggleSubcategory(className, checked) {
    const checkboxes = document.querySelectorAll(`.${className}`);
    checkboxes.forEach(checkbox => {
      checkbox.checked = checked;
    });
    this.calculateScore();
  },

  // Week Configuration Modal
  openWeekConfigModal() {
    const filterMonthMetrics = document.getElementById('filterMonthMetrics');
    if (!filterMonthMetrics || !filterMonthMetrics.value) {
      alert('Por favor seleccione un mes primero');
      return;
    }

    const currentYear = new Date().getFullYear();
    const month = parseInt(filterMonthMetrics.value);
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    // Get current week configuration
    const weeks = DataManager.getWeekConfig(currentYear, month);
    
    let content = `
      <div style="background: #fef3f2; padding: 1rem; border-radius: 0.75rem; margin-bottom: 1rem;">
        <p style="margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--text-primary);">
          Mes: ${monthNames[month]} ${currentYear}
        </p>
      </div>
    `;
    
    weeks.forEach((week, index) => {
      content += `
        <div style="background: #f9fafb; padding: 1rem; border-radius: 0.75rem; margin-bottom: 1rem; border-left: 3px solid #38CEA6;">
          <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0 0 0.75rem 0;">
            Semana ${index + 1}
          </h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label class="label-small">Fecha de Inicio</label>
              <input type="date" class="input-dark week-start-date" data-index="${index}" value="${week.startDate}">
            </div>
            <div>
              <label class="label-small">Fecha de Fin</label>
              <input type="date" class="input-dark week-end-date" data-index="${index}" value="${week.endDate}">
            </div>
          </div>
        </div>
      `;
    });
    
    content += `
      <button type="button" class="btn-accent" id="addWeekBtn" style="width: 100%; background: #f3f4f6; color: var(--text-primary); border: 1px dashed #d1d5db; margin-top: 0.5rem;">
        <i class="fas fa-plus"></i> Agregar Semana
      </button>
    `;
    
    document.getElementById('weekConfigContent').innerHTML = content;
    document.getElementById('weekConfigModal').classList.remove('hidden');
    
    // Add event listener for add week button
    document.getElementById('addWeekBtn').addEventListener('click', () => {
      const container = document.getElementById('weekConfigContent');
      const weekCount = container.querySelectorAll('.week-start-date').length;
      const lastEndDate = container.querySelector(`.week-end-date[data-index="${weekCount - 1}"]`).value;
      
      const nextStart = new Date(lastEndDate);
      nextStart.setDate(nextStart.getDate() + 1);
      const nextEnd = new Date(nextStart);
      nextEnd.setDate(nextEnd.getDate() + 6);
      
      const newWeekHTML = `
        <div style="background: #f9fafb; padding: 1rem; border-radius: 0.75rem; margin-bottom: 1rem; border-left: 3px solid #38CEA6;">
          <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0 0 0.75rem 0;">
            Semana ${weekCount + 1}
          </h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label class="label-small">Fecha de Inicio</label>
              <input type="date" class="input-dark week-start-date" data-index="${weekCount}" value="${nextStart.toISOString().split('T')[0]}">
            </div>
            <div>
              <label class="label-small">Fecha de Fin</label>
              <input type="date" class="input-dark week-end-date" data-index="${weekCount}" value="${nextEnd.toISOString().split('T')[0]}">
            </div>
          </div>
        </div>
      `;
      
      document.getElementById('addWeekBtn').insertAdjacentHTML('beforebegin', newWeekHTML);
    });
  },

  closeWeekConfigModal() {
    document.getElementById('weekConfigModal').classList.add('hidden');
  },

  saveWeekConfig() {
    const filterMonthMetrics = document.getElementById('filterMonthMetrics');
    const currentYear = new Date().getFullYear();
    const month = parseInt(filterMonthMetrics.value);
    
    const startDates = document.querySelectorAll('.week-start-date');
    const endDates = document.querySelectorAll('.week-end-date');
    
    const weeks = [];
    startDates.forEach((startInput, index) => {
      weeks.push({
        weekNumber: index + 1,
        startDate: startInput.value,
        endDate: endDates[index].value,
        label: `Semana ${startInput.value} al ${endDates[index].value}`
      });
    });
    
    DataManager.saveWeekConfig(currentYear, month, weeks);
    this.closeWeekConfigModal();
    this.loadWeeklyMetrics();
    alert('Configuración de semanas guardada exitosamente');
  },

  // Manual Metrics Modal
  openManualMetricsModal(agentName, weekIndex, year, month) {
    const weeks = DataManager.getWeekConfig(year, month);
    const week = weeks[weekIndex];
    
    document.getElementById('metricsAgentName').textContent = agentName;
    document.getElementById('metricsWeekRange').textContent = `${week.startDate} al ${week.endDate}`;
    document.getElementById('metricsYear').value = year;
    document.getElementById('metricsMonth').value = month;
    document.getElementById('metricsWeekIndex').value = weekIndex;
    document.getElementById('metricsAgentKey').value = agentName;
    
    // Load existing data
    const manualData = DataManager.getWeeklyMetricsData(year, month);
    const agentData = manualData[agentName] && manualData[agentName][weekIndex] ? manualData[agentName][weekIndex] : {};
    
    document.getElementById('metricTickets').value = agentData.tickets || 0;
    document.getElementById('metricTicketsBad').value = agentData.ticketsBad || 0;
    document.getElementById('metricTicketsGood').value = agentData.ticketsGood || 0;
    document.getElementById('metricFirstResponse').value = agentData.firstResponse || 0;
    document.getElementById('metricResolutionTime').value = agentData.resolutionTime || 0;
    
    document.getElementById('manualMetricsModal').classList.remove('hidden');
  },

  closeManualMetricsModal() {
    document.getElementById('manualMetricsModal').classList.add('hidden');
  },

  handleManualMetricsSubmit(e) {
    e.preventDefault();
    
    const year = parseInt(document.getElementById('metricsYear').value);
    const month = parseInt(document.getElementById('metricsMonth').value);
    const weekIndex = parseInt(document.getElementById('metricsWeekIndex').value);
    const agentName = document.getElementById('metricsAgentKey').value;
    
    const metricsData = {
      tickets: parseInt(document.getElementById('metricTickets').value) || 0,
      ticketsBad: parseInt(document.getElementById('metricTicketsBad').value) || 0,
      ticketsGood: parseInt(document.getElementById('metricTicketsGood').value) || 0,
      firstResponse: parseFloat(document.getElementById('metricFirstResponse').value) || 0,
      resolutionTime: parseFloat(document.getElementById('metricResolutionTime').value) || 0
    };
    
    // Get current data
    const allData = DataManager.getWeeklyMetricsData(year, month);
    
    // Initialize agent data if doesn't exist
    if (!allData[agentName]) {
      allData[agentName] = {};
    }
    
    // Save metrics for this week
    allData[agentName][weekIndex] = metricsData;
    
    // Save back to storage
    DataManager.saveWeeklyMetricsData(year, month, allData);
    
    this.closeManualMetricsModal();
    this.loadWeeklyMetrics();
    
    alert('Métricas guardadas exitosamente');
  },

  updateShiftLabel(agentName, weekIndex, shiftValue, year, month) {
    // Get current data
    const allData = DataManager.getWeeklyMetricsData(year, month);
    
    // Initialize agent data if doesn't exist
    if (!allData[agentName]) {
      allData[agentName] = {};
    }
    
    // Initialize week data if doesn't exist
    if (!allData[agentName][weekIndex]) {
      allData[agentName][weekIndex] = {
        tickets: 0,
        ticketsBad: 0,
        ticketsGood: 0,
        firstResponse: 0,
        resolutionTime: 0
      };
    }
    
    // Update shift value
    allData[agentName][weekIndex].shift = shiftValue;
    
    // Save back to storage
    DataManager.saveWeeklyMetricsData(year, month, allData);
    
    // Optionally reload to show changes (but not necessary as the input already shows the new value)
    // this.loadMonthlyMetrics();
  }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  GraduationCap,
  Building2,
  Clock,
  Flag,
  KeyRound,
  LifeBuoy,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { adminApi } from '../../services/adminApi.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';

export function OverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const res = await adminApi.getOverview();
        setData(res.data);
      } catch (err) {
        console.error('Failed to load overview data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOverview();
  }, []);

  if (loading || !data) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>Loading Owner Dashboard...</div>
          <span style={{ fontSize: '0.85rem' }}>Aggregating system metrics across colleges and clubs</span>
        </div>
      </div>
    );
  }

  const { metrics, charts, recentReports, recentAuditLogs } = data;

  const metricCards = [
    { label: 'Total Users', value: metrics.totalUsers.toLocaleString(), icon: Users, color: '#2563EB', bg: '#DBEAFE', to: '/users' },
    { label: 'Active Users', value: metrics.activeUsers.toLocaleString(), icon: UserCheck, color: '#16A34A', bg: '#DCFCE7', to: '/users' },
    { label: 'Suspended Users', value: metrics.suspendedUsers, icon: UserX, color: '#DC2626', bg: '#FEE2E2', to: '/users' },
    { label: 'Verified Colleges', value: metrics.verifiedColleges, icon: GraduationCap, color: '#16A34A', bg: '#DCFCE7', to: '/colleges' },
    { label: 'Pending Colleges', value: metrics.pendingColleges, icon: Clock, color: '#D97706', bg: '#FEF3C7', to: '/colleges' },
    { label: 'Verified Clubs', value: metrics.verifiedClubs, icon: Building2, color: '#7C3AED', bg: '#EDE9FE', to: '/clubs' },
    { label: 'Pending Clubs', value: metrics.pendingClubs, icon: Clock, color: '#D97706', bg: '#FEF3C7', to: '/clubs' },
    { label: 'Open Reports', value: metrics.openReports, icon: Flag, color: '#DC2626', bg: '#FEE2E2', to: '/moderation' },
    { label: 'Pending Admin Apps', value: metrics.pendingApplications, icon: KeyRound, color: '#D97706', bg: '#FEF3C7', to: '/club-admin-applications' },
    { label: 'Open Support Tickets', value: metrics.openTickets, icon: LifeBuoy, color: '#2563EB', bg: '#DBEAFE', to: '/support' },
  ];

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Platform Owner Dashboard</h1>
          <p className="page-header-subtitle">
            Global governance, college accreditations, club administration, and platform safety monitor.
          </p>
        </div>
        <div className="page-header-actions">
          <Link to="/audit-logs" className="btn btn-secondary btn-sm">
            Inspect Audit Trail
          </Link>
          <Link to="/moderation" className="btn btn-primary btn-sm">
            Review Open Reports ({metrics.openReports})
          </Link>
        </div>
      </div>

      {/* 10 Summary Metric Cards */}
      <div className="metrics-grid-5">
        {metricCards.map((card, idx) => (
          <Link key={idx} to={card.to} style={{ textDecoration: 'none' }}>
            <div className="metric-card">
              <div className="metric-card-top">
                <span className="metric-card-title">{card.label}</span>
                <div className="metric-card-icon" style={{ backgroundColor: card.bg }}>
                  <card.icon size={16} color={card.color} />
                </div>
              </div>
              <div className="metric-card-value">{card.value}</div>
              <div className="metric-card-footer">
                <span>View details</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Urgent Pending Actions Banner */}
      <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <AlertTriangle size={24} color="#D97706" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#92400E' }}>
              Owner Attention Required: {metrics.pendingColleges} Colleges &bull; {metrics.pendingApplications} Club Admin Applications &bull; {metrics.openReports} Reports
            </div>
            <div style={{ fontSize: '0.82rem', color: '#B45309' }}>
              Review statutory documents and candidate qualifications to maintain platform safety.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/colleges" className="btn btn-secondary btn-sm" style={{ backgroundColor: '#FFFFFF' }}>
            Verify Colleges
          </Link>
          <Link to="/club-admin-applications" className="btn btn-primary btn-sm">
            Review Applications
          </Link>
        </div>
      </div>

      {/* Charts Grid: Growth & Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', marginBottom: 24 }}>
        {/* User Growth Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Student &amp; College Growth</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Verified accounts over previous 6 months</span>
            </div>
            <span className="badge badge-success">
              <TrendingUp size={12} /> +18.4% MoM
            </span>
          </div>
          <div className="card-body">
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.userGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: 8, color: '#F8FAFC', fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#userGrad)" name="Total Registered" />
                  <Area type="monotone" dataKey="active" stroke="#16A34A" strokeWidth={2} fillOpacity={0} name="Active Monthly" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Platform Activity Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Weekly Platform Interaction Volume</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Daily active users &amp; posts published</span>
            </div>
            <span className="badge badge-info">Live Telemetry</span>
          </div>
          <div className="card-body">
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.platformActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: 8, color: '#F8FAFC', fontSize: 12 }}
                  />
                  <Bar dataKey="posts" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Campus Posts" />
                  <Bar dataKey="reports" fill="#EF4444" radius={[4, 4, 0, 0]} name="Moderation Reports" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Feeds: Moderation Activity & Audit Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        {/* Recent Moderation Activity */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Active Moderation Queue</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Flagged posts, spam alerts, and harassment reports</span>
            </div>
            <Link to="/moderation" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              View All &rarr;
            </Link>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Target</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map(rep => (
                  <tr key={rep.id}>
                    <td>
                      <div className="table-title-cell">
                        <span className="cell-primary">{rep.targetName}</span>
                        <span className="cell-secondary">by {rep.reporterName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="cell-code">{rep.category}</span>
                    </td>
                    <td>
                      <StatusBadge status={rep.priority} />
                    </td>
                    <td>
                      <StatusBadge status={rep.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Audit Activities */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Recent Administrative Audit Events</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Verified log of actions executed by Platform Owner</span>
            </div>
            <Link to="/audit-logs" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              Full Audit Log &rarr;
            </Link>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Target</th>
                  <th>Result</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {recentAuditLogs.map(log => (
                  <tr key={log.id}>
                    <td>
                      <span className="cell-code" style={{ color: 'var(--color-info-text)', fontWeight: 700 }}>
                        {log.action}
                      </span>
                    </td>
                    <td>
                      <div className="table-title-cell">
                        <span className="cell-primary">{log.targetName}</span>
                        <span className="cell-secondary">{log.reason}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-success">{log.result}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewPage;

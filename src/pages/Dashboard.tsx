import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  BedDouble,
  Activity,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { insforge } from '../utils/insforge';

const StatCard = ({ icon: Icon, label, value, trend, color, loading, onClick }: any) => (
  <div className="premium-card stat-card clickable" onClick={onClick}>
    <div className="stat-header">
      <div className={`stat-icon-wrapper ${color}`}>
        <Icon size={24} />
      </div>
      <div className="stat-trend flex items-center gap-1">
        <ArrowUpRight size={14} />
        <span>{trend}</span>
      </div>
    </div>
    <div className="stat-body">
      {loading ? <Loader2 size={24} className="animate-spin text-primary" /> : <h3>{value}</h3>}
      <p>{label}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsToday: 0,
    surgeryToday: 8, // Hardcoded for now
    availableBeds: 14 // Hardcoded for now
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch total patients count
      const { count: patientsCount } = await insforge.database
        .from('patients')
        .select('*', { count: 'exact', head: true });

      // Fetch recent appointments
      const { data: appointmentsData } = await insforge.database
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats((prev: any) => ({
        ...prev,
        totalPatients: patientsCount || 0,
        appointmentsToday: appointmentsData?.length || 0
      }));
      setRecentAppointments(appointmentsData || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleExport = () => {
    alert("Generating dashboard report CSV...");
  };

  return (
    <div className="dashboard-page col gap-4">
      <div className="dashboard-header flex justify-between items-center mb-4">
        <div>
          <h2>Dashboard</h2>
          <p className="text-muted">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <button className="secondary-btn" onClick={handleExport}>Export Report</button>
          <button
            className="primary-btn-flat"
            onClick={() => navigate('/patients', { state: { openAddModal: true } })}
          >
            + Add Patient
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={Users}
          label="Total Patients"
          value={stats.totalPatients.toLocaleString()}
          trend="+12%"
          color="blue"
          loading={loading}
          onClick={() => navigate('/patients')}
        />
        <StatCard
          icon={Calendar}
          label="Appointments"
          value={stats.appointmentsToday}
          trend="+5%"
          color="purple"
          loading={loading}
          onClick={() => navigate('/appointments')}
        />
        <StatCard
          icon={BedDouble}
          label="Surgery Today"
          value={stats.surgeryToday}
          trend="-2%"
          color="orange"
          onClick={() => alert("Surgery Schedule coming soon!")}
        />
        <StatCard
          icon={Activity}
          label="Available Beds"
          value={stats.availableBeds}
          trend="stable"
          color="green"
          onClick={() => alert("Bed Management coming soon!")}
        />
      </div>

      <div className="dashboard-main-grid">
        <div className="premium-card main-chart-area">
          <div className="card-title flex justify-between items-center">
            <h3>Recent Appointments</h3>
            <button className="icon-btn-minimal" onClick={() => navigate('/appointments')}>
              <span className="text-primary text-sm font-bold underline">View All</span>
            </button>
          </div>

          <table className="hms-table w-full">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Type</th>
                <th>Doctor</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10">
                    <Loader2 className="animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : recentAppointments.length > 0 ? (
                recentAppointments.map((apt: any) => (
                  <tr key={apt.id}>
                    <td className="font-bold">{apt.patient_name}</td>
                    <td>{apt.type}</td>
                    <td>{apt.doctor_name}</td>
                    <td>{apt.appointment_time}</td>
                    <td>
                      <span className={`status-badge ${apt.status.toLowerCase()}`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-muted">No recent appointments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="premium-card recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="activity-item flex gap-4">
                <div className="activity-marker"></div>
                <div className="activity-content">
                  <p className="activity-text"><strong>Patient Record Updated</strong></p>
                  <span className="activity-time">Just now</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-page h2 {
          font-size: 1.75rem;
          color: var(--text-main);
        }

        .text-muted {
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          padding: 1.5rem;
        }

        .stat-card.clickable {
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card.clickable:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary);
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .stat-icon-wrapper {
          padding: 0.75rem;
          border-radius: var(--radius-md);
          display: flex;
        }

        .stat-icon-wrapper.blue { background: #eff6ff; color: #3b82f6; }
        .stat-icon-wrapper.purple { background: #faf5ff; color: #a855f7; }
        .stat-icon-wrapper.orange { background: #fff7ed; color: #f97316; }
        .stat-icon-wrapper.green { background: #f0fdf4; color: #22c55e; }

        .stat-trend {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--success);
          background: #ecfdf5;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-full);
        }

        .stat-body h3 {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }

        .stat-body p {
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .dashboard-main-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .card-title {
          margin-bottom: 1.5rem;
        }

        .hms-table {
          border-collapse: collapse;
          text-align: left;
        }

        .hms-table th {
          padding: 1rem;
          color: var(--text-muted);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border);
        }

        .hms-table td {
          padding: 1rem;
          font-size: 0.875rem;
          border-bottom: 1px solid var(--border);
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge.confirmed { background: #dcfce7; color: #166534; }
        .status-badge.pending { background: #fef9c3; color: #854d0e; }
        .status-badge.cancelled { background: #fee2e2; color: #991b1b; }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .activity-item {
          position: relative;
        }

        .activity-item:not(:last-child)::after {
          content: "";
          position: absolute;
          left: 4px;
          top: 20px;
          bottom: -20px;
          width: 1px;
          background: var(--border);
        }

        .activity-marker {
          width: 9px;
          height: 9px;
          background: var(--primary);
          border-radius: 50%;
          margin-top: 6px;
          z-index: 1;
        }

        .activity-text {
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .activity-time {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .primary-btn-flat {
          background: var(--primary);
          color: white;
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-md);
          font-weight: 600;
        }

        .secondary-btn {
          background: white;
          border: 1px solid var(--border);
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-md);
          font-weight: 600;
        }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 1200px) {
          .dashboard-main-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import {
    Users,
    Calendar,
    BedDouble,
    Activity,
    ArrowUpRight,
    MoreVertical
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
    <div className="premium-card stat-card">
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
            <h3>{value}</h3>
            <p>{label}</p>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const appointments = [
        { name: 'Alice Thompson', age: 34, doctor: 'Dr. Smith', date: '2026-02-12', time: '09:30 AM', status: 'Confirmed', type: 'Checkup' },
        { name: 'Robert Wilson', age: 52, doctor: 'Dr. Garcia', date: '2026-02-12', time: '10:45 AM', status: 'Pending', type: 'Emergency' },
        { name: 'Elena Rodriguez', age: 27, doctor: 'Dr. Smith', date: '2026-02-12', time: '01:15 PM', status: 'Cancelled', type: 'Follow-up' },
        { name: 'James Miller', age: 41, doctor: 'Dr. Taylor', date: '2026-02-13', time: '11:00 AM', status: 'Confirmed', type: 'Surgery' },
    ];

    return (
        <div className="dashboard-page col gap-4">
            <div className="dashboard-header flex justify-between items-center mb-4">
                <div>
                    <h2>Dashboard</h2>
                    <p className="text-muted">Welcome back, here's what's happening today.</p>
                </div>
                <div className="flex gap-2">
                    <button className="secondary-btn">Export Report</button>
                    <button className="primary-btn-flat">+ Add Patient</button>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard icon={Users} label="Total Patients" value="1,284" trend="+12%" color="blue" />
                <StatCard icon={Calendar} label="Appointments" value="42" trend="+5%" color="purple" />
                <StatCard icon={BedDouble} label="Surgery Today" value="08" trend="-2%" color="orange" />
                <StatCard icon={Activity} label="Available Beds" value="14" trend="stable" color="green" />
            </div>

            <div className="dashboard-main-grid">
                <div className="premium-card main-chart-area">
                    <div className="card-title flex justify-between items-center">
                        <h3>Recent Appointments</h3>
                        <button className="icon-btn-minimal"><MoreVertical size={18} /></button>
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
                            {appointments.map((apt, i) => (
                                <tr key={i}>
                                    <td className="font-bold">{apt.name}</td>
                                    <td>{apt.type}</td>
                                    <td>{apt.doctor}</td>
                                    <td>{apt.time}</td>
                                    <td>
                                        <span className={`status-badge ${apt.status.toLowerCase()}`}>
                                            {apt.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
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
                                    <p className="activity-text"><strong>Patient Record Updated</strong> for Sarah Johnson</p>
                                    <span className="activity-time">2 hours ago</span>
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

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          padding: 1.5rem;
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

        /* Main Grid */
        .dashboard-main-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .card-title {
          margin-bottom: 1.5rem;
        }

        /* HMS Table */
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

        /* Recent Activity */
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

        /* Buttons */
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

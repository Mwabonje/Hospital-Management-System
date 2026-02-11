import React, { useState } from 'react';
import { Search, Filter, Plus, MoreHorizontal } from 'lucide-react';

const Patients: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const patients = [
        { id: 'PT-001', name: 'Alice Thompson', gender: 'Female', age: 34, bloodGroup: 'A+', lastVisit: '2026-02-10', status: 'In-patient' },
        { id: 'PT-002', name: 'Robert Wilson', gender: 'Male', age: 52, bloodGroup: 'O-', lastVisit: '2026-02-09', status: 'Out-patient' },
        { id: 'PT-003', name: 'Elena Rodriguez', gender: 'Female', age: 27, bloodGroup: 'B+', lastVisit: '2026-02-08', status: 'Discharged' },
        { id: 'PT-004', name: 'James Miller', gender: 'Male', age: 41, bloodGroup: 'AB+', lastVisit: '2026-02-05', status: 'In-patient' },
        { id: 'PT-005', name: 'Sarah Jenkins', gender: 'Female', age: 45, bloodGroup: 'A-', lastVisit: '2026-01-30', status: 'Out-patient' },
    ];

    return (
        <div className="patients-page col gap-4">
            <div className="page-header flex justify-between items-center mb-4">
                <div>
                    <h2>Patient Directory</h2>
                    <p className="text-muted">Manage and view all patient medical records.</p>
                </div>
                <button className="primary-btn-flat flex items-center gap-2">
                    <Plus size={18} /> Add New Patient
                </button>
            </div>

            <div className="premium-card">
                <div className="table-controls flex justify-between items-center mb-6">
                    <div className="search-box flex items-center gap-2">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="filter-btn flex items-center gap-2">
                            <Filter size={16} /> Filters
                        </button>
                    </div>
                </div>

                <table className="hms-table w-full">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Patient Name</th>
                            <th>Gender</th>
                            <th>Age</th>
                            <th>Blood Group</th>
                            <th>Last Visit</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient) => (
                            <tr key={patient.id} className="table-row-hover">
                                <td className="text-primary font-bold">{patient.id}</td>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar-small">{patient.name.charAt(0)}</div>
                                        {patient.name}
                                    </div>
                                </td>
                                <td>{patient.gender}</td>
                                <td>{patient.age}</td>
                                <td>{patient.bloodGroup}</td>
                                <td>{patient.lastVisit}</td>
                                <td>
                                    <span className={`status-badge ${patient.status.toLowerCase().replace('-', '')}`}>
                                        {patient.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="icon-btn-minimal"><MoreHorizontal size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
        .search-box {
          background: var(--background);
          padding: 0.625rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          width: 300px;
        }

        .search-box input {
          border: none;
          background: none;
          width: 100%;
          font-size: 0.875rem;
        }

        .filter-btn {
          background: white;
          border: 1px solid var(--border);
          padding: 0.625rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .avatar-small {
          width: 32px;
          height: 32px;
          background: var(--accent);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-weight: 700;
          font-size: 0.75rem;
        }

        .text-primary { color: var(--primary); }
        
        .status-badge.inpatient { background: #dbeafe; color: #1e40af; }
        .status-badge.outpatient { background: #f3f4f6; color: #374151; }
        .status-badge.discharged { background: #d1fae5; color: #065f46; }

        .table-row-hover:hover {
          background-color: #f8fafc;
        }
      `}</style>
        </div>
    );
};

export default Patients;

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, Plus, Loader2, X, Trash2, Eye } from 'lucide-react';
import { insforge } from '../utils/insforge';

interface Patient {
    id: string;
    full_name: string;
    gender: string;
    age: number;
    blood_group: string;
    last_visit: string;
    status: string;
}

const Patients: React.FC = () => {
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPatient, setNewPatient] = useState({
        full_name: '',
        gender: 'Male',
        age: '',
        blood_group: 'A+',
        status: 'Out-patient'
    });

    useEffect(() => {
        if (location.state?.openAddModal) {
            setIsModalOpen(true);
        }
    }, [location]);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            let query = insforge.database.from('patients').select('*');

            if (searchTerm) {
                query = query.ilike('full_name', `%${searchTerm}%`);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching patients:', error);
            } else {
                setPatients(data || []);
            }
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this patient record?")) return;

        try {
            const { error } = await insforge.database.from('patients').delete().eq('id', id);
            if (!error) {
                fetchPatients();
            } else {
                alert("Error deleting patient: " + error.message);
            }
        } catch (err: any) {
            alert("Delete failed: " + err.message);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPatients();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleAddPatient = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await insforge.database.from('patients').insert({
                ...newPatient,
                age: parseInt(newPatient.age),
                last_visit: new Date().toISOString().split('T')[0]
            });

            if (!error) {
                setIsModalOpen(false);
                setNewPatient({
                    full_name: '',
                    gender: 'Male',
                    age: '',
                    blood_group: 'A+',
                    status: 'Out-patient'
                });
                fetchPatients();
            }
        } catch (err) {
            console.error('Insert error:', err);
        }
    };

    return (
        <div className="patients-page col gap-4">
            <div className="page-header flex justify-between items-center mb-4">
                <div>
                    <h2>Patient Directory</h2>
                    <p className="text-muted">Manage and view all patient medical records.</p>
                </div>
                <button
                    className="primary-btn-flat flex items-center gap-2"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={18} /> Add New Patient
                </button>
            </div>

            <div className="premium-card relative">
                <div className="table-controls flex justify-between items-center mb-6">
                    <div className="search-box flex items-center gap-2">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by name..."
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

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-primary" size={40} />
                    </div>
                ) : (
                    <table className="hms-table w-full">
                        <thead>
                            <tr>
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
                            {patients.length > 0 ? (
                                patients.map((patient) => (
                                    <tr key={patient.id} className="table-row-hover">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar-small">{patient.full_name.charAt(0)}</div>
                                                {patient.full_name}
                                            </div>
                                        </td>
                                        <td>{patient.gender}</td>
                                        <td>{patient.age}</td>
                                        <td>{patient.blood_group}</td>
                                        <td>{patient.last_visit}</td>
                                        <td>
                                            <span className={`status-badge ${patient.status.toLowerCase().replace('-', '')}`}>
                                                {patient.status}
                                            </span>
                                        </td>
                                        <td className="flex gap-2">
                                            <button
                                                className="icon-btn-minimal text-primary"
                                                onClick={() => alert(`Viewing details for ${patient.full_name}`)}
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                className="icon-btn-minimal text-danger"
                                                onClick={() => handleDelete(patient.id)}
                                                title="Delete Record"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-10 text-muted">No patients found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content premium-card">
                        <div className="modal-header flex justify-between items-center mb-6">
                            <h3>Add New Patient</h3>
                            <button className="icon-btn-minimal" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddPatient} className="flex col gap-4">
                            <div className="input-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="styled-input"
                                    value={newPatient.full_name}
                                    onChange={(e) => setNewPatient({ ...newPatient, full_name: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="input-group w-full">
                                    <label>Gender</label>
                                    <select
                                        className="styled-select"
                                        value={newPatient.gender}
                                        onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="input-group w-full">
                                    <label>Age</label>
                                    <input
                                        type="number"
                                        required
                                        className="styled-input"
                                        value={newPatient.age}
                                        onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="input-group w-full">
                                    <label>Blood Group</label>
                                    <select
                                        className="styled-select"
                                        value={newPatient.blood_group}
                                        onChange={(e) => setNewPatient({ ...newPatient, blood_group: e.target.value })}
                                    >
                                        <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                                        <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                                    </select>
                                </div>
                                <div className="input-group w-full">
                                    <label>Status</label>
                                    <select
                                        className="styled-select"
                                        value={newPatient.status}
                                        onChange={(e) => setNewPatient({ ...newPatient, status: e.target.value })}
                                    >
                                        <option>In-patient</option>
                                        <option>Out-patient</option>
                                        <option>Discharged</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="primary-btn w-full mt-4">Save Patient</button>
                        </form>
                    </div>
                </div>
            )}

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

        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 1rem;
        }

        .modal-content {
            width: 100%;
            max-width: 500px;
            animation: slideUp 0.3s ease-out;
        }

        .styled-input, .styled-select {
            padding: 0.75rem;
            border-radius: var(--radius-md);
            border: 1px solid var(--border);
            width: 100%;
            font-size: 0.875rem;
        }

        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

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

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin, Loader2, X, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { insforge } from '../utils/insforge';

interface Appointment {
  id: string;
  patient_name: string;
  doctor_name: string;
  appointment_time: string;
  type: string;
  room: string;
  status: string;
}

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patient_name: '',
    doctor_name: '',
    appointment_time: '',
    type: 'Consultation',
    room: ''
  });

  const [saving, setSaving] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data, error } = await insforge.database
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
      } else {
        setAppointments(data || []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await insforge.database.from('appointments').insert({
        ...newAppointment,
        status: 'Pending'
      });

      if (error) {
        alert("Failed to schedule appointment: " + error.message);
      } else {
        setIsModalOpen(false);
        setNewAppointment({
          patient_name: '',
          doctor_name: '',
          appointment_time: '',
          type: 'Consultation',
          room: ''
        });
        fetchAppointments();
      }
    } catch (err: any) {
      console.error('Insert error:', err);
      alert("An unexpected error occurred: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      const { error } = await insforge.database.from('appointments').delete().eq('id', id);
      if (!error) fetchAppointments();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const { error } = await insforge.database.from('appointments').update({ status }).eq('id', id);
      if (!error) fetchAppointments();
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  return (
    <div className="appointments-page col gap-4">
      <div className="page-header flex justify-between items-center mb-4">
        <div>
          <h2>Appointments Schedule</h2>
          <p className="text-muted">View and manage medical consultations.</p>
        </div>
        <button
          className="primary-btn-flat flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} /> Schedule New
        </button>
      </div>

      <div className="appointments-grid">
        <div className="premium-card calendar-section">
          <div className="calendar-header flex justify-between items-center mb-6">
            <h3>February 2026</h3>
            <div className="flex gap-2">
              <button className="icon-btn-minimal"><ChevronLeft size={20} /></button>
              <button className="icon-btn-minimal"><ChevronRight size={20} /></button>
            </div>
          </div>

          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="calendar-day-label">{day}</div>
            ))}
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} className={`calendar-date ${i + 1 === 11 ? 'today' : ''} ${[12, 13, 14].includes(i + 1) ? 'has-appointment' : ''}`}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="upcoming-section flex col gap-4">
          <h3>Upcoming Today</h3>
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
          ) : appointments.length > 0 ? (
            appointments.map((apt) => (
              <div key={apt.id} className="premium-card appointment-card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="patient-name">{apt.patient_name}</h4>
                    <p className="apt-type">{apt.type}</p>
                  </div>
                  <div className="flex col items-end gap-2">
                    <div className="apt-time-badge flex items-center gap-1">
                      <Clock size={14} /> {apt.appointment_time}
                    </div>
                    <span className={`status-badge-small ${apt.status.toLowerCase()}`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
                <div className="apt-details flex justify-between items-center">
                  <div className="flex col gap-1">
                    <div className="flex items-center gap-2 text-muted text-xs">
                      <CalendarIcon size={12} /> <span>{apt.doctor_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted text-xs">
                      <MapPin size={12} /> <span>{apt.room}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {apt.status === 'Pending' && (
                      <button
                        className="icon-btn-sm text-success"
                        onClick={() => handleUpdateStatus(apt.id, 'Confirmed')}
                        title="Confirm"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {apt.status !== 'Cancelled' && (
                      <button
                        className="icon-btn-sm text-warning"
                        onClick={() => handleUpdateStatus(apt.id, 'Cancelled')}
                        title="Cancel"
                      >
                        <XCircle size={16} />
                      </button>
                    )}
                    <button
                      className="icon-btn-sm text-danger"
                      onClick={() => handleDelete(apt.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-10 text-muted">No appointments scheduled today.</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content premium-card">
            <div className="modal-header flex justify-between items-center mb-6">
              <h3>Schedule New Appointment</h3>
              <button className="icon-btn-minimal" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSchedule} className="flex col gap-4">
              <div className="input-group">
                <label>Patient Name</label>
                <input
                  type="text"
                  required
                  className="styled-input"
                  value={newAppointment.patient_name}
                  onChange={(e) => setNewAppointment({ ...newAppointment, patient_name: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Doctor Name</label>
                <input
                  type="text"
                  required
                  className="styled-input"
                  value={newAppointment.doctor_name}
                  placeholder="e.g. Dr. Smith"
                  onChange={(e) => setNewAppointment({ ...newAppointment, doctor_name: e.target.value })}
                />
              </div>
              <div className="flex gap-4">
                <div className="input-group w-full">
                  <label>Time</label>
                  <input
                    type="time"
                    required
                    className="styled-input"
                    value={newAppointment.appointment_time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, appointment_time: e.target.value })}
                  />
                </div>
                <div className="input-group w-full">
                  <label>Type</label>
                  <select
                    className="styled-select"
                    value={newAppointment.type}
                    onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
                  >
                    <option>Consultation</option>
                    <option>Checkup</option>
                    <option>Surgery</option>
                    <option>Follow-up</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label>Room / Location</label>
                <input
                  type="text"
                  required
                  className="styled-input"
                  placeholder="e.g. Room 204"
                  value={newAppointment.room}
                  onChange={(e) => setNewAppointment({ ...newAppointment, room: e.target.value })}
                />
              </div>
              <button type="submit" className="primary-btn w-full mt-4" disabled={saving}>
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin" /> Scheduling...
                  </span>
                ) : "Confirm Appointment"}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .appointments-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 1.5rem;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
        }

        .calendar-day-label {
          text-align: center;
          font-weight: 600;
          font-size: 0.75rem;
          color: var(--text-muted);
          padding-bottom: 0.5rem;
        }

        .calendar-date {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          cursor: pointer;
          transition: var(--transition);
        }

        .calendar-date.today {
          background: var(--primary);
          color: white;
          font-weight: 700;
        }

        .calendar-date.has-appointment::after {
          content: "";
          position: absolute;
          bottom: 6px;
          width: 4px;
          height: 4px;
          background: var(--primary);
          border-radius: 50%;
        }

        .appointment-card {
          padding: 1.25rem;
          border-left: 4px solid var(--primary);
        }

        .patient-name {
          font-size: 1rem;
          margin-bottom: 0.125rem;
        }

        .apt-type {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .apt-time-badge {
          background: var(--accent);
          color: var(--primary);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .status-badge-small {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
        }
        .status-badge-small.confirmed { background: #dcfce7; color: #166534; }
        .status-badge-small.pending { background: #fef9c3; color: #854d0e; }
        .status-badge-small.cancelled { background: #fee2e2; color: #991b1b; }

        .icon-btn-sm {
          padding: 4px;
          border-radius: 4px;
          background: #f8fafc;
          border: 1px solid var(--border);
          display: flex;
          color: var(--text-muted);
        }
        .icon-btn-sm:hover {
          background: white;
          box-shadow: var(--shadow-sm);
        }
        .text-success { color: var(--success); }
        .text-warning { color: var(--warning); }
        .text-danger { color: var(--danger); }
        .text-xs { font-size: 0.75rem; }

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

        @media (max-width: 1100px) {
          .appointments-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Appointments;

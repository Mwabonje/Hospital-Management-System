import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';

const Appointments: React.FC = () => {
    const upcoming = [
        { patient: 'Alice Thompson', doctor: 'Dr. Smith', time: '09:30 AM', type: 'Consultation', room: 'Room 204' },
        { patient: 'Michael Chen', doctor: 'Dr. Garcia', time: '11:00 AM', type: 'Checkup', room: 'Room 105' },
        { patient: 'Sarah Miller', doctor: 'Dr. Taylor', time: '02:00 PM', type: 'Follow-up', room: 'Room 312' },
    ];

    return (
        <div className="appointments-page col gap-4">
            <div className="page-header flex justify-between items-center mb-4">
                <div>
                    <h2>Appointments Schedule</h2>
                    <p className="text-muted">View and manage medical consultations.</p>
                </div>
                <button className="primary-btn-flat flex items-center gap-2">
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
                    {upcoming.map((apt, i) => (
                        <div key={i} className="premium-card appointment-card">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="patient-name">{apt.patient}</h4>
                                    <p className="apt-type">{apt.type}</p>
                                </div>
                                <div className="apt-time-badge flex items-center gap-1">
                                    <Clock size={14} /> {apt.time}
                                </div>
                            </div>
                            <div className="apt-details flex col gap-2">
                                <div className="flex items-center gap-2 text-muted">
                                    <CalendarIcon size={14} /> <span>{apt.doctor}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted">
                                    <MapPin size={14} /> <span>{apt.room}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        .appointments-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 1.5rem;
        }

        /* Calendar Styles */
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

        .calendar-date:hover {
          background: var(--background);
        }

        .calendar-date.today {
          background: var(--primary);
          color: white;
          font-weight: 700;
        }

        .calendar-date.has-appointment {
          position: relative;
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

        /* Appointment Card */
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

        .apt-details {
          font-size: 0.8125rem;
        }

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

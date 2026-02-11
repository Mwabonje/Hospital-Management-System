import { Pill, UserRound, FileText, Settings as SettingsIcon } from 'lucide-react';

export const Pharmacy = () => (
    <div className="p-8 premium-card flex col items-center justify-center gap-4" style={{ minHeight: '400px' }}>
        <Pill size={64} className="text-muted" />
        <h2>Pharmacy Inventory</h2>
        <p className="text-muted">Pharmacy management module coming soon.</p>
    </div>
);

export const Doctors = () => (
    <div className="p-8 premium-card flex col items-center justify-center gap-4" style={{ minHeight: '400px' }}>
        <UserRound size={64} className="text-muted" />
        <h2>Medical Staff Directory</h2>
        <p className="text-muted">Staff management module coming soon.</p>
    </div>
);

export const Billing = () => (
    <div className="p-8 premium-card flex col items-center justify-center gap-4" style={{ minHeight: '400px' }}>
        <FileText size={64} className="text-muted" />
        <h2>Billing & Invoices</h2>
        <p className="text-muted">Financial management module coming soon.</p>
    </div>
);

export const Settings = () => (
    <div className="p-8 premium-card flex col items-center justify-center gap-4" style={{ minHeight: '400px' }}>
        <SettingsIcon size={64} className="text-muted" />
        <h2>System Settings</h2>
        <p className="text-muted">Configuration module coming soon.</p>
    </div>
);

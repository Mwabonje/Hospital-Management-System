
const apiKey = 'ik_d6b2d6b36bdb63ed982a7b7a88422557';
const baseUrl = 'https://p9ekmjgi.us-west.insforge.app/rest/v1';

async function setup() {
    const sql = `
        CREATE TABLE IF NOT EXISTS patients (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            full_name TEXT NOT NULL,
            email TEXT,
            gender TEXT,
            age INTEGER,
            blood_group TEXT,
            last_visit DATE,
            status TEXT DEFAULT 'Out-patient',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS appointments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            patient_name TEXT NOT NULL,
            doctor_name TEXT NOT NULL,
            appointment_time TEXT,
            type TEXT,
            room TEXT,
            status TEXT DEFAULT 'Pending',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS profiles (
            id UUID PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            role TEXT DEFAULT 'staff',
            full_name TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    `;

    console.log('Initializing tables in hosmanagement...');

    try {
        const response = await fetch(`${baseUrl}/rpc/run_sql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': apiKey,
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({ query: sql })
        });

        const text = await response.text();
        console.log('Status Code:', response.status);
        if (response.ok) {
            console.log('Tables successfully initialized!');
        } else {
            console.error('Initialization failed:', text);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

setup();

import { createClient } from '@insforge/sdk';

const INSFORGE_URL = 'https://gn9nuyhp.us-west.insforge.app';
const INSFORGE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MzU3MzR9.Yx4rTgiCj0x7wjJ-siN1-5ePqQCmNpnakU4qkVyO2vw';

export const insforge = createClient({
    baseUrl: INSFORGE_URL,
    anonKey: INSFORGE_ANON_KEY
});

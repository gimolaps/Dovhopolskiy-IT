// Demo-only local data. No real authentication, authorization or database.
const USERS_KEY = 'serwis_it_demo_users_v1';
const REQUESTS_KEY = 'serwis_it_demo_requests_v1';
const SESSION_KEY = 'serwis_it_demo_session_v1';
const STATUS = ['New', 'In Progress', 'Completed'];

const initialUsers = [
  { id: 'u1', firstName: 'Anna', lastName: 'Kowalska', email: 'customer@demo.test', role: 'Customer', password: 'demo12345' },
  { id: 'u2', firstName: 'Marek', lastName: 'Nowak', email: 'technician@demo.test', role: 'Technician', password: 'demo12345' },
  { id: 'u3', firstName: 'Joanna', lastName: 'Wrona', email: 'admin@demo.test', role: 'Administrator', password: 'demo12345' },
  { id: 'u4', firstName: 'Piotr', lastName: 'Zielinski', email: 'james@demo.test', role: 'Customer', password: 'demo12345' }
];
const initialRequests = [
  { id: 'REQ-1042', userId: 'u1', device: 'Laptop', description: 'Screen flickering intermittently and turning black.', createdAt: '2026-10-28', status: 'In Progress' },
  { id: 'REQ-1041', userId: 'u1', device: 'Desktop', description: 'Computer will not start after a power outage.', createdAt: '2026-10-25', status: 'New' },
  { id: 'REQ-1038', userId: 'u1', device: 'Tablet', description: 'Battery drains quickly and does not charge fully.', createdAt: '2026-10-17', status: 'Completed' },
  { id: 'REQ-1036', userId: 'u1', device: 'Laptop', description: 'Computer becomes very slow and overheats during use.', createdAt: '2026-10-14', status: 'In Progress' },
  { id: 'REQ-1034', userId: 'u1', device: 'Desktop', description: 'Unexpected shutdowns while working.', createdAt: '2026-10-12', status: 'In Progress' },
  { id: 'REQ-1033', userId: 'u1', device: 'Laptop', description: 'Keyboard replacement requested.', createdAt: '2026-10-11', status: 'Completed' },
  { id: 'REQ-1028', userId: 'u4', device: 'Desktop', description: 'Operating system fails to load.', createdAt: '2026-10-04', status: 'In Progress' },
  { id: 'REQ-1026', userId: 'u4', device: 'Laptop', description: 'Device overheats when running applications.', createdAt: '2026-09-29', status: 'Completed' },
  { id: 'REQ-1021', userId: 'u1', device: 'Smartphone', description: 'Charging port connection is unreliable.', createdAt: '2026-09-21', status: 'Completed' },
  { id: 'REQ-1019', userId: 'u1', device: 'Desktop', description: 'Fan makes a loud noise.', createdAt: '2026-09-17', status: 'Completed' },
  { id: 'REQ-1015', userId: 'u1', device: 'Laptop', description: 'Wi-Fi connection disconnects randomly.', createdAt: '2026-09-10', status: 'Completed' },
  { id: 'REQ-1010', userId: 'u1', device: 'Tablet', description: 'Touch input sometimes fails.', createdAt: '2026-09-04', status: 'Completed' },
  { id: 'REQ-1007', userId: 'u1', device: 'Laptop', description: 'Battery replacement requested.', createdAt: '2026-08-30', status: 'Completed' },
  { id: 'REQ-1001', userId: 'u1', device: 'Desktop', description: 'Blue screen on startup.', createdAt: '2026-08-18', status: 'New' }
];

function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
export function initMock() {
  if (!localStorage.getItem(USERS_KEY)) write(USERS_KEY, initialUsers);
  if (!localStorage.getItem(REQUESTS_KEY)) write(REQUESTS_KEY, initialRequests);
}
export function currentUser() {
  const id = read(SESSION_KEY, null);
  return read(USERS_KEY, []).find(u => u.id === id) || null;
}
export function demoSignIn(email, password) {
  const user = read(USERS_KEY, []).find(u => u.email.toLowerCase() === String(email).trim().toLowerCase() && u.password === password);
  if (!user) throw new Error('Incorrect email or password.');
  write(SESSION_KEY, user.id);
  return { ...user, password: undefined };
}
export function demoRegister(data) {
  const users = read(USERS_KEY, []);
  if (users.some(u => u.email.toLowerCase() === data.email.trim().toLowerCase())) throw new Error('An account with this email already exists.');
  const user = { id: 'u' + Date.now().toString(36), firstName: data.firstName.trim(), lastName: data.lastName.trim(), email: data.email.trim(), password: data.password, role: 'Customer' };
  users.push(user); write(USERS_KEY, users);
  return { ...user, password: undefined };
}
export function demoSignOut() { localStorage.removeItem(SESSION_KEY); }
export function demoUsers() { return read(USERS_KEY, []).map(({ password, ...safe }) => safe); }
export function demoRequests() { return [...read(REQUESTS_KEY, [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id)); }
export function demoCreateRequest(user, device, description, phone) {
  if (!user || user.role !== "Customer") {
    throw new Error("Customer access required.");
  }
  const phoneValue = String(phone ?? "").trim();
  const digits = phoneValue.replace(/\D/g, "");
  const validFormat = /^\+?[0-9 ()-]+$/.test(phoneValue);
  if (!validFormat || digits.length < 7 || digits.length > 15) {
    throw new Error("Invalid phone number.");
  }
  const requests = read(REQUESTS_KEY, []);
  const maxNum = requests.reduce(
    (max, r) => Math.max(
      max,
      Number(r.id.replace(/\D/g, "")) || 0
    ),
    1042
  );
  const record = {
    id: "REQ-" + (maxNum + 1),
    userId: user.id,
    device: device,
    description: description.trim(),
    phone: phoneValue,
    createdAt: new Date().toISOString().slice(0, 10),
    status: "New"
  };
  requests.push(record);
  write(REQUESTS_KEY, requests);
  return record;
}
export function demoUpdateRequest(id, status) {
  if (!STATUS.includes(status)) throw new Error('Unsupported repair status.');
  const requests = read(REQUESTS_KEY, []);
  const record = requests.find(r => r.id === id);
  if (!record) throw new Error('Request not found.');
  record.status = status; write(REQUESTS_KEY, requests); return record;
}

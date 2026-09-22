export const ALLOWED_SUPERADMIN_EMAILS = [
  'superadmin@onmas.gob.ar',
  'admin@onmas.gob.ar',
  'director@onmas.gob.ar',
  'socio@onmas.gob.ar'
];

const SUPERADMIN_SESSION_KEY = 'onmas_superadmin_session';

export interface SuperAdminUser {
  email: string;
  name: string;
  role: 'superadmin';
  loggedInAt: string;
}

export function getSuperAdminSession(): SuperAdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SUPERADMIN_SESSION_KEY);
    if (!raw) return null;
    const data: SuperAdminUser = JSON.parse(raw);
    if (data && ALLOWED_SUPERADMIN_EMAILS.includes(data.email.toLowerCase())) {
      return data;
    }
    return null;
  } catch (e) {
    return null;
  }
}

export function isSuperAdminAuthenticated(): boolean {
  return getSuperAdminSession() !== null;
}

export function loginSuperAdmin(email: string, password: string): { success: boolean; message: string; user?: SuperAdminUser } {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !password) {
    return { success: false, message: 'Por favor completá todos los campos.' };
  }

  if (!ALLOWED_SUPERADMIN_EMAILS.includes(cleanEmail)) {
    return { 
      success: false, 
      message: 'El correo ingresado no cuenta con privilegios de SuperAdmin Provincial.' 
    };
  }

  // Demo password validation: minimum 6 chars
  if (password.length < 6) {
    return { success: false, message: 'La contraseña debe tener al menos 6 caracteres.' };
  }

  const user: SuperAdminUser = {
    email: cleanEmail,
    name: cleanEmail.split('@')[0].toUpperCase(),
    role: 'superadmin',
    loggedInAt: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(SUPERADMIN_SESSION_KEY, JSON.stringify(user));
  }

  return { success: true, message: 'Acceso concedido', user };
}

export function logoutSuperAdmin(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SUPERADMIN_SESSION_KEY);
  }
}

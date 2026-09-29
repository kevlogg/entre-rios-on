export const ALLOWED_SUPERADMIN_EMAILS = [
  'loggia.1996@gmail.com',
  'arielcariati@gmail.com',
  'gestioncobranzasbv@gmail.com'
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
    if (data && data.email && ALLOWED_SUPERADMIN_EMAILS.includes(data.email.trim().toLowerCase())) {
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

  // Mínimo 6 caracteres para la contraseña
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
    document.cookie = 'onmas_superadmin_session=true; path=/; max-age=86400';
  }

  return { success: true, message: 'Acceso concedido', user };
}

export function logoutSuperAdmin(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SUPERADMIN_SESSION_KEY);
    document.cookie = 'onmas_superadmin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}


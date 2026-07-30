export type AdminUser = 'ghalyndra' | 'masyanda' | 'admin';

export function getAuthUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  if (localStorage.getItem('adminAuth') !== 'true') return null;
  return localStorage.getItem('adminUser') as AdminUser | null;
}

export function setAuthUser(user: AdminUser) {
  localStorage.setItem('adminAuth', 'true');
  localStorage.setItem('adminUser', user);
  window.dispatchEvent(new Event('authchange'));
}

export function clearAuthUser() {
  localStorage.removeItem('adminAuth');
  localStorage.removeItem('adminUser');
  window.dispatchEvent(new Event('authchange'));
}

// Script to ensure admin account is properly configured
// This runs in the browser console to fix admin access

export function setupAdminAccount() {
  if (typeof window === 'undefined') {
    console.error('This script must run in the browser');
    return;
  }

  console.log('[BEAGVS] Setting up admin account...');

  // Get existing users
  const stored = localStorage.getItem('beagvs_users');
  const users = stored ? JSON.parse(stored) : [];

  // Find or create admin user
  let adminUser = users.find((u: any) => u.email === 'beagvsglobal@gmail.com');

  if (adminUser) {
    // Update existing admin
    adminUser.role = 'admin';
    adminUser.id = 'admin_1';
    console.log('[BEAGVS] Updated existing admin user');
  } else {
    // Create new admin
    adminUser = {
      id: 'admin_1',
      piUserId: 'pi_admin',
      username: 'beagvsglobal',
      email: 'beagvsglobal@gmail.com',
      password: 'hashed_trinity_123', // Will be hashed on login
      role: 'admin',
      isPremium: true,
      listingsThisMonth: 0,
      followers: [],
      following: [],
      totalPoints: 1000,
      pointsActivities: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(adminUser);
    console.log('[BEAGVS] Created new admin user');
  }

  // Save updated users
  localStorage.setItem('beagvs_users', JSON.stringify(users));
  localStorage.setItem('current_user', JSON.stringify(adminUser));

  console.log('[BEAGVS] Admin setup complete!');
  console.log('[BEAGVS] Email: beagvsglobal@gmail.com');
  console.log('[BEAGVS] Password: TRInity.123');
  console.log('[BEAGVS] Role:', adminUser.role);
  console.log('[BEAGVS] Please refresh the page to see admin dashboard');

  return adminUser;
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  (window as any).setupAdminAccount = setupAdminAccount;
  console.log('[BEAGVS] Run setupAdminAccount() in console to fix admin access');
}

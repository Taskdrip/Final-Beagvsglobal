// Data persistence utilities to prevent data loss during app updates

export class DataPersistence {
  private static readonly BACKUP_PREFIX = 'beagvs_backup_';
  private static initialized = false;

  static backupData(): void {
    if (typeof window === 'undefined') return;

    const criticalKeys = [
      'beagvs_users',
      'current_user',
      'feed_posts',
      'task_submissions',
      'earn_tasks',
      'marketplace_listings',
      'user_profiles',
      'shipping_orders',
    ];

    try {
      criticalKeys.forEach((key) => {
        const data = localStorage.getItem(key);
        if (data) {
          localStorage.setItem(`${this.BACKUP_PREFIX}${key}`, data);
        }
      });
      console.log('[v0] Data backup completed');
    } catch (error) {
      console.error('[v0] Backup failed:', error);
    }
  }

  static restoreIfNeeded(): void {
    if (typeof window === 'undefined') return;

    const criticalKeys = [
      'beagvs_users',
      'current_user',
      'feed_posts',
      'task_submissions',
      'earn_tasks',
      'marketplace_listings',
      'user_profiles',
      'shipping_orders',
    ];

    try {
      criticalKeys.forEach((key) => {
        const data = localStorage.getItem(key);
        const backup = localStorage.getItem(`${this.BACKUP_PREFIX}${key}`);
        if ((!data || data === '[]') && backup) {
          console.log(`[v0] Restoring ${key} from backup`);
          localStorage.setItem(key, backup);
        }
      });
    } catch (error) {
      console.error('[v0] Restore failed:', error);
    }
  }

  static initialize(): void {
    if (typeof window === 'undefined') return;
    if (DataPersistence.initialized) return;
    DataPersistence.initialized = true;

    this.restoreIfNeeded();

    const criticalKeys = [
      'feed_posts',
      'task_submissions',
      'earn_tasks',
      'beagvs_users',
      'current_user',
      'marketplace_listings',
    ];

    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k: string, v: string) {
      originalSetItem.call(this, k, v);
      if (criticalKeys.includes(k)) {
        originalSetItem.call(this, `${DataPersistence.BACKUP_PREFIX}${k}`, v);
      }
    };

    setInterval(() => {
      DataPersistence.backupData();
    }, 2 * 60 * 1000);

    window.addEventListener('beforeunload', () => {
      DataPersistence.backupData();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        DataPersistence.restoreIfNeeded();
      }
    });

    console.log('[v0] Enhanced data persistence system initialized');
  }
}

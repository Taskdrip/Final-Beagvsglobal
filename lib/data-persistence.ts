// Data persistence utilities to prevent data loss during app updates

export class DataPersistence {
  private static readonly BACKUP_PREFIX = 'beagvs_backup_';
  
  /**
   * Backup critical data before updates
   */
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
      'shipping_orders'
    ];
    
    try {
      criticalKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          const backupKey = `${this.BACKUP_PREFIX}${key}`;
          localStorage.setItem(backupKey, data);
        }
      });
      
      console.log('[v0] Data backup completed');
    } catch (error) {
      console.error('[v0] Backup failed:', error);
    }
  }
  
  /**
   * Restore data from backup if main data is missing
   */
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
      'shipping_orders'
    ];
    
    try {
      criticalKeys.forEach(key => {
        const data = localStorage.getItem(key);
        const backupKey = `${this.BACKUP_PREFIX}${key}`;
        const backup = localStorage.getItem(backupKey);
        
        // Restore from backup if main data is missing or empty
        if ((!data || data === '[]') && backup) {
          console.log(`[v0] Restoring ${key} from backup`);
          localStorage.setItem(key, backup);
        }
      });
    } catch (error) {
      console.error('[v0] Restore failed:', error);
    }
  }
  
  /**
   * Initialize data persistence system
   */
  static initialize(): void {
    if (typeof window === 'undefined') return;
    
    // Restore any missing data on load
    this.restoreIfNeeded();
    
    // Backup data on every change to critical keys
    const criticalKeys = ['feed_posts', 'task_submissions', 'earn_tasks', 'beagvs_users', 'current_user', 'marketplace_listings'];
    
    // Hook into localStorage setItem only once
    const originalSetItem = Storage.prototype.setItem;
    let isHooked = false;
    
    if (!isHooked) {
      Storage.prototype.setItem = function(k: string, v: string) {
        originalSetItem.call(this, k, v);
        if (criticalKeys.includes(k)) {
          const backupKey = `${DataPersistence.BACKUP_PREFIX}${k}`;
          originalSetItem.call(this, backupKey, v);
        }
      };
      isHooked = true;
    }
    
    // Backup data periodically (every 2 minutes)
    setInterval(() => {
      this.backupData();
    }, 2 * 60 * 1000);
    
    // Backup before page unload
    window.addEventListener('beforeunload', () => {
      this.backupData();
    });
    
    // Restore on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.restoreIfNeeded();
      }
    });
    
    console.log('[v0] Enhanced data persistence system initialized');
  }
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  DataPersistence.initialize();
}

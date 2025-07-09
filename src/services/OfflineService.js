import { openDB } from 'idb';

class OfflineService {
  constructor() {
    this.dbName = 'CalmaDB';
    this.version = 1;
    this.db = null;
    this.init();
  }

  async init() {
    try {
      this.db = await openDB(this.dbName, this.version, {
        upgrade(db) {
          // Create stores for offline data
          if (!db.objectStoreNames.contains('meditations')) {
            db.createObjectStore('meditations', { keyPath: 'id', autoIncrement: true });
          }
          
          if (!db.objectStoreNames.contains('journals')) {
            db.createObjectStore('journals', { keyPath: 'id', autoIncrement: true });
          }
          
          if (!db.objectStoreNames.contains('breathwork')) {
            db.createObjectStore('breathwork', { keyPath: 'id', autoIncrement: true });
          }
          
          if (!db.objectStoreNames.contains('walks')) {
            db.createObjectStore('walks', { keyPath: 'id', autoIncrement: true });
          }
          
          if (!db.objectStoreNames.contains('syncQueue')) {
            db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
          }
        },
      });
      
      console.log('Offline database initialized');
    } catch (error) {
      console.error('Failed to initialize offline database:', error);
    }
  }

  async saveData(storeName, data) {
    if (!this.db) await this.init();
    
    try {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.add({
        ...data,
        timestamp: new Date().toISOString(),
        synced: false,
      });
      await tx.done;
      
      // Add to sync queue if offline
      if (!navigator.onLine) {
        await this.addToSyncQueue(storeName, data);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to save data offline:', error);
      return false;
    }
  }

  async getData(storeName, limit = 100) {
    if (!this.db) await this.init();
    
    try {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const allData = await store.getAll();
      
      return allData
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to get data from offline storage:', error);
      return [];
    }
  }

  async addToSyncQueue(storeName, data) {
    if (!this.db) await this.init();
    
    try {
      const tx = this.db.transaction('syncQueue', 'readwrite');
      const store = tx.objectStore('syncQueue');
      await store.add({
        storeName,
        data,
        timestamp: new Date().toISOString(),
        attempts: 0,
      });
      await tx.done;
    } catch (error) {
      console.error('Failed to add to sync queue:', error);
    }
  }

  async processSyncQueue() {
    if (!this.db || !navigator.onLine) return;
    
    try {
      const tx = this.db.transaction('syncQueue', 'readwrite');
      const store = tx.objectStore('syncQueue');
      const queueItems = await store.getAll();
      
      for (const item of queueItems) {
        try {
          // Attempt to sync with server
          const success = await this.syncWithServer(item.storeName, item.data);
          
          if (success) {
            // Remove from queue on successful sync
            await store.delete(item.id);
          } else {
            // Increment attempts
            item.attempts += 1;
            if (item.attempts < 3) {
              await store.put(item);
            } else {
              // Remove after 3 failed attempts
              await store.delete(item.id);
            }
          }
        } catch (error) {
          console.error('Sync failed for item:', item.id, error);
        }
      }
      
      await tx.done;
    } catch (error) {
      console.error('Failed to process sync queue:', error);
    }
  }

  async syncWithServer(storeName, data) {
    // Implement server sync logic here
    // This would typically involve API calls to your backend
    try {
      // Example API call
      const response = await fetch(`/api/${storeName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Server sync failed:', error);
      return false;
    }
  }

  async clearData(storeName) {
    if (!this.db) await this.init();
    
    try {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.clear();
      await tx.done;
      return true;
    } catch (error) {
      console.error('Failed to clear data:', error);
      return false;
    }
  }

  async getStorageUsage() {
    if (!this.db) await this.init();
    
    try {
      const storeNames = ['meditations', 'journals', 'breathwork', 'walks'];
      const usage = {};
      
      for (const storeName of storeNames) {
        const data = await this.getData(storeName);
        usage[storeName] = data.length;
      }
      
      return usage;
    } catch (error) {
      console.error('Failed to get storage usage:', error);
      return {};
    }
  }
}

export default new OfflineService();
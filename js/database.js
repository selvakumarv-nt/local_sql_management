class PlaygroundIndexedDB {
  constructor() {
    this.dbName = 'SQLPracticePlaygroundDB';
    this.version = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('databases')) {
          db.createObjectStore('databases', { keyPath: 'name' });
        }
        if (!db.objectStoreNames.contains('history')) {
          const histStore = db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
          histStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this);
      };
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async saveDatabaseBinary(name, uint8Array) {
    const tx = this.db.transaction('databases', 'readwrite');
    const store = tx.objectStore('databases');
    store.put({ name, binary: uint8Array, updatedAt: Date.now() });
    return new Promise((resolve) => (tx.oncomplete = () => resolve()));
  }

  async getDatabaseBinary(name) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('databases', 'readonly');
      const req = tx.objectStore('databases').get(name);
      req.onsuccess = () => resolve(req.result ? req.result.binary : null);
      req.onerror = () => reject(req.error);
    });
  }

  async getAllDatabases() {
    return new Promise((resolve) => {
      const tx = this.db.transaction('databases', 'readonly');
      const req = tx.objectStore('databases').getAll();
      req.onsuccess = () => resolve(req.result || []);
    });
  }

  async deleteDatabase(name) {
    const tx = this.db.transaction('databases', 'readwrite');
    tx.objectStore('databases').delete(name);
    return new Promise((res) => (tx.oncomplete = () => res()));
  }

  async addHistory(record) {
    const tx = this.db.transaction('history', 'readwrite');
    tx.objectStore('history').add({ ...record, timestamp: Date.now() });
  }

  async getHistory() {
    return new Promise((res) => {
      const tx = this.db.transaction('history', 'readonly');
      const req = tx.objectStore('history').getAll();
      req.onsuccess = () => res(req.result || []);
    });
  }

  async clearHistory() {
    const tx = this.db.transaction('history', 'readwrite');
    tx.objectStore('history').clear();
  }

  async getSetting(key, defaultValue = null) {
    return new Promise((res) => {
      const tx = this.db.transaction('settings', 'readonly');
      const req = tx.objectStore('settings').get(key);
      req.onsuccess = () => res(req.result ? req.result.value : defaultValue);
    });
  }

  async saveSetting(key, value) {
    const tx = this.db.transaction('settings', 'readwrite');
    tx.objectStore('settings').put({ key, value });
  }
}

window.idb = new PlaygroundIndexedDB();class PlaygroundIndexedDB {
  constructor() {
    this.dbName = 'SQLPracticePlaygroundDB';
    this.version = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('databases')) {
          db.createObjectStore('databases', { keyPath: 'name' });
        }
        if (!db.objectStoreNames.contains('history')) {
          const histStore = db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
          histStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this);
      };
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async saveDatabaseBinary(name, uint8Array) {
    const tx = this.db.transaction('databases', 'readwrite');
    const store = tx.objectStore('databases');
    store.put({ name, binary: uint8Array, updatedAt: Date.now() });
    return new Promise((resolve) => (tx.oncomplete = () => resolve()));
  }

  async getDatabaseBinary(name) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('databases', 'readonly');
      const req = tx.objectStore('databases').get(name);
      req.onsuccess = () => resolve(req.result ? req.result.binary : null);
      req.onerror = () => reject(req.error);
    });
  }

  async getAllDatabases() {
    return new Promise((resolve) => {
      const tx = this.db.transaction('databases', 'readonly');
      const req = tx.objectStore('databases').getAll();
      req.onsuccess = () => resolve(req.result || []);
    });
  }

  async deleteDatabase(name) {
    const tx = this.db.transaction('databases', 'readwrite');
    tx.objectStore('databases').delete(name);
    return new Promise((res) => (tx.oncomplete = () => res()));
  }

  async addHistory(record) {
    const tx = this.db.transaction('history', 'readwrite');
    tx.objectStore('history').add({ ...record, timestamp: Date.now() });
  }

  async getHistory() {
    return new Promise((res) => {
      const tx = this.db.transaction('history', 'readonly');
      const req = tx.objectStore('history').getAll();
      req.onsuccess = () => res(req.result || []);
    });
  }

  async clearHistory() {
    const tx = this.db.transaction('history', 'readwrite');
    tx.objectStore('history').clear();
  }

  async getSetting(key, defaultValue = null) {
    return new Promise((res) => {
      const tx = this.db.transaction('settings', 'readonly');
      const req = tx.objectStore('settings').get(key);
      req.onsuccess = () => res(req.result ? req.result.value : defaultValue);
    });
  }

  async saveSetting(key, value) {
    const tx = this.db.transaction('settings', 'readwrite');
    tx.objectStore('settings').put({ key, value });
  }
}

window.idb = new PlaygroundIndexedDB();
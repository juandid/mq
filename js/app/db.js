// Promise-basierte IndexedDB-Abstraktion

export class AliasDatabase {
  constructor(config) {
    this.dbName = config.name;
    this.version = config.version;
    this.storeConfig = config.stores.aliases;
    this.db = null;
  }

  // Öffnet die Datenbankverbindung mit Promise-Wrapper
  _openDB() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(this.db);
        return;
      }

      const request = indexedDB.open(this.dbName, this.version);

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = () => reject(request.error);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeConfig.name)) {
          db.createObjectStore(this.storeConfig.name, {
            keyPath: this.storeConfig.keyPath,
            autoIncrement: this.storeConfig.autoIncrement
          });
        }
      };
    });
  }

  // Wiederverwendbarer Transaction-Helper
  async _getStore(mode = 'readonly') {
    const db = await this._openDB();
    const transaction = db.transaction(this.storeConfig.name, mode);
    return transaction.objectStore(this.storeConfig.name);
  }

  // Initialisiert die Datenbank
  async initialize() {
    await this._openDB();
  }

  // Fügt einen Alias hinzu
  async addAlias(name) {
    const store = await this._getStore('readwrite');
    return new Promise((resolve, reject) => {
      const request = store.add({ name });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Ruft alle Aliases ab
  async getAllAliases() {
    const store = await this._getStore('readonly');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Ruft einen einzelnen Alias per ID ab
  async getAlias(id) {
    const store = await this._getStore('readonly');
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Löscht alle Aliases
  async clearAllAliases() {
    const store = await this._getStore('readwrite');
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Zählt die Anzahl der Aliases
  async getCount() {
    const store = await this._getStore('readonly');
    return new Promise((resolve, reject) => {
      const request = store.count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

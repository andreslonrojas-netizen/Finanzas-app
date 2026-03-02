// db.js - Módulo de Persistencia Híbrida (IndexedDB + Supabase)

// --- CONFIGURACIÓN SUPABASE ---
// Configurado automáticamente vía Supabase MCP
const SUPABASE_URL = 'https://idvzqutyekazfgswqguz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_idHxReuJlcjI7XUDCBRYzg_UdrQXPio';

// Cargamos el cliente de Supabase (se asume que el script de CDN está en el HTML)
let supabaseClient = null;
if (window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const DB_NAME = 'FinanzasAppDB';
const DB_VERSION = 2; // Incrementamos versión para el nuevo campo 'synced'
const STORE_NAME = 'transactions';

class LocalDB {
    constructor() {
        this.db = null;
        this.init();
    }

    init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                let store;
                if (!this.db.objectStoreNames.contains(STORE_NAME)) {
                    store = this.db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                } else {
                    store = event.currentTarget.transaction.objectStore(STORE_NAME);
                }

                // Aseguramos índices
                if (!store.indexNames.contains('date')) store.createIndex('date', 'date', { unique: false });
                if (!store.indexNames.contains('synced')) store.createIndex('synced', 'synced', { unique: false });
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onerror = (event) => reject(event.target.error);
        });
    }

    async addTransaction(transaction) {
        if (!this.db) await this.init();

        // Marcamos como no sincronizado inicialmente
        transaction.synced = false;

        return new Promise((resolve, reject) => {
            const transaction_db = this.db.transaction([STORE_NAME], 'readwrite');
            const store = transaction_db.objectStore(STORE_NAME);
            const request = store.add(transaction);

            request.onsuccess = () => {
                const id = request.result;
                // Intentamos sincronizar en segundo plano sin bloquear la UI
                this.syncOne(id);
                resolve(id);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async getAllTransactions() {
        if (!this.db) await this.init();
        return new Promise((resolve, reject) => {
            const transaction_db = this.db.transaction([STORE_NAME], 'readonly');
            const store = transaction_db.objectStore(STORE_NAME);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // --- LÓGICA DE SINCRONIZACIÓN ---

    async syncOne(id) {
        if (!supabaseClient || SUPABASE_URL === 'TU_SUPABASE_URL') return;

        const transaction_db = this.db.transaction([STORE_NAME], 'readonly');
        const store = transaction_db.objectStore(STORE_NAME);
        const data = await new Promise(r => {
            const req = store.get(id);
            req.onsuccess = () => r(req.result);
        });

        if (!data || data.synced) return;

        try {
            // Preparamos objeto para Supabase (quitamos ID local si queremos que Supabase genere uno o manejamos el mapeo)
            const { id: localId, synced, ...supabaseData } = data;

            const { error } = await supabaseClient
                .from('transactions')
                .insert([supabaseData]);

            if (!error) {
                await this.markAsSynced(id);
                console.log(`Transacción ${id} sincronizada con éxito.`);
            } else {
                console.warn("Fallo sync con Supabase:", error.message);
            }
        } catch (err) {
            console.error("Error en sync:", err);
        }
    }

    async markAsSynced(id) {
        const transaction_db = this.db.transaction([STORE_NAME], 'readwrite');
        const store = transaction_db.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => {
            const data = request.result;
            data.synced = true;
            store.put(data);
        };
    }

    async fullSync() {
        if (!supabaseClient || SUPABASE_URL === 'TU_SUPABASE_URL') return;

        const txs = await this.getAllTransactions();
        const pending = txs.filter(t => !t.synced);

        for (const t of pending) {
            await this.syncOne(t.id);
        }
    }
}

// Inyectamos el cliente globalmente
window.financeDB = new LocalDB();

// Intentar sincronización completa al cargar
window.addEventListener('load', () => {
    setTimeout(() => window.financeDB.fullSync(), 2000);
});

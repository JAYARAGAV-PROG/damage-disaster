import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'disaster-reports-db';
const STORE_NAME = 'pending-reports';
const DB_VERSION = 1;

export interface PendingReport {
  id: string;
  reportData: any;
  timestamp: number;
}

let dbInstance: IDBPDatabase | null = null;

/**
 * Initialize IndexedDB
 */
async function getDB(): Promise<IDBPDatabase> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    }
  });

  return dbInstance;
}

/**
 * Save report to IndexedDB for offline sync
 */
export async function savePendingReport(reportData: any): Promise<string> {
  const db = await getDB();
  const id = crypto.randomUUID();
  
  const pendingReport: PendingReport = {
    id,
    reportData,
    timestamp: Date.now()
  };

  await db.add(STORE_NAME, pendingReport);
  return id;
}

/**
 * Get all pending reports
 */
export async function getPendingReports(): Promise<PendingReport[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

/**
 * Remove a pending report after successful sync
 */
export async function removePendingReport(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

/**
 * Clear all pending reports
 */
export async function clearPendingReports(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}

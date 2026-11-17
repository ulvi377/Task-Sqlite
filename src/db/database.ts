import * as SQLite from "expo-sqlite";

export type Task = {
  id: number;
  title: string;
  completed: number;
};

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("tasks1.db");

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0
      )
    `);
  }
};

export const getTasks = async (): Promise<Task[]> => {
  if (!db) {
    await initDatabase();
  }

  const rows = await db!.getAllAsync<Task>("SELECT * FROM tasks");

  return rows;
};

export const insertTask = async (title: string): Promise<void> => {
  if (!db) {
    await initDatabase();
  }

  await db!.runAsync(
    "INSERT INTO tasks (title, completed) VALUES (?, ?)",
    [title, 0]
  );
};

export const deleteTask = async (id: number): Promise<void> => {
  if (!db) {
    await initDatabase();
  }

  await db!.runAsync("DELETE FROM tasks WHERE id = ?", [id]);
};

export const toggleComplete = async (
  id: number,
  value: boolean
): Promise<void> => {
  if (!db) {
    await initDatabase();
  }

  await db!.runAsync(
    "UPDATE tasks SET completed = ? WHERE id = ?",
    [value ? 1 : 0, id]
  );
};

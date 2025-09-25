// src/database.ts
import Dexie, { Table } from "dexie";
import { Candidate, Job } from "./types";

export class AppDatabase extends Dexie {
  candidates!: Table<Candidate, string>;
  jobs!: Table<Job, string>;

  constructor() {
    super("AppDatabase");
    this.version(1).stores({
      candidates: "id, name, email, jobId, stage, createdAt",
      jobs: "id, title, department, location, createdAt",
    });
  }
}

export const db = new AppDatabase();

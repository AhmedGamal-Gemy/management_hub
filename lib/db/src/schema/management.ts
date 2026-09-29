import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  date,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

const ownerId = () => text("owner_id").notNull().default("demo-user");

export const profilesTable = pgTable("profiles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  teacherEnabled: boolean("teacher_enabled").notNull().default(true),
  freelancerEnabled: boolean("freelancer_enabled").notNull().default(true),
  entrepreneurEnabled: boolean("entrepreneur_enabled").notNull().default(true),
});

export const studentsTable = pgTable("students", {
  id: serial("id").primaryKey(),
  ownerId: ownerId(),
  name: text("name").notNull(),
  parentName: text("parent_name").notNull(),
  phone: text("phone").notNull().default(""),
  email: text("email").notNull(),
  age: integer("age").notNull(),
  grade: text("grade").notNull(),
  subjects: text("subjects").array().notNull().default([]),
  notes: text("notes").notNull().default(""),
  curriculum: text("curriculum").notNull().default(""),
  hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessionsTable = pgTable("sessions", {
  id: serial("id").primaryKey(),
  ownerId: ownerId(),
  studentId: integer("student_id").notNull(),
  className: text("class_name").notNull(),
  sessionDate: date("session_date", { mode: "string" }).notNull(),
  duration: numeric("duration", { precision: 8, scale: 2 }).notNull(),
  hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }).notNull(),
  calculatedCost: numeric("calculated_cost", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("planned"),
  paymentStatus: text("payment_status").notNull().default("pending"),
  notes: text("notes").notNull().default(""),
});

export const curriculaTable = pgTable("curricula", {
  id: serial("id").primaryKey(),
  ownerId: ownerId(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  grade: text("grade").notNull(),
  description: text("description").notNull(),
  publisher: text("publisher").notNull().default(""),
  version: text("version").notNull(),
  status: text("status").notNull().default("current"),
  dateAdded: date("date_added", { mode: "string" }).notNull(),
  lastUpdated: date("last_updated", { mode: "string" }).notNull(),
  reviewDate: date("review_date", { mode: "string" }).notNull(),
  notes: text("notes").notNull().default(""),
});

export const freelancerProjectsTable = pgTable("freelancer_projects", {
  id: serial("id").primaryKey(),
  ownerId: ownerId(),
  name: text("name").notNull(),
  client: text("client").notNull(),
  description: text("description").notNull(),
  dateCreated: date("date_created", { mode: "string" }).notNull(),
  deadline: date("deadline", { mode: "string" }).notNull(),
  status: text("status").notNull().default("idea"),
  hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }).notNull(),
});

export const timeEntriesTable = pgTable("time_entries", {
  id: serial("id").primaryKey(),
  ownerId: ownerId(),
  projectId: integer("project_id").notNull(),
  entryDate: date("entry_date", { mode: "string" }).notNull(),
  duration: numeric("duration", { precision: 8, scale: 2 }).notNull(),
  description: text("description").notNull(),
  hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }).notNull(),
  calculatedCost: numeric("calculated_cost", { precision: 10, scale: 2 }).notNull(),
});

export const proposalsTable = pgTable("proposals", {
  id: serial("id").primaryKey(),
  ownerId: ownerId(),
  projectId: integer("project_id"),
  opportunityName: text("opportunity_name").notNull(),
  clientType: text("client_type").notNull(),
  version: text("version").notNull(),
  content: text("content").notNull(),
  approach: text("approach").notNull(),
  proposalDate: date("proposal_date", { mode: "string" }).notNull(),
  result: text("result").notNull(),
  won: boolean("won").notNull().default(false),
  notes: text("notes").notNull().default(""),
  whatWorked: text("what_worked").notNull().default(""),
});

export const expensesTable = pgTable("expenses", {
  id: serial("id").primaryKey(),
  ownerId: ownerId(),
  expenseDate: date("expense_date", { mode: "string" }).notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  projectId: integer("project_id"),
  paymentMethod: text("payment_method").notNull(),
});

export const ventureProjectsTable = pgTable("venture_projects", {
  id: serial("id").primaryKey(),
  ownerId: ownerId(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  dateCreated: date("date_created", { mode: "string" }).notNull(),
  stage: text("stage").notNull().default("idea"),
  status: text("status").notNull().default("active"),
  goal: text("goal").notNull(),
  deadline: date("deadline", { mode: "string" }).notNull(),
  nextStep: text("next_step").notNull().default(""),
});

export const ideasTable = pgTable("ideas", {
  id: serial("id").primaryKey(),
  ownerId: ownerId(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  createdAt: date("created_at", { mode: "string" }).notNull(),
  stage: text("stage").notNull().default("new"),
  priority: text("priority").notNull().default("medium"),
  notes: text("notes").notNull().default(""),
  developmentCount: integer("development_count").notNull().default(0),
});

export const filesTable = pgTable("files", {
  id: serial("id").primaryKey(),
  ownerId: ownerId(),
  name: text("name").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  objectPath: text("object_path").notNull(),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
  size: integer("size").notNull(),
  contentType: text("content_type").notNull(),
});

export const insertStudentSchema = createInsertSchema(studentsTable).omit({ id: true, createdAt: true });
export const insertSessionSchema = createInsertSchema(sessionsTable).omit({ id: true });
export const insertCurriculumSchema = createInsertSchema(curriculaTable).omit({ id: true });
export const insertFreelancerProjectSchema = createInsertSchema(freelancerProjectsTable).omit({ id: true });
export const insertTimeEntrySchema = createInsertSchema(timeEntriesTable).omit({ id: true });
export const insertProposalSchema = createInsertSchema(proposalsTable).omit({ id: true });
export const insertExpenseSchema = createInsertSchema(expensesTable).omit({ id: true });
export const insertVentureProjectSchema = createInsertSchema(ventureProjectsTable).omit({ id: true });
export const insertIdeaSchema = createInsertSchema(ideasTable).omit({ id: true });
export const insertFileSchema = createInsertSchema(filesTable).omit({ id: true, uploadedAt: true });

export type Student = typeof studentsTable.$inferSelect;
export type Session = typeof sessionsTable.$inferSelect;
export type Curriculum = typeof curriculaTable.$inferSelect;
export type FreelancerProject = typeof freelancerProjectsTable.$inferSelect;
export type TimeEntry = typeof timeEntriesTable.$inferSelect;
export type Proposal = typeof proposalsTable.$inferSelect;
export type Expense = typeof expensesTable.$inferSelect;
export type VentureProject = typeof ventureProjectsTable.$inferSelect;
export type Idea = typeof ideasTable.$inferSelect;
export type FileRecord = typeof filesTable.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
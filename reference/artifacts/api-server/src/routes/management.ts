import { Router, type IRouter, type Request, type Response } from "express";
import { getAuth } from "@clerk/express";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  CreateCurriculumBody,
  CreateExpenseBody,
  CreateFileRecordBody,
  CreateFreelancerProjectBody,
  CreateIdeaBody,
  CreateProposalBody,
  CreateSessionBody,
  CreateStudentBody,
  CreateTimeEntryBody,
  CreateVentureProjectBody,
  DeleteCurriculumParams,
  DeleteExpenseParams,
  DeleteFileRecordParams,
  DeleteFreelancerProjectParams,
  DeleteIdeaParams,
  DeleteProposalParams,
  DeleteSessionParams,
  DeleteStudentParams,
  DeleteVentureProjectParams,
  GetProfileResponse,
  GetStudentParams,
  GetStudentResponse,
  ListCurriculaQueryParams,
  ListCurriculaResponse,
  ListExpensesQueryParams,
  ListExpensesResponse,
  ListFilesQueryParams,
  ListFilesResponse,
  ListFreelancerProjectsQueryParams,
  ListFreelancerProjectsResponse,
  ListIdeasQueryParams,
  ListIdeasResponse,
  ListProposalsQueryParams,
  ListProposalsResponse,
  ListSessionsQueryParams,
  ListSessionsResponse,
  ListStudentsQueryParams,
  ListStudentsResponse,
  ListTimeEntriesResponse,
  ListVentureProjectsQueryParams,
  ListVentureProjectsResponse,
  UpdateCurriculumBody,
  UpdateCurriculumParams,
  UpdateFreelancerProjectBody,
  UpdateFreelancerProjectParams,
  UpdateIdeaBody,
  UpdateIdeaParams,
  UpdateProfileBody,
  UpdateProposalBody,
  UpdateProposalParams,
  UpdateSessionBody,
  UpdateSessionParams,
  UpdateStudentBody,
  UpdateStudentParams,
  UpdateVentureProjectBody,
  UpdateVentureProjectParams,
} from "@workspace/api-zod";
import {
  curriculaTable,
  expensesTable,
  filesTable,
  freelancerProjectsTable,
  ideasTable,
  profilesTable,
  proposalsTable,
  sessionsTable,
  studentsTable,
  timeEntriesTable,
  ventureProjectsTable,
} from "@workspace/db";

const router: IRouter = Router();

const money = (value: string | number | null | undefined) => Number(value ?? 0);
const dateText = (value: Date | string) => value instanceof Date ? value.toISOString().slice(0, 10) : value;

function ownerFor(req: Request): string | null {
  const auth = getAuth(req);
  if (auth.userId) return auth.userId;
  return process.env.NODE_ENV === "development" ? "demo-user" : null;
}

async function ensureUserData(ownerId: string) {
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.id, ownerId));
  if (profile) return profile;

  const [created] = await db
    .insert(profilesTable)
    .values({
      id: ownerId,
      name: ownerId === "demo-user" ? "Alex Morgan" : "New member",
      email: ownerId === "demo-user" ? "alex@northstar.studio" : "member@northstar.studio",
    })
    .returning();

  const today = new Date().toISOString().slice(0, 10);
  const [ava, jordan, maya] = await db
    .insert(studentsTable)
    .values([
      {
        ownerId,
        name: "Ava Thompson",
        parentName: "Leah Thompson",
        phone: "+1 415 555 0134",
        email: "leah.thompson@example.com",
        age: 14,
        grade: "Grade 9",
        subjects: ["Mathematics", "Physics"],
        curriculum: "Cambridge IGCSE",
        hourlyRate: "32",
        status: "active",
      },
      {
        ownerId,
        name: "Jordan Lee",
        parentName: "Samuel Lee",
        phone: "+1 415 555 0152",
        email: "samuel.lee@example.com",
        age: 16,
        grade: "Grade 11",
        subjects: ["Physics", "Calculus"],
        curriculum: "AP",
        hourlyRate: "38",
        status: "active",
      },
      {
        ownerId,
        name: "Maya Patel",
        parentName: "Priya Patel",
        phone: "+1 415 555 0187",
        email: "priya.patel@example.com",
        age: 12,
        grade: "Grade 7",
        subjects: ["English", "Study skills"],
        curriculum: "Common Core",
        hourlyRate: "28",
        status: "inactive",
      },
    ])
    .returning();

  await db.insert(sessionsTable).values([
    {
      ownerId,
      studentId: ava.id,
      className: "Algebra II",
      sessionDate: today,
      duration: "1.5",
      hourlyRate: "32",
      calculatedCost: "48",
      status: "taught",
      paymentStatus: "confirmed",
      notes: "Reviewed quadratic functions.",
    },
    {
      ownerId,
      studentId: jordan.id,
      className: "Physics lab prep",
      sessionDate: today,
      duration: "1",
      hourlyRate: "42",
      calculatedCost: "42",
      status: "planned",
      paymentStatus: "pending",
      notes: "Bring practice exam questions.",
    },
    {
      ownerId,
      studentId: ava.id,
      className: "Mechanics",
      sessionDate: "2026-09-16",
      duration: "1.25",
      hourlyRate: "35",
      calculatedCost: "43.75",
      status: "taught",
      paymentStatus: "confirmed",
      notes: "Strong progress with vectors.",
    },
  ]);

  await db.insert(curriculaTable).values([
    {
      ownerId,
      name: "IGCSE Mathematics Core",
      subject: "Mathematics",
      grade: "Grades 9–10",
      description: "Core sequence for algebra, geometry, and statistics.",
      publisher: "Cambridge",
      version: "2026.1",
      status: "current",
      dateAdded: today,
      lastUpdated: today,
      reviewDate: "2026-10-15",
      notes: "Use with Ava and Jordan.",
    },
    {
      ownerId,
      name: "Physics Foundations",
      subject: "Physics",
      grade: "Grades 10–11",
      description: "Mechanics and energy progression with lab prompts.",
      publisher: "Northstar Studio",
      version: "2.3",
      status: "needs_review",
      dateAdded: "2026-08-10",
      lastUpdated: "2026-08-28",
      reviewDate: "2026-09-28",
      notes: "Review lab safety module.",
    },
  ]);

  const [brandProject, launchProject] = await db
    .insert(freelancerProjectsTable)
    .values([
      {
        ownerId,
        name: "Sonder brand refresh",
        client: "Sonder Coffee",
        description: "A new visual identity and launch kit for a neighborhood coffee brand.",
        dateCreated: "2026-08-21",
        deadline: "2026-10-02",
        status: "working",
        hourlyRate: "85",
      },
      {
        ownerId,
        name: "Launch site build",
        client: "Cedar & Co.",
        description: "Marketing site and content system for a new studio.",
        dateCreated: "2026-09-02",
        deadline: "2026-09-30",
        status: "completed",
        hourlyRate: "95",
      },
      {
        ownerId,
        name: "Atlas content system",
        client: "Atlas Health",
        description: "Exploratory proposal for a modular content library.",
        dateCreated: "2026-09-08",
        deadline: "2026-10-20",
        status: "proposal",
        hourlyRate: "75",
      },
    ])
    .returning();

  await db.insert(timeEntriesTable).values([
    {
      ownerId,
      projectId: brandProject.id,
      entryDate: "2026-09-18",
      duration: "3.5",
      description: "Explored packaging directions and typography.",
      hourlyRate: "85",
      calculatedCost: "297.5",
    },
    {
      ownerId,
      projectId: launchProject.id,
      entryDate: "2026-09-12",
      duration: "5",
      description: "Final QA and handoff.",
      hourlyRate: "95",
      calculatedCost: "475",
    },
  ]);

  await db.insert(proposalsTable).values([
    {
      ownerId,
      projectId: brandProject.id,
      opportunityName: "Sonder brand refresh",
      clientType: "Local retail",
      version: "v3",
      content: "A focused brand system that gives Sonder a recognizable morning ritual.",
      approach: "Lead with the customer ritual, then show the system.",
      proposalDate: "2026-08-17",
      result: "Won",
      won: true,
      notes: "Shorter intro performed better.",
      whatWorked: "Concrete deliverables and a clear first-week plan.",
    },
  ]);

  await db.insert(expensesTable).values([
    {
      ownerId,
      expenseDate: "2026-09-05",
      name: "Figma Professional",
      category: "Software",
      amount: "15",
      description: "Monthly design workspace.",
      projectId: brandProject.id,
      paymentMethod: "Card",
    },
    {
      ownerId,
      expenseDate: "2026-09-11",
      name: "Client workshop transit",
      category: "Transportation",
      amount: "32.5",
      description: "Train to client studio.",
      projectId: brandProject.id,
      paymentMethod: "Card",
    },
  ]);

  const [venture] = await db
    .insert(ventureProjectsTable)
    .values({
      ownerId,
      name: "Northstar Learning Lab",
      description: "A small, practical learning studio for independent instructors.",
      category: "Education",
      dateCreated: "2026-07-18",
      stage: "development",
      status: "active",
      goal: "Pilot a three-week cohort in November.",
      deadline: "2026-11-01",
      nextStep: "Draft the pilot curriculum.",
    })
    .returning();

  await db.insert(ideasTable).values([
    {
      ownerId,
      title: "Quiet office hours",
      description: "A lightweight weekly office-hours format for solo educators.",
      category: "Education",
      createdAt: "2026-09-14",
      stage: "developing",
      priority: "high",
      notes: "Test the format with three existing students.",
      developmentCount: 4,
    },
    {
      ownerId,
      title: "Client handoff kit",
      description: "A reusable handoff system that makes project completion calmer.",
      category: "Freelance",
      createdAt: "2026-09-04",
      stage: "researching",
      priority: "medium",
      notes: "Collect the questions clients ask after delivery.",
      developmentCount: 2,
    },
  ]);

  await db.insert(filesTable).values({
    ownerId,
    name: "pilot-curriculum-outline.pdf",
    entityType: "venture-project",
    entityId: venture.id,
    objectPath: "/objects/demo/pilot-curriculum-outline.pdf",
    size: 248000,
    contentType: "application/pdf",
  });

  return created;
}

async function withOwner(req: Request, res: Response): Promise<string | null> {
  const owner = ownerFor(req);
  if (!owner) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  await ensureUserData(owner);
  return owner;
}

const queryValue = (value: unknown) => (typeof value === "string" ? value : undefined);

router.get("/profile", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const profile = await ensureUserData(owner);
  res.json(GetProfileResponse.parse({
    id: profile.id,
    name: profile.name,
    email: profile.email,
    initials: profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    teacherEnabled: profile.teacherEnabled,
    freelancerEnabled: profile.freelancerEnabled,
    entrepreneurEnabled: profile.entrepreneurEnabled,
  }));
});

router.patch("/profile", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [profile] = await db.update(profilesTable).set(parsed.data).where(eq(profilesTable.id, owner)).returning();
  res.json(GetProfileResponse.parse({
    id: profile.id,
    name: profile.name,
    email: profile.email,
    initials: profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    teacherEnabled: profile.teacherEnabled,
    freelancerEnabled: profile.freelancerEnabled,
    entrepreneurEnabled: profile.entrepreneurEnabled,
  }));
});

router.get("/overview", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const [students, sessions, projects, expenses, ventures, ideas] = await Promise.all([
    db.select().from(studentsTable).where(eq(studentsTable.ownerId, owner)),
    db.select().from(sessionsTable).where(eq(sessionsTable.ownerId, owner)),
    db.select().from(freelancerProjectsTable).where(eq(freelancerProjectsTable.ownerId, owner)),
    db.select().from(expensesTable).where(eq(expensesTable.ownerId, owner)),
    db.select().from(ventureProjectsTable).where(eq(ventureProjectsTable.ownerId, owner)),
    db.select().from(ideasTable).where(eq(ideasTable.ownerId, owner)),
  ]);
  const confirmedTeaching = sessions.filter((s) => s.status === "taught").reduce((sum, s) => sum + money(s.calculatedCost), 0);
  const estimatedTeaching = sessions.filter((s) => ["taught", "planned"].includes(s.status)).reduce((sum, s) => sum + money(s.calculatedCost), 0);
  const hours = sessions.reduce((sum, s) => sum + money(s.duration), 0);
  const confirmedFreelance = projects.filter((p) => p.status === "completed").reduce((sum, p) => sum + money(p.hourlyRate) * money(p.hourlyRate === null ? 0 : 1) * 0 + 0, 0) +
    (await db.select().from(timeEntriesTable).where(and(eq(timeEntriesTable.ownerId, owner), eq(timeEntriesTable.projectId, -1)))).reduce((sum) => sum, 0);
  const timeEntries = await db.select().from(timeEntriesTable).where(eq(timeEntriesTable.ownerId, owner));
  const projectValues = projects.map((p) => ({
    project: p,
    total: timeEntries.filter((t) => t.projectId === p.id).reduce((sum, t) => sum + money(t.calculatedCost), 0),
  }));
  const earned = projectValues.filter(({ project }) => project.status === "completed").reduce((sum, item) => sum + item.total, 0);
  const potential = projectValues.filter(({ project }) => ["working", "accepted", "pending", "proposal"].includes(project.status)).reduce((sum, item) => sum + item.total, 0);
  const expenseTotal = expenses.reduce((sum, e) => sum + money(e.amount), 0);
  res.json({
    teaching: {
      confirmedIncome: confirmedTeaching,
      estimatedIncome: estimatedTeaching,
      hours,
      sessions: sessions.length,
      students: students.filter((student) => student.status === "active").length,
      averageRate: sessions.length ? sessions.reduce((sum, session) => sum + money(session.hourlyRate), 0) / sessions.length : 0,
    },
    freelancer: {
      confirmedIncome: earned,
      estimatedIncome: potential,
      expenses: expenseTotal,
      netIncome: earned - expenseTotal,
      projects: projects.length,
      hours: timeEntries.reduce((sum, entry) => sum + money(entry.duration), 0),
    },
    entrepreneur: {
      activeProjects: ventures.filter((project) => !["completed", "archived"].includes(project.stage)).length,
      ideas: ideas.length,
      inDevelopment: ideas.filter((idea) => idea.stage === "developing").length,
      completed: ventures.filter((project) => project.stage === "completed").length,
    },
  });
});

router.get("/activity", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const students = await db.select().from(studentsTable).where(eq(studentsTable.ownerId, owner)).orderBy(desc(studentsTable.createdAt)).limit(2);
  const projects = await db.select().from(freelancerProjectsTable).where(eq(freelancerProjectsTable.ownerId, owner)).orderBy(desc(freelancerProjectsTable.id)).limit(2);
  const ideas = await db.select().from(ideasTable).where(eq(ideasTable.ownerId, owner)).orderBy(desc(ideasTable.id)).limit(2);
  const activity = [
    ...students.map((student) => ({ id: student.id, title: "Student profile updated", description: `${student.name} is in your teaching roster.`, module: "teacher", createdAt: student.createdAt.toISOString() })),
    ...projects.map((project) => ({ id: 1000 + project.id, title: `${project.name} moved to ${project.status}`, description: `Client project for ${project.client}.`, module: "freelancer", createdAt: `${project.dateCreated}T09:00:00.000Z` })),
    ...ideas.map((idea) => ({ id: 2000 + idea.id, title: idea.title, description: `Idea is ${idea.stage}.`, module: "entrepreneur", createdAt: `${idea.createdAt}T09:00:00.000Z` })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
  res.json(activity);
});

router.get("/students", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const query = ListStudentsQueryParams.parse(req.query);
  const filters = [eq(studentsTable.ownerId, owner)];
  if (query.status) filters.push(eq(studentsTable.status, query.status));
  if (query.search) filters.push(or(ilike(studentsTable.name, `%${query.search}%`), ilike(studentsTable.email, `%${query.search}%`))!);
  const students = await db.select().from(studentsTable).where(and(...filters)).orderBy(asc(studentsTable.name));
  const sessionCounts = await db.select({ studentId: sessionsTable.studentId, count: sql<number>`count(*)` }).from(sessionsTable).where(eq(sessionsTable.ownerId, owner)).groupBy(sessionsTable.studentId);
  res.json(students.map((student) => ({ ...student, hourlyRate: student.hourlyRate === null ? null : money(student.hourlyRate), sessionsCount: Number(sessionCounts.find((row) => row.studentId === student.id)?.count ?? 0) })));
});

router.post("/students", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const parsed = CreateStudentBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [student] = await db.insert(studentsTable).values({ ...parsed.data, ownerId: owner, hourlyRate: parsed.data.hourlyRate?.toString() ?? null }).returning();
  res.status(201).json({ ...student, hourlyRate: student.hourlyRate === null ? null : money(student.hourlyRate), sessionsCount: 0 });
});

router.get("/students/:id", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const params = GetStudentParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [student] = await db.select().from(studentsTable).where(and(eq(studentsTable.id, params.data.id), eq(studentsTable.ownerId, owner)));
  if (!student) { res.status(404).json({ error: "Student not found" }); return; }
  const sessionsCount = await db.select({ count: sql<number>`count(*)` }).from(sessionsTable).where(and(eq(sessionsTable.ownerId, owner), eq(sessionsTable.studentId, student.id)));
  res.json(GetStudentResponse.parse({ ...student, hourlyRate: student.hourlyRate === null ? null : money(student.hourlyRate), sessionsCount: Number(sessionsCount[0]?.count ?? 0) }));
});

router.patch("/students/:id", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const params = UpdateStudentParams.safeParse(req.params);
  const parsed = UpdateStudentBody.safeParse(req.body);
  if (!params.success || !parsed.success) { res.status(400).json({ error: "Invalid student data" }); return; }
  const [student] = await db.update(studentsTable).set({ ...parsed.data, ownerId: owner, hourlyRate: parsed.data.hourlyRate?.toString() ?? null }).where(and(eq(studentsTable.id, params.data.id), eq(studentsTable.ownerId, owner))).returning();
  if (!student) { res.status(404).json({ error: "Student not found" }); return; }
  res.json({ ...student, hourlyRate: student.hourlyRate === null ? null : money(student.hourlyRate), sessionsCount: 0 });
});

router.delete("/students/:id", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const params = DeleteStudentParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  await db.delete(studentsTable).where(and(eq(studentsTable.id, params.data.id), eq(studentsTable.ownerId, owner)));
  res.sendStatus(204);
});

router.get("/sessions", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const query = ListSessionsQueryParams.parse(req.query);
  const filters = [eq(sessionsTable.ownerId, owner)];
  if (query.status) filters.push(eq(sessionsTable.status, query.status));
  if (query.search) filters.push(ilike(sessionsTable.className, `%${query.search}%`));
  if (query.month) filters.push(sql`${sessionsTable.sessionDate} >= ${query.month}-01 AND ${sessionsTable.sessionDate} < ${(Number(query.month.slice(5)) === 12 ? Number(query.month.slice(0, 4)) + 1 : Number(query.month.slice(0, 4)))}-${String(Number(query.month.slice(5)) === 12 ? 1 : Number(query.month.slice(5)) + 1).padStart(2, "0")}-01`);
  const rows = await db.select({ session: sessionsTable, student: studentsTable }).from(sessionsTable).leftJoin(studentsTable, eq(sessionsTable.studentId, studentsTable.id)).where(and(...filters)).orderBy(desc(sessionsTable.sessionDate));
  res.json(rows.map(({ session, student }) => ({ ...session, studentName: student?.name ?? "Unknown student", duration: money(session.duration), hourlyRate: money(session.hourlyRate), calculatedCost: money(session.calculatedCost) })));
});

router.post("/sessions", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const parsed = CreateSessionBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const values = { studentId: parsed.data.studentId, className: parsed.data.className, notes: parsed.data.notes ?? "", status: parsed.data.status, ownerId: owner, duration: parsed.data.duration.toString(), hourlyRate: parsed.data.hourlyRate.toString(), calculatedCost: (parsed.data.duration * parsed.data.hourlyRate).toFixed(2), paymentStatus: parsed.data.status === "taught" ? "confirmed" : "pending", sessionDate: dateText(parsed.data.date) };
  const [session] = await db.insert(sessionsTable).values(values).returning();
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, session.studentId));
  res.status(201).json({ ...session, date: session.sessionDate, studentName: student?.name ?? "Unknown student", duration: money(session.duration), hourlyRate: money(session.hourlyRate), calculatedCost: money(session.calculatedCost) });
});

router.patch("/sessions/:id", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const params = UpdateSessionParams.safeParse(req.params);
  const parsed = UpdateSessionBody.safeParse(req.body);
  if (!params.success || !parsed.success) { res.status(400).json({ error: "Invalid session data" }); return; }
  const values = { studentId: parsed.data.studentId, className: parsed.data.className, notes: parsed.data.notes ?? "", status: parsed.data.status, ownerId: owner, duration: parsed.data.duration.toString(), hourlyRate: parsed.data.hourlyRate.toString(), calculatedCost: (parsed.data.duration * parsed.data.hourlyRate).toFixed(2), paymentStatus: parsed.data.status === "taught" ? "confirmed" : "pending", sessionDate: dateText(parsed.data.date) };
  const [session] = await db.update(sessionsTable).set(values).where(and(eq(sessionsTable.id, params.data.id), eq(sessionsTable.ownerId, owner))).returning();
  if (!session) { res.status(404).json({ error: "Session not found" }); return; }
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, session.studentId));
  res.json({ ...session, date: session.sessionDate, studentName: student?.name ?? "Unknown student", duration: money(session.duration), hourlyRate: money(session.hourlyRate), calculatedCost: money(session.calculatedCost) });
});

router.delete("/sessions/:id", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const params = DeleteSessionParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  await db.delete(sessionsTable).where(and(eq(sessionsTable.id, params.data.id), eq(sessionsTable.ownerId, owner)));
  res.sendStatus(204);
});

function mapCurriculum(row: typeof curriculaTable.$inferSelect) {
  return { ...row, filesCount: 0 };
}

router.get("/curricula", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const query = ListCurriculaQueryParams.parse(req.query);
  const filters = [eq(curriculaTable.ownerId, owner)];
  if (query.status) filters.push(eq(curriculaTable.status, query.status));
  if (query.search) filters.push(or(ilike(curriculaTable.name, `%${query.search}%`), ilike(curriculaTable.subject, `%${query.search}%`))!);
  const rows = await db.select().from(curriculaTable).where(and(...filters)).orderBy(desc(curriculaTable.lastUpdated));
  res.json(rows.map(mapCurriculum));
});

router.post("/curricula", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const parsed = CreateCurriculumBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const today = new Date().toISOString().slice(0, 10);
  const [row] = await db.insert(curriculaTable).values({ name: parsed.data.name, subject: parsed.data.subject, grade: parsed.data.grade, description: parsed.data.description, publisher: parsed.data.publisher ?? "", version: parsed.data.version, status: parsed.data.status, reviewDate: dateText(parsed.data.reviewDate), notes: parsed.data.notes ?? "", ownerId: owner, dateAdded: today, lastUpdated: today }).returning();
  res.status(201).json(mapCurriculum(row));
});

router.patch("/curricula/:id", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const params = UpdateCurriculumParams.safeParse(req.params);
  const parsed = UpdateCurriculumBody.safeParse(req.body);
  if (!params.success || !parsed.success) { res.status(400).json({ error: "Invalid curriculum data" }); return; }
  const [row] = await db.update(curriculaTable).set({ name: parsed.data.name, subject: parsed.data.subject, grade: parsed.data.grade, description: parsed.data.description, publisher: parsed.data.publisher ?? "", version: parsed.data.version, status: parsed.data.status, reviewDate: dateText(parsed.data.reviewDate), notes: parsed.data.notes ?? "", ownerId: owner, lastUpdated: new Date().toISOString().slice(0, 10) }).where(and(eq(curriculaTable.id, params.data.id), eq(curriculaTable.ownerId, owner))).returning();
  if (!row) { res.status(404).json({ error: "Curriculum not found" }); return; }
  res.json(mapCurriculum(row));
});

router.delete("/curricula/:id", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const params = DeleteCurriculumParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  await db.delete(curriculaTable).where(and(eq(curriculaTable.id, params.data.id), eq(curriculaTable.ownerId, owner)));
  res.sendStatus(204);
});

async function listProjects(owner: string, query: { search?: string; status?: string }) {
  const filters = [eq(freelancerProjectsTable.ownerId, owner)];
  if (query.status) filters.push(eq(freelancerProjectsTable.status, query.status));
  if (query.search) filters.push(or(ilike(freelancerProjectsTable.name, `%${query.search}%`), ilike(freelancerProjectsTable.client, `%${query.search}%`))!);
  const projects = await db.select().from(freelancerProjectsTable).where(and(...filters)).orderBy(desc(freelancerProjectsTable.id));
  const entries = await db.select().from(timeEntriesTable).where(eq(timeEntriesTable.ownerId, owner));
  const proposals = await db.select().from(proposalsTable).where(eq(proposalsTable.ownerId, owner));
  return projects.map((project) => {
    const projectEntries = entries.filter((entry) => entry.projectId === project.id);
    return { ...project, totalHours: projectEntries.reduce((sum, entry) => sum + money(entry.duration), 0), totalCost: projectEntries.reduce((sum, entry) => sum + money(entry.calculatedCost), 0), proposalCount: proposals.filter((proposal) => proposal.projectId === project.id).length };
  });
}

router.get("/freelancer-projects", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const query = ListFreelancerProjectsQueryParams.parse(req.query);
  res.json(await listProjects(owner, query));
});

router.post("/freelancer-projects", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const parsed = CreateFreelancerProjectBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(freelancerProjectsTable).values({ name: parsed.data.name, client: parsed.data.client, description: parsed.data.description, deadline: dateText(parsed.data.deadline), status: parsed.data.status, hourlyRate: parsed.data.hourlyRate.toString(), ownerId: owner, dateCreated: new Date().toISOString().slice(0, 10) }).returning();
  res.status(201).json({ ...row, totalHours: 0, totalCost: 0, proposalCount: 0 });
});

router.patch("/freelancer-projects/:id", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const params = UpdateFreelancerProjectParams.safeParse(req.params);
  const parsed = UpdateFreelancerProjectBody.safeParse(req.body);
  if (!params.success || !parsed.success) { res.status(400).json({ error: "Invalid project data" }); return; }
  const [row] = await db.update(freelancerProjectsTable).set({ name: parsed.data.name, client: parsed.data.client, description: parsed.data.description, deadline: dateText(parsed.data.deadline), status: parsed.data.status, hourlyRate: parsed.data.hourlyRate.toString(), ownerId: owner }).where(and(eq(freelancerProjectsTable.id, params.data.id), eq(freelancerProjectsTable.ownerId, owner))).returning();
  if (!row) { res.status(404).json({ error: "Project not found" }); return; }
  const updated = (await listProjects(owner, {})).find((project) => project.id === row.id);
  res.json(updated ?? { ...row, totalHours: 0, totalCost: 0, proposalCount: 0 });
});

router.delete("/freelancer-projects/:id", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const params = DeleteFreelancerProjectParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  await db.delete(freelancerProjectsTable).where(and(eq(freelancerProjectsTable.id, params.data.id), eq(freelancerProjectsTable.ownerId, owner)));
  res.sendStatus(204);
});

router.get("/freelancer-projects/:projectId/time-entries", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const projectId = Number(req.params.projectId);
  const rows = await db.select().from(timeEntriesTable).where(and(eq(timeEntriesTable.ownerId, owner), eq(timeEntriesTable.projectId, projectId))).orderBy(desc(timeEntriesTable.entryDate));
  res.json(rows.map((row) => ({ ...row, date: row.entryDate, duration: money(row.duration), hourlyRate: money(row.hourlyRate), calculatedCost: money(row.calculatedCost) })));
});

router.post("/freelancer-projects/:projectId/time-entries", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const projectId = Number(req.params.projectId);
  const parsed = CreateTimeEntryBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(timeEntriesTable).values({ description: parsed.data.description, ownerId: owner, projectId, entryDate: dateText(parsed.data.date), duration: parsed.data.duration.toString(), hourlyRate: parsed.data.hourlyRate.toString(), calculatedCost: (parsed.data.duration * parsed.data.hourlyRate).toFixed(2) }).returning();
  res.status(201).json({ ...row, date: row.entryDate, duration: money(row.duration), hourlyRate: money(row.hourlyRate), calculatedCost: money(row.calculatedCost) });
});

router.get("/proposals", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const query = ListProposalsQueryParams.parse(req.query);
  const filters = [eq(proposalsTable.ownerId, owner)];
  if (query.search) filters.push(or(ilike(proposalsTable.opportunityName, `%${query.search}%`), ilike(proposalsTable.clientType, `%${query.search}%`))!);
  const rows = await db.select().from(proposalsTable).where(and(...filters)).orderBy(desc(proposalsTable.proposalDate));
  res.json(rows.map((row) => ({ ...row, date: row.proposalDate })));
});

router.post("/proposals", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const parsed = CreateProposalBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(proposalsTable).values({ opportunityName: parsed.data.opportunityName, clientType: parsed.data.clientType, version: parsed.data.version, content: parsed.data.content, approach: parsed.data.approach, result: parsed.data.result, won: parsed.data.won, notes: parsed.data.notes ?? "", whatWorked: parsed.data.whatWorked, projectId: parsed.data.projectId ?? null, ownerId: owner, proposalDate: dateText(parsed.data.date) }).returning();
  res.status(201).json({ ...row, date: row.proposalDate });
});

router.patch("/proposals/:id", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const params = UpdateProposalParams.safeParse(req.params);
  const parsed = UpdateProposalBody.safeParse(req.body);
  if (!params.success || !parsed.success) { res.status(400).json({ error: "Invalid proposal data" }); return; }
  const [row] = await db.update(proposalsTable).set({ opportunityName: parsed.data.opportunityName, clientType: parsed.data.clientType, version: parsed.data.version, content: parsed.data.content, approach: parsed.data.approach, result: parsed.data.result, won: parsed.data.won, notes: parsed.data.notes ?? "", whatWorked: parsed.data.whatWorked, projectId: parsed.data.projectId ?? null, ownerId: owner, proposalDate: dateText(parsed.data.date) }).where(and(eq(proposalsTable.id, params.data.id), eq(proposalsTable.ownerId, owner))).returning();
  if (!row) { res.status(404).json({ error: "Proposal not found" }); return; }
  res.json({ ...row, date: row.proposalDate });
});

router.delete("/proposals/:id", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const params = DeleteProposalParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  await db.delete(proposalsTable).where(and(eq(proposalsTable.id, params.data.id), eq(proposalsTable.ownerId, owner)));
  res.sendStatus(204);
});

router.get("/expenses", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const query = ListExpensesQueryParams.parse(req.query);
  const filters = [eq(expensesTable.ownerId, owner)];
  if (query.search) filters.push(or(ilike(expensesTable.name, `%${query.search}%`), ilike(expensesTable.category, `%${query.search}%`))!);
  if (query.month) filters.push(sql`${expensesTable.expenseDate} >= ${query.month}-01 AND ${expensesTable.expenseDate} < ${(Number(query.month.slice(5)) === 12 ? Number(query.month.slice(0, 4)) + 1 : Number(query.month.slice(0, 4)))}-${String(Number(query.month.slice(5)) === 12 ? 1 : Number(query.month.slice(5)) + 1).padStart(2, "0")}-01`);
  const rows = await db.select().from(expensesTable).where(and(...filters)).orderBy(desc(expensesTable.expenseDate));
  res.json(rows.map((row) => ({ ...row, date: row.expenseDate, amount: money(row.amount) })));
});

router.post("/expenses", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const parsed = CreateExpenseBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(expensesTable).values({ name: parsed.data.name, category: parsed.data.category, description: parsed.data.description, paymentMethod: parsed.data.paymentMethod, projectId: parsed.data.projectId ?? null, ownerId: owner, expenseDate: dateText(parsed.data.date), amount: parsed.data.amount.toString() }).returning();
  res.status(201).json({ ...row, date: row.expenseDate, amount: money(row.amount) });
});

router.delete("/expenses/:id", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const params = DeleteExpenseParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  await db.delete(expensesTable).where(and(eq(expensesTable.id, params.data.id), eq(expensesTable.ownerId, owner)));
  res.sendStatus(204);
});

router.get("/venture-projects", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const query = ListVentureProjectsQueryParams.parse(req.query);
  const filters = [eq(ventureProjectsTable.ownerId, owner)];
  if (query.status) filters.push(eq(ventureProjectsTable.status, query.status));
  if (query.search) filters.push(or(ilike(ventureProjectsTable.name, `%${query.search}%`), ilike(ventureProjectsTable.category, `%${query.search}%`))!);
  const rows = await db.select().from(ventureProjectsTable).where(and(...filters)).orderBy(desc(ventureProjectsTable.id));
  const files = await db.select().from(filesTable).where(and(eq(filesTable.ownerId, owner), eq(filesTable.entityType, "venture-project")));
  res.json(rows.map((row) => ({ ...row, filesCount: files.filter((file) => file.entityId === row.id).length })));
});

router.post("/venture-projects", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const parsed = CreateVentureProjectBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(ventureProjectsTable).values({ name: parsed.data.name, description: parsed.data.description, category: parsed.data.category, stage: parsed.data.stage, status: parsed.data.status, goal: parsed.data.goal, nextStep: parsed.data.nextStep ?? "", ownerId: owner, deadline: dateText(parsed.data.deadline), dateCreated: new Date().toISOString().slice(0, 10) }).returning();
  res.status(201).json({ ...row, filesCount: 0 });
});

router.patch("/venture-projects/:id", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const params = UpdateVentureProjectParams.safeParse(req.params);
  const parsed = UpdateVentureProjectBody.safeParse(req.body);
  if (!params.success || !parsed.success) { res.status(400).json({ error: "Invalid venture project data" }); return; }
  const [row] = await db.update(ventureProjectsTable).set({ name: parsed.data.name, description: parsed.data.description, category: parsed.data.category, stage: parsed.data.stage, status: parsed.data.status, goal: parsed.data.goal, nextStep: parsed.data.nextStep ?? "", ownerId: owner, deadline: dateText(parsed.data.deadline) }).where(and(eq(ventureProjectsTable.id, params.data.id), eq(ventureProjectsTable.ownerId, owner))).returning();
  if (!row) { res.status(404).json({ error: "Project not found" }); return; }
  res.json({ ...row, filesCount: 0 });
});

router.delete("/venture-projects/:id", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const params = DeleteVentureProjectParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  await db.delete(ventureProjectsTable).where(and(eq(ventureProjectsTable.id, params.data.id), eq(ventureProjectsTable.ownerId, owner)));
  res.sendStatus(204);
});

router.get("/ideas", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const query = ListIdeasQueryParams.parse(req.query);
  const filters = [eq(ideasTable.ownerId, owner)];
  if (query.status) filters.push(eq(ideasTable.stage, query.status));
  if (query.search) filters.push(or(ilike(ideasTable.title, `%${query.search}%`), ilike(ideasTable.category, `%${query.search}%`))!);
  const rows = await db.select().from(ideasTable).where(and(...filters)).orderBy(desc(ideasTable.id));
  res.json(rows);
});

router.post("/ideas", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const parsed = CreateIdeaBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(ideasTable).values({ ...parsed.data, ownerId: owner, createdAt: new Date().toISOString().slice(0, 10) }).returning();
  res.status(201).json(row);
});

router.patch("/ideas/:id", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const params = UpdateIdeaParams.safeParse(req.params);
  const parsed = UpdateIdeaBody.safeParse(req.body);
  if (!params.success || !parsed.success) { res.status(400).json({ error: "Invalid idea data" }); return; }
  const [row] = await db.update(ideasTable).set({ ...parsed.data, ownerId: owner, developmentCount: sql`${ideasTable.developmentCount} + 1` }).where(and(eq(ideasTable.id, params.data.id), eq(ideasTable.ownerId, owner))).returning();
  if (!row) { res.status(404).json({ error: "Idea not found" }); return; }
  res.json(row);
});

router.delete("/ideas/:id", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const params = DeleteIdeaParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  await db.delete(ideasTable).where(and(eq(ideasTable.id, params.data.id), eq(ideasTable.ownerId, owner)));
  res.sendStatus(204);
});

router.get("/files", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const query = ListFilesQueryParams.parse(req.query);
  const filters = [eq(filesTable.ownerId, owner)];
  if (query.entityType) filters.push(eq(filesTable.entityType, query.entityType));
  if (query.entityId) filters.push(eq(filesTable.entityId, query.entityId));
  if (query.search) filters.push(ilike(filesTable.name, `%${query.search}%`));
  const rows = await db.select().from(filesTable).where(and(...filters)).orderBy(desc(filesTable.uploadedAt));
  res.json(rows);
});

router.post("/files", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const parsed = CreateFileRecordBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(filesTable).values({ ...parsed.data, ownerId: owner }).returning();
  res.status(201).json(row);
});

router.delete("/files/:id", async (req, res): Promise<void> => {
  const owner = await withOwner(req, res);
  if (!owner) return;
  const params = DeleteFileRecordParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  await db.delete(filesTable).where(and(eq(filesTable.id, params.data.id), eq(filesTable.ownerId, owner)));
  res.sendStatus(204);
});

export default router;
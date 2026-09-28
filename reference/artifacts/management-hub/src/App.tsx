import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import {
  ClerkProvider,
  Show,
  SignIn,
  SignUp,
  useAuth,
  useClerk,
  useUser,
} from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Compass,
  FileText,
  FolderKanban,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  Lightbulb,
  ListFilter,
  LogOut,
  Menu,
  MoreHorizontal,
  Pencil,
  Plus,
  Receipt,
  Search,
  Settings,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Users,
  WalletCards,
  X,
} from 'lucide-react';
import {
  getGetActivityQueryKey,
  getGetOverviewQueryKey,
  getGetProfileQueryKey,
  getGetStudentQueryKey,
  getListCurriculaQueryKey,
  getListExpensesQueryKey,
  getListFilesQueryKey,
  getListFreelancerProjectsQueryKey,
  getListIdeasQueryKey,
  getListProposalsQueryKey,
  getListSessionsQueryKey,
  getListStudentsQueryKey,
  getListTimeEntriesQueryKey,
  getListVentureProjectsQueryKey,
  useCreateCurriculum,
  useCreateExpense,
  useCreateFileRecord,
  useCreateFreelancerProject,
  useCreateIdea,
  useCreateProposal,
  useCreateSession,
  useCreateStudent,
  useCreateTimeEntry,
  useCreateVentureProject,
  useDeleteCurriculum,
  useDeleteExpense,
  useDeleteFileRecord,
  useDeleteFreelancerProject,
  useDeleteIdea,
  useDeleteProposal,
  useDeleteSession,
  useDeleteStudent,
  useDeleteVentureProject,
  useGetActivity,
  useGetOverview,
  useGetProfile,
  useGetStudent,
  useListCurricula,
  useListExpenses,
  useListFiles,
  useListFreelancerProjects,
  useListIdeas,
  useListProposals,
  useListSessions,
  useListStudents,
  useListTimeEntries,
  useListVentureProjects,
  useUpdateCurriculum,
  useUpdateFreelancerProject,
  useUpdateIdea,
  useUpdateProfile,
  useUpdateProposal,
  useUpdateSession,
  useUpdateStudent,
  useUpdateVentureProject,
  useRequestUploadUrl,
} from '@workspace/api-client-react';
import { Link, Redirect, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const clerkPubKey = publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const money = (value: number | undefined) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);
const dateLabel = (value?: string) =>
  value ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value)) : '—';
const titleCase = (value?: string) => (value || '').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3" data-testid="link-brand">
      <span className={`grid size-9 place-items-center rounded-xl ${inverse ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}>
        <span className="font-mono text-sm font-bold">pm</span>
      </span>
      <span className="font-bold tracking-[-0.04em]">Professional Management Hub</span>
    </Link>
  );
}

function Landing() {
  return (
    <div className="min-h-[100dvh] overflow-hidden bg-background">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-10" data-testid="landing-header">
        <BrandMark />
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex" data-testid="landing-nav">
          <a href="#workspaces" data-testid="link-workspaces">Workspaces</a>
          <a href="#rhythm" data-testid="link-rhythm">The rhythm</a>
          <Link href="/sign-in" className="font-semibold text-foreground" data-testid="link-sign-in">Sign in</Link>
          <Link href="/sign-up" className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5" data-testid="link-get-started">Get started</Link>
        </nav>
        <Link href="/sign-in" className="rounded-lg border border-border px-3 py-2 text-sm font-semibold md:hidden" data-testid="link-mobile-sign-in">Sign in</Link>
      </header>

      <main>
        <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-12 lg:grid-cols-[1.1fr_.9fr] lg:px-10 lg:pb-28 lg:pt-24">
          <div className="relative z-10 animate-rise-in">
            <p className="eyebrow mb-6 text-primary" data-testid="text-landing-eyebrow">One account. Three practices.</p>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-[.98] tracking-[-0.075em] text-foreground sm:text-7xl lg:text-[6.8rem]" data-testid="text-landing-title">
              Make room for the work that matters.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl" data-testid="text-landing-description">
              A calm operating system for teaching, client work, and the ideas you are building next. Keep the whole practice in view without flattening what makes it yours.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/sign-up" className="group inline-flex items-center gap-3 rounded-lg bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5" data-testid="button-landing-start">
                Set up your hub <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="#workspaces" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3.5 text-sm font-semibold" data-testid="link-explore-workspaces">
                See the workspaces
              </a>
            </div>
          </div>
          <div className="relative animate-rise-in stagger-2" data-testid="landing-hero-art">
            <div className="workspace-grid absolute -inset-8 rounded-[2rem] opacity-60" />
            <div className="relative rounded-[2rem] border border-border bg-[#17303A] p-5 text-[#F8F2E7] shadow-2xl shadow-primary/10 sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div><p className="eyebrow text-[#F5C45B]">Tuesday, 18 June</p><p className="mt-2 text-xl font-bold tracking-tight">Good morning, Alex.</p></div>
                <span className="grid size-10 place-items-center rounded-full bg-[#F5C45B] text-sm font-bold text-[#17303A]" data-testid="avatar-landing">AK</span>
              </div>
              <div className="py-7">
                <p className="text-sm text-white/55">This week at a glance</p>
                <p className="mt-2 text-4xl font-bold tracking-[-0.06em]">$4,280 <span className="text-base font-medium text-[#F5C45B]">in motion</span></p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['Teach', '6 sessions', 'bg-[#2A766B]'],
                  ['Freelance', '2 projects', 'bg-[#466F91]'],
                  ['Build', '1 launch', 'bg-[#B67257]'],
                ].map(([name, value, color]) => (
                  <div className="rounded-xl bg-white/5 p-3" key={name} data-testid={`card-hero-${name.toLowerCase()}`}>
                    <span className={`mb-5 block size-2 rounded-full ${color}`} /><p className="text-xs text-white/55">{name}</p><p className="mt-1 text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm">
                <span className="flex items-center gap-2 text-white/65"><Activity className="size-4" /> Last update</span><span className="font-medium">Proposal marked won</span>
              </div>
            </div>
            <span className="absolute -bottom-7 -left-5 hidden rounded-full border border-border bg-accent px-4 py-2 text-sm font-bold text-accent-foreground shadow-lg sm:block">Your practice, in focus.</span>
          </div>
        </section>

        <section id="workspaces" className="border-y border-border bg-card/60 px-5 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl"><p className="eyebrow text-primary">Choose your mix</p><h2 className="mt-4 text-4xl font-extrabold tracking-[-0.06em] sm:text-6xl">Three modes of making.<br />One clear view.</h2></div>
            <div className="mt-14 grid gap-4 lg:grid-cols-3" data-testid="workspace-cards">
              {[
                { icon: GraduationCap, name: 'Teacher', accent: 'bg-[#E9B948]', number: '01', copy: 'Students, sessions, curriculum, and income — arranged for a teaching week that runs on time.' },
                { icon: BriefcaseBusiness, name: 'Freelancer', accent: 'bg-[#6A9BB6]', number: '02', copy: 'Projects, proposals, time, and money — enough structure to do excellent client work.' },
                { icon: Lightbulb, name: 'Entrepreneur', accent: 'bg-[#D48669]', number: '03', copy: 'Ideas, ventures, and the next step — keep early-stage thinking moving forward.' },
              ].map(({ icon: Icon, name, accent, number, copy }) => (
                <div key={name} className="group rounded-2xl border border-border bg-background p-6 transition-transform hover:-translate-y-1 sm:p-8" data-testid={`card-workspace-${name.toLowerCase()}`}>
                  <div className="flex items-start justify-between"><span className={`grid size-12 place-items-center rounded-xl ${accent}`}><Icon className="size-5 text-[#17303A]" /></span><span className="font-mono text-xs text-muted-foreground">{number}</span></div>
                  <h3 className="mt-12 text-2xl font-bold tracking-[-0.04em]">{name}</h3><p className="mt-3 min-h-20 text-sm leading-6 text-muted-foreground">{copy}</p>
                  <Link href="/sign-up" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-primary" data-testid={`link-workspace-${name.toLowerCase()}`}>Add workspace <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="rhythm" className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[.8fr_1.2fr] lg:px-10 lg:py-32">
          <div><p className="eyebrow text-primary">Designed for the in-between</p><h2 className="mt-4 text-4xl font-extrabold tracking-[-0.06em] sm:text-6xl">Not another tab<br />to keep open.</h2></div>
          <div className="grid gap-7 sm:grid-cols-2">
            {[
              ['01', 'A dependable pulse', 'See what needs attention today, not a wall of metrics you have to interpret.'],
              ['02', 'Records with context', 'The small details — a student note, a proposal result, a next step — stay attached to the work.'],
              ['03', 'Your mix can change', 'Turn workspaces on and off as your practice evolves. The hub follows your season.'],
              ['04', 'Quietly yours', 'No performance theater. Just a thoughtful place to run the business behind the work.'],
            ].map(([number, title, copy]) => <div key={number} className="border-t border-border pt-5" data-testid={`feature-${number}`}><span className="font-mono text-xs text-primary">{number}</span><h3 className="mt-5 text-xl font-bold tracking-[-0.03em]">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p></div>)}
          </div>
        </section>

        <section className="mx-5 mb-6 rounded-[2rem] bg-primary px-6 py-14 text-primary-foreground sm:px-12 lg:mx-10 lg:px-20 lg:py-20">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 sm:flex-row sm:items-end"><div><p className="eyebrow text-accent">Your work, held well.</p><h2 className="mt-5 max-w-xl text-4xl font-extrabold tracking-[-0.06em] sm:text-6xl">Start with the work you are already doing.</h2></div><Link href="/sign-up" className="inline-flex shrink-0 items-center gap-3 rounded-lg bg-accent px-5 py-3.5 text-sm font-bold text-accent-foreground" data-testid="button-final-start">Create your hub <ArrowRight className="size-4" /></Link></div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-10"><BrandMark /><span data-testid="text-footer">A well-run studio, wherever your work takes you.</span></footer>
    </div>
  );
}

const navGroups = [
  { label: 'Overview', items: [{ href: '/app', label: 'All work', icon: LayoutDashboard }] },
  { label: 'Teaching', key: 'teacherEnabled', items: [{ href: '/teacher', label: 'Teaching home', icon: GraduationCap }, { href: '/teacher/students', label: 'Students', icon: Users }, { href: '/teacher/sessions', label: 'Sessions', icon: CalendarDays }, { href: '/teacher/curriculum', label: 'Curriculum', icon: BookOpen }, { href: '/teacher/income', label: 'Income', icon: CircleDollarSign }] },
  { label: 'Freelance', key: 'freelancerEnabled', items: [{ href: '/freelancer', label: 'Freelance home', icon: BriefcaseBusiness }, { href: '/freelancer/projects', label: 'Projects', icon: FolderKanban }, { href: '/freelancer/proposals', label: 'Proposals', icon: FileText }, { href: '/freelancer/money', label: 'Money', icon: WalletCards }] },
  { label: 'Build', key: 'entrepreneurEnabled', items: [{ href: '/entrepreneur', label: 'Build home', icon: Target }, { href: '/entrepreneur/ideas', label: 'Ideas', icon: Lightbulb }, { href: '/entrepreneur/projects', label: 'Projects', icon: Sparkles }] },
];

function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileQuery = useGetProfile();
  const profile = profileQuery.data;
  const enabled = profile || { teacherEnabled: true, freelancerEnabled: true, entrepreneurEnabled: true };
  const { signOut } = useClerk();
  const { user } = useUser();
  const closeMenu = () => setMobileOpen(false);
  return (
    <div className="min-h-[100dvh] bg-background">
      <aside className={`fixed inset-y-0 left-0 z-40 w-[260px] border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`} data-testid="sidebar">
        <div className="flex h-full flex-col px-4 py-5">
          <div className="mb-8 flex items-center justify-between px-2"><BrandMark inverse /><button className="grid size-8 place-items-center rounded-md hover:bg-sidebar-accent lg:hidden" onClick={closeMenu} data-testid="button-close-sidebar"><X className="size-4" /></button></div>
          <nav className="flex-1 space-y-7 overflow-y-auto">
            {navGroups.map((group) => {
              if (group.key && !enabled[group.key as keyof typeof enabled]) return null;
              return <div key={group.label}><p className="eyebrow mb-2 px-3 text-sidebar-foreground/45">{group.label}</p><div className="space-y-1">{group.items.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={closeMenu} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${location === href ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`} data-testid={`link-nav-${href.replaceAll('/', '-').replace(/^-/, '')}`}><Icon className="size-4" />{label}</Link>)}</div></div>;
            })}
          </nav>
          <div className="border-t border-sidebar-border pt-4">
            <Link href="/settings" onClick={closeMenu} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${location === '/settings' ? 'bg-sidebar-accent' : 'text-sidebar-foreground/72 hover:bg-sidebar-accent'}`} data-testid="link-nav-settings"><Settings className="size-4" />Settings</Link>
            <button onClick={() => signOut({ redirectUrl: basePath || '/' })} className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground" data-testid="button-sign-out"><LogOut className="size-4" />Sign out</button>
          </div>
        </div>
      </aside>
      {mobileOpen && <button className="fixed inset-0 z-30 bg-foreground/20 lg:hidden" onClick={closeMenu} aria-label="Close navigation" data-testid="button-sidebar-overlay" />}
      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur-md lg:px-10" data-testid="app-header">
          <div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} className="grid size-9 place-items-center rounded-lg border border-border lg:hidden" data-testid="button-open-sidebar"><Menu className="size-4" /></button><div className="hidden text-sm text-muted-foreground sm:block" data-testid="text-header-context">Your practice / <span className="font-semibold text-foreground">{location === '/app' ? 'All work' : titleCase(location.split('/').filter(Boolean).at(-1))}</span></div></div>
          <div className="flex items-center gap-3"><button className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold sm:flex" data-testid="button-workspace-switcher"><span className="size-2 rounded-full bg-accent" />All work<ChevronDown className="size-3.5 text-muted-foreground" /></button><div className="grid size-9 place-items-center rounded-full bg-accent text-xs font-extrabold text-accent-foreground" data-testid="avatar-user">{profile?.initials || user?.firstName?.slice(0, 2).toUpperCase() || 'PM'}</div></div>
        </header>
        <main className="mx-auto max-w-[1500px] p-5 lg:p-10">{children}</main>
      </div>
    </div>
  );
}

function LoadingState({ label = 'Loading your workspace' }: { label?: string }) {
  return <div className="space-y-4" data-testid="state-loading"><div className="h-8 w-48 animate-pulse rounded-lg bg-muted" /><div className="grid gap-4 md:grid-cols-3"><div className="h-28 animate-pulse rounded-2xl bg-muted" /><div className="h-28 animate-pulse rounded-2xl bg-muted" /><div className="h-28 animate-pulse rounded-2xl bg-muted" /></div><p className="text-sm text-muted-foreground">{label}…</p></div>;
}

function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-8 text-center" data-testid="state-error"><p className="font-semibold">We could not load this view.</p><p className="mt-1 text-sm text-muted-foreground">Give it another moment, then try again.</p>{onRetry && <button onClick={onRetry} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" data-testid="button-retry">Try again</button>}</div>;
}

function EmptyState({ icon: Icon = Compass, title, copy, action }: { icon?: typeof Compass; title: string; copy: string; action?: ReactNode }) {
  return <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center" data-testid="state-empty"><span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary"><Icon className="size-5" /></span><h3 className="mt-4 font-bold">{title}</h3><p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">{copy}</p>{action && <div className="mt-5">{action}</div>}</div>;
}

function PageIntro({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy: string; action?: ReactNode }) {
  return <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow text-primary" data-testid="text-page-eyebrow">{eyebrow}</p><h1 className="mt-3 text-4xl font-extrabold tracking-[-0.065em] sm:text-5xl" data-testid="text-page-title">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground" data-testid="text-page-copy">{copy}</p></div>{action}</div>;
}

function StatCard({ label, value, detail, icon: Icon, tone = 'default' }: { label: string; value: string; detail?: string; icon: typeof Gauge; tone?: 'default' | 'accent' | 'warm' }) {
  return <div className={`rounded-2xl border border-border p-5 ${tone === 'accent' ? 'bg-primary text-primary-foreground' : tone === 'warm' ? 'bg-accent text-accent-foreground' : 'bg-card'}`} data-testid={`stat-${label.toLowerCase().replaceAll(' ', '-')}`}><div className="flex items-start justify-between"><p className={`eyebrow ${tone === 'default' ? 'text-muted-foreground' : 'opacity-70'}`}>{label}</p><Icon className="size-4 opacity-70" /></div><p className="mt-6 text-3xl font-extrabold tracking-[-0.06em]">{value}</p>{detail && <p className="mt-1 text-xs opacity-70">{detail}</p>}</div>;
}

function OverviewPage() {
  const overviewQuery = useGetOverview();
  const activityQuery = useGetActivity();
  const overview = overviewQuery.data;
  const activity = activityQuery.data ?? [];
  if (overviewQuery.isLoading) return <LoadingState />;
  if (overviewQuery.isError) return <ErrorState onRetry={() => overviewQuery.refetch()} />;
  return <div className="animate-rise-in"><PageIntro eyebrow="Monday overview" title="Keep the whole practice in view." copy="A clear read on the work moving across your teaching, freelance, and build desks." action={<Link href="/settings" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold" data-testid="button-overview-settings"><Settings className="size-4" />Tune your mix</Link>} />
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard label="Teaching confirmed" value={money(overview?.teaching.confirmedIncome)} detail={`${overview?.teaching.sessions ?? 0} sessions this period`} icon={GraduationCap} tone="accent" />
      <StatCard label="Freelance net" value={money(overview?.freelancer.netIncome)} detail={`${overview?.freelancer.projects ?? 0} active projects`} icon={BriefcaseBusiness} />
      <StatCard label="In development" value={`${overview?.entrepreneur.inDevelopment ?? 0}`} detail={`${overview?.entrepreneur.ideas ?? 0} ideas in the mix`} icon={Lightbulb} tone="warm" />
    </div>
    <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_.6fr]">
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-7" data-testid="card-practice-pulse"><div className="flex items-center justify-between"><div><p className="eyebrow text-muted-foreground">Practice pulse</p><h2 className="mt-2 text-xl font-bold tracking-[-0.04em]">The useful numbers</h2></div><BarChart3 className="size-5 text-primary" /></div><div className="mt-8 grid gap-6 sm:grid-cols-3">{[['Teaching', `${overview?.teaching.hours ?? 0}h`, `${overview?.teaching.students ?? 0} students`], ['Freelance', `${overview?.freelancer.hours ?? 0}h`, `${money(overview?.freelancer.estimatedIncome)} estimated`], ['Build', `${overview?.entrepreneur.activeProjects ?? 0}`, `${overview?.entrepreneur.completed ?? 0} completed`]].map(([name, value, detail]) => <div key={name} className="border-l-2 border-accent pl-4" data-testid={`metric-overview-${name.toLowerCase()}`}><p className="text-xs text-muted-foreground">{name}</p><p className="mt-2 text-2xl font-extrabold tracking-[-0.05em]">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>)}</div></section>
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-7" data-testid="card-recent-activity"><div className="flex items-center justify-between"><div><p className="eyebrow text-muted-foreground">Recent activity</p><h2 className="mt-2 text-xl font-bold tracking-[-0.04em]">What moved</h2></div><Activity className="size-5 text-primary" /></div>{activity.length ? <div className="mt-6 space-y-5">{activity.slice(0, 4).map((item) => <div key={item.id} className="flex gap-3" data-testid={`activity-item-${item.id}`}><span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" /><div><p className="text-sm font-semibold">{item.title}</p><p className="mt-0.5 text-xs leading-5 text-muted-foreground">{item.description}</p><p className="mt-1 font-mono text-[10px] text-muted-foreground/70">{dateLabel(item.createdAt)}</p></div></div>)}</div> : <p className="mt-7 text-sm text-muted-foreground">Your latest moves will show up here.</p>}</section>
    </div>
  </div>;
}

function TeacherDashboard() {
  const overviewQuery = useGetOverview();
  const studentsQuery = useListStudents();
  const sessionsQuery = useListSessions({ month: new Date().toISOString().slice(0, 7) });
  const summary = overviewQuery.data?.teaching;
  const sessions = sessionsQuery.data ?? [];
  return <div className="animate-rise-in"><PageIntro eyebrow="Teaching desk" title="Teach with a little more room." copy="The students, sessions, and material that make up your week — in one steady place." action={<Link href="/teacher/students" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground" data-testid="button-teacher-add"><Plus className="size-4" />Add student</Link>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Confirmed income" value={money(summary?.confirmedIncome)} detail={`${summary?.averageRate ?? 0}/hr average`} icon={CircleDollarSign} tone="accent" /><StatCard label="Hours taught" value={`${summary?.hours ?? 0}h`} detail={`${summary?.sessions ?? 0} sessions`} icon={Clock3} /><StatCard label="Students" value={`${summary?.students ?? studentsQuery.data?.length ?? 0}`} detail="active relationships" icon={Users} /><StatCard label="Estimated income" value={money(summary?.estimatedIncome)} detail="including planned sessions" icon={TrendingUp} tone="warm" /></div>
    <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_.9fr]"><section className="rounded-2xl border border-border bg-card p-6" data-testid="card-teacher-sessions"><div className="flex items-center justify-between"><div><p className="eyebrow text-muted-foreground">Coming up</p><h2 className="mt-2 text-xl font-bold">This month’s sessions</h2></div><Link href="/teacher/sessions" className="text-sm font-bold text-primary" data-testid="link-all-sessions">View all</Link></div>{sessionsQuery.isLoading ? <div className="mt-6 h-40 animate-pulse rounded-xl bg-muted" /> : sessions.length ? <div className="mt-6 divide-y divide-border">{sessions.slice(0, 5).map((session) => <div key={session.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0" data-testid={`session-row-${session.id}`}><div className="flex min-w-0 items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><CalendarDays className="size-4" /></span><div className="min-w-0"><p className="truncate text-sm font-semibold">{session.className}</p><p className="text-xs text-muted-foreground">{session.studentName} · {dateLabel(session.date)}</p></div></div><span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-primary">{titleCase(session.status)}</span></div>)}</div> : <EmptyState icon={CalendarDays} title="No sessions yet" copy="Add your first session and your teaching week will start to take shape." action={<Link href="/teacher/sessions" className="text-sm font-bold text-primary" data-testid="link-empty-sessions">Plan a session</Link>} />}</section>
      <section className="rounded-2xl border border-border bg-[#17303A] p-6 text-[#F8F2E7]" data-testid="card-teaching-note"><p className="eyebrow text-[#F5C45B]">A useful pause</p><h2 className="mt-3 text-2xl font-bold tracking-[-0.04em]">Keep the note, not just the number.</h2><p className="mt-4 text-sm leading-6 text-white/65">A quick note after a session often becomes the best preparation for the next one. Keep it attached to the student record while it is fresh.</p><Link href="/teacher/students" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#F5C45B]" data-testid="link-teaching-students">Open student records <ArrowRight className="size-4" /></Link></section>
    </div>
  </div>;
}

type StudentForm = { name: string; parentName: string; email: string; phone: string; age: string; grade: string; subjects: string; curriculum: string; hourlyRate: string; notes: string };
const blankStudent: StudentForm = { name: '', parentName: '', email: '', phone: '', age: '', grade: '', subjects: '', curriculum: '', hourlyRate: '', notes: '' };

function StudentsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<StudentForm>(blankStudent);
  const [open, setOpen] = useState(false);
  const studentsQuery = useListStudents({ search: search || undefined });
  const createStudent = useCreateStudent(); const updateStudent = useUpdateStudent(); const deleteStudent = useDeleteStudent();
  const studentDetail = useGetStudent(editingId ?? 0, { query: { enabled: !!editingId, queryKey: getGetStudentQueryKey(editingId ?? 0) } });
  const students = studentsQuery.data ?? [];
  const showNew = () => { setEditingId(null); setForm(blankStudent); setOpen(true); };
  const showEdit = (id: number) => { const student = students.find((item) => item.id === id); if (!student) return; setEditingId(id); setForm({ name: student.name, parentName: student.parentName, email: student.email, phone: student.phone || '', age: String(student.age), grade: student.grade, subjects: student.subjects.join(', '), curriculum: student.curriculum, hourlyRate: String(student.hourlyRate || ''), notes: student.notes || '' }); setOpen(true); };
  const submit = (event: FormEvent) => { event.preventDefault(); const payload = { name: form.name, parentName: form.parentName, email: form.email, phone: form.phone || undefined, age: Number(form.age), grade: form.grade, subjects: form.subjects.split(',').map((item) => item.trim()).filter(Boolean), curriculum: form.curriculum, hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : null, status: 'active' as const, notes: form.notes || undefined }; const done = () => { queryClient.invalidateQueries({ queryKey: getListStudentsQueryKey() }); setOpen(false); }; if (editingId) updateStudent.mutate({ id: editingId, data: payload }, { onSuccess: done }); else createStudent.mutate({ data: payload }, { onSuccess: done }); };
  const remove = (id: number) => { if (window.confirm('Remove this student record?')) deleteStudent.mutate({ id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListStudentsQueryKey() }) }); };
  return <div className="animate-rise-in"><PageIntro eyebrow="Teaching / people" title="Students" copy="A living record of the people you teach — ready for the next session, not buried in a spreadsheet." action={<button onClick={showNew} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground" data-testid="button-add-student"><Plus className="size-4" />Add student</button>} />
    <div className="mb-5 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students, parents, subjects" className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm outline-none ring-primary transition focus:ring-2" data-testid="input-search-students" /></div><button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold" data-testid="button-filter-students"><ListFilter className="size-4" />Filter</button></div>
    {studentsQuery.isLoading ? <LoadingState label="Loading students" /> : studentsQuery.isError ? <ErrorState onRetry={() => studentsQuery.refetch()} /> : students.length ? <div className="overflow-hidden rounded-2xl border border-border bg-card"><div className="hidden grid-cols-[1.5fr_1fr_1fr_120px] gap-4 border-b border-border px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid"><span>Student</span><span>Focus</span><span>Cadence</span><span /></div>{students.map((student) => <div key={student.id} className="grid gap-3 border-b border-border px-5 py-4 last:border-0 md:grid-cols-[1.5fr_1fr_1fr_120px] md:items-center md:gap-4" data-testid={`row-student-${student.id}`}><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-secondary text-xs font-bold text-primary">{student.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><div><p className="text-sm font-bold">{student.name}</p><p className="text-xs text-muted-foreground">{student.parentName || student.email}</p></div></div><div><p className="text-sm">{student.subjects.join(', ') || 'General'}</p><p className="text-xs text-muted-foreground">{student.grade}</p></div><div><p className="text-sm">{student.sessionsCount} sessions</p><p className="text-xs text-muted-foreground">{student.hourlyRate ? money(student.hourlyRate) + '/hr' : 'Rate not set'}</p></div><div className="flex gap-1 md:justify-end"><button onClick={() => showEdit(student.id)} className="grid size-8 place-items-center rounded-md hover:bg-secondary" data-testid={`button-edit-student-${student.id}`}><Pencil className="size-3.5" /></button><button onClick={() => remove(student.id)} className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive" data-testid={`button-delete-student-${student.id}`}><Trash2 className="size-3.5" /></button></div></div>)}</div> : <EmptyState icon={Users} title="No students in view" copy={search ? 'Try a different search term.' : 'Your first student record can hold the details that make every session better.'} action={!search && <button onClick={showNew} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" data-testid="button-empty-add-student">Add student</button>} />}
    {open && <Modal title={editingId ? 'Edit student' : 'Add a student'} onClose={() => setOpen(false)} testId="dialog-student"><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2"><Field label="Student name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required testId="input-student-name" /><Field label="Parent or contact" value={form.parentName} onChange={(value) => setForm({ ...form, parentName: value })} testId="input-student-parent" /><Field label="Email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} required testId="input-student-email" /><Field label="Phone" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} testId="input-student-phone" /><Field label="Age" type="number" value={form.age} onChange={(value) => setForm({ ...form, age: value })} required testId="input-student-age" /><Field label="Grade" value={form.grade} onChange={(value) => setForm({ ...form, grade: value })} testId="input-student-grade" /><Field label="Subjects" value={form.subjects} onChange={(value) => setForm({ ...form, subjects: value })} hint="Separate with commas" testId="input-student-subjects" /><Field label="Hourly rate" type="number" value={form.hourlyRate} onChange={(value) => setForm({ ...form, hourlyRate: value })} testId="input-student-rate" /><Field label="Curriculum" value={form.curriculum} onChange={(value) => setForm({ ...form, curriculum: value })} testId="input-student-curriculum" /><Field label="Notes" value={form.notes} onChange={(value) => setForm({ ...form, notes: value })} testId="input-student-notes" /><div className="col-span-full flex justify-end gap-2 border-t border-border pt-4"><button type="button" onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm font-semibold" data-testid="button-cancel-student">Cancel</button><button type="submit" disabled={createStudent.isPending || updateStudent.isPending} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50" data-testid="button-save-student">{createStudent.isPending || updateStudent.isPending ? 'Saving…' : 'Save student'}</button></div></form>{studentDetail.data && editingId && <span className="sr-only" data-testid={`detail-student-${editingId}`}>{studentDetail.data.name}</span>}</Modal>}
  </div>;
}

function Field({ label, value, onChange, type = 'text', required = false, hint, testId }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; hint?: string; testId: string }) {
  return <label className="grid gap-1.5 text-sm font-semibold">{label}<input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-primary" data-testid={testId} />{hint && <span className="text-[11px] font-normal text-muted-foreground">{hint}</span>}</label>;
}

function Modal({ title, children, onClose, testId }: { title: string; children: ReactNode; onClose: () => void; testId: string }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4 backdrop-blur-sm" data-testid={testId}><div className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8"><div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-bold tracking-[-0.04em]">{title}</h2><button onClick={onClose} className="grid size-8 place-items-center rounded-md hover:bg-secondary" data-testid={`button-close-${testId}`}><X className="size-4" /></button></div>{children}</div></div>;
}

function SessionsPage() {
  const queryClient = useQueryClient(); const [open, setOpen] = useState(false); const [search, setSearch] = useState(''); const [form, setForm] = useState({ studentId: '', className: '', date: new Date().toISOString().slice(0, 10), duration: '1', hourlyRate: '45', notes: '' });
  const sessionsQuery = useListSessions({ search: search || undefined }); const studentsQuery = useListStudents(); const create = useCreateSession(); const update = useUpdateSession(); const remove = useDeleteSession(); const sessions = sessionsQuery.data ?? [];
  const submit = (event: FormEvent) => { event.preventDefault(); create.mutate({ data: { studentId: Number(form.studentId), className: form.className, date: form.date, duration: Number(form.duration), hourlyRate: Number(form.hourlyRate), status: 'planned', notes: form.notes } }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListSessionsQueryKey() }); setOpen(false); } }); };
  const markTaught = (id: number, session: (typeof sessions)[number]) => update.mutate({ id, data: { studentId: session.studentId, className: session.className, date: session.date, duration: session.duration, hourlyRate: session.hourlyRate, status: 'taught', notes: session.notes } }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListSessionsQueryKey() }) });
  return <div className="animate-rise-in"><PageIntro eyebrow="Teaching / calendar" title="Sessions" copy="Plan the week, keep the rate visible, and close the loop when the teaching is done." action={<button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground" data-testid="button-add-session"><Plus className="size-4" />Plan session</button>} /><div className="mb-5 flex gap-3"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sessions" className="h-11 w-full rounded-lg border border-border bg-card pl-10 text-sm outline-none focus:ring-2 focus:ring-primary" data-testid="input-search-sessions" /></div></div>{sessionsQuery.isLoading ? <LoadingState label="Loading sessions" /> : sessions.length ? <div className="space-y-3">{sessions.map((session) => <div key={session.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between" data-testid={`card-session-${session.id}`}><div className="flex items-start gap-4"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><CalendarDays className="size-5" /></span><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold">{session.className}</h3><span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-primary">{titleCase(session.status)}</span></div><p className="mt-1 text-sm text-muted-foreground">{session.studentName} · {dateLabel(session.date)} · {session.duration}h</p></div></div><div className="flex items-center justify-between gap-5 sm:justify-end"><div className="text-left sm:text-right"><p className="font-mono text-lg font-medium">{money(session.calculatedCost)}</p><p className="text-[11px] text-muted-foreground">{titleCase(session.paymentStatus)} payment</p></div>{session.status === 'planned' && <button onClick={() => markTaught(session.id, session)} className="grid size-8 place-items-center rounded-lg border border-border text-primary hover:bg-secondary" data-testid={`button-complete-session-${session.id}`}><Check className="size-4" /></button>}<button onClick={() => { if (window.confirm('Delete this session?')) remove.mutate({ id: session.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListSessionsQueryKey() }) }); }} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive" data-testid={`button-delete-session-${session.id}`}><Trash2 className="size-4" /></button></div></div>)}</div> : <EmptyState icon={CalendarDays} title="Your calendar is clear" copy="Plan a session to start building a useful teaching rhythm." action={<button onClick={() => setOpen(true)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" data-testid="button-empty-add-session">Plan a session</button>} />}{open && <Modal title="Plan a session" onClose={() => setOpen(false)} testId="dialog-session"><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2"><label className="grid gap-1.5 text-sm font-semibold">Student<select required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} className="h-10 rounded-lg border border-input bg-background px-3 text-sm font-normal" data-testid="select-session-student"><option value="">Choose a student</option>{(studentsQuery.data ?? []).map((student) => <option value={student.id} key={student.id}>{student.name}</option>)}</select></label><Field label="Class name" value={form.className} onChange={(value) => setForm({ ...form, className: value })} required testId="input-session-class" /><Field label="Date" type="date" value={form.date} onChange={(value) => setForm({ ...form, date: value })} required testId="input-session-date" /><Field label="Duration (hours)" type="number" value={form.duration} onChange={(value) => setForm({ ...form, duration: value })} required testId="input-session-duration" /><Field label="Hourly rate" type="number" value={form.hourlyRate} onChange={(value) => setForm({ ...form, hourlyRate: value })} required testId="input-session-rate" /><Field label="Notes" value={form.notes} onChange={(value) => setForm({ ...form, notes: value })} testId="input-session-notes" /><div className="col-span-full flex justify-end gap-2 border-t border-border pt-4"><button type="button" onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm font-semibold" data-testid="button-cancel-session">Cancel</button><button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" data-testid="button-save-session">Save session</button></div></form></Modal>}</div>;
}

function CurriculumPage() {
  const queryClient = useQueryClient(); const [open, setOpen] = useState(false); const [form, setForm] = useState({ name: '', subject: '', grade: '', description: '', version: '1.0', reviewDate: new Date().toISOString().slice(0, 10) }); const query = useListCurricula(); const create = useCreateCurriculum(); const update = useUpdateCurriculum(); const remove = useDeleteCurriculum(); const curricula = query.data ?? [];
  const submit = (event: FormEvent) => { event.preventDefault(); create.mutate({ data: { ...form, status: 'current' } }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListCurriculaQueryKey() }); setOpen(false); } }); };
  const advance = (item: (typeof curricula)[number]) => update.mutate({ id: item.id, data: { name: item.name, subject: item.subject, grade: item.grade, description: item.description, version: item.version, reviewDate: item.reviewDate, status: item.status === 'current' ? 'needs_review' : 'current' } }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListCurriculaQueryKey() }) });
  return <div className="animate-rise-in"><PageIntro eyebrow="Teaching / library" title="Curriculum" copy="Keep your materials current, findable, and connected to the classes they serve." action={<button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground" data-testid="button-add-curriculum"><Plus className="size-4" />Add curriculum</button>} />{query.isLoading ? <LoadingState label="Loading curriculum" /> : curricula.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{curricula.map((item) => <div key={item.id} className="rounded-2xl border border-border bg-card p-5" data-testid={`card-curriculum-${item.id}`}><div className="flex items-start justify-between"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><BookOpen className="size-5" /></span><div className="flex items-center gap-2"><button onClick={() => advance(item)} className="text-xs font-semibold text-primary" data-testid={`button-review-curriculum-${item.id}`}>{item.status === 'current' ? 'Flag review' : 'Mark current'}</button><button onClick={() => { if (window.confirm('Archive this curriculum?')) remove.mutate({ id: item.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListCurriculaQueryKey() }) }); }} className="text-muted-foreground hover:text-destructive" data-testid={`button-delete-curriculum-${item.id}`}><Trash2 className="size-3.5" /></button></div></div><h3 className="mt-6 text-lg font-bold">{item.name}</h3><p className="mt-1 text-sm text-muted-foreground">{item.subject} · {item.grade}</p><p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.description}</p><div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground"><span>v{item.version}</span><span className="rounded-full bg-secondary px-2.5 py-1 font-bold text-primary">{titleCase(item.status)}</span></div></div>)}</div> : <EmptyState icon={BookOpen} title="Your library is ready for its first title" copy="Add the curriculum, course plan, or reference you return to often." action={<button onClick={() => setOpen(true)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" data-testid="button-empty-add-curriculum">Add curriculum</button>} />}{open && <Modal title="Add curriculum" onClose={() => setOpen(false)} testId="dialog-curriculum"><form onSubmit={submit} className="grid gap-4"><Field label="Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required testId="input-curriculum-name" /><div className="grid gap-4 sm:grid-cols-2"><Field label="Subject" value={form.subject} onChange={(value) => setForm({ ...form, subject: value })} testId="input-curriculum-subject" /><Field label="Grade" value={form.grade} onChange={(value) => setForm({ ...form, grade: value })} testId="input-curriculum-grade" /></div><Field label="Description" value={form.description} onChange={(value) => setForm({ ...form, description: value })} testId="input-curriculum-description" /><div className="grid gap-4 sm:grid-cols-2"><Field label="Version" value={form.version} onChange={(value) => setForm({ ...form, version: value })} testId="input-curriculum-version" /><Field label="Review date" type="date" value={form.reviewDate} onChange={(value) => setForm({ ...form, reviewDate: value })} testId="input-curriculum-review" /></div><div className="flex justify-end gap-2 border-t border-border pt-4"><button type="button" onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm font-semibold" data-testid="button-cancel-curriculum">Cancel</button><button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" data-testid="button-save-curriculum">Save curriculum</button></div></form></Modal>}</div>;
}

function FreelancerDashboard() {
  const overview = useGetOverview(); const projects = useListFreelancerProjects(); const proposals = useListProposals(); const summary = overview.data?.freelancer;
  return <div className="animate-rise-in"><PageIntro eyebrow="Freelance desk" title="Make the next piece of work easier." copy="A clean view of what is promised, what is in progress, and what is paying off." action={<Link href="/freelancer/projects" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground" data-testid="button-freelance-add"><Plus className="size-4" />New project</Link>} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Net income" value={money(summary?.netIncome)} detail={`${money(summary?.confirmedIncome)} confirmed`} icon={CircleDollarSign} tone="accent" /><StatCard label="In the studio" value={`${summary?.projects ?? projects.data?.length ?? 0}`} detail="active projects" icon={FolderKanban} /><StatCard label="Hours logged" value={`${summary?.hours ?? 0}h`} detail="this period" icon={Clock3} /><StatCard label="Proposals" value={`${proposals.data?.length ?? 0}`} detail="experiments to learn from" icon={FileText} tone="warm" /></div><div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_.8fr]"><section className="rounded-2xl border border-border bg-card p-6" data-testid="card-freelance-projects"><div className="flex justify-between"><div><p className="eyebrow text-muted-foreground">Current board</p><h2 className="mt-2 text-xl font-bold">Projects in motion</h2></div><Link href="/freelancer/projects" className="text-sm font-bold text-primary" data-testid="link-freelance-projects">Manage</Link></div><div className="mt-6 space-y-3">{(projects.data ?? []).slice(0, 4).map((project) => <div key={project.id} className="flex items-center justify-between rounded-xl border border-border px-4 py-3" data-testid={`freelance-project-row-${project.id}`}><div><p className="text-sm font-bold">{project.name}</p><p className="text-xs text-muted-foreground">{project.client} · Due {dateLabel(project.deadline)}</p></div><span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-primary">{titleCase(project.status)}</span></div>)}{!projects.data?.length && <EmptyState icon={FolderKanban} title="No projects yet" copy="Add the work that is currently taking up space in your head." action={<Link href="/freelancer/projects" className="text-sm font-bold text-primary" data-testid="link-empty-freelance-projects">Open project board</Link>} />}</div></section><section className="rounded-2xl border border-border bg-card p-6" data-testid="card-freelance-insight"><p className="eyebrow text-muted-foreground">What worked lately</p><h2 className="mt-2 text-xl font-bold">Learn from the yes.</h2><div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-xl bg-secondary p-4"><p className="text-xs text-muted-foreground">Estimated</p><p className="mt-2 text-2xl font-extrabold">{money(summary?.estimatedIncome)}</p></div><div className="rounded-xl bg-accent p-4"><p className="text-xs text-accent-foreground/70">Expenses</p><p className="mt-2 text-2xl font-extrabold text-accent-foreground">{money(summary?.expenses)}</p></div></div><Link href="/freelancer/proposals" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-primary" data-testid="link-freelance-proposals">Review proposals <ArrowRight className="size-4" /></Link></section></div></div>;
}

function FreelancerProjectsPage() {
  const queryClient = useQueryClient(); const query = useListFreelancerProjects(); const create = useCreateFreelancerProject(); const update = useUpdateFreelancerProject(); const remove = useDeleteFreelancerProject(); const [open, setOpen] = useState(false); const [form, setForm] = useState({ name: '', client: '', description: '', deadline: new Date().toISOString().slice(0, 10), hourlyRate: '75' }); const projects = query.data ?? [];
  const submit = (e: FormEvent) => { e.preventDefault(); create.mutate({ data: { ...form, hourlyRate: Number(form.hourlyRate), status: 'idea' } }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListFreelancerProjectsQueryKey() }); setOpen(false); } }); };
  const advance = (project: (typeof projects)[number]) => update.mutate({ id: project.id, data: { name: project.name, client: project.client, description: project.description, deadline: project.deadline, hourlyRate: project.hourlyRate, status: project.status === 'idea' ? 'proposal' : project.status === 'proposal' ? 'working' : project.status === 'working' ? 'completed' : project.status } }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListFreelancerProjectsQueryKey() }) });
  return <div className="animate-rise-in"><PageIntro eyebrow="Freelance / pipeline" title="Projects" copy="Give each engagement a clear place to land, then let the status tell the story." action={<button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground" data-testid="button-add-project"><Plus className="size-4" />New project</button>} />{query.isLoading ? <LoadingState label="Loading projects" /> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{projects.map((project) => <div key={project.id} className="rounded-2xl border border-border bg-card p-5" data-testid={`card-project-${project.id}`}><div className="flex items-center justify-between"><button onClick={() => advance(project)} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-accent" data-testid={`button-advance-project-${project.id}`}>{titleCase(project.status)}</button><button onClick={() => { if (window.confirm('Delete this project?')) remove.mutate({ id: project.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListFreelancerProjectsQueryKey() }) }); }} className="text-muted-foreground hover:text-destructive" data-testid={`button-delete-project-${project.id}`}><Trash2 className="size-4" /></button></div><h3 className="mt-6 text-lg font-bold">{project.name}</h3><p className="mt-1 text-sm text-muted-foreground">{project.client}</p><p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">{project.description}</p><div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-4"><div><p className="text-[11px] text-muted-foreground">Deadline</p><p className="mt-1 text-sm font-semibold">{dateLabel(project.deadline)}</p></div><div><p className="text-[11px] text-muted-foreground">Value</p><p className="mt-1 text-sm font-semibold">{money(project.totalCost || project.hourlyRate)}</p></div></div></div>)}{!projects.length && <div className="md:col-span-2 xl:col-span-3"><EmptyState icon={FolderKanban} title="The board is open" copy="Start with the next client engagement you want to move forward." action={<button onClick={() => setOpen(true)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" data-testid="button-empty-add-project">New project</button>} /></div>}</div>}{open && <Modal title="New freelance project" onClose={() => setOpen(false)} testId="dialog-project"><form onSubmit={submit} className="grid gap-4"><Field label="Project name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required testId="input-project-name" /><Field label="Client" value={form.client} onChange={(value) => setForm({ ...form, client: value })} required testId="input-project-client" /><Field label="Description" value={form.description} onChange={(value) => setForm({ ...form, description: value })} testId="input-project-description" /><div className="grid gap-4 sm:grid-cols-2"><Field label="Deadline" type="date" value={form.deadline} onChange={(value) => setForm({ ...form, deadline: value })} testId="input-project-deadline" /><Field label="Hourly rate" type="number" value={form.hourlyRate} onChange={(value) => setForm({ ...form, hourlyRate: value })} testId="input-project-rate" /></div><div className="flex justify-end gap-2 border-t border-border pt-4"><button type="button" onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm font-semibold" data-testid="button-cancel-project">Cancel</button><button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" data-testid="button-save-project">Save project</button></div></form></Modal>}</div>;
}

function ProposalsPage() {
  const queryClient = useQueryClient(); const query = useListProposals(); const create = useCreateProposal(); const update = useUpdateProposal(); const remove = useDeleteProposal(); const [open, setOpen] = useState(false); const [form, setForm] = useState({ opportunityName: '', clientType: '', version: '1.0', content: '', approach: '', date: new Date().toISOString().slice(0, 10), result: 'pending', whatWorked: '' });
  const submit = (e: FormEvent) => { e.preventDefault(); create.mutate({ data: { ...form, projectId: null, won: false, notes: '' } }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListProposalsQueryKey() }); setOpen(false); } }); };
  const markWon = (proposal: NonNullable<typeof query.data>[number]) => update.mutate({ id: proposal.id, data: { projectId: proposal.projectId ?? null, opportunityName: proposal.opportunityName, clientType: proposal.clientType, version: proposal.version, content: proposal.content, approach: proposal.approach, date: proposal.date, result: 'won', won: true, notes: proposal.notes || '', whatWorked: proposal.whatWorked } }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListProposalsQueryKey() }) });
  return <div className="animate-rise-in"><PageIntro eyebrow="Freelance / learning loop" title="Proposals" copy="Treat each pitch as an experiment. Keep the signal from the outcome and make the next one sharper." action={<button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground" data-testid="button-add-proposal"><Plus className="size-4" />Log proposal</button>} /><div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]"><section className="rounded-2xl border border-border bg-card p-6" data-testid="card-proposal-list"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Experiments</h2><span className="font-mono text-xs text-muted-foreground">{query.data?.length ?? 0} logged</span></div>{query.isLoading ? <div className="mt-5 h-40 animate-pulse rounded-xl bg-muted" /> : query.data?.length ? <div className="mt-5 space-y-3">{query.data.map((proposal) => <div key={proposal.id} className="rounded-xl border border-border p-4" data-testid={`card-proposal-${proposal.id}`}><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{proposal.opportunityName}</h3><p className="mt-1 text-xs text-muted-foreground">{proposal.clientType} · {dateLabel(proposal.date)} · v{proposal.version}</p></div><div className="flex items-center gap-2"><button onClick={() => markWon(proposal)} className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${proposal.won ? 'bg-accent text-accent-foreground' : 'bg-secondary text-primary'}`} data-testid={`button-mark-proposal-${proposal.id}`}>{proposal.won ? 'Won' : 'Mark won'}</button><button onClick={() => { if (window.confirm('Delete this proposal?')) remove.mutate({ id: proposal.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListProposalsQueryKey() }) }); }} className="text-muted-foreground hover:text-destructive" data-testid={`button-delete-proposal-${proposal.id}`}><Trash2 className="size-3.5" /></button></div></div><p className="mt-3 text-sm leading-6 text-muted-foreground">{proposal.whatWorked || 'No notes yet.'}</p></div>)}</div> : <EmptyState icon={FileText} title="No proposals logged" copy="Capture the next pitch while the thinking is still close." action={<button onClick={() => setOpen(true)} className="text-sm font-bold text-primary" data-testid="button-empty-add-proposal">Log a proposal</button>} />}</section><section className="rounded-2xl bg-[#17303A] p-6 text-[#F8F2E7]" data-testid="card-what-worked"><p className="eyebrow text-[#F5C45B]">What worked</p><h2 className="mt-3 text-2xl font-bold tracking-[-0.04em]">Your best pitch is the one you can learn from.</h2><p className="mt-4 text-sm leading-6 text-white/65">Record the angle, the proof, and the moment the conversation shifted. Patterns compound quietly.</p><div className="mt-8 grid gap-3"><div className="rounded-xl bg-white/5 p-4"><p className="text-xs text-white/50">Prompt</p><p className="mt-2 text-sm font-semibold">What did they repeat back to you?</p></div><div className="rounded-xl bg-white/5 p-4"><p className="text-xs text-white/50">Prompt</p><p className="mt-2 text-sm font-semibold">Where did your point of view feel most specific?</p></div></div></section></div>{open && <Modal title="Log a proposal" onClose={() => setOpen(false)} testId="dialog-proposal"><form onSubmit={submit} className="grid gap-4"><Field label="Opportunity" value={form.opportunityName} onChange={(value) => setForm({ ...form, opportunityName: value })} required testId="input-proposal-opportunity" /><div className="grid gap-4 sm:grid-cols-2"><Field label="Client type" value={form.clientType} onChange={(value) => setForm({ ...form, clientType: value })} testId="input-proposal-client-type" /><Field label="Version" value={form.version} onChange={(value) => setForm({ ...form, version: value })} testId="input-proposal-version" /></div><Field label="Approach" value={form.approach} onChange={(value) => setForm({ ...form, approach: value })} testId="input-proposal-approach" /><Field label="What worked?" value={form.whatWorked} onChange={(value) => setForm({ ...form, whatWorked: value })} testId="input-proposal-what-worked" /><div className="flex justify-end gap-2 border-t border-border pt-4"><button type="button" onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm font-semibold" data-testid="button-cancel-proposal">Cancel</button><button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" data-testid="button-save-proposal">Save proposal</button></div></form></Modal>}</div>;
}

function MoneyPage() {
  const queryClient = useQueryClient(); const expensesQuery = useListExpenses(); const projectsQuery = useListFreelancerProjects(); const createExpense = useCreateExpense(); const deleteExpense = useDeleteExpense(); const createEntry = useCreateTimeEntry(); const [open, setOpen] = useState(false); const [form, setForm] = useState({ name: '', category: 'Software', amount: '', date: new Date().toISOString().slice(0, 10), description: '' }); const expenses = expensesQuery.data ?? [];
  const submit = (e: FormEvent) => { e.preventDefault(); createExpense.mutate({ data: { ...form, amount: Number(form.amount), projectId: null, paymentMethod: 'Card' } }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListExpensesQueryKey() }); setOpen(false); } }); };
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  const overview = useGetOverview();
  const trackedHours = projectsQuery.data?.reduce((sum, project) => sum + project.totalHours, 0) ?? 0;
  const logTime = () => { const project = projectsQuery.data?.[0]; if (!project) return; createEntry.mutate({ projectId: project.id, data: { date: new Date().toISOString().slice(0, 10), duration: 0.5, description: 'Focused work block', hourlyRate: project.hourlyRate } }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListFreelancerProjectsQueryKey() }) }); };
  return <div className="animate-rise-in"><PageIntro eyebrow="Freelance / money" title="Money" copy="See the cost of doing good work alongside the income it creates." action={<div className="flex flex-wrap gap-2"><button onClick={logTime} disabled={!projectsQuery.data?.length || createEntry.isPending} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold disabled:opacity-50" data-testid="button-log-time"><Clock3 className="size-4" />Log 30 min</button><button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground" data-testid="button-add-expense"><Plus className="size-4" />Add expense</button></div>} /><div className="grid gap-4 sm:grid-cols-3"><StatCard label="Expenses logged" value={money(total)} detail={`${expenses.length} records`} icon={Receipt} tone="warm" /><StatCard label="Time tracked" value={`${trackedHours}h`} detail="across active projects" icon={Clock3} /><StatCard label="Net view" value={money((overview.data?.freelancer.netIncome || 0) - total)} detail="after logged expenses" icon={WalletCards} tone="accent" /></div><section className="mt-5 rounded-2xl border border-border bg-card p-6" data-testid="card-expense-list"><div className="flex items-center justify-between"><div><p className="eyebrow text-muted-foreground">Expense ledger</p><h2 className="mt-2 text-xl font-bold">Keep the overhead honest.</h2></div><button className="grid size-9 place-items-center rounded-lg border border-border hover:bg-secondary" data-testid="button-money-filter"><ListFilter className="size-4" /></button></div>{expenses.length ? <div className="mt-6 divide-y divide-border">{expenses.map((expense) => <div key={expense.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0" data-testid={`expense-row-${expense.id}`}><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary"><Receipt className="size-4" /></span><div><p className="text-sm font-bold">{expense.name}</p><p className="text-xs text-muted-foreground">{expense.category} · {dateLabel(expense.date)}</p></div></div><div className="flex items-center gap-4"><span className="font-mono text-sm">{money(expense.amount)}</span><button onClick={() => deleteExpense.mutate({ id: expense.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListExpensesQueryKey() }) })} className="text-muted-foreground hover:text-destructive" data-testid={`button-delete-expense-${expense.id}`}><Trash2 className="size-3.5" /></button></div></div>)}</div> : <div className="mt-6"><EmptyState icon={Receipt} title="No expenses logged" copy="Add software, travel, or the other real costs behind your freelance work." /></div>}</section>{open && <Modal title="Add an expense" onClose={() => setOpen(false)} testId="dialog-expense"><form onSubmit={submit} className="grid gap-4"><Field label="Expense name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required testId="input-expense-name" /><div className="grid gap-4 sm:grid-cols-2"><Field label="Category" value={form.category} onChange={(value) => setForm({ ...form, category: value })} testId="input-expense-category" /><Field label="Amount" type="number" value={form.amount} onChange={(value) => setForm({ ...form, amount: value })} required testId="input-expense-amount" /></div><Field label="Date" type="date" value={form.date} onChange={(value) => setForm({ ...form, date: value })} testId="input-expense-date" /><Field label="Description" value={form.description} onChange={(value) => setForm({ ...form, description: value })} testId="input-expense-description" /><div className="flex justify-end gap-2 border-t border-border pt-4"><button type="button" onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm font-semibold" data-testid="button-cancel-expense">Cancel</button><button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" data-testid="button-save-expense">Save expense</button></div></form></Modal>}</div>;
}

function EntrepreneurDashboard() {
  const overview = useGetOverview(); const projects = useListVentureProjects(); const ideas = useListIdeas();
  return <div className="animate-rise-in"><PageIntro eyebrow="Build desk" title="Give the next idea a place to go." copy="A lightweight space for exploring, testing, and moving your own work into the world." action={<Link href="/entrepreneur/ideas" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground" data-testid="button-build-add"><Plus className="size-4" />Capture idea</Link>} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Active projects" value={`${overview.data?.entrepreneur.activeProjects ?? projects.data?.length ?? 0}`} detail="with a next step" icon={Target} tone="accent" /><StatCard label="Ideas" value={`${overview.data?.entrepreneur.ideas ?? ideas.data?.length ?? 0}`} detail="in the notebook" icon={Lightbulb} /><StatCard label="In development" value={`${overview.data?.entrepreneur.inDevelopment ?? 0}`} detail="becoming tangible" icon={Sparkles} /><StatCard label="Completed" value={`${overview.data?.entrepreneur.completed ?? 0}`} detail="shipped or closed" icon={Check} tone="warm" /></div><div className="mt-5 grid gap-5 xl:grid-cols-2"><section className="rounded-2xl border border-border bg-card p-6" data-testid="card-venture-projects"><div className="flex items-center justify-between"><div><p className="eyebrow text-muted-foreground">Venture board</p><h2 className="mt-2 text-xl font-bold">Projects with momentum</h2></div><Link href="/entrepreneur/projects" className="text-sm font-bold text-primary" data-testid="link-venture-projects">Open board</Link></div><div className="mt-6 space-y-3">{(projects.data ?? []).slice(0, 4).map((project) => <div key={project.id} className="flex items-center justify-between rounded-xl border border-border p-4" data-testid={`venture-project-row-${project.id}`}><div><p className="text-sm font-bold">{project.name}</p><p className="mt-1 text-xs text-muted-foreground">{titleCase(project.stage)} · Next: {project.nextStep || 'Decide next step'}</p></div><span className="size-2 rounded-full bg-accent" /></div>)}{!projects.data?.length && <EmptyState icon={Target} title="No ventures in motion" copy="Turn the idea with the most energy into a project with a next step." />}</div></section><section className="rounded-2xl border border-border bg-card p-6" data-testid="card-ideas-preview"><div className="flex items-center justify-between"><div><p className="eyebrow text-muted-foreground">Idea shelf</p><h2 className="mt-2 text-xl font-bold">Thoughts worth returning to</h2></div><Link href="/entrepreneur/ideas" className="text-sm font-bold text-primary" data-testid="link-ideas">View ideas</Link></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{(ideas.data ?? []).slice(0, 4).map((idea) => <div key={idea.id} className="rounded-xl bg-secondary p-4" data-testid={`idea-preview-${idea.id}`}><div className="flex justify-between"><span className="text-[11px] font-bold uppercase tracking-wider text-primary">{titleCase(idea.priority)}</span><span className="text-[11px] text-muted-foreground">{titleCase(idea.stage)}</span></div><p className="mt-5 text-sm font-bold">{idea.title}</p></div>)}{!ideas.data?.length && <div className="sm:col-span-2"><EmptyState icon={Lightbulb} title="The shelf is quiet" copy="Capture the rough idea before it disappears." /></div>}</div></section></div></div>;
}

function IdeasPage() {
  const queryClient = useQueryClient(); const query = useListIdeas(); const create = useCreateIdea(); const update = useUpdateIdea(); const remove = useDeleteIdea(); const [open, setOpen] = useState(false); const [form, setForm] = useState({ title: '', description: '', category: 'General', notes: '' }); const ideas = query.data ?? [];
  const submit = (e: FormEvent) => { e.preventDefault(); create.mutate({ data: { ...form, stage: 'new', priority: 'medium' } }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListIdeasQueryKey() }); setOpen(false); } }); };
  const moveIdea = (idea: (typeof ideas)[number]) => update.mutate({ id: idea.id, data: { title: idea.title, description: idea.description, category: idea.category, notes: idea.notes, stage: idea.stage === 'new' ? 'researching' : idea.stage === 'researching' ? 'developing' : idea.stage, priority: idea.priority } }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListIdeasQueryKey() }) });
  return <div className="animate-rise-in"><PageIntro eyebrow="Build / notebook" title="Ideas" copy="Keep the raw material close. Every idea gets a stage, a priority, and permission to change." action={<button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground" data-testid="button-add-idea"><Plus className="size-4" />Capture idea</button>} />{query.isLoading ? <LoadingState label="Loading ideas" /> : ideas.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{ideas.map((idea) => <div key={idea.id} className="rounded-2xl border border-border bg-card p-5" data-testid={`card-idea-${idea.id}`}><div className="flex items-start justify-between"><span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-accent-foreground">{titleCase(idea.priority)} priority</span><div className="flex gap-2"><button onClick={() => moveIdea(idea)} className="text-muted-foreground hover:text-primary" title="Advance stage" data-testid={`button-advance-idea-${idea.id}`}><ArrowRight className="size-4" /></button><button onClick={() => { if (window.confirm('Delete this idea?')) remove.mutate({ id: idea.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListIdeasQueryKey() }) }); }} className="text-muted-foreground hover:text-destructive" data-testid={`button-delete-idea-${idea.id}`}><Trash2 className="size-4" /></button></div></div><h3 className="mt-6 text-lg font-bold">{idea.title}</h3><p className="mt-1 text-xs text-muted-foreground">{idea.category} · {titleCase(idea.stage)}</p><p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">{idea.description}</p><div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">{idea.developmentCount} development notes</div></div>)}</div> : <EmptyState icon={Lightbulb} title="Start with a loose thought" copy="The best place for a promising idea is somewhere you will actually return to." action={<button onClick={() => setOpen(true)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" data-testid="button-empty-add-idea">Capture idea</button>} />}{open && <Modal title="Capture an idea" onClose={() => setOpen(false)} testId="dialog-idea"><form onSubmit={submit} className="grid gap-4"><Field label="Title" value={form.title} onChange={(value) => setForm({ ...form, title: value })} required testId="input-idea-title" /><Field label="Category" value={form.category} onChange={(value) => setForm({ ...form, category: value })} testId="input-idea-category" /><Field label="Description" value={form.description} onChange={(value) => setForm({ ...form, description: value })} testId="input-idea-description" /><Field label="Notes" value={form.notes} onChange={(value) => setForm({ ...form, notes: value })} testId="input-idea-notes" /><div className="flex justify-end gap-2 border-t border-border pt-4"><button type="button" onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm font-semibold" data-testid="button-cancel-idea">Cancel</button><button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" data-testid="button-save-idea">Save idea</button></div></form></Modal>}</div>;
}

function VentureProjectsPage() {
  const queryClient = useQueryClient(); const query = useListVentureProjects(); const create = useCreateVentureProject(); const update = useUpdateVentureProject(); const remove = useDeleteVentureProject(); const filesQuery = useListFiles({ entityType: 'venture-project' }); const createFile = useCreateFileRecord(); const deleteFile = useDeleteFileRecord(); const requestUpload = useRequestUploadUrl(); const [open, setOpen] = useState(false); const [fileProjectId, setFileProjectId] = useState<number | ''>(''); const [uploading, setUploading] = useState(false); const [uploadError, setUploadError] = useState(''); const [form, setForm] = useState({ name: '', description: '', category: 'Product', goal: '', deadline: new Date().toISOString().slice(0, 10) }); const projects = query.data ?? [];
  const submit = (e: FormEvent) => { e.preventDefault(); create.mutate({ data: { ...form, stage: 'idea', status: 'active', nextStep: 'Define the next small step' } }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListVentureProjectsQueryKey() }); setOpen(false); } }); };
  const advance = (project: (typeof projects)[number]) => update.mutate({ id: project.id, data: { name: project.name, description: project.description, category: project.category, stage: project.stage === 'idea' ? 'research' : project.stage === 'research' ? 'planning' : project.stage === 'planning' ? 'development' : project.stage, status: project.status, goal: project.goal, deadline: project.deadline, nextStep: project.nextStep } }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListVentureProjectsQueryKey() }) });
  const addFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const project = projects.find((item) => item.id === fileProjectId) ?? projects[0];
    event.target.value = '';
    if (!file || !project) return;
    setUploading(true);
    setUploadError('');
    try {
      const upload = await requestUpload.mutateAsync({ data: { name: file.name, size: file.size, contentType: file.type || 'application/octet-stream' } });
      const response = await fetch(upload.uploadURL, { method: 'PUT', headers: { 'Content-Type': file.type || 'application/octet-stream' }, body: file });
      if (!response.ok) throw new Error(`Upload failed (${response.status})`);
      await createFile.mutateAsync({ data: { name: file.name, entityType: 'venture-project', entityId: project.id, objectPath: upload.objectPath, size: file.size, contentType: file.type || 'application/octet-stream' } });
      await queryClient.invalidateQueries({ queryKey: getListFilesQueryKey({ entityType: 'venture-project' }) });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Could not attach that file.');
    } finally {
      setUploading(false);
    }
  };
  return <div className="animate-rise-in"><PageIntro eyebrow="Build / ventures" title="Projects" copy="Move from possibility to practice with a clear stage and a next step you can actually take." action={<div className="flex flex-wrap items-center gap-2"><select value={fileProjectId || projects[0]?.id || ''} onChange={(event) => setFileProjectId(event.target.value ? Number(event.target.value) : '')} disabled={!projects.length} className="h-10 rounded-lg border border-border bg-card px-3 text-sm font-semibold disabled:opacity-50" aria-label="Project for attachment" data-testid="select-venture-file-project">{projects.length ? projects.map((project) => <option value={project.id} key={project.id}>{project.name}</option>) : <option value="">Create a project first</option>}</select><label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold"><FileText className="size-4" />{uploading ? 'Uploading…' : 'Attach file'}<input type="file" className="sr-only" onChange={addFile} disabled={uploading || !projects.length} data-testid="input-venture-file" /></label><button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground" data-testid="button-add-venture"><Plus className="size-4" />New venture</button></div>} />{uploadError && <div className="mb-5 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert" data-testid="text-upload-error">{uploadError}</div>}<div className="mb-5 flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm"><span className="flex items-center gap-2 text-muted-foreground"><FileText className="size-4" />{filesQuery.data?.length ?? 0} files connected to build work</span><span className="font-mono text-xs text-muted-foreground">Stages move forward, not sideways.</span></div>{filesQuery.data?.length ? <div className="mb-5 flex flex-wrap gap-2">{filesQuery.data.slice(0, 5).map((file) => <span key={file.id} className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium" data-testid={`file-chip-${file.id}`}><a href={`/api/storage/objects/${file.objectPath.replace(/^\/objects\//, '')}`} target="_blank" rel="noreferrer" className="hover:text-primary hover:underline">{file.name}</a><button onClick={() => deleteFile.mutate({ id: file.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListFilesQueryKey({ entityType: 'venture-project' }) }) })} data-testid={`button-delete-file-${file.id}`}><X className="size-3" /></button></span>)}</div> : null}{query.isLoading ? <LoadingState label="Loading ventures" /> : projects.length ? <div className="grid gap-4 md:grid-cols-2">{projects.map((project) => <div key={project.id} className="rounded-2xl border border-border bg-card p-6" data-testid={`card-venture-${project.id}`}><div className="flex items-start justify-between"><div><button onClick={() => advance(project)} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-accent" data-testid={`button-advance-venture-${project.id}`}>{titleCase(project.stage)}</button><h3 className="mt-5 text-xl font-bold">{project.name}</h3><p className="mt-1 text-sm text-muted-foreground">{project.category}</p></div><button onClick={() => { if (window.confirm('Delete this venture?')) remove.mutate({ id: project.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListVentureProjectsQueryKey() }) }); }} className="text-muted-foreground hover:text-destructive" data-testid={`button-delete-venture-${project.id}`}><Trash2 className="size-4" /></button></div><p className="mt-5 text-sm leading-6 text-muted-foreground">{project.description}</p><div className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2"><div><p className="text-[11px] text-muted-foreground">Goal</p><p className="mt-1 text-sm font-semibold">{project.goal}</p></div><div><p className="text-[11px] text-muted-foreground">Next step</p><p className="mt-1 text-sm font-semibold text-primary">{project.nextStep || 'Set a next step'}</p></div></div></div>)}</div> : <EmptyState icon={Target} title="No venture projects yet" copy="Give the idea you keep circling a name, a goal, and a next move." action={<button onClick={() => setOpen(true)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" data-testid="button-empty-add-venture">New venture</button>} />}{open && <Modal title="New venture project" onClose={() => setOpen(false)} testId="dialog-venture"><form onSubmit={submit} className="grid gap-4"><Field label="Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required testId="input-venture-name" /><div className="grid gap-4 sm:grid-cols-2"><Field label="Category" value={form.category} onChange={(value) => setForm({ ...form, category: value })} testId="input-venture-category" /><Field label="Deadline" type="date" value={form.deadline} onChange={(value) => setForm({ ...form, deadline: value })} testId="input-venture-deadline" /></div><Field label="Description" value={form.description} onChange={(value) => setForm({ ...form, description: value })} testId="input-venture-description" /><Field label="Goal" value={form.goal} onChange={(value) => setForm({ ...form, goal: value })} testId="input-venture-goal" /><div className="flex justify-end gap-2 border-t border-border pt-4"><button type="button" onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm font-semibold" data-testid="button-cancel-venture">Cancel</button><button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" data-testid="button-save-venture">Save venture</button></div></form></Modal>}</div>;
}

function SettingsPage() {
  const queryClient = useQueryClient(); const profileQuery = useGetProfile(); const update = useUpdateProfile(); const profile = profileQuery.data; const [name, setName] = useState(profile?.name || '');
  const save = (field: 'teacherEnabled' | 'freelancerEnabled' | 'entrepreneurEnabled', value: boolean) => { if (!profile) return; update.mutate({ data: { name: profile.name, [field]: value } }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() }) }); };
  if (profileQuery.isLoading) return <LoadingState label="Loading settings" />;
  return <div className="animate-rise-in"><PageIntro eyebrow="Your hub" title="Settings" copy="Keep your profile current and choose which workspaces deserve a place in your navigation." /><div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]"><section className="rounded-2xl border border-border bg-card p-6" data-testid="card-profile-settings"><p className="eyebrow text-muted-foreground">Profile</p><h2 className="mt-2 text-xl font-bold">The person behind the practice</h2><div className="mt-7 grid gap-4"><Field label="Display name" value={name} onChange={setName} testId="input-profile-name" /><label className="grid gap-1.5 text-sm font-semibold">Email<span className="h-10 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm font-normal text-muted-foreground" data-testid="text-profile-email">{profile?.email}</span></label><button onClick={() => update.mutate({ data: { name } }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() }) })} className="mt-2 w-fit rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground" data-testid="button-save-profile">Save profile</button></div></section><section className="rounded-2xl border border-border bg-card p-6" data-testid="card-workspace-settings"><p className="eyebrow text-muted-foreground">Workspaces</p><h2 className="mt-2 text-xl font-bold">Tune your navigation</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">You can change this mix whenever your season changes. Your records stay safe when a workspace is off.</p><div className="mt-7 divide-y divide-border">{[['teacherEnabled', 'Teaching', 'Students, sessions, curriculum, and income', GraduationCap], ['freelancerEnabled', 'Freelance', 'Projects, proposals, time, and money', BriefcaseBusiness], ['entrepreneurEnabled', 'Build', 'Ideas, ventures, and the next step', Lightbulb]].map(([key, label, copy, Icon]) => { const enabledValue = Boolean(profile?.[key as keyof typeof profile]); return <div key={key as string} className="flex items-center justify-between gap-4 py-5 first:pt-0 last:pb-0" data-testid={`setting-workspace-${key}`}><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><Icon className="size-5" /></span><div><p className="text-sm font-bold">{label as string}</p><p className="mt-1 text-xs text-muted-foreground">{copy as string}</p></div></div><button onClick={() => save(key as 'teacherEnabled' | 'freelancerEnabled' | 'entrepreneurEnabled', !enabledValue)} className={`relative h-7 w-12 rounded-full p-1 transition-colors ${enabledValue ? 'bg-primary' : 'bg-muted'}`} aria-label={`Toggle ${label}`} data-testid={`button-toggle-${key}`}><span className={`block size-5 rounded-full bg-background shadow-sm transition-transform ${enabledValue ? 'translate-x-5' : ''}`} /></button></div>; })}</div></section></div></div>;
}

function Protected({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <div className="grid min-h-[100dvh] place-items-center bg-background"><LoadingState /></div>;
  if (!isSignedIn) return <Redirect to="/sign-in" />;
  return <AppShell>{children}</AppShell>;
}

function HomeRedirect() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <Landing />;
  return isSignedIn ? <Redirect to="/app" /> : <Landing />;
}

function SignInPage() {
  return <div className="grid min-h-[100dvh] place-items-center bg-background px-4 py-8"><SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} /></div>;
}

function SignUpPage() {
  return <div className="grid min-h-[100dvh] place-items-center bg-background px-4 py-8"><SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} /></div>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: { logoPlacement: 'inside' as const, logoLinkUrl: basePath || '/', logoImageUrl: `${window.location.origin}${basePath}/logo.svg` },
  variables: { colorPrimary: '#1f6b60', colorForeground: '#17303A', colorMutedForeground: '#68777a', colorBackground: '#fbfaf5', colorInput: '#f5f1e8', colorInputForeground: '#17303A', colorDanger: '#bc443b', colorNeutral: '#d9d2c6', fontFamily: 'Manrope, sans-serif', borderRadius: '0.75rem' },
  elements: { rootBox: 'w-full flex justify-center', cardBox: 'bg-[#fbfaf5] rounded-2xl w-[440px] max-w-full overflow-hidden border border-[#d9d2c6]', card: '!shadow-none !border-0 !bg-transparent', footer: '!shadow-none !border-0 !bg-transparent', headerTitle: 'text-[#17303A] font-bold', headerSubtitle: 'text-[#68777a]', formFieldLabel: 'text-[#17303A]', footerActionLink: 'text-[#1f6b60] font-bold', footerActionText: 'text-[#68777a]', dividerText: 'text-[#68777a]', formButtonPrimary: 'bg-[#1f6b60] hover:bg-[#174e47]', formFieldInput: 'bg-[#f5f1e8] border-[#d9d2c6]', socialButtonsBlockButton: 'border-[#d9d2c6] bg-[#fbfaf5]', logoImage: 'max-h-10' },
};

function ClerkRoutes() {
  const [, setLocation] = useLocation();
  const stripBase = (path: string) => basePath && path.startsWith(basePath) ? path.slice(basePath.length) || '/' : path;
  return <ClerkProvider publishableKey={clerkPubKey} proxyUrl={clerkProxyUrl} appearance={clerkAppearance} signInUrl={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} localization={{ signIn: { start: { title: 'Welcome back', subtitle: 'Your practice is waiting.' } }, signUp: { start: { title: 'Create your hub', subtitle: 'A calmer way to run your work.' } } }} routerPush={(to) => setLocation(stripBase(to))} routerReplace={(to) => setLocation(stripBase(to), { replace: true })}><QueryClientProvider client={queryClient}><WouterRoutes /></QueryClientProvider></ClerkProvider>;
}

function WouterRoutes() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={HomeRedirect} /><Route path="/sign-in/*?" component={SignInPage} /><Route path="/sign-up/*?" component={SignUpPage} /><Route path="/app"><Protected><OverviewPage /></Protected></Route><Route path="/teacher"><Protected><TeacherDashboard /></Protected></Route><Route path="/teacher/students"><Protected><StudentsPage /></Protected></Route><Route path="/teacher/sessions"><Protected><SessionsPage /></Protected></Route><Route path="/teacher/curriculum"><Protected><CurriculumPage /></Protected></Route><Route path="/teacher/income"><Protected><IncomePage /></Protected></Route><Route path="/freelancer"><Protected><FreelancerDashboard /></Protected></Route><Route path="/freelancer/projects"><Protected><FreelancerProjectsPage /></Protected></Route><Route path="/freelancer/proposals"><Protected><ProposalsPage /></Protected></Route><Route path="/freelancer/money"><Protected><MoneyPage /></Protected></Route><Route path="/entrepreneur"><Protected><EntrepreneurDashboard /></Protected></Route><Route path="/entrepreneur/ideas"><Protected><IdeasPage /></Protected></Route><Route path="/entrepreneur/projects"><Protected><VentureProjectsPage /></Protected></Route><Route path="/settings"><Protected><SettingsPage /></Protected></Route><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function IncomePage() {
  const overview = useGetOverview(); const sessions = useListSessions({ status: 'taught' }); const summary = overview.data?.teaching;
  return <div className="animate-rise-in"><PageIntro eyebrow="Teaching / numbers" title="Income" copy="A grounded view of what your teaching time is returning." /><div className="grid gap-4 sm:grid-cols-3"><StatCard label="Confirmed" value={money(summary?.confirmedIncome)} detail="paid or confirmed" icon={CircleDollarSign} tone="accent" /><StatCard label="Estimated" value={money(summary?.estimatedIncome)} detail="including planned work" icon={TrendingUp} /><StatCard label="Average rate" value={money(summary?.averageRate)} detail="per teaching hour" icon={BarChart3} tone="warm" /></div><section className="mt-5 rounded-2xl border border-border bg-card p-6" data-testid="card-income-sessions"><p className="eyebrow text-muted-foreground">Taught sessions</p><h2 className="mt-2 text-xl font-bold">The work behind the number</h2><div className="mt-6 divide-y divide-border">{(sessions.data ?? []).map((session) => <div key={session.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0" data-testid={`income-session-${session.id}`}><div><p className="text-sm font-bold">{session.className}</p><p className="text-xs text-muted-foreground">{session.studentName} · {dateLabel(session.date)}</p></div><span className="font-mono text-sm">{money(session.calculatedCost)}</span></div>)}{!sessions.data?.length && <EmptyState icon={CircleDollarSign} title="Income will follow the work" copy="Once you mark a planned session as taught, it will appear here." />}</div></section></div>;
}

function App() {
  if (!clerkPubKey) throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
  return <WouterRouter base={basePath}><TooltipProvider><ClerkRoutes /><Toaster /></TooltipProvider></WouterRouter>;
}

export default App;
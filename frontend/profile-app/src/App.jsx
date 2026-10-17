import React, { useState } from "react"
import {
  Briefcase,
  Code2,
  FolderGit2,
  GraduationCap,
  Mail,
  MapPin,
  Sparkles,
  Terminal,
  TrendingUp,
  UserCheck,
  CheckCircle2,
  Download,
  Calendar,
} from "lucide-react"

import ProfileSection from "@/components/ProfileSection"
import StatItem from "@/components/StatItem"
import ProjectCard from "@/components/ProjectCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null)

  // Explicitly separate data objects ensuring each ProjectCard keeps its own distinct data
  const projectAlpha = {
    id: "proj-1",
    title: "CloudPulse Analytics",
    description:
      "Enterprise real-time telemetry engine ingesting 1.4M events/sec with sub-second OLAP aggregation and anomaly alerts.",
    status: "Production",
    statusVariant: "success",
    tags: ["React 19", "TypeScript", "Tailwind CSS", "Kafka", "ClickHouse"],
    metrics: "1.4M ev/s",
    projectUrl: "https://github.com",
  }

  const projectBeta = {
    id: "proj-2",
    title: "Nexus Design System",
    description:
      "Accessible, token-driven component architecture supporting 35+ micro-frontends with automated WCAG AA compliance.",
    status: "Featured v2.4",
    statusVariant: "accent",
    tags: ["Tailwind CSS", "Radix UI", "Storybook", "TypeScript", "npm"],
    metrics: "28k+ DLs",
    projectUrl: "https://github.com",
  }

  const handleViewProject = (title) => {
    setSelectedProject(title)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md transition-all">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
              <Terminal className="h-5 w-5" />
            </div>
            <span className="text-base font-bold tracking-tight text-gray-900">
              alexrivers<span className="text-indigo-600">.dev</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Available for Q3 Projects
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition-colors duration-150 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
              aria-label="GitHub Profile"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition-colors duration-150 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
              aria-label="LinkedIn Profile"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        {/* Profile Hero Header Card */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center md:items-start">
              {/* Profile Avatar with Indicator */}
              <div className="relative self-start sm:self-auto">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-3xl font-extrabold text-white shadow-md ring-4 ring-indigo-50">
                  AR
                </div>
                <div
                  className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-white bg-emerald-500 ring-2 ring-emerald-100 flex items-center justify-center"
                  title="Online and open to work"
                >
                  <span className="h-2 w-2 rounded-full bg-white"></span>
                </div>
              </div>

              {/* Identity & Headline */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                    Alex Rivers
                  </h1>
                  <Badge variant="accent">
                    Staff Engineer
                  </Badge>
                  <span className="text-xs font-semibold text-gray-500">
                    8+ Yrs Exp
                  </span>
                </div>

                <p className="text-base font-medium text-gray-700">
                  Full-Stack Architect & Distributed Systems Specialist
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    San Francisco, CA / Remote
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                    HyperScale Tech Labs
                  </span>
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-gray-400" />
                    B.S. Computer Science
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="default"
                size="default"
                onClick={() => alert("Initiating contact dialogue...")}
                className="gap-2 shadow-sm"
              >
                <Mail className="h-4 w-4" />
                <span>Get in Touch</span>
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={() => alert("Resume download requested")}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Resume PDF</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Selected Project Interactive Toast Notification */}
        {selectedProject && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>
                Inspecting project details for <strong>{selectedProject}</strong>
              </span>
            </div>
            <button
              onClick={() => setSelectedProject(null)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Responsive Two-Column Layout: Single column on mobile, 2-column from md: up */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Sidebar Column: md:col-span-4 */}
          <aside className="space-y-6 md:col-span-4">
            {/* Quick Overview Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold tracking-tight text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-indigo-600" />
                Candidate Snapshot
              </h2>
              <dl className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <dt className="text-gray-500 font-medium">Clearance / Status</dt>
                  <dd className="font-semibold text-gray-900">US Citizen / W2 or C2C</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <dt className="text-gray-500 font-medium">Preferred Stack</dt>
                  <dd className="font-semibold text-gray-900">React, Node, Go, AWS</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <dt className="text-gray-500 font-medium">Architecture Style</dt>
                  <dd className="font-semibold text-gray-900">Event-Driven / Serverless</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-gray-500 font-medium">Notice Period</dt>
                  <dd className="font-semibold text-emerald-700">Immediate / 2 Weeks</dd>
                </div>
              </dl>
            </div>

            {/* Reusable Props-Driven Component 1: StatItem (Instance 1 & 2 & 3 & 4) */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold tracking-tight text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
                Key Career Metrics
              </h2>
              <div className="grid grid-cols-1 gap-3">
                <StatItem
                  icon={Briefcase}
                  label="Production Apps"
                  value="42+"
                  subtext="Full-lifecycle products launched"
                  trend="+8 this year"
                />
                <StatItem
                  icon={Sparkles}
                  label="Client CSAT Score"
                  value="99.4%"
                  subtext="Across enterprise client audits"
                  trend="Top tier"
                />
                <StatItem
                  icon={Code2}
                  label="GitHub Commits"
                  value="2,480"
                  subtext="Public & open-source codebase"
                  trend="+32% YoY"
                />
              </div>
            </div>

            {/* Core Tech Stack */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold tracking-tight text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                <Code2 className="h-4 w-4 text-indigo-600" />
                Tech Competencies
              </h2>
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-gray-500 block mb-2">Frontend</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["React 19", "Next.js", "Tailwind CSS", "TypeScript", "Vite"].map((s) => (
                      <span key={s} className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 block mb-2">Backend & Cloud</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Node.js", "Go", "PostgreSQL", "Redis", "Kafka", "AWS"].map((s) => (
                      <span key={s} className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Column: md:col-span-8 */}
          <div className="space-y-6 md:col-span-8">
            {/* Reusable Component 2: ProfileSection with {children} prop */}
            <ProfileSection
              title="Engineering Philosophy"
              description="How I approach building robust, user-centric software"
              icon={Sparkles}
              badge="Core Values"
            >
              <p className="text-sm leading-relaxed text-gray-700">
                I design scalable frontends and cloud services with an uncompromising focus on
                maintainability, performance, and accessible UI blueprints. By pairing strict
                design systems with predictable unidirectional data flow, I ensure applications
                scale cleanly from startup prototypes to enterprise volume.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/70 p-3">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Strict Type Safety & Scale</span>
                    <span className="text-xs text-gray-500">End-to-end typing from schema to UI component props.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/70 p-3">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Design System Discipline</span>
                    <span className="text-xs text-gray-500">Adhering strictly to 4px spacing and verified tokens.</span>
                  </div>
                </div>
              </div>
            </ProfileSection>

            {/* Featured Projects Section: Composing shadcn ProjectCards with isolated data */}
            <ProfileSection
              title="Featured Projects"
              description="High-impact initiatives engineered with modern architectural patterns"
              icon={FolderGit2}
              badge="Selected Works"
            >
              {/* Responsive Grid for ProjectCards */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Instance 1: Project Alpha */}
                <ProjectCard
                  title={projectAlpha.title}
                  description={projectAlpha.description}
                  status={projectAlpha.status}
                  statusVariant={projectAlpha.statusVariant}
                  tags={projectAlpha.tags}
                  metrics={projectAlpha.metrics}
                  projectUrl={projectAlpha.projectUrl}
                  onViewProject={handleViewProject}
                />

                {/* Instance 2: Project Beta */}
                <ProjectCard
                  title={projectBeta.title}
                  description={projectBeta.description}
                  status={projectBeta.status}
                  statusVariant={projectBeta.statusVariant}
                  tags={projectBeta.tags}
                  metrics={projectBeta.metrics}
                  projectUrl={projectBeta.projectUrl}
                  onViewProject={handleViewProject}
                />
              </div>
            </ProfileSection>

            {/* Career Timeline Section using ProfileSection with {children} */}
            <ProfileSection
              title="Work Experience"
              description="Recent leadership and engineering contributions"
              icon={Briefcase}
              badge="History"
            >
              <div className="space-y-4">
                <div className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-200">
                  <span className="absolute left-0.5 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-indigo-600 ring-2 ring-indigo-100"></span>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-sm font-bold text-gray-900">
                      Staff Software Engineer &middot; HyperScale Labs
                    </h3>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      2023 - Present
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-700 leading-relaxed">
                    Lead frontend architecture across 4 engineering pods. Spearheaded migration to
                    React 19 and custom Tailwind design token system, cutting build times by 44%.
                  </p>
                </div>

                <div className="relative pl-6">
                  <span className="absolute left-0.5 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-gray-400"></span>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-sm font-bold text-gray-900">
                      Senior Full-Stack Developer &middot; DataFlow Systems
                    </h3>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      2020 - 2023
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-700 leading-relaxed">
                    Engineered resilient real-time dashboards and microservices powering B2B customer insights.
                    Mentored 6 junior engineers in component-driven UI architecture.
                  </p>
                </div>
              </div>
            </ProfileSection>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white py-8 text-center text-xs text-gray-500">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Alex Rivers. Built with Tailwind CSS & shadcn/ui blueprints.</p>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">&bull; 4px Spacing Scale Verified</span>
            <span className="text-gray-400">&bull; Audited Props Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

"use client";

import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    year: "",
    branch: "",
    skills: "",
    targetRole: "",
    hours: "",
  });

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function generatePlan(e) {
    e.preventDefault();
    setLoading(true);
    setPlan(null);

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      setPlan(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#0E2B2B] text-[#F5F1E8]">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* HEADER */}
        <header className="mb-12">
          <div className="mb-4 inline-block rounded-full border border-[#F5F1E8]/20 px-4 py-2 text-sm">
            ✦ CAREER ACTION ENGINE
          </div>

          <h1 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
            Turn your career goal into{" "}
            <span className="text-[#F2B84B]">14 days of action.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-[#F5F1E8]/70">
            Runway turns your current skills, target role, and available time
            into a focused sprint of practical work.
          </p>
        </header>

        {/* FORM */}
        <section className="rounded-3xl border border-[#F5F1E8]/10 bg-[#123737] p-6 md:p-10">

          <h2 className="mb-8 text-2xl font-bold">
            Build your sprint
          </h2>

          <form
            onSubmit={generatePlan}
            className="grid gap-6 md:grid-cols-2"
          >

            <div>
              <label className="mb-2 block text-sm">
                Current year
              </label>

              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-[#0E2B2B] p-4"
              >
                <option value="">Select year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="Final Year">Final Year</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Branch / Degree
              </label>

              <input
                name="branch"
                value={form.branch}
                onChange={handleChange}
                required
                placeholder="B.Sc AI & ML"
                className="w-full rounded-xl border border-white/10 bg-[#0E2B2B] p-4"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Current skills
              </label>

              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                required
                placeholder="Python, SQL, ML, Excel"
                className="w-full rounded-xl border border-white/10 bg-[#0E2B2B] p-4"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Target role
              </label>

              <input
                name="targetRole"
                value={form.targetRole}
                onChange={handleChange}
                required
                placeholder="Data Analyst"
                className="w-full rounded-xl border border-white/10 bg-[#0E2B2B] p-4"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Hours available per week
              </label>

              <input
                name="hours"
                value={form.hours}
                onChange={handleChange}
                required
                type="number"
                min="1"
                max="40"
                placeholder="7"
                className="w-full rounded-xl border border-white/10 bg-[#0E2B2B] p-4"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#F2B84B] p-4 font-bold text-[#0E2B2B] transition hover:scale-[1.01] disabled:opacity-50"
              >
                {loading
                  ? "Building your runway..."
                  : "Generate my 14-day sprint →"}
              </button>
            </div>

          </form>
        </section>

        {/* RESULTS */}
        {plan && (
          <section className="mt-10 space-y-8">

            <div>
              <p className="text-sm uppercase tracking-widest text-[#F2B84B]">
                Your runway
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                {plan.title}
              </h2>
            </div>

            {/* GAP */}
            <div className="rounded-3xl bg-[#123737] p-6 md:p-8">
              <h3 className="mb-4 text-2xl font-bold">
                🔍 Skill Gap
              </h3>

              <p className="text-[#F5F1E8]/80">
                {plan.gapAnalysis}
              </p>
            </div>

            {/* 14 DAYS */}
            <div className="rounded-3xl bg-[#123737] p-6 md:p-8">

              <h3 className="mb-6 text-2xl font-bold">
                📅 Your 14-Day Sprint
              </h3>

              <div className="space-y-4">

                {plan.days?.map((day, index) => (
                  <div
                    key={index}
                    className="flex gap-4 rounded-2xl border border-white/10 p-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2B84B] font-bold text-[#0E2B2B]">
                      {index + 1}
                    </div>

                    <div>
                      <h4 className="font-bold">
                        {day.title}
                      </h4>

                      <p className="mt-1 text-sm text-[#F5F1E8]/70">
                        {day.task}
                      </p>

                      <span className="mt-2 inline-block text-xs text-[#F2B84B]">
                        ⏱ {day.minutes} minutes
                      </span>
                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* PROJECTS */}
            <div className="rounded-3xl bg-[#123737] p-6 md:p-8">

              <h3 className="mb-6 text-2xl font-bold">
                💼 Portfolio Projects
              </h3>

              <div className="grid gap-5 md:grid-cols-2">

                {plan.projects?.map((project, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 p-5"
                  >
                    <h4 className="text-xl font-bold">
                      {project.title}
                    </h4>

                    <p className="mt-3 text-sm text-[#F5F1E8]/70">
                      {project.description}
                    </p>
                  </div>
                ))}

              </div>
            </div>

            {/* OUTREACH */}
            <div className="rounded-3xl bg-[#123737] p-6 md:p-8">

              <h3 className="mb-4 text-2xl font-bold">
                📩 Ready-to-send outreach
              </h3>

              <div className="rounded-2xl bg-[#0E2B2B] p-5 text-[#F5F1E8]/80">
                {plan.outreach}
              </div>

            </div>

          </section>
        )}

      </div>
    </main>
  );
}
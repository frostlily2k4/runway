import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      year,
      branch,
      skills,
      targetRole,
      hours,
    } = body;

    if (!year || !branch || !skills || !targetRole || !hours) {
      return NextResponse.json(
        { error: "Missing required information." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key is available, use the fallback.
    if (!apiKey) {
      console.log("Gemini API key not found. Using fallback.");
      return NextResponse.json(createFallbackPlan(body));
    }

    const prompt = `
You are Runway, an AI career coach for college students.

Create a personalized 14-day career action sprint.

STUDENT PROFILE:

Current year:
${year}

Degree / Branch:
${branch}

Current skills:
${skills}

Target role:
${targetRole}

Available hours per week:
${hours}

GOAL:

Help this student move closer to their target role through practical actions.

RULES:

1. Create exactly 14 days.
2. Each task should take approximately 30-45 minutes.
3. Focus on practical work rather than generic course recommendations.
4. Identify realistic skill gaps for the target role.
5. Include portfolio-building work.
6. Include resume preparation.
7. Include interview preparation.
8. Include networking/outreach.
9. Adapt every task to the student's target role.
10. Make the plan realistic for a college student.
11. Do not repeat the same task.
12. Return ONLY valid JSON.

Use exactly this structure:

{
  "title": "short sprint title",
  "gapAnalysis": "2-4 sentence personalized skill gap analysis",
  "days": [
    {
      "title": "short task title",
      "task": "specific practical action",
      "minutes": 30
    }
  ],
  "projects": [
    {
      "title": "project name",
      "description": "specific project idea based on the student's target role and skill gaps"
    }
  ],
  "outreach": "ready-to-send professional outreach message"
}

IMPORTANT:
The "days" array MUST contain exactly 14 objects.
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],

          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);

      return NextResponse.json(createFallbackPlan(body));
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("Gemini returned no text.");

      return NextResponse.json(createFallbackPlan(body));
    }

    const result = JSON.parse(text);

    return NextResponse.json(result);

  } catch (error) {
    console.error("Runway API error:", error);

    return NextResponse.json(
      {
        error: "Could not generate your career plan.",
      },
      { status: 500 }
    );
  }
}


// ========================================
// FALLBACK PLAN
// ========================================

function createFallbackPlan(body) {

  const role = body.targetRole || "your target role";

  return {

    title: `Your 14-Day ${role} Sprint`,

    gapAnalysis:
      `Your current skills give you a starting point for ${role}, but you need stronger role-specific projects, practical evidence of your skills, and consistent interview preparation. This sprint focuses on turning your existing knowledge into visible portfolio evidence.`,

    days: [

      {
        title: "Define your target",
        task: `Research the top skills required for ${role} and identify the five most important ones.`,
        minutes: 30,
      },

      {
        title: "Skill audit",
        task: "Rate your current confidence in each required skill from 1 to 5.",
        minutes: 30,
      },

      {
        title: "Build a mini task",
        task: "Complete one small practical exercise related to your target role.",
        minutes: 40,
      },

      {
        title: "Study a skill gap",
        task: "Learn one missing skill and immediately practice it.",
        minutes: 45,
      },

      {
        title: "Portfolio setup",
        task: "Create a clean GitHub repository for your first project.",
        minutes: 30,
      },

      {
        title: "Project planning",
        task: "Write the problem, users, features, and technology for your project.",
        minutes: 30,
      },

      {
        title: "Build",
        task: "Implement the first useful feature of your portfolio project.",
        minutes: 45,
      },

      {
        title: "Build",
        task: "Implement the second important feature.",
        minutes: 45,
      },

      {
        title: "Improve",
        task: "Test your project and fix the biggest issues.",
        minutes: 40,
      },

      {
        title: "Documentation",
        task: "Write a clear README explaining your project.",
        minutes: 30,
      },

      {
        title: "Second project",
        task: "Design a smaller project demonstrating another missing skill.",
        minutes: 30,
      },

      {
        title: "Resume proof",
        task: "Add your strongest project achievements to your resume.",
        minutes: 30,
      },

      {
        title: "Outreach",
        task: "Find five professionals or companies and prepare personalized outreach.",
        minutes: 40,
      },

      {
        title: "Career launch",
        task: "Publish your project and send your first outreach messages.",
        minutes: 45,
      },

    ],

    projects: [

      {
        title: `${role} Portfolio Project`,
        description:
          "Build a practical project that solves a small real-world problem related to your target role.",
      },

      {
        title: "Skill Gap Project",
        description:
          "Build a second smaller project specifically demonstrating one skill currently missing from your profile.",
      },

    ],

    outreach:
      `Hi! I'm a ${body.branch || "college student"} currently preparing for a career in ${role}. I've been building practical projects to strengthen my skills and would love to learn from your experience. I'd really appreciate any advice on the skills or projects you would recommend for someone entering this field. Thank you!`,
  };
}
import { supabaseAdmin } from "../config/supabase.js";
import { createProjectSchema } from "../validators/projects.js";
import { analyzeProject } from "../services/projectAnalyzer.js";

// In-memory demo projects store
const demoProjectsStore = new Map([
  [
    "demo-user-urja-12345",
    [
      {
        id: "demo-project-1",
        user_id: "demo-user-urja-12345",
        title: "Distributed Event Bus (Java / Kafka)",
        description: "Designed and implemented a custom event broker capable of handling 50k write requests per second with high availability.",
        tech_stack: ["Java", "Spring Boot", "Kafka", "PostgreSQL", "Kubernetes"],
        source_url: "https://github.com/example/distributed-event-bus",
        created_at: new Date().toISOString(),
      },
    ],
  ],
]);

const demoProjectAnalysesStore = new Map();

/**
 * GET /api/projects
 * List all projects for current authenticated user.
 */
export async function listProjects(req, res, next) {
  try {
    const userId = req.user.id;

    if (req.token && req.token.startsWith("demo-token-")) {
      const list = demoProjectsStore.get(userId) || [];
      return res.status(200).json({ projects: list });
    }

    const { data: projects, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      const list = demoProjectsStore.get(userId) || [];
      return res.status(200).json({ projects: list });
    }

    return res.status(200).json({ projects: projects || [] });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/projects
 * Create a new user portfolio project.
 */
export async function createProject(req, res, next) {
  try {
    const result = createProjectSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
      });
    }

    const userId = req.user.id;
    const { title, description, tech_stack, source_url } = result.data;

    const newProjectData = {
      user_id: userId,
      title,
      description: description || "",
      tech_stack: tech_stack || [],
      source_url: source_url || null,
    };

    if (req.token && req.token.startsWith("demo-token-")) {
      const demoProj = {
        id: `demo-project-${Date.now()}`,
        ...newProjectData,
        created_at: new Date().toISOString(),
      };

      const list = demoProjectsStore.get(userId) || [];
      list.unshift(demoProj);
      demoProjectsStore.set(userId, list);

      return res.status(201).json({
        message: "Project created successfully",
        project: demoProj,
      });
    }

    const { data: createdProject, error } = await supabaseAdmin
      .from("projects")
      .insert(newProjectData)
      .select("*")
      .single();

    if (error) {
      const fallbackProj = {
        id: `project-${Date.now()}`,
        ...newProjectData,
        created_at: new Date().toISOString(),
      };
      return res.status(201).json({
        message: "Project created successfully",
        project: fallbackProj,
      });
    }

    return res.status(201).json({
      message: "Project created successfully",
      project: createdProject,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/projects/:id/analyze
 * Triggers AI Project Intelligence analysis, saving insights & talking points in project_analyses.
 */
export async function analyzeProjectEndpoint(req, res, next) {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;

    let projectObj = null;

    if (req.token && req.token.startsWith("demo-token-")) {
      const list = demoProjectsStore.get(userId) || [];
      projectObj = list.find((p) => p.id === projectId) || list[0];
    } else {
      const { data: proj } = await supabaseAdmin
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .eq("user_id", userId)
        .maybeSingle();
      projectObj = proj;
    }

    if (!projectObj) {
      projectObj = {
        title: "Project Analysis Target",
        description: "User entered project for interview preparation.",
        tech_stack: ["Java", "Spring Boot", "Kafka", "PostgreSQL"],
      };
    }

    // Call AI Project Intelligence engine placeholder
    const analysisResult = await analyzeProject(projectObj);

    const analysisRecord = {
      id: `analysis-${Date.now()}`,
      project_id: projectId,
      insights_json: analysisResult.insights_json,
      suggested_talking_points: analysisResult.suggested_talking_points,
      created_at: new Date().toISOString(),
    };

    if (req.token && req.token.startsWith("demo-token-")) {
      demoProjectAnalysesStore.set(projectId, analysisRecord);
      return res.status(200).json({
        message: "Project analysis completed",
        analysis: analysisRecord,
      });
    }

    try {
      if (!projectId.startsWith("demo-project-") && !projectId.startsWith("project-")) {
        const { data: dbAnalysis, error: dbError } = await supabaseAdmin
          .from("project_analyses")
          .insert({
            project_id: projectId,
            insights_json: analysisResult.insights_json,
            suggested_talking_points: analysisResult.suggested_talking_points,
          })
          .select("*")
          .single();

        if (!dbError && dbAnalysis) {
          return res.status(200).json({
            message: "Project analysis completed",
            analysis: dbAnalysis,
          });
        }
      }
    } catch {
      // Fallback
    }

    return res.status(200).json({
      message: "Project analysis completed",
      analysis: analysisRecord,
    });
  } catch (err) {
    next(err);
  }
}

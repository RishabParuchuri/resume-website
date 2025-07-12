import { NextRequest, NextResponse } from "next/server";
import { PdfReader } from "pdfreader";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

const ai = new GoogleGenAI({});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const exampleJSONFormat = {
  personal: {
    name: "Alex Johnson",
    role: "Full Stack Developer",
    tagline: "Crafting digital experiences with code and creativity",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Passionate full-stack developer with 5+ years of experience building scalable web applications. I love turning complex problems into simple, beautiful solutions that make a difference.",
    avatar: "/placeholder.svg?height=400&width=400",
  },
  experience: [
    {
      id: 1,
      company: "TechCorp Inc.",
      position: "Senior Full Stack Developer",
      duration: "2022 - Present",
      description:
        "Led development of microservices architecture serving 1M+ users. Mentored junior developers and implemented CI/CD pipelines.",
      technologies: ["React", "Node.js", "AWS", "Docker", "PostgreSQL"],
    },
    {
      id: 2,
      company: "StartupXYZ",
      position: "Frontend Developer",
      duration: "2020 - 2022",
      description:
        "Built responsive web applications using React and TypeScript. Collaborated with design team to implement pixel-perfect UIs.",
      technologies: ["React", "TypeScript", "Tailwind CSS", "GraphQL"],
    },
    {
      id: 3,
      company: "Digital Agency",
      position: "Junior Developer",
      duration: "2019 - 2020",
      description:
        "Developed client websites and learned modern web development practices. Gained experience in both frontend and backend technologies.",
      technologies: ["JavaScript", "PHP", "MySQL", "WordPress"],
    },
  ],
  skills: [
    { name: "JavaScript", level: 95, category: "Frontend" },
    { name: "TypeScript", level: 90, category: "Frontend" },
    { name: "React", level: 95, category: "Frontend" },
    { name: "Next.js", level: 85, category: "Frontend" },
    { name: "Vue.js", level: 75, category: "Frontend" },
    { name: "Node.js", level: 90, category: "Backend" },
    { name: "Python", level: 80, category: "Backend" },
    { name: "PostgreSQL", level: 85, category: "Backend" },
    { name: "MongoDB", level: 80, category: "Backend" },
    { name: "AWS", level: 75, category: "DevOps" },
    { name: "Docker", level: 80, category: "DevOps" },
    { name: "Kubernetes", level: 65, category: "DevOps" },
  ],
  projects: [
    {
      id: 1,
      title: "E-Commerce Platform",
      description:
        "A full-stack e-commerce solution with real-time inventory management and payment processing.",
      longDescription:
        "Built a comprehensive e-commerce platform from scratch using React, Node.js, and PostgreSQL. Features include user authentication, product catalog, shopping cart, payment integration with Stripe, order management, and admin dashboard. Implemented real-time inventory updates and email notifications.",
      image: "/placeholder.svg?height=300&width=500",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "Redis"],
      github: "https://github.com/alexjohnson/ecommerce-platform",
      demo: "https://ecommerce-demo.com",
      featured: true,
    },
    {
      id: 2,
      title: "Task Management App",
      description:
        "A collaborative task management application with real-time updates and team features.",
      longDescription:
        "Developed a modern task management application similar to Trello with drag-and-drop functionality, real-time collaboration, file attachments, and team management. Used React with TypeScript for the frontend and Node.js with Socket.io for real-time features.",
      image: "/placeholder.svg?height=300&width=500",
      technologies: ["React", "TypeScript", "Socket.io", "MongoDB", "Express"],
      github: "https://github.com/alexjohnson/task-manager",
      demo: "https://taskmanager-demo.com",
      featured: true,
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description:
        "A responsive weather dashboard with location-based forecasts and interactive maps.",
      longDescription:
        "Created a comprehensive weather dashboard that provides current weather conditions, 7-day forecasts, and interactive weather maps. Features location-based weather detection, favorite locations, weather alerts, and beautiful data visualizations using Chart.js.",
      image: "/placeholder.svg?height=300&width=500",
      technologies: ["Vue.js", "Chart.js", "OpenWeather API", "Mapbox"],
      github: "https://github.com/alexjohnson/weather-dashboard",
      demo: "https://weather-demo.com",
      featured: false,
    },
    {
      id: 4,
      title: "Social Media Analytics",
      description:
        "Analytics dashboard for social media performance tracking and insights.",
      longDescription:
        "Built an analytics dashboard that aggregates data from multiple social media platforms to provide comprehensive insights into engagement, reach, and performance metrics. Features custom date ranges, exportable reports, and automated scheduling for social media posts.",
      image: "/placeholder.svg?height=300&width=500",
      technologies: ["React", "D3.js", "Python", "FastAPI", "PostgreSQL"],
      github: "https://github.com/alexjohnson/social-analytics",
      demo: "https://analytics-demo.com",
      featured: false,
    },
  ],
  education: [
    {
      id: 1,
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science in Computer Science",
      duration: "2015 - 2019",
      description:
        "Graduated Magna Cum Laude. Relevant coursework: Data Structures, Algorithms, Database Systems, Software Engineering.",
      logo: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 2,
      institution: "FreeCodeCamp",
      degree: "Full Stack Web Development Certification",
      duration: "2019",
      description:
        "Completed comprehensive curriculum covering HTML, CSS, JavaScript, React, Node.js, and database management.",
      logo: "/placeholder.svg?height=60&width=60",
    },
  ],
};

async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    let fullText = "";
    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) {
        reject(err);
      } else if (!item) {
        resolve(fullText);
      } else if (item.text) {
        fullText += item.text + " ";
      }
    });
  });
}

async function parseResumeWithAI(
  fullText: string
): Promise<typeof exampleJSONFormat> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Parse the following resume to the JSON format: " + fullText,
    config: {
      systemInstruction:
        "You are a resume parser. Make sure to keep descriptions very accurate and precise not going over 4 sentences anywhere. Use your judgment on the skill level based on the resume, and if you can't find something, leave it blank. Please provide the parsed resume strictly as a valid JSON object without any markdown formatting, code fences, or extra text. Here is the format you should follow strictly: " +
        JSON.stringify(exampleJSONFormat),
    },
  });

  if (!response.text) {
    throw new Error("No response from AI model");
  }

  return JSON.parse(response.text);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const fullText = await parsePdfBuffer(buffer);
    const structuredData = await parseResumeWithAI(fullText);
    const { data, error } = await supabase
      .from("resumes")
      .insert([{ data: structuredData }])
      .select("id");

    if (error) {
      throw new Error("Data not saved in supabase");
    }

    return NextResponse.json(data[0]);
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Calendar,
  Award,
  Code,
  Briefcase,
  GraduationCap,
  User,
  FolderOpen,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  Star,
  Coffee,
  Heart,
  Rocket,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"

// Portfolio data
export interface PortfolioData {
  personal: {
    name: string;
    role: string;
    tagline: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    avatar: string;
  };
  experience: Array<{
    id: number;
    company: string;
    position: string;
    duration: string;
    description: string;
    technologies: string[];
  }>;
  skills: Array<{
    name: string;
    level: number;
    category: string;
  }>;
  projects: Array<{
    id: number;
    title: string;
    description: string;
    longDescription: string;
    image: string;
    technologies: string[];
    github: string;
    demo: string;
    featured: boolean;
  }>;
  education: Array<{
    id: number;
    institution: string;
    degree: string;
    duration: string;
    description: string;
    logo: string;
  }>;
}

interface PortfolioProps {
  data?: PortfolioData;
}

const navigation = [
  { name: "About", href: "#about", icon: User },
  { name: "Experience", href: "#experience", icon: Briefcase },
  { name: "Skills", href: "#skills", icon: Code },
  { name: "Projects", href: "#projects", icon: FolderOpen },
  { name: "Education", href: "#education", icon: GraduationCap },
]

// Subtle floating particles
const FloatingParticles = () => {
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 15 + 10,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-400/10 dark:bg-blue-300/10"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export function Portfolio({ data }: PortfolioProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("about")
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigation.map((nav) => nav.href.substring(1))
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center">No portfolio data available</div>;
  }
  
  const portfolioData = data;

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.substring(1))
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <FloatingParticles />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-xl text-gray-900 dark:text-white"
            >
              {portfolioData.personal.name}
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === item.href.substring(1)
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              ))}

              <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)} className="ml-4">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    activeSection === item.href.substring(1)
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section - Creative Layout (keeping from second version) */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Profile Image - Floating */}
            <motion.div
              className="lg:col-span-4 flex justify-center lg:justify-start order-1 lg:order-2"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, type: "spring" }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-20"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Image
                    src={portfolioData.personal.avatar || "/placeholder.svg"}
                    alt={portfolioData.personal.name}
                    width={320}
                    height={320}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Text Content - Scattered Layout */}
            <div className="lg:col-span-8 order-2 lg:order-1 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative"
              >
                <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 leading-tight">
                  {portfolioData.personal.name.split(" ")[0]}
                </h1>
                <motion.h1
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="text-6xl md:text-8xl font-black text-gray-800 dark:text-white ml-8 -mt-4"
                >
                  {portfolioData.personal.name.split(" ")[1]}
                </motion.h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="ml-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                  {portfolioData.personal.role}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">{portfolioData.personal.tagline}</p>
              </motion.div>

              {/* Fun Facts - Floating Cards */}
              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="flex flex-wrap gap-4 ml-16"
              >
                <Button size="lg" onClick={() => scrollToSection("#projects")}>
                  <Rocket className="mr-2 w-5 h-5" />
                  View My Work
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => scrollToSection("#about")}>
                  <Heart className="mr-2 w-5 h-5" />
                  About Me
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="flex space-x-6 justify-center lg:justify-start mt-8 ml-4"
              >
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href={`mailto:${portfolioData.personal.email}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Mail className="w-6 h-6" />
                </a>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-blue-400 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About Me</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {portfolioData.personal.bio}
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300">{portfolioData.personal.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300">{portfolioData.personal.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300">{portfolioData.personal.location}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { number: "5+", label: "Years Experience", icon: Code },
                { number: "50+", label: "Projects Completed", icon: Rocket },
                { number: "15+", label: "Technologies", icon: Star },
                { number: "100%", label: "Client Satisfaction", icon: Heart },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg text-center"
                >
                  <stat.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stat.number}</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Experience</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-px h-full w-0.5 bg-blue-200 dark:bg-blue-800"></div>

            {portfolioData.experience.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900 z-10"></div>

                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:pr-8" : "md:pl-8"} ml-16 md:ml-0`}>
                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{exp.duration}</Badge>
                        <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <CardTitle className="text-xl">{exp.position}</CardTitle>
                      <CardDescription className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {exp.company}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{exp.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {/* Skills Section - Compact Appealing Cards */}
      <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Skills & Technologies</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">Technologies I work with</p>
          </motion.div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {portfolioData.skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -8 }}
                className="group cursor-pointer"
              >
                <Card className="relative overflow-hidden bg-white dark:bg-gray-700 border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
                    {/* Skill Icon with animated background */}
                    <div className="relative mb-3">
                      <motion.div
                        className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg"
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        {skill.name.charAt(0)}
                      </motion.div>
                      {/* Animated glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    </div>

                    {/* Skill Name */}
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-2 leading-tight">
                      {skill.name}
                    </h3>

                    {/* Compact Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mb-2">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: index * 0.05 }}
                        viewport={{ once: true }}
                      />
                    </div>

                    {/* Percentage */}
                    <motion.span
                      className="text-xs font-medium text-gray-600 dark:text-gray-400"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.05 + 0.5 }}
                      viewport={{ once: true }}
                    >
                      {skill.level}%
                    </motion.span>

                    {/* Category dot indicator */}
                    <div className="absolute top-2 right-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          skill.category === "Frontend"
                            ? "bg-blue-500"
                            : skill.category === "Backend"
                              ? "bg-green-500"
                              : "bg-orange-500"
                        }`}
                      />
                    </div>

                    {/* Hover overlay with category */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2">
                      <Badge className="text-xs bg-white/20 text-white border-white/30 backdrop-blur-sm">
                        {skill.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Category Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex justify-center mt-8 space-x-6"
          >
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Frontend</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Backend</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">DevOps</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Projects</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioData.projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={500}
                      height={300}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                      <Button size="sm" variant="secondary" asChild>
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </a>
                      </Button>
                      <Button size="sm" asChild>
                        <a href={project.demo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Demo
                        </a>
                      </Button>
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      {project.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          <Award className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full bg-transparent">
                          Learn More
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{project.title}</DialogTitle>
                          <DialogDescription className="text-base">{project.longDescription}</DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                          <Image
                            src={project.image || "/placeholder.svg"}
                            alt={project.title}
                            width={500}
                            height={300}
                            className="w-full h-64 object-cover rounded-lg mb-4"
                          />
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.map((tech) => (
                              <Badge key={tech} variant="outline">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex space-x-4">
                            <Button asChild>
                              <a href={project.github} target="_blank" rel="noopener noreferrer">
                                <Github className="w-4 h-4 mr-2" />
                                View Code
                              </a>
                            </Button>
                            <Button variant="outline" asChild>
                              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Live Demo
                              </a>
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Education</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioData.education.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center space-x-4 mb-4">
                      <Image
                        src={edu.logo || "/placeholder.svg"}
                        alt={edu.institution}
                        width={60}
                        height={60}
                        className="rounded-lg"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-lg">{edu.degree}</CardTitle>
                        <CardDescription className="text-base font-semibold text-blue-600 dark:text-blue-400">
                          {edu.institution}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {edu.duration}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">{edu.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Let&apos;s Work Together</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              I&apos;m always interested in new opportunities and exciting projects. Let&apos;s discuss how we can bring your
              ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <a href={`mailto:${portfolioData.personal.email}`}>
                  <Mail className="w-5 h-5 mr-2" />
                  Get In Touch
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                Download Resume
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="flex items-center justify-center md:justify-start">
                Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> and{" "}
                <Coffee className="w-4 h-4 text-brown-500 mx-1" />
              </p>
              <p className="text-gray-400">&copy; 2024 {portfolioData.personal.name}. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href={`mailto:${portfolioData.personal.email}`} className="hover:text-blue-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

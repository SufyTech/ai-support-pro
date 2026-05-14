import { motion } from "motion/react";
import { fadeInUp, viewportConfig } from "../lib/motionPresets.ts";
import { InfiniteSlider } from "./ui/infinite-slider";
import { ProgressiveBlur } from "./ui/progressive-blur";

export default function SocialProof() {
  const techStack = [
    {
      name: "React",
      color: "#61DAFB",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    },
    {
      name: "TypeScript",
      color: "#3178C6",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    },
    {
      name: "Tailwind CSS",
      color: "#06B6D4",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    },
    {
      name: "Python",
      color: "#3776AB",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    },
    {
      name: "Node.js",
      color: "#339933",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    },
    {
      name: "FastAPI",
      color: "#009688",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
    },
    {
      name: "AutoGen",
      color: "#FF6B6B",
      logo: "https://mailmeteor.com/logos/assets/PNG/Microsoft_Logo_512px.png",
    },
    {
      name: "Groq",
      color: "#F55036",
      logo: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/groq.png",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 text-center relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-accent/5 blur-[100px] -z-10" />

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-text-muted font-bold mb-8 sm:mb-10 md:mb-12 px-4">
          Built with modern AI & web technologies
        </h3>

        <div className="relative mx-auto max-w-6xl">
          <InfiniteSlider
            gap={60}
            reverse={false}
            speed={15}
            speedOnHover={60}
            pauseOnHover={true}
          >
            {techStack.map((tech, index) => (
              <motion.div
                key={`${tech.name}-${index}`}
                whileHover={{
                  scale: 1.05,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="flex items-center gap-2 sm:gap-3 cursor-default select-none group"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 relative flex-shrink-0">
                  <img
                    src={tech.logo}
                    alt={tech.name}
                    className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-all duration-300"
                    style={{
                      filter: "brightness(0.9)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = `drop-shadow(0 0 10px ${tech.color})`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = "brightness(0.9)";
                    }}
                  />
                </div>
                <span
                  className="text-base sm:text-lg md:text-xl font-display font-bold text-text-secondary group-hover:text-text-primary whitespace-nowrap transition-colors duration-300"
                  style={{ transition: "color 0.3s ease" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = tech.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "";
                  }}
                >
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </InfiniteSlider>

          {/* Progressive Blur - Responsive widths */}
          <ProgressiveBlur
            blurIntensity={1}
            className="pointer-events-none absolute top-0 left-0 h-full w-[80px] sm:w-[120px] md:w-[160px]"
            direction="left"
          />
          <ProgressiveBlur
            blurIntensity={1}
            className="pointer-events-none absolute top-0 right-0 h-full w-[80px] sm:w-[120px] md:w-[160px]"
            direction="right"
          />
        </div>
      </motion.div>
    </section>
  );
}

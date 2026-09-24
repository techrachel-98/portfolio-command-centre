import { ScrollProgress } from "@/components/site/scroll-progress";
import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { CapabilityStrip } from "@/components/site/capability-strip";
import { TechMarquee } from "@/components/site/tech-marquee";
import { About } from "@/components/site/about";
import { Focus } from "@/components/site/focus";
import { Education } from "@/components/site/education";
import { Projects } from "@/components/site/projects";
import { GithubStats } from "@/components/site/github-stats";
import { Contact } from "@/components/site/contact";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { Footer } from "@/components/site/footer";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main id="top">
        <Hero />
        <CapabilityStrip />
        <TechMarquee />
        <About />
        <Focus />
        <Education />
        <Projects />
        <GithubStats />
        <Contact />
      </main>
      <WhatsAppFab />
      <Footer />
    </>
  );
}

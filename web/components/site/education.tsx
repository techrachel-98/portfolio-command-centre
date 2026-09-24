import { GraduationCap } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { getEducation, type CmsEducation } from "@/lib/supabase";

export const revalidate = 300;

// Fallback content — rendered whenever the database connector isn't configured
// (no env vars) or the API call fails for any reason, so the section never
// breaks or shows up empty.
const FALLBACK_EDUCATION: CmsEducation[] = [
  {
    title: "Certificate in Python Full Stack Development",
    institution: "ACTE Technologies",
    location: "Bangalore, India",
    tag: "Course",
  },
];

export async function Education() {
  const cmsEducation = await getEducation();
  const entries = cmsEducation && cmsEducation.length > 0 ? cmsEducation : FALLBACK_EDUCATION;

  return (
    <section id="education" className="py-[78px] lg:py-[116px] pt-0!">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-7">
        <Reveal>
          <p className="font-heading font-semibold text-[12.5px] tracking-[0.16em] uppercase text-purple mb-5 inline-flex items-center gap-2.5">
            <span className="w-[26px] h-px bg-purple opacity-50" />
            Education
          </p>
          <h2 className="font-heading font-bold text-[1.5rem] lg:text-2xl mb-8">
            Where the foundations were built
          </h2>
        </Reveal>

        <div className="grid gap-4">
          {entries.map((e, i) => (
            <Reveal key={e.title} delay={80 + i * 80}>
              <div className="flex items-center gap-5 flex-wrap sm:flex-nowrap bg-card border border-border rounded-[22px] px-6.5 py-5.5 transition-all hover:border-purple-line hover:-translate-y-1 hover:shadow-[0_2px_8px_rgba(0,0,0,.5),0_28px_60px_-20px_rgba(0,0,0,.7)]">
                <span className="shrink-0 w-12 h-12 rounded-xl bg-purple-wash border border-purple-line grid place-items-center text-purple">
                  <GraduationCap size={22} />
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[1.08rem] mb-1">{e.title}</h3>
                  <p className="text-text-soft text-[0.94rem] flex items-center gap-2 flex-wrap">
                    {e.institution}
                    <span className="w-[3px] h-[3px] rounded-full bg-text-faint" />
                    {e.location}
                  </p>
                </div>
                <span className="shrink-0 font-heading text-[11.5px] font-medium text-purple bg-purple-wash border border-purple-line px-2.5 py-1 rounded-full">
                  {e.tag}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

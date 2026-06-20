import { motion } from "framer-motion";
import { ArrowRight, Compass, ShieldCheck, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-sm bg-background/80 border-b border-foreground/5"
        role="navigation"
        aria-label="Main navigation"
      >
        <Logo variant="light" />
        <a
          href="mailto:Lesley.Hazleton@makeboldsolutions.com"
          className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Get in Touch
          <ArrowRight className="h-4 w-4" />
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[40rem] flex items-center justify-center pt-24" role="banner">
        <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          <svg
            viewBox="0 0 412 208"
            className="absolute -right-24 -bottom-24 w-[60rem] opacity-[0.06]"
          >
            <path fill="#982407" d="M287.64,207.95H0L236.35,24.05l51.3,183.9Z" />
            <path fill="#1E1E1E" d="M412,207.95H103.29L368.03,0l43.97,207.95Z" />
          </svg>
        </div>

        <div className="container relative z-10 px-4 md:px-6 text-center max-w-5xl mx-auto">
          <div
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold tracking-wider uppercase"
            role="status"
          >
            Launching Soon
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight mb-8 leading-[1.1]">
            Strong Foundations.<br />
            <span className="text-primary">Bold</span> Decisions.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-6 leading-relaxed">
            Make Bold Solutions provides fractional and interim CFO leadership to organizations navigating growth, change, and complexity. We partner with founders and leadership teams to build strong financial foundations, drive operational clarity, and support confident decision-making at critical moments.
          </p>
          <p className="text-base md:text-lg font-medium text-foreground/70 max-w-2xl mx-auto">
            Fractional CTO support is also available for teams aligning technology strategy with financial goals.
          </p>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-primary/50 to-transparent"></div>
        </motion.div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-4 md:px-6 bg-background relative" aria-labelledby="core-values">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <h2 id="core-values" className="text-3xl md:text-5xl font-display font-extrabold text-primary">
              Core Values
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed self-end">
              Our core values shape how we think, lead, and partner with our clients. Rooted in experience and accountability, they guide every decision we make.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <h3 className="text-primary font-semibold mb-3">Clarity Over Complexity</h3>
              <p className="text-muted-foreground leading-relaxed">
                We simplify the financial picture so leaders can act with confidence and focus on what matters most.
              </p>
            </div>
            <p className="text-2xl md:text-3xl font-display font-bold leading-snug">
              We encourage decisive leadership backed by disciplined analysis, experience, and accountability.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Financial Clarity",
                desc: "Senior-level financial leadership that simplifies complexity into a clear picture.",
              },
              {
                icon: Compass,
                title: "Confident Decisions",
                desc: "Disciplined analysis and experience that support bold decision-making at critical moments.",
              },
              {
                icon: ArrowRight,
                title: "Flexible Engagement",
                desc: "Fractional and interim leadership scaled to the moment—CFO-led, with CTO support available.",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Card className="glass-card border-foreground/10 hover:border-primary/40 transition-colors duration-300 h-full">
                  <CardContent className="flex flex-col items-start gap-4 p-6">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary">
                      <card.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2 font-display">{card.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="site-footer" className="py-16 bg-secondary text-secondary-foreground" role="contentinfo" aria-label="Site footer">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center">
          <Logo variant="dark" className="mb-6" />
          <p className="text-secondary-foreground/60 text-sm mb-8">
            &copy; {new Date().getFullYear()} Make Bold Solutions LLC. All rights reserved.
          </p>
          <a
            href="mailto:Lesley.Hazleton@makeboldsolutions.com"
            className="text-secondary-foreground/70 hover:text-primary transition-colors"
          >
            <Mail className="h-5 w-5" />
            <span className="sr-only">Email</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

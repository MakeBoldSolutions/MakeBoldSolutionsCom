import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, TrendingUp, ChevronRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import heroBg from "@assets/generated_images/abstract_modern_dark_corporate_background_with_geometric_lines.png";

export default function Home() {
  const { toast } = useToast();

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "You're on the list!",
      description: "We'll notify you when Make Bold Solutions launches.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Navigation Overlay */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center backdrop-blur-sm bg-background/50 border-b border-white/5" role="navigation" aria-label="Main navigation">
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-2xl font-display font-bold tracking-tight text-white">
              MAKE BOLD
            </span>
          </div>
          <div className="text-[10px] tracking-[0.34em] text-primary uppercase font-bold w-full text-right mt-0.5 pl-11">
            SOLUTIONS
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20" role="banner">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg}
            alt="Abstract Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
        </div>

        <div className="container relative z-10 px-4 md:px-6 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wider uppercase" role="status">
              Launching Soon
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-8 leading-[1.1]">
              Something <span className="text-gradient">Bold</span> <br /> Is Coming
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 font-light leading-relaxed">
              Executive-level CFO and CTO expertise for growing companies—without the full-time commitment.
            </p>

            <p className="text-lg md:text-xl font-display font-semibold text-primary/90 mb-10 tracking-wide">
              Strategic leadership. Flexible engagement. Real results.
            </p>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground/50"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-primary/50 to-transparent"></div>
        </motion.div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 px-4 md:px-6 bg-background relative" aria-labelledby="value-proposition">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 id="value-proposition" className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight">
                Scale Smarter, <br />
                <span className="text-primary">Not Harder.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Make Bold Solutions is launching soon with fractional financial and technology leadership designed for start-ups, high-growth companies, and businesses ready to scale smarter.
              </p>
              <ul className="space-y-4">
                {[
                  "Strategic leadership aligned with your goals",
                  "Flexible engagement models that scale with you",
                  "Technical and financial roadmaps that deliver results"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground/90">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-6">
              {[
                {
                  icon: ShieldCheck,
                  title: "Strategic Leadership",
                  desc: "Senior-level guidance without the C-suite overhead."
                },
                {
                  icon: TrendingUp,
                  title: "Real Results",
                  desc: "Strategic, data-driven solutions that drive growth."
                },
                {
                  icon: Zap,
                  title: "Flexible Engagement",
                  desc: "On-demand expertise tailored to your needs."
                }
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                >
                  <Card className="glass-card border-white/5 hover:border-primary/30 transition-colors duration-300">
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="mt-1 bg-primary/10 p-3 rounded-lg text-primary">
                        <card.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 font-display">{card.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {card.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black/20" role="contentinfo" aria-label="Site footer">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="text-xl font-display font-bold tracking-tighter mb-4">
            MAKE <span className="text-primary">BOLD</span> SOLUTIONS
          </div>
          <p className="text-muted-foreground text-sm mb-8">
            © {new Date().getFullYear()} Make Bold Solutions. All rights reserved.
          </p>
          <div className="flex justify-center gap-6">
            <a href="mailto:Lesley.Hazleton@makeboldsolutions.com" className="text-muted-foreground hover:text-primary transition-colors">
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

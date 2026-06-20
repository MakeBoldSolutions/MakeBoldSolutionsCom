type LogoVariant = "light" | "red" | "dark";

const VARIANT_COLORS: Record<LogoVariant, { peakLeft: string; peakRight: string; make: string; bold: string; sub: string }> = {
  light: { peakLeft: "#982407", peakRight: "#1E1E1E", make: "#982407", bold: "#1E1E1E", sub: "#787878" },
  red: { peakLeft: "#F8F6F2", peakRight: "#1E1E1E", make: "#F8F6F2", bold: "#F8F6F2", sub: "#F8F6F2" },
  dark: { peakLeft: "#F8F6F2", peakRight: "#982407", make: "#F8F6F2", bold: "#982407", sub: "#F8F6F2" },
};

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  markClassName?: string;
}

export function Logo({ variant = "light", className = "", markClassName = "h-9 w-auto" }: LogoProps) {
  const colors = VARIANT_COLORS[variant];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 412 208" className={markClassName} aria-hidden="true">
        <path fill={colors.peakLeft} d="M287.64,207.95H0L236.35,24.05l51.3,183.9Z" />
        <path fill={colors.peakRight} d="M412,207.95H103.29L368.03,0l43.97,207.95Z" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="font-display font-extrabold text-xl tracking-tight">
          <span style={{ color: colors.make }}>Make</span>
          <span style={{ color: colors.bold }}>Bold</span>
        </span>
        <span
          className="text-[10px] font-medium tracking-[0.3em] uppercase mt-0.5"
          style={{ color: colors.sub }}
        >
          Solutions
        </span>
      </div>
    </div>
  );
}

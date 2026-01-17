import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        gaming: ['Orbitron', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Gaming specific colors
        crimson: {
          DEFAULT: "hsl(var(--crimson))",
          dark: "hsl(var(--crimson-dark))",
          glow: "hsl(var(--crimson-glow))",
        },
        gold: "hsl(var(--gold))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(0 85% 55% / 0.3)" },
          "50%": { boxShadow: "0 0 40px hsl(0 85% 55% / 0.6)" },
        },
        "border-glow": {
          "0%, 100%": { borderColor: "hsl(0 85% 55% / 0.3)" },
          "50%": { borderColor: "hsl(0 85% 55% / 0.8)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 20px hsl(0 85% 55% / 0.4), inset 0 0 20px hsl(0 85% 55% / 0.1)"
          },
          "50%": { 
            boxShadow: "0 0 40px hsl(0 85% 55% / 0.6), inset 0 0 30px hsl(0 85% 55% / 0.2)"
          },
        },
        "fire-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 20px hsl(0 85% 55% / 0.5), 0 0 40px hsl(25 100% 50% / 0.3)"
          },
          "50%": { 
            boxShadow: "0 0 30px hsl(25 100% 50% / 0.6), 0 0 60px hsl(45 100% 50% / 0.4)"
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "border-glow": "border-glow 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "fire-glow": "fire-glow 2s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-gaming": "linear-gradient(135deg, hsl(0 85% 55%) 0%, hsl(0 70% 40%) 100%)",
        "gradient-gold": "linear-gradient(135deg, hsl(45 100% 50%) 0%, hsl(30 100% 45%) 100%)",
        "gradient-fire": "linear-gradient(135deg, hsl(0 85% 55%) 0%, hsl(25 100% 50%) 50%, hsl(45 100% 50%) 100%)",
        "gradient-card": "linear-gradient(145deg, hsl(0 0% 9%) 0%, hsl(0 0% 5%) 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

"use client";

import { Box, Typography, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../Button";
import { Breadcrumb } from "../Breadcrumb";
import type { BreadcrumbItem } from "../Breadcrumb";
import PageHeaderBg from "@/assets/image/jpg/pageHeader.jpg";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeIcon?: ReactNode;
  illustration?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  showDecorLine?: boolean;
  showWave?: boolean;
  showDotGrid?: boolean;
  showBgImage?: boolean;
  sx?: SxProps<Theme>;
  titleSx?: SxProps<Theme>;
  subtitleSx?: SxProps<Theme>;
}

const FloatingParticles = () => (
  <>
    {[...Array(6)].map((_, i) => (
      <Box
        key={i}
        aria-hidden
        sx={{
          position: "absolute",
          width: 4 + i * 2,
          height: 4 + i * 2,
          borderRadius: "50%",
          bgcolor: i % 2 === 0 ? "#60A5FA" : "#93C5FD",
          opacity: 0.6,
          left: `${15 + i * 12}%`,
          top: `${20 + (i % 3) * 25}%`,
          animation: `floatParticle${i} ${3 + i * 0.5}s ease-in-out infinite`,
          animationDelay: `${i * 0.3}s`,
          "@keyframes floatParticle0": {
            "0%, 100%": { transform: "translateY(0) scale(1)", opacity: 0.4 },
            "50%": { transform: "translateY(-15px) scale(1.2)", opacity: 0.8 },
          },
          "@keyframes floatParticle1": {
            "0%, 100%": { transform: "translateY(0) scale(1)", opacity: 0.5 },
            "50%": { transform: "translateY(-20px) scale(1.3)", opacity: 0.9 },
          },
          "@keyframes floatParticle2": {
            "0%, 100%": { transform: "translateY(0) scale(1)", opacity: 0.3 },
            "50%": { transform: "translateY(-12px) scale(1.1)", opacity: 0.7 },
          },
          "@keyframes floatParticle3": {
            "0%, 100%": { transform: "translateY(0) scale(1)", opacity: 0.6 },
            "50%": {
              transform: "translateY(-18px) scale(1.25)",
              opacity: 0.85,
            },
          },
          "@keyframes floatParticle4": {
            "0%, 100%": { transform: "translateY(0) scale(1)", opacity: 0.4 },
            "50%": {
              transform: "translateY(-10px) scale(1.15)",
              opacity: 0.75,
            },
          },
          "@keyframes floatParticle5": {
            "0%, 100%": { transform: "translateY(0) scale(1)", opacity: 0.5 },
            "50%": { transform: "translateY(-22px) scale(1.35)", opacity: 0.9 },
          },
        }}
      />
    ))}
  </>
);

const LightRays = () => (
  <Box
    aria-hidden
    sx={{
      position: "absolute",
      top: "-50%",
      right: "-20%",
      width: "80%",
      height: "200%",
      pointerEvents: "none",
      zIndex: 0,
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "200%",
        height: "200%",
        background:
          "conic-gradient(from 0deg, transparent 0deg, rgba(147,197,253,0.12) 30deg, transparent 60deg, rgba(191,219,254,0.1) 90deg, transparent 120deg)",
        transform: "translate(-50%, -50%)",
        animation: "rotateRay 30s linear infinite",
      },
      "@keyframes rotateRay": {
        from: { transform: "translate(-50%, -50%) rotate(0deg)" },
        to: { transform: "translate(-50%, -50%) rotate(360deg)" },
      },
    }}
  />
);

const GradientOrb = ({
  top,
  right,
  size,
  color,
  delay,
}: {
  top: string;
  right: string;
  size: number;
  color: string;
  delay: string;
}) => (
  <Box
    aria-hidden
    sx={{
      position: "absolute",
      top,
      right,
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle at 30% 30%, ${color} 0%, transparent 70%)`,
      opacity: 0.15,
      animation: `pulseOrb 4s ease-in-out infinite`,
      animationDelay: delay,
      filter: "blur(20px)",
      zIndex: 0,
      "@keyframes pulseOrb": {
        "0%, 100%": { transform: "scale(1)", opacity: 0.15 },
        "50%": { transform: "scale(1.3)", opacity: 0.25 },
      },
    }}
  />
);

const GeometricShapes = () => (
  <>
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        top: 30,
        right: 200,
        width: 0,
        height: 0,
        borderLeft: "8px solid transparent",
        borderRight: "8px solid transparent",
        borderBottom: "14px solid rgba(147,197,253,0.35)",
        animation: "floatShape 5s ease-in-out infinite",
        "@keyframes floatShape": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(10deg)" },
        },
      }}
    />
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        bottom: 40,
        right: 180,
        width: 12,
        height: 12,
        border: "2px solid rgba(129,140,248,0.3)",
        borderRadius: "2px",
        transform: "rotate(45deg)",
        animation: "rotateShape 8s linear infinite",
        "@keyframes rotateShape": {
          from: { transform: "rotate(45deg)" },
          to: { transform: "rotate(405deg)" },
        },
      }}
    />
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        top: 60,
        right: 250,
        width: 6,
        height: 6,
        bgcolor: "rgba(199,210,254,0.4)",
        borderRadius: "50%",
        animation: "pingDot 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "@keyframes pingDot": {
          "0%": { transform: "scale(1)", opacity: 1 },
          "100%": { transform: "scale(2.5)", opacity: 0 },
        },
      }}
    />
  </>
);

const SparkleEffect = () => (
  <>
    {[...Array(4)].map((_, i) => (
      <Box
        key={i}
        aria-hidden
        sx={{
          position: "absolute",
          width: 2,
          height: 2,
          bgcolor: "#fff",
          borderRadius: "50%",
          right: `${30 + i * 15}%`,
          top: `${25 + (i % 2) * 30}%`,
          animation: `sparkle${i} 2s ease-in-out infinite`,
          boxShadow: "0 0 6px 2px rgba(255,255,255,0.8)",
          "@keyframes sparkle0": {
            "0%, 100%": { opacity: 0, transform: "scale(0)" },
            "50%": { opacity: 1, transform: "scale(1)" },
          },
          "@keyframes sparkle1": {
            "0%, 100%": { opacity: 0, transform: "scale(0)" },
            "50%": { opacity: 0.8, transform: "scale(1.2)" },
          },
          "@keyframes sparkle2": {
            "0%, 100%": { opacity: 0, transform: "scale(0)" },
            "50%": { opacity: 1, transform: "scale(0.8)" },
          },
          "@keyframes sparkle3": {
            "0%, 100%": { opacity: 0, transform: "scale(0)" },
            "50%": { opacity: 0.6, transform: "scale(1.5)" },
          },
        }}
      />
    ))}
  </>
);

const DotGrid = () => (
  <Box
    aria-hidden
    sx={{
      position: "absolute",
      top: 20,
      left: 20,
      width: 80,
      height: 60,
      backgroundImage:
        "radial-gradient(circle, rgba(147,197,253,0.8) 1.8px, transparent 1.8px)",
      backgroundSize: "12px 12px",
      pointerEvents: "none",
      zIndex: 1,
      animation: "dotGridPulse 4s ease-in-out infinite",
      "@keyframes dotGridPulse": {
        "0%, 100%": { opacity: 0.6 },
        "50%": { opacity: 1 },
      },
    }}
  />
);

const DecorativeDots = () => (
  <>
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        top: 45,
        right: 120,
        width: 8,
        height: 8,
        borderRadius: "50%",
        bgcolor: "#3B82F6",
        animation: "pulseDot1 2s ease-in-out infinite",
        boxShadow: "0 0 12px rgba(37,99,235,0.6)",
        zIndex: 1,
        "@keyframes pulseDot1": {
          "0%, 100%": {
            opacity: 1,
            boxShadow: "0 0 12px rgba(99,102,241,0.6)",
            transform: "scale(1)",
          },
          "50%": {
            opacity: 0.7,
            boxShadow: "0 0 20px rgba(99,102,241,0.9)",
            transform: "scale(1.2)",
          },
        },
      }}
    />
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        bottom: 35,
        right: 75,
        width: 6,
        height: 6,
        borderRadius: "50%",
        bgcolor: "#93C5FD",
        animation: "pulseDot2 2.5s ease-in-out infinite",
        boxShadow: "0 0 8px rgba(147,197,253,0.6)",
        zIndex: 1,
        "@keyframes pulseDot2": {
          "0%, 100%": {
            opacity: 1,
            boxShadow: "0 0 8px rgba(165,180,252,0.6)",
          },
          "50%": { opacity: 0.6, boxShadow: "0 0 14px rgba(165,180,252,0.9)" },
        },
      }}
    />
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        top: 80,
        right: 60,
        width: 5,
        height: 5,
        borderRadius: "50%",
        bgcolor: "#60A5FA",
        animation: "pulseDot3 3s ease-in-out infinite",
        zIndex: 1,
        "@keyframes pulseDot3": {
          "0%, 100%": { opacity: 0.8 },
          "50%": { opacity: 1 },
        },
      }}
    />
  </>
);

const WaveBackground = () => (
  <Box
    aria-hidden
    sx={{
      position: "absolute",
      top: 0,
      right: 0,
      width: { xs: "70%", md: "50%" },
      height: "100%",
      pointerEvents: "none",
      zIndex: 0,
      overflow: "hidden",
    }}
  >
    <svg
      viewBox="0 0 600 200"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: "100%",
        height: "100%",
        animation: "waveShift 6s ease-in-out infinite",
      }}
    >
      <style>
        {`
          @keyframes waveShift {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(10px); }
          }
        `}
      </style>
      <defs>
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path
        d="M 0 60 Q 80 30 160 70 T 320 70 T 480 55 T 600 80 L 600 0 L 0 0 Z"
        fill="url(#waveGrad)"
      />
      <path
        d="M 0 140 Q 100 110 200 150 T 400 140 T 600 160 L 600 200 L 0 200 Z"
        fill="url(#waveGrad)"
        opacity="0.7"
      />
    </svg>
  </Box>
);

const ShimmerBadge = ({ children }: { children: ReactNode }) => (
  <Box
    sx={{
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      gap: 0.75,
      bgcolor: "#EFF6FF",
      color: "#2563EB",
      px: 2,
      py: 0.75,
      borderRadius: 1.5,
      fontSize: "0.75rem",
      fontWeight: 700,
      letterSpacing: 0.75,
      textTransform: "uppercase",
      alignSelf: "flex-start",
      width: "fit-content",
      animation: "fadeInBadge 0.5s ease-out",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: "-100%",
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        animation: "shimmer 3s ease-in-out infinite",
      },
      "@keyframes fadeInBadge": {
        from: { opacity: 0, transform: "translateY(10px)" },
        to: { opacity: 1, transform: "translateY(0)" },
      },
      "@keyframes shimmer": {
        "0%": { left: "-100%" },
        "50%, 100%": { left: "100%" },
      },
    }}
  >
    {children}
  </Box>
);

export function PageHeader({
  title,
  subtitle,
  badge,
  badgeIcon,
  illustration,
  breadcrumbs,
  actions,
  showBackButton = false,
  onBack,
  showDecorLine = true,
  showWave = true,
  showDotGrid = true,
  showBgImage = false,
  sx,
  titleSx,
  subtitleSx,
}: PageHeaderProps) {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        p: { xs: 3, md: 4 },
        borderRadius: 3,
        overflow: "hidden",
        background: `
          radial-gradient(ellipse at 20% 80%, rgba(147,197,253,0.4) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(191,219,254,0.6) 0%, transparent 50%),
          linear-gradient(135deg, rgba(219,234,254,0.5) 0%, rgba(191,219,254,0.3) 100%)
        `,
        border: "1px solid rgba(37,99,235,0.25)",
        boxShadow:
          "0 10px 40px rgba(59,130,246,0.15), 0 4px 12px rgba(59,130,246,0.1), 0 0 0 1px rgba(255,255,255,0.5) inset",
        minHeight: 180,
        ...sx,
        marginBottom: 3,
        "& .header-bg-image": {
          position: "absolute",
          right: 0,
          top: 0,
          width: "55%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "right center",
          maskImage: "linear-gradient(to left, black 60%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to left, black 60%, transparent 100%)",
        },
      }}
    >
      {showBgImage && (
        <>
          <Box
            component="img"
            src={PageHeaderBg.src}
            className="header-bg-image"
            alt=""
          />
          <Box
            sx={{
              position: "absolute",
              right: "70%",
              top: 0,
              width: "15%",
              height: "100%",
              background:
                "linear-gradient(to right, transparent 0%, rgba(219,234,254,0.7) 50%, rgba(219,234,254,0.95) 100%)",
              zIndex: 1,
            }}
          />
        </>
      )}
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInLeft {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes rotateRing {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes titleGlow {
            0%, 100% { text-shadow: 0 0 20px rgba(59,130,246,0); }
            50% { text-shadow: 0 0 30px rgba(59,130,246,0.15); }
          }
          @keyframes borderPulse {
            0%, 100% { borderColor: rgba(199,210,254,0.3); }
            50% { borderColor: rgba(199,210,254,0.6); }
          }
        `}
      </style>

      <FloatingParticles />
      <LightRays />
      <GradientOrb top="10%" right="5%" size={120} color="#6366F1" delay="0s" />
      <GradientOrb top="50%" right="30%" size={80} color="#A5B4FC" delay="1s" />
      <GradientOrb top="70%" right="10%" size={60} color="#818CF8" delay="2s" />
      <GeometricShapes />
      <SparkleEffect />

      {showDotGrid && <DotGrid />}
      {showWave && <WaveBackground />}
      <DecorativeDots />

      {breadcrumbs && breadcrumbs.length > 0 && (
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            animation: "fadeInLeft 0.5s ease-out",
          }}
        >
          <Breadcrumb items={breadcrumbs} />
        </Box>
      )}

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          gap: { xs: 3, md: 4 },
          flexWrap: "wrap",
        }}
      >
        {illustration && (
          <Box
            sx={{
              position: "relative",
              flexShrink: 0,
              width: { xs: 130, md: 160 },
              height: { xs: 130, md: 160 },
              animation: "float 4s ease-in-out infinite",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 35% 30%, rgba(255,255,255,1) 0%, rgba(238,242,255,0.95) 20%, rgba(199,210,254,0.7) 60%, rgba(165,180,252,0.5) 100%)",
                boxShadow: `
                  0 20px 50px rgba(59,130,246,0.25),
                  0 8px 20px rgba(59,130,246,0.15),
                  inset 0 2px 4px rgba(255,255,255,1),
                  inset 0 -4px 8px rgba(147,197,253,0.3)
                `,
                border: "1px solid rgba(255,255,255,0.8)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 8,
                borderRadius: "50%",
                border: "2px solid rgba(59,130,246,0.5)",
                animation: "rotateRing 20s linear infinite",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: -4,
                borderRadius: "50%",
                border: "1px dashed rgba(59,130,246,0.3)",
                animation: "rotateRing 15s linear infinite reverse",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 16,
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: "#3B82F6",
                animation: "pulseDot1 2s ease-in-out infinite",
                boxShadow: "0 0 12px rgba(59,130,246,0.7)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 20,
                left: 6,
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#93C5FD",
                animation: "pulseDot2 2.5s ease-in-out infinite",
                boxShadow: "0 0 8px rgba(147,197,253,0.6)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#2563EB",
                filter: `drop-shadow(0 2px 4px rgba(79,70,229,0.2))`,
                zIndex: 1,
              }}
            >
              {illustration}
            </Box>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            flex: 1,
            minWidth: 0,
          }}
        >
          {showBackButton && (
            <Button
              variant="text"
              size="small"
              onClick={onBack}
              sx={{
                minWidth: "auto",
                px: 1,
                alignSelf: "flex-start",
                color: "#2563EB",
                animation: "fadeInUp 0.4s ease-out",
                "&:hover": {
                  color: "#2563EB",
                  bgcolor: "rgba(59,130,246,0.1)",
                },
              }}
              aria-label="Quay lại"
            >
              <ArrowLeft size={20} />
            </Button>
          )}

          {badge && (
            <ShimmerBadge>
              {badgeIcon && (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    color: "#4F46E5",
                  }}
                >
                  {badgeIcon}
                </Box>
              )}
              {badge}
            </ShimmerBadge>
          )}

          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "#2563EB",
              fontSize: { xs: "1.875rem", md: "2.5rem" },
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
              animation:
                "fadeInUp 0.6s ease-out, titleGlow 4s ease-in-out infinite",
              ...titleSx,
              "html[data-theme='dark'] &": {
                color: "#FFFFFF",
              },
            }}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              variant="body1"
              sx={{
                color: "#2563EB",
                fontSize: "1rem",
                lineHeight: 1.6,
                animation: "fadeInUp 0.7s ease-out",
                ...subtitleSx,
              }}
            >
              {subtitle}
            </Typography>
          )}

          {showDecorLine && (
            <Box
              sx={{
                position: "relative",
                mt: 1,
                height: 4,
                width: 80,
                animation: "scaleIn 0.8s ease-out",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: "65%",
                  background:
                    "linear-gradient(90deg, #6366F1 0%, #818CF8 100%)",
                  borderRadius: 2,
                  boxShadow: "0 0 10px rgba(16,185,129,0.5)",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  left: "68%",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: "#6366F1",
                  boxShadow: "0 0 8px rgba(99,102,241,0.8)",
                  animation: "pulseDot1 2s ease-in-out infinite",
                },
              }}
            />
          )}
        </Box>

        {actions && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexShrink: 0,
              flexWrap: "wrap",
              ml: "auto",
              animation: "fadeInUp 0.6s ease-out",
            }}
          >
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  );
}

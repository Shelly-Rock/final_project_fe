"use client";

import { useState, useCallback } from "react";
import { Box, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselItem {
  id: string;
  content: React.ReactNode;
}

export interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  loop?: boolean;
  height?: number | string;
}

export function Carousel({
  items,
  autoPlay = false,
  interval = 3000,
  showDots = true,
  showArrows = true,
  loop = true,
  height = 300,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev === items.length - 1) {
        return loop ? 0 : prev;
      }
      return prev + 1;
    });
  }, [items.length, loop]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev === 0) {
        return loop ? items.length - 1 : prev;
      }
      return prev - 1;
    });
  }, [items.length, loop]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height,
        overflow: "hidden",
        borderRadius: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: "100%",
          transition: "transform 0.5s ease-in-out",
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {items.map((item) => (
          <Box
            key={item.id}
            sx={{
              minWidth: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {item.content}
          </Box>
        ))}
      </Box>

      {showArrows && (
        <>
          <IconButton
            onClick={goToPrev}
            sx={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.9)",
              "&:hover": { bgcolor: "rgba(255,255,255,1)" },
            }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={goToNext}
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.9)",
              "&:hover": { bgcolor: "rgba(255,255,255,1)" },
            }}
          >
            <ChevronRight />
          </IconButton>
        </>
      )}

      {showDots && (
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 1,
          }}
        >
          {items.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToSlide(index)}
              sx={{
                width: currentIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                bgcolor:
                  currentIndex === index
                    ? "primary.main"
                    : "rgba(255,255,255,0.5)",
                cursor: "pointer",
                transition: "all 0.3s",
                "&:hover": { bgcolor: "primary.light" },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

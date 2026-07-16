import type { Meta, StoryObj } from "@storybook/react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { Carousel } from "./Carousel";

const meta = {
  title: "Shared/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Carousel>;

export default meta;

const slideColors = ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe"];

export const BasicCarousel: StoryObj = {
  render: () => (
    <Carousel
      items={[
        {
          id: "1",
          content: (
            <Box
              sx={{
                bgcolor: "#667eea",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" sx={{ color: "#fff" }}>
                Slide 1
              </Typography>
            </Box>
          ),
        },
        {
          id: "2",
          content: (
            <Box
              sx={{
                bgcolor: "#764ba2",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" sx={{ color: "#fff" }}>
                Slide 2
              </Typography>
            </Box>
          ),
        },
        {
          id: "3",
          content: (
            <Box
              sx={{
                bgcolor: "#f093fb",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" sx={{ color: "#fff" }}>
                Slide 3
              </Typography>
            </Box>
          ),
        },
      ]}
      height={250}
    />
  ),
};

export const CarouselWithCards: StoryObj = {
  render: () => (
    <Carousel
      items={[
        {
          id: "1",
          content: (
            <Card sx={{ width: "80%", height: 200 }}>
              <CardContent>
                <Typography variant="h5">Tin tức 1</Typography>
                <Typography variant="body2" color="text.secondary">
                  Nội dung tin tức đầu tiên
                </Typography>
              </CardContent>
            </Card>
          ),
        },
        {
          id: "2",
          content: (
            <Card sx={{ width: "80%", height: 200 }}>
              <CardContent>
                <Typography variant="h5">Tin tức 2</Typography>
                <Typography variant="body2" color="text.secondary">
                  Nội dung tin tức thứ hai
                </Typography>
              </CardContent>
            </Card>
          ),
        },
        {
          id: "3",
          content: (
            <Card sx={{ width: "80%", height: 200 }}>
              <CardContent>
                <Typography variant="h5">Tin tức 3</Typography>
                <Typography variant="body2" color="text.secondary">
                  Nội dung tin tức thứ ba
                </Typography>
              </CardContent>
            </Card>
          ),
        },
      ]}
      height={280}
    />
  ),
};

export const CarouselWithoutArrows: StoryObj = {
  render: () => (
    <Carousel
      items={slideColors.map((color, i) => ({
        id: String(i),
        content: (
          <Box
            sx={{
              bgcolor: color,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" sx={{ color: "#fff" }}>
              Slide {i + 1}
            </Typography>
          </Box>
        ),
      }))}
      height={200}
      showArrows={false}
    />
  ),
};

export const CarouselWithoutDots: StoryObj = {
  render: () => (
    <Carousel
      items={slideColors.map((color, i) => ({
        id: String(i),
        content: (
          <Box
            sx={{
              bgcolor: color,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" sx={{ color: "#fff" }}>
              Slide {i + 1}
            </Typography>
          </Box>
        ),
      }))}
      height={200}
      showDots={false}
    />
  ),
};

export const CarouselNoLoop: StoryObj = {
  render: () => (
    <Carousel
      items={[
        {
          id: "1",
          content: (
            <Box
              sx={{
                bgcolor: "#667eea",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" sx={{ color: "#fff" }}>
                Slide 1
              </Typography>
            </Box>
          ),
        },
        {
          id: "2",
          content: (
            <Box
              sx={{
                bgcolor: "#764ba2",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" sx={{ color: "#fff" }}>
                Slide 2
              </Typography>
            </Box>
          ),
        },
        {
          id: "3",
          content: (
            <Box
              sx={{
                bgcolor: "#f093fb",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" sx={{ color: "#fff" }}>
                Slide 3
              </Typography>
            </Box>
          ),
        },
      ]}
      height={200}
      loop={false}
    />
  ),
};

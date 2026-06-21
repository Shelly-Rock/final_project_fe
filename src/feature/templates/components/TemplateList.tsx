"use client";

import React from "react";
import { Box, Grid, Typography, Chip, Stack, Card, CardContent } from "@mui/material";
import type { TemplateItem, StageType, CategoryType } from "../types";
import { stageConfig, categoryConfig } from "../types";
import { TemplateCard } from "./TemplateCard";

interface TemplateListProps {
  templates: TemplateItem[];
  groupByStage?: boolean;
  onView?: (template: TemplateItem) => void;
  onDownload?: (template: TemplateItem, lang: "vi" | "en") => void;
}

export function TemplateList({
  templates,
  groupByStage = false,
  onView,
  onDownload,
}: TemplateListProps) {
  if (groupByStage) {
    const groupedByStage: Record<StageType, TemplateItem[]> = {
      preparation: [],
      assignment: [],
      execution: [],
      evaluation: [],
    };

    templates.forEach((t) => {
      groupedByStage[t.stage].push(t);
    });

    const stageOrder: StageType[] = ["preparation", "assignment", "execution", "evaluation"];

    return (
      <Box>
        {stageOrder.map((stage) => {
          const stageTemplates = groupedByStage[stage];
          if (stageTemplates.length === 0) return null;

          return (
            <Box key={stage} sx={{ mb: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Chip
                  label={stageConfig[stage].label}
                  color={stageConfig[stage].color as any}
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  ({stageTemplates.length} biểu mẫu)
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                {stageTemplates.map((template) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={template.id}>
                    <TemplateCard
                      template={template}
                      onView={onView}
                      onDownload={onDownload}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          );
        })}
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {templates.map((template) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={template.id}>
          <TemplateCard
            template={template}
            onView={onView}
            onDownload={onDownload}
          />
        </Grid>
      ))}
    </Grid>
  );
}

interface TemplateStatsProps {
  templates: TemplateItem[];
  selectedCategory?: CategoryType;
  selectedStage?: StageType | "all";
  onStageClick?: (stage: StageType) => void;
}

export function TemplateStats({
  templates,
  selectedCategory,
  selectedStage,
  onStageClick,
}: TemplateStatsProps) {
  const stageOrder: StageType[] = ["preparation", "assignment", "execution", "evaluation"];

  const stageCounts = stageOrder.reduce(
    (acc, stage) => {
      acc[stage] = templates.filter((t) => t.stage === stage).length;
      return acc;
    },
    {} as Record<StageType, number>
  );

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ py: 2 }}>
        <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 1 }}>
          {stageOrder.map((stage) => {
            const isActive = selectedStage === stage;
            return (
              <Card
                key={stage}
                sx={{
                  minWidth: 120,
                  textAlign: "center",
                  cursor: "pointer",
                  borderColor: isActive ? `${stageConfig[stage].color}.main` : undefined,
                  bgcolor: isActive ? `${stageConfig[stage].color}.50` : undefined,
                  transition: "all 0.2s",
                }}
                variant="outlined"
                onClick={() => onStageClick?.(stage)}
              >
                <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Chip
                    label={stageConfig[stage].label}
                    color={stageConfig[stage].color as any}
                    size="small"
                    sx={{ mb: 0.5 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {stageCounts[stage]}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}

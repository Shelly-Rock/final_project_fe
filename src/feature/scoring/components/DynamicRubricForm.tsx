import React from "react";
import {
  Box,
  Typography,
  TextField,
  Divider,
  Paper,
  Chip,
} from "@mui/material";
import {
  RubricSchema,
  RubricCategory,
  RubricCriteria,
  RubricSection,
} from "../services/rubrics.constant";

interface DynamicRubricFormProps {
  schema: RubricSchema;
  criteriaScores: Record<string, number>;
  setCriteriaScores: (scores: Record<string, number>) => void;
  readOnly?: boolean;
}

export default function DynamicRubricForm({
  schema,
  criteriaScores,
  setCriteriaScores,
  readOnly = false,
}: DynamicRubricFormProps) {
  const handleScoreChange = (criteriaId: string, value: string) => {
    if (readOnly) return;
    const num = parseFloat(value);
    setCriteriaScores({
      ...criteriaScores,
      [criteriaId]: isNaN(num) ? 0 : num,
    });
  };

  const calculateCategoryScore = (category: RubricCategory) => {
    let sum = 0;
    category.criteria.forEach((c) => {
      sum += criteriaScores[c.id] || 0;
    });
    const avg =
      category.criteria.length > 0 ? sum / category.criteria.length : 0;
    return avg * category.weight;
  };

  const calculateSectionScore = (section: RubricSection) => {
    let sum = 0;
    section.categories.forEach((cat) => {
      sum += calculateCategoryScore(cat);
    });
    return sum; // Max 10
  };

  const calculateGrandTotal = () => {
    const scoreA = schema.sections.find((s) => s.id === "A")
      ? calculateSectionScore(schema.sections.find((s) => s.id === "A")!)
      : 0;
    const scoreB = schema.sections.find((s) => s.id === "B")
      ? calculateSectionScore(schema.sections.find((s) => s.id === "B")!)
      : 0;

    return (
      scoreA * schema.grandTotalFormula.sectionAWeight +
      scoreB * schema.grandTotalFormula.sectionBWeight
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 1,
          textAlign: "center",
          color: "primary.main",
        }}
      >
        {schema.name}
      </Typography>

      {schema.sections.map((section) => {
        const sectionScore = calculateSectionScore(section);
        return (
          <Paper
            key={section.id}
            sx={{
              mb: 4,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
            }}
            elevation={0}
          >
            <Box
              sx={{
                bgcolor: "grey.100",
                p: 1.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {section.title}
              </Typography>
              <Chip
                label={`Điểm phần này: ${sectionScore.toFixed(2)}/10`}
                color="primary"
                size="small"
                sx={{ fontWeight: "bold" }}
              />
            </Box>

            <Box sx={{ p: 2 }}>
              {section.categories.map((cat, index) => (
                <Box
                  key={cat.id}
                  sx={{ mb: index < section.categories.length - 1 ? 3 : 0 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: "text.primary" }}
                    >
                      {cat.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 600 }}
                    >
                      Tạm tính: {calculateCategoryScore(cat).toFixed(2)}
                    </Typography>
                  </Box>

                  {cat.criteria.map((criteria) => (
                    <Box
                      key={criteria.id}
                      sx={{
                        display: "flex",
                        gap: 2,
                        mb: 2,
                        alignItems: "flex-start",
                        pl: 2,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, mb: 0.5 }}
                        >
                          {criteria.title}
                        </Typography>
                        {criteria.description && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", fontStyle: "italic" }}
                          >
                            {criteria.description}
                          </Typography>
                        )}
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <TextField
                          type="number"
                          inputProps={{ min: 0, max: 10, step: 0.5 }}
                          value={criteriaScores[criteria.id] ?? ""}
                          onChange={(e) =>
                            handleScoreChange(criteria.id, e.target.value)
                          }
                          disabled={readOnly}
                          sx={{ width: 80 }}
                          size="small"
                          placeholder="0-10"
                        />
                        <Typography variant="body2" color="text.secondary">
                          /10
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  {index < section.categories.length - 1 && (
                    <Divider sx={{ my: 2 }} />
                  )}
                </Box>
              ))}
            </Box>
          </Paper>
        );
      })}

      <Paper
        sx={{
          p: 2,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          TỔNG ĐIỂM
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {calculateGrandTotal().toFixed(2)}/10
        </Typography>
      </Paper>
    </Box>
  );
}

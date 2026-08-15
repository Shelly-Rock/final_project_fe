import type { Meta } from "@storybook/react";
import { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Paper,
  Chip,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import * as TextUtils from "@/shared/utils/text.utils";

const meta = {
  title: "Shared/Utils/Text Utils",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

export const CaseConversion: React.FC = () => {
  const [input, setInput] = useState("Hello World Example");

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 600 }}
    >
      <Typography variant="h5">Case Conversion</Typography>

      <TextField
        label="Input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        fullWidth
        size="small"
      />

      <Grid container spacing={2}>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              toCamelCase
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
              {TextUtils.toCamelCase(input)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              toPascalCase
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
              {TextUtils.toPascalCase(input)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              toSnakeCase
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
              {TextUtils.toSnakeCase(input)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              toKebabCase
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
              {TextUtils.toKebabCase(input)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              toConstantCase
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
              {TextUtils.toConstantCase(input)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              capitalize
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
              {TextUtils.capitalize(input)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              capitalizeWords
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
              {TextUtils.capitalizeWords(input)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export const Truncation: React.FC = () => {
  const [input, setInput] = useState(
    "Đây là một đoạn văn bản dài cần được cắt ngắn lại",
  );

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 600 }}
    >
      <Typography variant="h5">Truncation</Typography>

      <TextField
        label="Input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        fullWidth
        multiline
        rows={2}
        size="small"
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              truncate (20 chars)
            </Typography>
            <Typography variant="body2">
              "{TextUtils.truncate(input, 20)}"
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              truncateMiddle (20 chars)
            </Typography>
            <Typography variant="body2">
              "{TextUtils.truncateMiddle(input, 20)}"
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              truncateWords (5 words)
            </Typography>
            <Typography variant="body2">
              "{TextUtils.truncateWords(input, 5)}"
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              removeWhitespace
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
              "{TextUtils.removeWhitespace(input)}"
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export const Validation: React.FC = () => {
  const [input, setInput] = useState("");

  const testCases = [
    { label: "isEmpty", fn: () => TextUtils.isEmpty(input) },
    { label: "isEmail", fn: () => TextUtils.isEmail(input) },
    { label: "isUrl", fn: () => TextUtils.isUrl(input) },
    { label: "isNumeric", fn: () => TextUtils.isNumeric(input) },
    { label: "isAlpha", fn: () => TextUtils.isAlpha(input) },
    { label: "isAlphanumeric", fn: () => TextUtils.isAlphanumeric(input) },
    { label: "isHexColor", fn: () => TextUtils.isHexColor(input) },
    { label: "isWhitespace", fn: () => TextUtils.isWhitespace(input) },
  ];

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 600 }}
    >
      <Typography variant="h5">Text Validation</Typography>

      <TextField
        label="Input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        fullWidth
        size="small"
        placeholder="Test various inputs..."
      />

      <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
        <Typography variant="caption" color="text.secondary">
          Quick tests:
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Chip
            label="test@example.com"
            size="small"
            sx={{ mr: 1 }}
            onClick={() => setInput("test@example.com")}
          />
          <Chip
            label="https://google.com"
            size="small"
            sx={{ mr: 1 }}
            onClick={() => setInput("https://google.com")}
          />
          <Chip
            label="12345"
            size="small"
            sx={{ mr: 1 }}
            onClick={() => setInput("12345")}
          />
          <Chip
            label="#FF5733"
            size="small"
            sx={{ mr: 1 }}
            onClick={() => setInput("#FF5733")}
          />
          <Chip
            label="HelloWorld"
            size="small"
            onClick={() => setInput("HelloWorld")}
          />
        </Box>
      </Paper>

      <Grid container spacing={1}>
        {testCases.map(({ label, fn }) => (
          <Grid item xs={4} sm={3} key={label}>
            <Paper sx={{ p: 1.5, textAlign: "center" }}>
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>
              <Box>
                <Chip
                  label={fn() ? "true" : "false"}
                  size="small"
                  color={fn() ? "success" : "default"}
                />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export const Masking: React.FC = () => {
  const [email, setEmail] = useState("nguyen.van.an@example.com");
  const [phone, setPhone] = useState("0987654321");
  const [cccd, setCccd] = useState("079199123456");

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 600 }}
    >
      <Typography variant="h5">Masking</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            size="small"
          />
          <Paper sx={{ p: 1.5, mt: 1, bgcolor: "#f5f5f5" }}>
            <Typography variant="caption" color="text.secondary">
              maskEmail
            </Typography>
            <Typography variant="body2">
              {TextUtils.maskEmail(email)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            size="small"
          />
          <Paper sx={{ p: 1.5, mt: 1, bgcolor: "#f5f5f5" }}>
            <Typography variant="caption" color="text.secondary">
              maskPhone
            </Typography>
            <Typography variant="body2">
              {TextUtils.maskPhone(phone)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="CCCD"
            value={cccd}
            onChange={(e) => setCccd(e.target.value)}
            fullWidth
            size="small"
          />
          <Paper sx={{ p: 1.5, mt: 1, bgcolor: "#f5f5f5" }}>
            <Typography variant="caption" color="text.secondary">
              maskCCCD
            </Typography>
            <Typography variant="body2">{TextUtils.maskCCCD(cccd)}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Divider />

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          maskString (visibleStart=2, visibleEnd=3)
        </Typography>
        <TextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          size="small"
        />
        <Paper sx={{ p: 1.5, mt: 1, bgcolor: "#f5f5f5" }}>
          <Typography variant="body2">
            {TextUtils.maskString(email, 2, 3)}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

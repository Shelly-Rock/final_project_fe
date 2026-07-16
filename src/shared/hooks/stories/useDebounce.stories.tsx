import type { Meta } from "@storybook/react";
import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Divider,
} from "@mui/material";

import { useDebounce } from "@/shared/hooks/useDebounce";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { useThrottle } from "@/shared/hooks/useThrottle";

const meta = {
  title: "Shared/Hooks/useDebounce",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;

// ==================== useDebounce ====================

export const UseDebounceBasic: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const debouncedValue = useDebounce(inputValue, 500);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 500 }}
    >
      <Typography variant="h6">useDebounce - Basic</Typography>
      <Typography variant="body2" color="text.secondary">
        Giá trị debounced sẽ thay đổi sau khi ngừng nhập 500ms
      </Typography>

      <TextField
        label="Nhập text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        fullWidth
        placeholder="Gõ và đợi 500ms..."
      />

      <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
        <Typography variant="body2">
          Input: <Chip label={inputValue || "(empty)"} size="small" />
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Debounced:{" "}
          <Chip
            label={debouncedValue || "(empty)"}
            size="small"
            color="primary"
          />
        </Typography>
      </Paper>

      <Paper sx={{ p: 2, bgcolor: "#e8f5e9" }}>
        <Typography variant="caption">
          Debounced value chỉ cập nhật khi input không thay đổi trong 500ms
        </Typography>
      </Paper>
    </Box>
  );
};

export const UseDebounceSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const debouncedSearch = useDebounce(searchTerm, 800);

  useEffect(() => {
    if (!debouncedSearch) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    // Simulate API call
    const timer = setTimeout(() => {
      setResults([
        `Kết quả cho "${debouncedSearch}" #1`,
        `Kết quả cho "${debouncedSearch}" #2`,
        `Kết quả cho "${debouncedSearch}" #3`,
      ]);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [debouncedSearch]);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 500 }}
    >
      <Typography variant="h6">useDebounce - Search Demo</Typography>

      <TextField
        label="Tìm kiếm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        placeholder="Nhập từ khóa..."
        size="small"
      />

      <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
        <Typography variant="body2">
          Search term: <Chip label={searchTerm || "(empty)"} size="small" />
        </Typography>
        <Typography variant="body2">
          Debounced:{" "}
          <Chip
            label={debouncedSearch || "(empty)"}
            size="small"
            color="primary"
          />
        </Typography>
        <Typography variant="body2">
          Status:{" "}
          {isSearching ? (
            <CircularProgress size={14} />
          ) : (
            <Chip label="Idle" size="small" color="success" />
          )}
        </Typography>
      </Paper>

      {results.length > 0 && (
        <Paper sx={{ p: 2, bgcolor: "#e3f2fd" }}>
          <Typography variant="subtitle2" gutterBottom>
            Kết quả ({results.length})
          </Typography>
          {results.map((result, i) => (
            <Typography key={i} variant="body2" sx={{ py: 0.5 }}>
              {result}
            </Typography>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export const UseDebounceDelayVariants: React.FC = () => {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [value3, setValue3] = useState("");

  const debounced1 = useDebounce(value1, 200);
  const debounced2 = useDebounce(value2, 500);
  const debounced3 = useDebounce(value3, 1000);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 600 }}
    >
      <Typography variant="h6">useDebounce - Different Delays</Typography>

      <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
        <Typography variant="body2" sx={{ mb: 2 }}>
          So sánh các delay khác nhau:
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption">200ms delay</Typography>
          <TextField
            size="small"
            fullWidth
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
          />
          <Typography variant="body2">
            Result: <Chip label={debounced1 || "-"} size="small" />
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption">500ms delay</Typography>
          <TextField
            size="small"
            fullWidth
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
          />
          <Typography variant="body2">
            Result: <Chip label={debounced2 || "-"} size="small" />
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box>
          <Typography variant="caption">1000ms delay</Typography>
          <TextField
            size="small"
            fullWidth
            value={value3}
            onChange={(e) => setValue3(e.target.value)}
          />
          <Typography variant="body2">
            Result: <Chip label={debounced3 || "-"} size="small" />
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

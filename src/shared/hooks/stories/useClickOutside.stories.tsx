import type { Meta } from '@storybook/react';
import { useRef, useState } from 'react';
import { Box, Button, Typography, Paper, Chip, Divider } from '@mui/material';

import { useClickOutside } from '@/shared/hooks/useClickOutside';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { useThrottle } from '@/shared/hooks/useThrottle';
import { useInterval } from '@/shared/hooks/useInterval';

const meta = {
  title: 'Shared/Hooks/useClickOutside',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;

// ==================== useClickOutside ====================

export const UseClickOutsideBasic: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => {
    setIsOpen(false);
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
      <Typography variant="h6">useClickOutside - Basic</Typography>
      <Typography variant="body2" color="text.secondary">
        Click bên ngoài menu để đóng nó
      </Typography>

      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <Button variant="contained" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Đóng Menu' : 'Mở Menu'}
        </Button>

        {isOpen && (
          <Paper
            ref={menuRef}
            elevation={8}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              mt: 1,
              p: 2,
              minWidth: 150,
              zIndex: 1000,
            }}
          >
            <Typography variant="body2">Menu Item 1</Typography>
            <Typography variant="body2">Menu Item 2</Typography>
            <Typography variant="body2">Menu Item 3</Typography>
          </Paper>
        )}
      </Box>

      <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="caption">
          Trạng thái: <Chip label={isOpen ? 'Menu đang mở' : 'Menu đang đóng'} size="small" />
        </Typography>
      </Paper>
    </Box>
  );
};

export const UseClickOutsideDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    setIsOpen(false);
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 500 }}>
      <Typography variant="h6">useClickOutside - Dropdown</Typography>
      <Typography variant="body2" color="text.secondary">
        Component dropdown với click outside detection
      </Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ position: 'relative' }}>
          <Button
            variant="outlined"
            onClick={() => setIsOpen(!isOpen)}
          >
            Actions {isOpen ? '▲' : '▼'}
          </Button>

          {isOpen && (
            <Paper
              ref={dropdownRef}
              elevation={4}
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                mt: 1,
                p: 0,
                minWidth: 200,
                zIndex: 1000,
              }}
            >
              <Box sx={{ p: 1, cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }}>
                <Typography variant="body2">Edit</Typography>
              </Box>
              <Divider />
              <Box sx={{ p: 1, cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }}>
                <Typography variant="body2">Duplicate</Typography>
              </Box>
              <Divider />
              <Box sx={{ p: 1, cursor: 'pointer', '&:hover': { bgcolor: '#ffebee' }, color: 'error.main' }}>
                <Typography variant="body2">Delete</Typography>
              </Box>
            </Paper>
          )}
        </Box>

        <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="body2">
            Click outside: <Chip label={isOpen ? 'Bên trong' : 'Bên ngoài'} size="small" />
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export const UseClickOutsideDisabled: React.FC = () => {
  const [enabled, setEnabled] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => {
    setIsOpen(false);
  }, enabled);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
      <Typography variant="h6">useClickOutside - With Enable/Disable</Typography>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant={enabled ? 'contained' : 'outlined'}
          onClick={() => setEnabled(!enabled)}
        >
          {enabled ? 'Enabled' : 'Disabled'}
        </Button>
        <Button variant="outlined" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Close' : 'Open'}
        </Button>
      </Box>

      <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="body2">
          Khi disabled: click outside sẽ không đóng menu
        </Typography>
      </Paper>

      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <Paper
          ref={menuRef}
          sx={{
            p: 2,
            bgcolor: isOpen ? '#e3f2fd' : '#f5f5f5',
            transition: 'background 0.2s',
          }}
        >
          <Typography variant="body2">
            Menu {isOpen ? 'đang mở' : 'đang đóng'}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

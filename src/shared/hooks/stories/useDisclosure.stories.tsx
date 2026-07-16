import type { Meta } from '@storybook/react';
import { useState, useRef } from 'react';
import { Box, Button, Typography, Paper, Chip, TextField, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

// Import hooks directly
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { useBoolean } from '@/shared/hooks/useBoolean';

const meta = {
  title: 'Shared/Hooks/useDisclosure',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;

// ==================== useDisclosure ====================

export const UseDisclosureBasic: React.FC = () => {
  const { isOpen, open, close, toggle } = useDisclosure();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
      <Typography variant="h6">useDisclosure - Basic</Typography>

      <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="body2">
          Trạng thái hiện tại: <Chip label={isOpen ? 'Mở' : 'Đóng'} color={isOpen ? 'success' : 'default'} />
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" onClick={open} disabled={isOpen}>
          Mở
        </Button>
        <Button variant="outlined" onClick={close} disabled={!isOpen}>
          Đóng
        </Button>
        <Button variant="text" onClick={toggle}>
          Toggle
        </Button>
      </Box>

      {isOpen && (
        <Alert severity="success">
          Panel đã được mở! Click "Đóng" hoặc "Toggle" để đóng lại.
        </Alert>
      )}
    </Box>
  );
};

export const UseDisclosureModal: React.FC = () => {
  const { isOpen, open, close, toggle } = useDisclosure(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 500 }}>
      <Typography variant="h6">useDisclosure - Modal Demo</Typography>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={open}>
          Mở Modal
        </Button>
        <Button variant="outlined" onClick={toggle}>
          Toggle Modal
        </Button>
      </Box>

      {isOpen && (
        <Paper
          elevation={8}
          sx={{
            p: 3,
            position: 'relative',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Modal Header</Typography>
            <Button size="small" onClick={close} startIcon={<CloseIcon />}>
              Đóng
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Đây là nội dung modal được điều khiển bởi useDisclosure hook.
            Trạng thái: {isOpen ? 'Mở' : 'Đóng'}
          </Typography>
        </Paper>
      )}

      {!isOpen && (
        <Typography variant="body2" color="text.secondary">
          Modal đang đóng - click "Mở Modal" để hiển thị
        </Typography>
      )}
    </Box>
  );
};

export const UseDisclosureMultiple: React.FC = () => {
  const modal1 = useDisclosure();
  const modal2 = useDisclosure();
  const drawer = useDisclosure();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}>
      <Typography variant="h6">useDisclosure - Multiple Instances</Typography>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button variant="outlined" onClick={modal1.toggle}>
          Modal 1: {modal1.isOpen ? 'Mở' : 'Đóng'}
        </Button>
        <Button variant="outlined" onClick={modal2.toggle}>
          Modal 2: {modal2.isOpen ? 'Mở' : 'Đóng'}
        </Button>
        <Button variant="outlined" onClick={drawer.toggle}>
          Drawer: {drawer.isOpen ? 'Mở' : 'Đóng'}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        {modal1.isOpen && (
          <Paper sx={{ p: 2, bgcolor: '#e3f2fd' }}>
            <Typography variant="subtitle2">Modal 1</Typography>
            <Button size="small" onClick={modal1.close}>Đóng</Button>
          </Paper>
        )}
        {modal2.isOpen && (
          <Paper sx={{ p: 2, bgcolor: '#e8f5e9' }}>
            <Typography variant="subtitle2">Modal 2</Typography>
            <Button size="small" onClick={modal2.close}>Đóng</Button>
          </Paper>
        )}
        {drawer.isOpen && (
          <Paper sx={{ p: 2, bgcolor: '#fff3e0' }}>
            <Typography variant="subtitle2">Drawer</Typography>
            <Button size="small" onClick={drawer.close}>Đóng</Button>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

// ==================== useBoolean ====================

export const UseBooleanBasic: React.FC = () => {
  const { value, setValue, setTrue, setFalse, toggle } = useBoolean(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
      <Typography variant="h6">useBoolean - Basic</Typography>

      <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="body2">
          Giá trị: <Chip label={value ? 'TRUE' : 'FALSE'} color={value ? 'success' : 'default'} />
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={setTrue} disabled={value}>
          setTrue
        </Button>
        <Button variant="outlined" onClick={setFalse} disabled={!value}>
          setFalse
        </Button>
        <Button variant="text" onClick={toggle}>
          toggle
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Typography variant="body2">setValue:</Typography>
        <Button size="small" variant="outlined" onClick={() => setValue(true)}>true</Button>
        <Button size="small" variant="outlined" onClick={() => setValue(false)}>false</Button>
      </Box>
    </Box>
  );
};

export const UseBooleanLoading: React.FC = () => {
  const { value: isLoading, setTrue, setFalse, toggle } = useBoolean(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
      <Typography variant="h6">useBoolean - Loading State Demo</Typography>

      <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="body2">
          Loading: <Chip label={isLoading ? 'Đang tải...' : 'Hoàn tất'} color={isLoading ? 'warning' : 'success'} />
        </Typography>
      </Paper>

      <Button
        variant="contained"
        onClick={async () => {
          setTrue();
          await new Promise((r) => setTimeout(r, 2000));
          setFalse();
        }}
        disabled={isLoading}
      >
        {isLoading ? 'Đang xử lý...' : 'Bắt đầu (2 giây)'}
      </Button>

      <Button variant="text" onClick={toggle} disabled={isLoading}>
        Toggle Loading
      </Button>
    </Box>
  );
};

export const UseBooleanToggle: React.FC = () => {
  const { value: darkMode, toggle } = useBoolean(false);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 3,
        borderRadius: 2,
        bgcolor: darkMode ? '#1e1e1e' : '#ffffff',
        color: darkMode ? '#fff' : '#000',
        transition: 'all 0.3s',
        maxWidth: 400,
      }}
    >
      <Typography variant="h6">useBoolean - Theme Toggle</Typography>

      <Paper
        sx={{
          p: 2,
          bgcolor: darkMode ? '#2d2d2d' : '#f5f5f5',
        }}
      >
        <Typography variant="body2">
          Chế độ: <Chip label={darkMode ? 'Dark Mode' : 'Light Mode'} />
        </Typography>
      </Paper>

      <Button variant="outlined" onClick={toggle} sx={{ color: darkMode ? '#fff' : '#000', borderColor: darkMode ? '#fff' : '#000' }}>
        Toggle Theme
      </Button>

      <Typography variant="caption" color="text.secondary">
        Click để chuyển đổi giữa Light và Dark mode
      </Typography>
    </Box>
  );
};

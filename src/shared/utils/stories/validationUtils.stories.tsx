import type { Meta } from '@storybook/react';
import { useState } from 'react';
import { Box, TextField, Typography, Paper, Chip, Grid, Button, Divider, LinearProgress, Alert } from '@mui/material';
import {
  validateEmail,
  validatePhone,
  validatePassword,
  getPasswordStrength,
  validateUsername,
  validateName,
  isValidCCCD,
  isValidTaxId,
  isValidUrl,
  isValidCreditCard,
  isValidPhoneVN,
  isReservedUsername,
  validateForm,
  required,
  minLength,
  maxLength,
  pattern,
} from '@/shared/utils/validation.utils';

const meta = {
  title: 'Shared/Utils/Validation Utils',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;

export const EmailValidation: React.FC = () => {
  const [email, setEmail] = useState('');
  const result = validateEmail(email);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 500 }}>
      <Typography variant="h5">Email Validation</Typography>

      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        placeholder="user@example.com"
        error={!!email && !result.valid}
        helperText={!result.valid && email ? result.error : ''}
      />

      <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="body2">
          Result: <Chip
            label={result.valid ? 'Valid' : 'Invalid'}
            color={result.valid ? 'success' : 'error'}
            size="small"
          />
        </Typography>
      </Paper>

      <Paper sx={{ p: 2, bgcolor: '#e3f2fd' }}>
        <Typography variant="caption" color="text.secondary">
          Test: <Chip label="test@gmail.com" size="small" onClick={() => setEmail('test@gmail.com')} sx={{ mr: 1 }} />
          <Chip label="invalid-email" size="small" onClick={() => setEmail('invalid-email')} />
        </Typography>
      </Paper>
    </Box>
  );
};

export const PhoneValidation: React.FC = () => {
  const [phone, setPhone] = useState('');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 500 }}>
      <Typography variant="h5">Phone Validation</Typography>

      <TextField
        label="Số điện thoại VN"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        fullWidth
        placeholder="0987654321"
      />

      <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="body2">
          isValidPhoneVN: <Chip
            label={phone && isValidPhoneVN(phone) ? 'Valid' : 'Invalid'}
            color={phone && isValidPhoneVN(phone) ? 'success' : 'default'}
            size="small"
          />
        </Typography>
        <Typography variant="body2">
          validatePhone: <Chip
            label={phone ? (validatePhone(phone).valid ? 'Valid' : validatePhone(phone).error) : 'N/A'}
            color={phone && validatePhone(phone).valid ? 'success' : 'warning'}
            size="small"
          />
        </Typography>
      </Paper>

      <Paper sx={{ p: 2, bgcolor: '#e3f2fd' }}>
        <Typography variant="caption" color="text.secondary">
          Test: <Chip label="0987654321" size="small" onClick={() => setPhone('0987654321')} sx={{ mr: 1 }} />
          <Chip label="0123456789" size="small" onClick={() => setPhone('0123456789')} sx={{ mr: 1 }} />
          <Chip label="abc123" size="small" onClick={() => setPhone('abc123')} />
        </Typography>
      </Paper>
    </Box>
  );
};

export const PasswordValidation: React.FC = () => {
  const [password, setPassword] = useState('');
  const result = validatePassword(password);
  const strength = getPasswordStrength(password);

  const strengthColors: Record<string, 'error' | 'warning' | 'success' | 'primary'> = {
    weak: 'error',
    medium: 'warning',
    strong: 'success',
    'very-strong': 'primary',
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 500 }}>
      <Typography variant="h5">Password Validation</Typography>

      <TextField
        label="Mật khẩu"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />

      <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="body2" gutterBottom>
          Strength: <Chip label={strength} color={strengthColors[strength]} size="small" />
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(result.score / 4) * 100}
          color={strengthColors[strength]}
        />
      </Paper>

      {result.errors.length > 0 && (
        <Paper sx={{ p: 2, bgcolor: '#ffebee' }}>
          <Typography variant="subtitle2" color="error" gutterBottom>Errors:</Typography>
          {result.errors.map((error, i) => (
            <Typography key={i} variant="caption" component="li">{error}</Typography>
          ))}
        </Paper>
      )}

      <Divider />

      <Typography variant="subtitle2">Test passwords:</Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button size="small" variant="outlined" onClick={() => setPassword('abc')}>Weak</Button>
        <Button size="small" variant="outlined" onClick={() => setPassword('Password1')}>Medium</Button>
        <Button size="small" variant="outlined" onClick={() => setPassword('Password1!')}>Strong</Button>
        <Button size="small" variant="outlined" onClick={() => setPassword('MyP@ssw0rd!2024')}>Very Strong</Button>
      </Box>
    </Box>
  );
};

export const UsernameValidation: React.FC = () => {
  const [username, setUsername] = useState('');
  const result = validateUsername(username);
  const reserved = isReservedUsername(username);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 500 }}>
      <Typography variant="h5">Username Validation</Typography>

      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        error={!result.valid}
        helperText={!result.valid && username ? result.error : ''}
      />

      <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="body2">
          validateUsername: <Chip
            label={username ? (result.valid ? 'Valid' : 'Invalid') : 'N/A'}
            color={username && result.valid ? 'success' : 'default'}
            size="small"
          />
        </Typography>
        <Typography variant="body2">
          isReservedUsername: <Chip
            label={username ? (reserved ? 'RESERVED' : 'Available') : 'N/A'}
            color={reserved ? 'warning' : 'success'}
            size="small"
          />
        </Typography>
      </Paper>

      <Paper sx={{ p: 2, bgcolor: '#e3f2fd' }}>
        <Typography variant="caption" color="text.secondary">
          Test: <Chip label="admin" size="small" onClick={() => setUsername('admin')} sx={{ mr: 1 }} />
          <Chip label="user_123" size="small" onClick={() => setUsername('user_123')} sx={{ mr: 1 }} />
          <Chip label="ab" size="small" onClick={() => setUsername('ab')} />
        </Typography>
      </Paper>
    </Box>
  );
};

export const FormValidation: React.FC = () => {
  const [data, setData] = useState({ email: '', password: '', name: '' });
  const result = validateForm(data, {
    email: [
      required('Email là bắt buộc'),
      { validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Email không hợp lệ' },
    ],
    password: [
      required('Mật khẩu là bắt buộc'),
      minLength(8, 'Ít nhất 8 ký tự'),
      pattern(/[A-Z]/, 'Ít nhất 1 chữ hoa'),
    ],
    name: [
      required('Tên là bắt buộc'),
      minLength(2, 'Ít nhất 2 ký tự'),
    ],
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 500 }}>
      <Typography variant="h5">Form Validation</Typography>

      <TextField
        label="Email"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        fullWidth
        error={!!result.errors.email}
        helperText={result.errors.email}
        size="small"
      />
      <TextField
        label="Password"
        type="password"
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
        fullWidth
        error={!!result.errors.password}
        helperText={result.errors.password}
        size="small"
      />
      <TextField
        label="Name"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        fullWidth
        error={!!result.errors.name}
        helperText={result.errors.name}
        size="small"
      />

      <Paper sx={{ p: 2, bgcolor: result.valid ? '#e8f5e9' : '#fff3e0' }}>
        <Typography variant="body2">
          Form Valid: <Chip
            label={result.valid ? 'YES' : 'NO'}
            color={result.valid ? 'success' : 'error'}
            size="small"
          />
        </Typography>
      </Paper>
    </Box>
  );
};

export const OtherValidations: React.FC = () => {
  const [input, setInput] = useState('');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}>
      <Typography variant="h5">Other Validations</Typography>

      <TextField
        label="Test Input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        fullWidth
        size="small"
        placeholder="Test various values..."
      />

      <Grid container spacing={2}>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">CCCD (12 digits)</Typography>
            <Typography variant="body2">
              <Chip label={input && isValidCCCD(input) ? 'Valid' : 'Invalid'} size="small" color={input && isValidCCCD(input) ? 'success' : 'default'} />
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">Tax ID (10/13 digits)</Typography>
            <Typography variant="body2">
              <Chip label={input && isValidTaxId(input) ? 'Valid' : 'Invalid'} size="small" color={input && isValidTaxId(input) ? 'success' : 'default'} />
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">Credit Card (Luhn)</Typography>
            <Typography variant="body2">
              <Chip label={input && isValidCreditCard(input) ? 'Valid' : 'Invalid'} size="small" color={input && isValidCreditCard(input) ? 'success' : 'default'} />
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">URL</Typography>
            <Typography variant="body2">
              <Chip label={input && isValidUrl(input) ? 'Valid' : 'Invalid'} size="small" color={input && isValidUrl(input) ? 'success' : 'default'} />
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">validateName</Typography>
            <Typography variant="body2">
              <Chip label={input && validateName(input).valid ? 'Valid' : 'Invalid'} size="small" color={input && validateName(input).valid ? 'success' : 'default'} />
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Divider />

      <Typography variant="subtitle2">Quick Tests:</Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button size="small" variant="outlined" onClick={() => setInput('079199123456')}>CCCD</Button>
        <Button size="small" variant="outlined" onClick={() => setInput('1234567890')}>Tax ID</Button>
        <Button size="small" variant="outlined" onClick={() => setInput('4532015112830366')}>Credit Card</Button>
        <Button size="small" variant="outlined" onClick={() => setInput('https://example.com')}>URL</Button>
        <Button size="small" variant="outlined" onClick={() => setInput('Nguyễn Văn A')}>Name</Button>
      </Box>
    </Box>
  );
};

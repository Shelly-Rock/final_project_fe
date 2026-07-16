"use client";

import { useState } from "react";
import { Box, TextField, MenuItem, Typography } from "@mui/material";

interface PhoneNumberInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

const vietnamProvinces = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Hải Phòng",
  "Đà Nẵng",
  "Cần Thơ",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Tĩnh",
  "Hải Dương",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

export function PhoneNumberInput({
  value: controlledValue,
  defaultValue = "",
  onChange,
  label = "Số điện thoại",
  placeholder = "Nhập số điện thoại",
  disabled = false,
  error = false,
  helperText,
  required = false,
}: PhoneNumberInputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const phoneNumber =
    controlledValue !== undefined ? controlledValue : internalValue;
  const setPhoneNumber =
    controlledValue !== undefined ? (onChange ?? (() => {})) : setInternalValue;
  const isControlled = controlledValue !== undefined;
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const formatPhoneNumber = (input: string) => {
    const cleaned = input.replace(/\D/g, "");

    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6)
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    if (cleaned.length <= 10)
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
  };

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length === 10 && /^0[0-9]/.test(cleaned);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    onChange?.(formatted);

    if (formatted.length >= 10) {
      setIsValid(validatePhone(formatted));
    } else {
      setIsValid(null);
    }
  };

  const getHelperText = () => {
    if (helperText) return helperText;
    if (isValid === false) return "Số điện thoại không hợp lệ";
    if (phoneNumber.length >= 10 && isValid === true)
      return "Số điện thoại hợp lệ";
    return "Ví dụ: 091 234 5678";
  };

  return (
    <TextField
      label={label}
      value={phoneNumber}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      error={error || isValid === false}
      helperText={getHelperText()}
      required={required}
      fullWidth
      inputProps={{
        maxLength: 12,
      }}
    />
  );
}

interface PhoneNumberInputWithPrefixProps extends PhoneNumberInputProps {
  showProvinceSelect?: boolean;
}

export function PhoneNumberInputWithPrefix({
  showProvinceSelect = false,
  ...props
}: PhoneNumberInputWithPrefixProps) {
  const [prefix, setPrefix] = useState("084");

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {showProvinceSelect && (
        <TextField
          select
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          sx={{ minWidth: 120 }}
          size="medium"
        >
          {[
            { value: "084", label: "084" },
            { value: "085", label: "085" },
            { value: "086", label: "086" },
            { value: "088", label: "088" },
            { value: "089", label: "089" },
            { value: "090", label: "090" },
            { value: "091", label: "091" },
            { value: "092", label: "092" },
            { value: "093", label: "093" },
            { value: "094", label: "094" },
            { value: "095", label: "095" },
            { value: "096", label: "096" },
            { value: "097", label: "097" },
            { value: "098", label: "098" },
            { value: "099", label: "099" },
          ].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
      <PhoneNumberInput {...props} />
    </Box>
  );
}

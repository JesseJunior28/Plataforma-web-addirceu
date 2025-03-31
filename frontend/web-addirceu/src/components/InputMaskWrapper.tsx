"use client"

import React, { useState } from 'react';

type InputMaskWrapperProps = {
  mask: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type?: string;
  required?: boolean;
  name?: string;
  defaultValue?: string;
};

export const InputMaskWrapper = ({
  mask,
  value: externalValue,
  onChange,
  className,
  type = "text",
  required,
  name,
  defaultValue,
}: InputMaskWrapperProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue || externalValue || '');
  
  // Função para aplicar a máscara ao CPF
  const applyMask = (value: string) => {
    if (mask === '999.999.999-99') {
      // Máscara de CPF
      return value
        .replace(/\D/g, '') // Remove tudo que não for dígito
        .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto após os primeiros 3 dígitos
        .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto após os segundos 3 dígitos
        .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Coloca hífen antes dos últimos 2 dígitos
        .replace(/(-\d{2})\d+?$/, '$1'); // Limita a 11 dígitos no total
    } else if (mask === '(99) 99999-9999') {
      // Máscara de telefone
      return value
        .replace(/\D/g, '') // Remove tudo que não for dígito
        .replace(/(\d{2})(\d)/, '($1) $2') // Coloca parênteses em volta dos 2 primeiros dígitos
        .replace(/(\d{5})(\d)/, '$1-$2') // Coloca hífen depois do quinto dígito
        .replace(/(-\d{4})\d+?$/, '$1'); // Limita a 11 dígitos no total
    }
    return value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const maskedValue = applyMask(rawValue);
    setInternalValue(maskedValue);

    if (onChange) {
      e.target.value = maskedValue;
      onChange(e);
    }
  };

  return (
    <input
      type={type}
      className={className}
      value={internalValue}
      onChange={handleChange}
      required={required}
      name={name}
    />
  );
};

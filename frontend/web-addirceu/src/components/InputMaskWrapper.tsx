import React, { useState, useEffect } from 'react';

interface InputMaskWrapperProps {
  mask: string;
  type: string;
  name: string;
  className?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const InputMaskWrapper: React.FC<InputMaskWrapperProps> = ({
  mask,
  type,
  name,
  className,
  defaultValue,
  required,
  disabled,
  onChange,
  placeholder,
  ...props
}) => {
  const [value, setValue] = useState(defaultValue || '');

  // Aplicar formatação inicial ao valor padrão
  useEffect(() => {
    if (defaultValue) {
      setValue(applyMask(defaultValue, mask));
    }
  }, [defaultValue, mask]);

  // Função aprimorada para aplicar a máscara ao valor
  const applyMask = (value: string, mask: string): string => {
    // Remove tudo que não for número
    const numericValue = value.replace(/\D/g, '');
    
    // Se não houver números, retorna vazio
    if (!numericValue) return '';
    
    // Implementação específica para os formatos mais comuns
    if (mask === '(99) 99999-9999') {
      // Máscara para telefone celular brasileiro
      if (numericValue.length <= 2) {
        return `(${numericValue}`;
      } else if (numericValue.length <= 7) {
        return `(${numericValue.substring(0, 2)}) ${numericValue.substring(2)}`;
      } else if (numericValue.length <= 11) {
        return `(${numericValue.substring(0, 2)}) ${numericValue.substring(2, 7)}-${numericValue.substring(7)}`;
      } else {
        // Limita a 11 dígitos
        return `(${numericValue.substring(0, 2)}) ${numericValue.substring(2, 7)}-${numericValue.substring(7, 11)}`;
      }
    } else if (mask === '999.999.999-99') {
      // Máscara para CPF
      if (numericValue.length <= 3) {
        return numericValue;
      } else if (numericValue.length <= 6) {
        return `${numericValue.substring(0, 3)}.${numericValue.substring(3)}`;
      } else if (numericValue.length <= 9) {
        return `${numericValue.substring(0, 3)}.${numericValue.substring(3, 6)}.${numericValue.substring(6)}`;
      } else {
        // Limita a 11 dígitos
        return `${numericValue.substring(0, 3)}.${numericValue.substring(3, 6)}.${numericValue.substring(6, 9)}-${numericValue.substring(9, 11)}`;
      }
    } else {
      // Implementação genérica para outras máscaras
      try {
        let result = '';
        let valueIndex = 0;
        
        for (let i = 0; i < mask.length && valueIndex < numericValue.length; i++) {
          if (mask[i] === '9') {
            result += numericValue[valueIndex++] || '';
          } else {
            result += mask[i];
          }
        }
        
        return result;
      } catch (error) {
        console.error("Erro ao aplicar máscara:", error);
        return numericValue; // Em caso de erro, retornar o valor sem máscara
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newValue = applyMask(e.target.value, mask);
      setValue(newValue);
      
      if (onChange) {
        // Criamos um novo evento com o valor formatado
        const newEvent = {
          ...e,
          target: {
            ...e.target,
            value: newValue
          },
          currentTarget: {
            ...e.currentTarget,
            value: newValue
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        onChange(newEvent);
      }
    } catch (error) {
      console.error("Erro ao processar input:", error);
      // Em caso de erro, mantém o valor anterior
    }
  };

  return (
    <input
      type={type}
      name={name}
      className={className}
      value={value}
      required={required}
      disabled={disabled}
      onChange={handleChange}
      placeholder={placeholder}
      {...props}
    />
  );
};

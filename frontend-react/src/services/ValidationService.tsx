import { useState } from 'react'

// Define validation rule interface
interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any
  message: string
}

// Validation options interface
interface ValidationOptions {
  rules: ValidationRule[]
  validateOnChange?: boolean
}

// Generic validation hook
export function useFieldValidation(options: ValidationOptions) {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const { rules, validateOnChange = false } = options

  const validateField = (inputValue: string) => {
    // Reset error
    setError("")

    // If field is empty, only show required error if it's required
    if (!inputValue.trim()) {
      const requiredRule = rules.find(rule => rule.type === 'required')
      if (requiredRule) {
        setError(requiredRule.message)
        return false
      }
      return true // Field is optional and empty
    }

    // Check rules in priority order - show only the first failing rule
    const priorityOrder: ValidationRule['type'][] = ['minLength', 'maxLength', 'pattern', 'custom']
    
    for (const ruleType of priorityOrder) {
      const rule = rules.find(r => r.type === ruleType)
      if (rule) {
        let isValid = true
        
        switch (rule.type) {
          case 'minLength':
            isValid = inputValue.length >= rule.value
            break
          case 'maxLength':
            isValid = inputValue.length <= rule.value
            break
          case 'pattern':
            isValid = rule.value.test(inputValue)
            break
          case 'custom':
            isValid = rule.value(inputValue)
            break
        }
        
        if (!isValid) {
          setError(rule.message)
          return false
        }
      }
    }

    return true
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setValue(inputValue)
    
    if (validateOnChange) {
      validateField(inputValue)
    }
  }

  // New onBlur handler for validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    validateField(inputValue)
  }

  const clearField = () => {
    setValue("")
    setError("")
  }

  const isValid = () => {
    return value.trim() !== "" && error === ""
  }

  const forceValidate = () => {
    return validateField(value)
  }

  return {
    value,
    error,
    handleChange,
    handleBlur, // Added onBlur handler
    clearField,
    isValid,
    forceValidate,
    setValue,
    setError
  }
}

// Submit-only validation hook (for login forms)
export function useSubmitValidation(options: Omit<ValidationOptions, 'validateOnChange'>) {
  return useFieldValidation({
    ...options,
    validateOnChange: false
  })
}

// Preset validation configurations for common fields
export const ValidationPresets = {
  // Email validation - now defaults to onBlur
  email: {
    rules: [
      { type: 'required' as const, message: 'Email is required' },
      { 
        type: 'pattern' as const, 
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
        message: 'Please enter a valid email address' 
      }
    ]
  },

  // Login-specific presets (no real-time validation)
  loginEmail: {
    rules: [
      { type: 'required' as const, message: 'Email is required' },
      { 
        type: 'pattern' as const, 
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
        message: 'Please enter a valid email address' 
      }
    ],
    validateOnChange: false
  },

  loginPassword: {
    rules: [
      { type: 'required' as const, message: 'Password is required' }
    ],
    validateOnChange: false
  },

  // First name validation - now defaults to onBlur
  firstName: {
    rules: [
      { type: 'required' as const, message: 'First name is required' },
      { type: 'minLength' as const, value: 2, message: 'First name must be at least 2 characters' },
      { type: 'maxLength' as const, value: 50, message: 'First name cannot exceed 50 characters' },
      { 
        type: 'pattern' as const, 
        value: /^[a-zA-Z\s'-]+$/, 
        message: 'First name can only contain letters, spaces, hyphens, and apostrophes' 
      }
    ]
  },

  // Last name validation - now defaults to onBlur
  lastName: {
    rules: [
      { type: 'required' as const, message: 'Last name is required' },
      { type: 'minLength' as const, value: 2, message: 'Last name must be at least 2 characters' },
      { type: 'maxLength' as const, value: 50, message: 'Last name cannot exceed 50 characters' },
      { 
        type: 'pattern' as const, 
        value: /^[a-zA-Z\s'-]+$/, 
        message: 'Last name can only contain letters, spaces, hyphens, and apostrophes' 
      }
    ]
  },

  // Password validation with better UX messages - now defaults to onBlur
  password: {
    rules: [
      { type: 'required' as const, message: 'Password is required' },
      { type: 'minLength' as const, value: 8, message: 'At least 8 characters required' },
      { type: 'maxLength' as const, value: 128, message: 'Too long (max 128 characters)' },
      { 
        type: 'pattern' as const, 
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        message: 'Must include: uppercase, lowercase, number & special character' 
      }
    ]
  },

  // Phone number validation - now defaults to onBlur
  phone: {
    rules: [
      { type: 'required' as const, message: 'Phone number is required' },
      { 
        type: 'pattern' as const, 
        value: /^\+?[\d\s\-\(\)]{10,}$/, 
        message: 'Please enter a valid phone number' 
      }
    ]
  }
}

// Custom validation builder for dynamic rules
export function createValidation(config: {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => boolean
  messages?: {
    required?: string
    minLength?: string
    maxLength?: string
    pattern?: string
    custom?: string
  }
}) {
  const rules: ValidationRule[] = []
  const defaultMessages = {
    required: 'This field is required',
    minLength: `Minimum ${config.minLength} characters required`,
    maxLength: `Maximum ${config.maxLength} characters allowed`,
    pattern: 'Invalid format',
    custom: 'Invalid value'
  }

  if (config.required) {
    rules.push({
      type: 'required',
      message: config.messages?.required || defaultMessages.required
    })
  }

  if (config.minLength) {
    rules.push({
      type: 'minLength',
      value: config.minLength,
      message: config.messages?.minLength || defaultMessages.minLength
    })
  }

  if (config.maxLength) {
    rules.push({
      type: 'maxLength',
      value: config.maxLength,
      message: config.messages?.maxLength || defaultMessages.maxLength
    })
  }

  if (config.pattern) {
    rules.push({
      type: 'pattern',
      value: config.pattern,
      message: config.messages?.pattern || defaultMessages.pattern
    })
  }

  if (config.custom) {
    rules.push({
      type: 'custom',
      value: config.custom,
      message: config.messages?.custom || defaultMessages.custom
    })
  }

  return { rules }
}
import { TextStyle, ViewStyle } from 'react-native';

export interface Theme {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  components?: ThemeComponents;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  disabled: string;
}

export interface ThemeTypography {
  fontFamily?: string;
  fontSize: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
  fontWeight: {
    regular: TextStyle['fontWeight'];
    medium: TextStyle['fontWeight'];
    bold: TextStyle['fontWeight'];
  };
  lineHeight: {
    small: number;
    medium: number;
    large: number;
  };
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeBorderRadius {
  small: number;
  medium: number;
  large: number;
  round: number;
}

export interface ThemeComponents {
  button?: {
    primary?: ViewStyle;
    secondary?: ViewStyle;
    text?: TextStyle;
  };
  input?: {
    container?: ViewStyle;
    input?: TextStyle;
    label?: TextStyle;
    error?: TextStyle;
  };
  card?: ViewStyle;
  progressBar?: {
    container?: ViewStyle;
    fill?: ViewStyle;
  };
}

export const defaultTheme: Theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#3C3C43',
    border: '#C6C6C8',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    info: '#5AC8FA',
    disabled: '#D1D1D6',
  },
  typography: {
    fontSize: {
      small: 12,
      medium: 16,
      large: 20,
      xlarge: 24,
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      bold: '700',
    },
    lineHeight: {
      small: 16,
      medium: 22,
      large: 28,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    round: 999,
  },
};

export function createTheme(overrides: Partial<Theme>): Theme {
  return {
    ...defaultTheme,
    ...overrides,
    colors: {
      ...defaultTheme.colors,
      ...(overrides.colors || {}),
    },
    typography: {
      ...defaultTheme.typography,
      ...(overrides.typography || {}),
      fontSize: {
        ...defaultTheme.typography.fontSize,
        ...(overrides.typography?.fontSize || {}),
      },
      fontWeight: {
        ...defaultTheme.typography.fontWeight,
        ...(overrides.typography?.fontWeight || {}),
      },
      lineHeight: {
        ...defaultTheme.typography.lineHeight,
        ...(overrides.typography?.lineHeight || {}),
      },
    },
    spacing: {
      ...defaultTheme.spacing,
      ...(overrides.spacing || {}),
    },
    borderRadius: {
      ...defaultTheme.borderRadius,
      ...(overrides.borderRadius || {}),
    },
    components: {
      ...defaultTheme.components,
      ...(overrides.components || {}),
    },
  };
}
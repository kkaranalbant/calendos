import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle[] => {
    const baseStyles = [styles.button, styles[`button_${variant}`]];

    if (size === 'small') baseStyles.push(styles.button_small);
    if (size === 'large') baseStyles.push(styles.button_large);
    if (fullWidth) baseStyles.push(styles.button_fullWidth);
    if (isDisabled) baseStyles.push(styles.button_disabled);
    if (style) baseStyles.push(style);

    return baseStyles;
  };

  const getTextStyle = (): TextStyle[] => {
    const baseStyles = [styles.text, styles[`text_${variant}`]];

    if (size === 'small') baseStyles.push(styles.text_small);
    if (size === 'large') baseStyles.push(styles.text_large);
    if (isDisabled) baseStyles.push(styles.text_disabled);
    if (textStyle) baseStyles.push(textStyle);

    return baseStyles;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? theme.colors.textInverse : theme.colors.primary}
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={getTextStyle()}>{title}</Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    minHeight: 48,
  },
  button_primary: {
    backgroundColor: theme.colors.primary,
  },
  button_secondary: {
    backgroundColor: theme.colors.secondary,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  button_text: {
    backgroundColor: 'transparent',
  },
  button_small: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    minHeight: 36,
  },
  button_large: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    minHeight: 56,
  },
  button_fullWidth: {
    width: '100%',
  },
  button_disabled: {
    backgroundColor: theme.colors.disabledBackground,
    borderColor: theme.colors.disabled,
  },
  text: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: 'center',
  },
  text_primary: {
    color: theme.colors.textInverse,
  },
  text_secondary: {
    color: theme.colors.textInverse,
  },
  text_outline: {
    color: theme.colors.primary,
  },
  text_text: {
    color: theme.colors.primary,
  },
  text_small: {
    fontSize: theme.typography.fontSize.sm,
  },
  text_large: {
    fontSize: theme.typography.fontSize.lg,
  },
  text_disabled: {
    color: theme.colors.disabled,
  },
});

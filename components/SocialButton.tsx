import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
} from 'react-native';

type SocialProvider = 'google' | 'github';

interface SocialButtonProps extends TouchableOpacityProps {
  provider: SocialProvider;
  isLoading?: boolean;
}

const providerConfig = {
  google: {
    title: 'Continuar com Google',
    backgroundColor: '#4285F4',
    textColor: '#FFFFFF',
  },
  github: {
    title: 'Continuar com GitHub',
    backgroundColor: '#24292e',
    textColor: '#FFFFFF',
  },
};

export function SocialButton({ 
  provider, 
  isLoading = false, 
  disabled,
  style,
  ...rest 
}: SocialButtonProps) {
  const config = providerConfig[provider];

  const renderIcon = () => {
    if (provider === 'google') {
      return <AntDesign name="google" size={20} color={config.textColor} />;
    } else {
      return <AntDesign name="github" size={20} color={config.textColor} />;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          opacity: disabled || isLoading ? 0.6 : 1,
        },
        style
      ]}
      activeOpacity={0.8}
      disabled={disabled || isLoading}
      {...rest}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {isLoading ? (
            <ActivityIndicator size="small" color={config.textColor} />
          ) : (
            renderIcon()
          )}
        </View>
        
        <Text style={[styles.text, { color: config.textColor }]}>
          {config.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 56,
    borderRadius: 8,
    marginVertical: 8,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: -36,
  },
});
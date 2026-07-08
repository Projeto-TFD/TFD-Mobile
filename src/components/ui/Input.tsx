import React, { forwardRef, useState } from 'react';
import { TextInput, TextInputProps, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type InputProps = TextInputProps & {
  label: string;
  error?: string;
  isPassword?: boolean;
};

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, isPassword, className, ...rest }, ref) => {
    const [hidden, setHidden] = useState(!!isPassword);

    return (
      <View className="mb-4">
        <Text className="text-sm font-semibold text-slate-800 mb-1.5">{label}</Text>
        <View
          className={`flex-row items-center border rounded-xl px-3.5 h-[52px] bg-white ${
            error ? 'border-danger' : 'border-slate-300'
          }`}
        >
          <TextInput
            ref={ref}
            className="flex-1 text-base text-slate-800 outline-none"
            secureTextEntry={hidden}
            placeholderTextColor="#8A8A8A"
            {...rest}
          />
          {isPassword && (
            <Pressable onPress={() => setHidden((prev) => !prev)} hitSlop={12}>
              <Ionicons name={hidden ? 'eye-off' : 'eye'} size={22} color="#5F6368" />
            </Pressable>
          )}
        </View>
        {error ? <Text className="mt-1 text-sm text-danger">{error}</Text> : null}
      </View>
    );
  }
);

Input.displayName = 'Input';
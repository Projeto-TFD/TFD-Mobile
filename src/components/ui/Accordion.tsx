import React, { useState } from 'react';
import { View, Text, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AccordionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  function toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((prev) => !prev);
  }

  return (
    <View className="border border-slate-200 rounded-xl bg-white mb-3 overflow-hidden">
      <Pressable className="flex-row items-center justify-between px-4 py-4" onPress={toggle}>
        <Text className="text-base font-semibold text-slate-800">{title}</Text>
        <Ionicons name={open ? 'chevron-down' : 'chevron-forward'} size={20} color="#1E5F8C" />
      </Pressable>
      {open && <View className="px-4 pb-4">{children}</View>}
    </View>
  );
}
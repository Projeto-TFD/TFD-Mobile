import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Option = { label: string; value: string };

type SelectProps = {
  label: string;
  placeholder?: string;
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
};

export function Select({ label, placeholder = 'Selecione', options, value, onChange }: SelectProps) {
  const [visible, setVisible] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-slate-800 mb-1.5">{label}</Text>
      <Pressable
        className="flex-row items-center justify-between border border-slate-300 rounded-xl px-3.5 h-[48px] bg-white"
        onPress={() => setVisible(true)}
      >
        <Text className={selected ? 'text-slate-800' : 'text-slate-400'}>
          {selected ? selected.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#5F6368" />
      </Pressable>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable className="flex-1 bg-black/40 justify-end" onPress={() => setVisible(false)}>
          <Pressable className="bg-white rounded-t-2xl max-h-[60%]" onPress={(e) => e.stopPropagation()}>
            <Text className="text-base font-semibold text-slate-800 px-4 pt-4 pb-2">{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  className="px-4 py-3 border-t border-slate-100"
                  onPress={() => {
                    onChange(item.value);
                    setVisible(false);
                  }}
                >
                  <Text className="text-slate-800">{item.label}</Text>
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
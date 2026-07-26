import React, { useRef, useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, findNodeHandle, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Option = { label: string; value: string };

type SelectProps = {
  label: string;
  placeholder?: string;
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
};

type Position = { x: number; y: number; width: number; height: number };

export function Select({ label, placeholder = 'Selecione', options, value, onChange }: SelectProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const triggerRef = useRef<View>(null);

  const selected = options.find((o) => o.value === value);

  function handleOpen() {
    const node = findNodeHandle(triggerRef.current);
    if (!node) return;

    UIManager.measureInWindow(node, (x, y, width, height) => {
      setPosition({ x, y, width, height });
      setVisible(true);
    });
  }

  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-slate-800 mb-1.5">{label}</Text>

      <View ref={triggerRef} collapsable={false}>
        <Pressable
          className="flex-row items-center justify-between border border-slate-300 rounded-xl px-3.5 h-[48px] bg-white"
          onPress={handleOpen}
        >
          <Text className={selected ? 'text-slate-800' : 'text-slate-400'}>
            {selected ? selected.label : placeholder}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#5F6368" />
        </Pressable>
      </View>

      <Modal visible={visible} transparent animationType="none" onRequestClose={() => setVisible(false)}>
        <Pressable className="flex-1" onPress={() => setVisible(false)}>
          {position && (
            <View
              className="absolute bg-white rounded-xl border border-slate-200 shadow-lg"
              style={{
                top: position.y + position.height + 4,
                left: position.x,
                width: position.width,
                maxHeight: 220,
              }}
              onStartShouldSetResponder={() => true}
            >
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item, index }) => (
                  <Pressable
                    className={`px-4 py-3 ${index > 0 ? 'border-t border-slate-100' : ''}`}
                    onPress={() => {
                      onChange(item.value);
                      setVisible(false);
                    }}
                  >
                    <Text className="text-slate-800">{item.label}</Text>
                  </Pressable>
                )}
              />
            </View>
          )}
        </Pressable>
      </Modal>
    </View>
  );
}
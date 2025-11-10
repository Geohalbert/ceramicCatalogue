import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import DropdownStyles from "./styles/DropdownStyles";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export default function Dropdown({ 
  options, 
  selectedValue, 
  onValueChange,
  placeholder
}: DropdownProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  
  const selectedOption = options.find(opt => opt.value === selectedValue);
  const displayText = selectedOption?.label || placeholder || t('dropdown.selectOption');

  const handleSelect = (value: string) => {
    onValueChange(value);
    setIsVisible(false);
  };

  const {
    container,
    trigger,
    triggerText,
    modal,
    modalContent,
    modalHeader,
    modalTitle,
    closeButton,
    closeButtonText,
    optionItem,
    optionItemSelected,
    optionText,
    optionTextSelected,
  } = DropdownStyles;

  return (
    <View style={container}>
      <TouchableOpacity 
        style={[trigger, { backgroundColor: colors.inputBackground, borderColor: colors.border }]} 
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={[triggerText, { color: colors.text }]}>{displayText}</Text>
        <Text style={[triggerText, { color: colors.text }]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity 
          style={modal}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <TouchableOpacity 
            style={[modalContent, { backgroundColor: colors.card }]}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[modalTitle, { color: colors.text }]}>{t('dropdown.modalTitle')}</Text>
              <TouchableOpacity 
                style={closeButton}
                onPress={() => setIsVisible(false)}
              >
                <Text style={[closeButtonText, { color: colors.secondaryText }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === selectedValue;
                return (
                  <TouchableOpacity
                    style={[
                      optionItem, 
                      { borderBottomColor: colors.border },
                      isSelected && { backgroundColor: colors.info }
                    ]}
                    onPress={() => handleSelect(item.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      optionText, 
                      { color: colors.text },
                      isSelected && { color: colors.primary, fontWeight: '600' }
                    ]}>
                      {item.label}
                    </Text>
                    {isSelected && <Text style={{ color: colors.primary, fontWeight: '600' }}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}


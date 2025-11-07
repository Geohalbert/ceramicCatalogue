import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
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
        style={trigger} 
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={triggerText}>{displayText}</Text>
        <Text style={triggerText}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={modal}>
          <View style={modalContent}>
            <View style={modalHeader}>
              <Text style={modalTitle}>{t('dropdown.modalTitle')}</Text>
              <TouchableOpacity 
                style={closeButton}
                onPress={() => setIsVisible(false)}
              >
                <Text style={closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === selectedValue;
                return (
                  <TouchableOpacity
                    style={[optionItem, isSelected && optionItemSelected]}
                    onPress={() => handleSelect(item.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={[optionText, isSelected && optionTextSelected]}>
                      {item.label}
                    </Text>
                    {isSelected && <Text style={optionTextSelected}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}


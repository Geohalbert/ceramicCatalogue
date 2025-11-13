import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

export type SortOrder = 'nameAsc' | 'nameDesc' | 'dateOldest' | 'dateNewest';

interface SortBarProps {
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

export default function SortBar({ sortOrder, onSortChange }: SortBarProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const sortOptions: { key: SortOrder; label: string }[] = [
    { key: 'nameAsc', label: t('collection.sort.nameAsc') },
    { key: 'nameDesc', label: t('collection.sort.nameDesc') },
    { key: 'dateOldest', label: t('collection.sort.dateOldest') },
    { key: 'dateNewest', label: t('collection.sort.dateNewest') },
  ];

  return (
    <View
      style={{
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 15,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={{
              flex: 1,
              minWidth: '22%',
              paddingVertical: 10,
              paddingHorizontal: 8,
              borderRadius: 20,
              backgroundColor: sortOrder === option.key ? colors.primary : colors.card,
              borderWidth: 1,
              borderColor: sortOrder === option.key ? colors.primary : colors.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => onSortChange(option.key)}
            activeOpacity={0.7}
          >
            <Text
              style={{
                color: sortOrder === option.key ? '#fff' : colors.text,
                fontSize: 12,
                fontWeight: sortOrder === option.key ? '600' : 'normal',
                textAlign: 'center',
              }}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}


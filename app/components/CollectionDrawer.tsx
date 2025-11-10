import { View, Text, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useRef } from 'react';

interface CollectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilter: 'all' | 'inProgress' | 'finished' | 'firing' | 'drying';
  onFilterChange: (filter: 'all' | 'inProgress' | 'finished' | 'firing' | 'drying') => void;
}

const DRAWER_WIDTH = Dimensions.get('window').width * 0.75;

export default function CollectionDrawer({ 
  isOpen, 
  onClose, 
  selectedFilter, 
  onFilterChange 
}: CollectionDrawerProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -DRAWER_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen, slideAnim]);

  const handleNavigate = (screen: string) => {
    onClose();
    setTimeout(() => {
      navigation.navigate(screen);
    }, 300);
  };

  const handleFilterSelect = (filter: 'all' | 'inProgress' | 'finished' | 'firing' | 'drying') => {
    onFilterChange(filter);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Overlay */}
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Drawer */}
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: DRAWER_WIDTH,
            backgroundColor: colors.card,
            transform: [{ translateX: slideAnim }],
            shadowColor: '#000',
            shadowOffset: { width: 2, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <View style={{ flex: 1, paddingTop: 60, paddingHorizontal: 20 }}>
            {/* Header */}
            <Text style={{ 
              fontSize: 24, 
              fontWeight: 'bold', 
              color: colors.text, 
              marginBottom: 30 
            }}>
              {t('collection.drawer.title')}
            </Text>

            {/* Navigation Section */}
            <View style={{ marginBottom: 30 }}>
              <Text style={{ 
                fontSize: 12, 
                fontWeight: '600', 
                color: colors.secondaryText, 
                marginBottom: 10,
                textTransform: 'uppercase'
              }}>
                {t('collection.drawer.navigation')}
              </Text>
              
              <TouchableOpacity
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 15,
                  backgroundColor: colors.secondaryBackground,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
                onPress={() => handleNavigate('Home')}
              >
                <Text style={{ fontSize: 16, color: colors.text }}>
                  🏠 {t('collection.drawer.home')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 15,
                  backgroundColor: colors.secondaryBackground,
                  borderRadius: 8,
                }}
                onPress={() => handleNavigate('Settings')}
              >
                <Text style={{ fontSize: 16, color: colors.text }}>
                  ⚙️ {t('collection.drawer.settings')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Filter Section */}
            <View>
              <Text style={{ 
                fontSize: 12, 
                fontWeight: '600', 
                color: colors.secondaryText, 
                marginBottom: 10,
                textTransform: 'uppercase'
              }}>
                {t('collection.drawer.filterBy')}
              </Text>

              <TouchableOpacity
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 15,
                  backgroundColor: selectedFilter === 'all' ? colors.primary : colors.secondaryBackground,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
                onPress={() => handleFilterSelect('all')}
              >
                <Text style={{ 
                  fontSize: 16, 
                  color: selectedFilter === 'all' ? '#fff' : colors.text,
                  fontWeight: selectedFilter === 'all' ? '600' : 'normal'
                }}>
                  {t('collection.drawer.filters.all')} {selectedFilter === 'all' && '✓'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 15,
                  backgroundColor: selectedFilter === 'inProgress' ? colors.primary : colors.secondaryBackground,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
                onPress={() => handleFilterSelect('inProgress')}
              >
                <Text style={{ 
                  fontSize: 16, 
                  color: selectedFilter === 'inProgress' ? '#fff' : colors.text,
                  fontWeight: selectedFilter === 'inProgress' ? '600' : 'normal'
                }}>
                  {t('collection.drawer.filters.inProgress')} {selectedFilter === 'inProgress' && '✓'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 15,
                  backgroundColor: selectedFilter === 'finished' ? colors.primary : colors.secondaryBackground,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
                onPress={() => handleFilterSelect('finished')}
              >
                <Text style={{ 
                  fontSize: 16, 
                  color: selectedFilter === 'finished' ? '#fff' : colors.text,
                  fontWeight: selectedFilter === 'finished' ? '600' : 'normal'
                }}>
                  {t('collection.drawer.filters.finished')} {selectedFilter === 'finished' && '✓'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 15,
                  backgroundColor: selectedFilter === 'firing' ? colors.primary : colors.secondaryBackground,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
                onPress={() => handleFilterSelect('firing')}
              >
                <Text style={{ 
                  fontSize: 16, 
                  color: selectedFilter === 'firing' ? '#fff' : colors.text,
                  fontWeight: selectedFilter === 'firing' ? '600' : 'normal'
                }}>
                  {t('collection.drawer.filters.firing')} {selectedFilter === 'firing' && '✓'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 15,
                  backgroundColor: selectedFilter === 'drying' ? colors.primary : colors.secondaryBackground,
                  borderRadius: 8,
                }}
                onPress={() => handleFilterSelect('drying')}
              >
                <Text style={{ 
                  fontSize: 16, 
                  color: selectedFilter === 'drying' ? '#fff' : colors.text,
                  fontWeight: selectedFilter === 'drying' ? '600' : 'normal'
                }}>
                  {t('collection.drawer.filters.drying')} {selectedFilter === 'drying' && '✓'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}


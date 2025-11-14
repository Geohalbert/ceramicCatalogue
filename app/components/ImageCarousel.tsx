import { useState } from 'react';
import { View, Image, Text, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { PotteryImage } from '../store/types';

interface ImageCarouselProps {
  images: PotteryImage[];
  height?: number;
  showTitle?: boolean;
  fallbackImage?: any;
}

export default function ImageCarousel({ 
  images, 
  height = 200, 
  showTitle = true,
  fallbackImage = require('../../assets/pot_icon.png')
}: ImageCarouselProps) {
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = Dimensions.get('window');

  // If no images, show fallback
  if (!images || images.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Image 
          source={fallbackImage} 
          style={[styles.image, { width, height }]} 
          resizeMode="cover"
        />
      </View>
    );
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    if (currentIndex >= 0 && currentIndex < images.length) {
      setActiveIndex(currentIndex);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ height }}
      >
        {images.map((image, index) => (
          <View key={index} style={{ width, height }}>
            <Image 
              source={{ uri: image.uri }} 
              style={[styles.image, { width, height }]} 
              resizeMode="cover"
            />
            
            {/* Image Title Overlay */}
            {showTitle && image.title && (
              <View style={[styles.titleOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}>
                <Text style={styles.titleText} numberOfLines={2}>
                  {image.title}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots - only show if more than 1 image */}
      {images.length > 1 && (
        <View style={styles.pagination}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === activeIndex ? colors.primary : '#ffffff',
                  opacity: index === activeIndex ? 1 : 0.5,
                }
              ]}
            />
          ))}
        </View>
      )}

      {/* Image Counter Badge */}
      {images.length > 1 && (
        <View style={[styles.counterBadge, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
          <Text style={styles.counterText}>
            {activeIndex + 1}/{images.length}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#f0f0f0',
  },
  image: {
    backgroundColor: '#f0f0f0',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  titleText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  pagination: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  counterBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  counterText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});


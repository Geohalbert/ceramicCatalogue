import { useState } from 'react';
import { View, Image, Text, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { PotteryImage } from '../store/types';
import ImageCarouselStyles from './styles/ImageCarouselStyles';

interface ImageCarouselProps {
  images: PotteryImage[];
  height?: number;
  showTitle?: boolean;
  fallbackImage?: any;
  onImagePress?: (index: number) => void;
  interactive?: boolean;
}

export default function ImageCarousel({ 
  images, 
  height = 200, 
  showTitle = true,
  fallbackImage = require('../../assets/pot_icon.png'),
  onImagePress,
  interactive = false
}: ImageCarouselProps) {
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = Dimensions.get('window');
  const { container, image, titleOverlay, titleText, pagination, dot, counterBadge, counterText, tapIndicator, tapIndicatorText } = ImageCarouselStyles;

  // If no images, show fallback
  if (!images || images.length === 0) {
    return (
      <View style={[container, { height }]}>
        <Image 
          source={fallbackImage} 
          style={[image, { width, height }]} 
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
    <View style={container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ height }}
        contentContainerStyle={{ width: width * images.length, height }}
      >
        {images.map((img, index) => {
          const ImageWrapper = interactive ? TouchableOpacity : View;
          
          return (
            <ImageWrapper 
              key={index} 
              style={{ width, height, flex: 0 }}
              onPress={interactive ? () => onImagePress?.(index) : undefined}
              activeOpacity={0.8}
            >
              <Image 
                source={{ uri: img.uri }} 
                style={[image, { width, height }]} 
                resizeMode="cover"
              />
              
              {/* Image Title Overlay */}
              {showTitle && img.title && (
                <View style={[titleOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}>
                  <Text style={titleText} numberOfLines={2}>
                    {img.title}
                  </Text>
                </View>
              )}
              
              {/* Tap to Edit Indicator */}
              {interactive && (
                <View style={[tapIndicator, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
                  <Text style={tapIndicatorText}>✏️ Tap to Edit</Text>
                </View>
              )}
            </ImageWrapper>
          );
        })}
      </ScrollView>

      {/* Pagination Dots - only show if more than 1 image */}
      {images.length > 1 && (
        <View style={pagination}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                dot,
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
        <View style={[counterBadge, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
          <Text style={counterText}>
            {activeIndex + 1}/{images.length}
          </Text>
        </View>
      )}
    </View>
  );
}

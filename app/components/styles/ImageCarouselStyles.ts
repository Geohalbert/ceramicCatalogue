import { StyleSheet } from "react-native";

const ImageCarouselStyles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  counterBadge: {
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    position: 'absolute',
    right: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    top: 15,
  },
  counterText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  dot: {
    borderRadius: 4,
    height: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width: 8,
  },
  image: {
    backgroundColor: '#f0f0f0',
  },
  pagination: {
    alignItems: 'center',
    bottom: 60,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
  },
  placeholderButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  placeholderContainer: {
    alignItems: 'center',
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderWidth: 2,
    justifyContent: 'center',
  },
  placeholderImage: {
    marginBottom: 10,
    opacity: 0.3,
  },
  placeholderText: {
    fontSize: 32,
    marginBottom: 8,
  },
  tapIndicator: {
    borderRadius: 20,
    left: '50%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    top: 15,
    transform: [{ translateX: -60 }],
  },
  tapIndicatorText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  titleOverlay: {
    bottom: 0,
    left: 0,
    paddingHorizontal: 15,
    paddingVertical: 12,
    position: 'absolute',
    right: 0,
  },
  titleText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default ImageCarouselStyles;


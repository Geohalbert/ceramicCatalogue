import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../context/ThemeContext";
import { getRemainingTime } from "../services/notificationService";

import { Pottery } from "../store/types";

import PotteryTileStyles from "./styles/PotteryTileStyles";

interface PotteryTileProps {
  pottery: Pottery;
}

export default function PotteryTile({ pottery }: PotteryTileProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { container, image, name, type, date, status, timerBadge, timerText } = PotteryTileStyles;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handlePress = () => {
    navigation.navigate('AddItem', { pottery });
  };

  // Calculate remaining time if timer is set
  const hasActiveTimer = pottery.timerStartDate && pottery.timerDays;
  const remainingTime = hasActiveTimer 
    ? getRemainingTime(pottery.timerStartDate!, pottery.timerDays!) 
    : null;

  // Get the LAST image from the array, or fall back to legacy imageUri
  const lastImageUri = pottery.images && pottery.images.length > 0 
    ? pottery.images[pottery.images.length - 1].uri 
    : pottery.imageUri;

  if (pottery) {
  return (
    <TouchableOpacity style={[container, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={handlePress}>
      <Image 
        source={lastImageUri ? { uri: lastImageUri } : require('../../assets/pot_icon.png')} 
        style={image} 
      />
      <Text style={[name, { color: colors.text }]}>{pottery.potName || t('potteryTile.unnamed')}</Text>
      <Text style={[type, { color: colors.secondaryText }]}>{pottery.designType}</Text>
      <Text style={[date, { color: colors.secondaryText }]}>{pottery.dateCreated}</Text>
      <Text style={[status, { color: colors.secondaryText }]}>{pottery.potStatus}</Text>
      
      {/* Timer Badge */}
      {hasActiveTimer && remainingTime && !remainingTime.isExpired && (
        <View style={[timerBadge, { backgroundColor: colors.warning }]}>
          <Text style={timerText}>
            ⏱️ {remainingTime.days}d {remainingTime.hours}h
          </Text>
        </View>
      )}
      {hasActiveTimer && remainingTime && remainingTime.isExpired && (
        <View style={[timerBadge, { backgroundColor: colors.success }]}>
          <Text style={timerText}>✓ {t('potteryTile.timerComplete')}</Text>
        </View>
      )}
    </TouchableOpacity>
  );}
}
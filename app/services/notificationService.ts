import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request notification permissions
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }

    // For Android, configure the notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('pottery-timers', {
        name: 'Pottery Timers',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF6B6B',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Schedule a notification for pottery status (Firing, Drying, or In Progress)
 */
export const schedulePotteryNotification = async (
  potteryName: string,
  status: 'Firing' | 'Drying' | 'In Progress',
  duration: number, // Duration in days or minutes
  time?: string, // Optional time in HH:MM format
  isMinutes?: boolean // If true, duration is in minutes; if false, duration is in days
): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      throw new Error('Notification permissions not granted');
    }

    let trigger: Notifications.NotificationTriggerInput;

    if (isMinutes) {
      // Timer based on minutes - use Date object for more reliable scheduling
      if (duration <= 0) {
        throw new Error('Cannot schedule notification with zero or negative minutes');
      }
      const now = new Date();
      const targetDate = new Date(now.getTime() + duration * 60 * 1000); // Add minutes in milliseconds
      const seconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000);
      console.log(`Scheduling minute-based notification: ${duration} minutes, target date: ${targetDate.toISOString()}, seconds until: ${seconds}, now: ${now.toISOString()}`);
      if (seconds <= 0) {
        throw new Error(`Invalid seconds calculation: ${seconds}. Target date: ${targetDate.toISOString()}, Now: ${now.toISOString()}`);
      }
      // Ensure minimum 1 second delay to prevent immediate notification
      if (seconds < 1) {
        throw new Error('Notification must be scheduled for at least 1 second in the future');
      }
      trigger = {
        date: targetDate,
        channelId: Platform.OS === 'android' ? 'pottery-timers' : undefined,
      };
    } else if (time) {
      // Custom timer with specific time
      const [hours, minutes] = time.split(':').map(Number);
      const now = new Date();
      const targetDate = new Date();
      
      // Set target date to X days from now
      targetDate.setDate(now.getDate() + duration);
      targetDate.setHours(hours, minutes, 0, 0);

      // If the target date/time has already passed, add one more day
      if (targetDate <= now) {
        targetDate.setDate(targetDate.getDate() + 1);
      }

      const secondsUntilNotification = Math.floor((targetDate.getTime() - now.getTime()) / 1000);
      
      console.log(`Scheduling custom time notification: ${duration} days, time ${time}, target date: ${targetDate.toISOString()}, seconds until: ${secondsUntilNotification}, now: ${now.toISOString()}`);
      
      // Ensure we're scheduling for a future time
      if (secondsUntilNotification <= 0) {
        throw new Error(`Cannot schedule notification in the past. Seconds: ${secondsUntilNotification}, Target: ${targetDate.toISOString()}, Now: ${now.toISOString()}`);
      }
      // Ensure minimum 1 second delay to prevent immediate notification
      if (secondsUntilNotification < 1) {
        throw new Error('Notification must be scheduled for at least 1 second in the future');
      }
      
      // Use Date object for more reliable scheduling
      trigger = {
        date: targetDate,
        channelId: Platform.OS === 'android' ? 'pottery-timers' : undefined,
      };
    } else {
      // Simple timer based on days only - use Date object for more reliable scheduling
      if (duration < 0) {
        throw new Error('Cannot schedule notification with negative days');
      }
      if (duration === 0) {
        throw new Error('Cannot schedule notification for 0 days without a custom time');
      }
      const now = new Date();
      const targetDate = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000); // Add days in milliseconds
      const seconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000);
      console.log(`Scheduling day-based notification: ${duration} days, target date: ${targetDate.toISOString()}, seconds until: ${seconds}, now: ${now.toISOString()}`);
      if (seconds <= 0) {
        throw new Error(`Invalid seconds calculation: ${seconds}. Target date: ${targetDate.toISOString()}, Now: ${now.toISOString()}`);
      }
      // Ensure minimum 1 second delay to prevent immediate notification
      if (seconds < 1) {
        throw new Error('Notification must be scheduled for at least 1 second in the future');
      }
      trigger = {
        date: targetDate,
        channelId: Platform.OS === 'android' ? 'pottery-timers' : undefined,
      };
    }

    console.log(`Final trigger object:`, JSON.stringify(trigger, null, 2));
    
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: status === 'In Progress' ? `Timer Complete! 🎨` : `${status} Complete! 🎨`,
        body: status === 'In Progress' 
          ? `Your pottery "${potteryName}" timer is complete. Time to check on it!`
          : `Your pottery "${potteryName}" has finished ${status.toLowerCase()}. Time to check on it!`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { potteryName, status },
      },
      trigger,
    });

    console.log(`Notification scheduled with ID: ${notificationId}, trigger:`, trigger);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

/**
 * Cancel a scheduled notification
 */
export const cancelPotteryNotification = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log(`Notification ${notificationId} cancelled`);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
  }
};

/**
 * Get all scheduled notifications
 */
export const getAllScheduledNotifications = async () => {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    return notifications;
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

/**
 * Calculate remaining time for a timer
 */
export const getRemainingTime = (timerStartDate: string, timerDays: number): { 
  days: number; 
  hours: number; 
  minutes: number;
  isExpired: boolean;
} => {
  const startDate = new Date(timerStartDate);
  const endDate = new Date(startDate.getTime() + timerDays * 24 * 60 * 60 * 1000);
  const now = new Date();
  const remaining = endDate.getTime() - now.getTime();

  if (remaining <= 0) {
    return { days: 0, hours: 0, minutes: 0, isExpired: true };
  }

  const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

  return { days, hours, minutes, isExpired: false };
};


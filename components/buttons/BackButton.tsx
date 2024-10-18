import { Image, TouchableOpacity, BackHandler, Platform } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { leftArrow } from '@/utils/constants/images';

export function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const disableBack = pathname.includes('/student/courses/RCA/');

  useEffect(() => {
    if (Platform.OS === 'android') {
      const onBackPress = () => {
        if (disableBack) {
          return true;
        }
        return false; 
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }
  }, [disableBack]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handlePopState = (event: PopStateEvent) => {
        if (disableBack) {
          event.preventDefault();
          window.history.pushState({}, '', window.location.pathname);
        }
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [disableBack]);

  return (
    <TouchableOpacity
      onPress={() => {
        if (!disableBack && router.canGoBack()) {
          router.back();
        }
      }}
      disabled={disableBack} 
    >
      <Image source={leftArrow} />
    </TouchableOpacity>
  );
}

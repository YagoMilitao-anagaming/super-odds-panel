'use client';
import { useEffect, useState } from 'react';

type MediaQueryListsProps =
  | 'is1920'
  | 'is1600'
  | 'is1440'
  | 'is1024'
  | 'is768'
  | 'is425'
  | 'is375'
  | 'is360';

export const useMediaQuery = () => {
  const [breakpoints, setBreakpoints] = useState({
    is1920: false,
    is1600: false,
    is1440: false,
    is1024: false,
    is768: false,
    is425: false,
    is375: false,
    is360: false,
  });

  useEffect(() => {
    const mediaQueryLists = {
      is1920: window.matchMedia('(max-width: 1920px)'),
      is1600: window.matchMedia('(max-width: 1600px)'),
      is1440: window.matchMedia('(max-width: 1440px)'),
      is1024: window.matchMedia('(max-width: 1024px)'),
      is768: window.matchMedia('(max-width: 768px)'),
      is425: window.matchMedia('(max-width: 430px)'),
      is375: window.matchMedia('(max-width: 375px)'),
      is360: window.matchMedia('(max-width: 360px)'),
    };

    const handleMediaQueryChange = () => {
      setBreakpoints({
        is1920: mediaQueryLists.is1920.matches,
        is1600: mediaQueryLists.is1600.matches,
        is1440: mediaQueryLists.is1440.matches,
        is1024: mediaQueryLists.is1024.matches,
        is768: mediaQueryLists.is768.matches,
        is425: mediaQueryLists.is425.matches,
        is375: mediaQueryLists.is375.matches,
        is360: mediaQueryLists.is360.matches,
      });
    };

    // Set the initial values
    handleMediaQueryChange();

    // Add event listeners
    for (let key in mediaQueryLists) {
      mediaQueryLists[key as MediaQueryListsProps].addEventListener(
        'change',
        handleMediaQueryChange,
      );
    }

    // Cleanup event listeners on unmount
    return () => {
      for (let key in mediaQueryLists) {
        mediaQueryLists[key as MediaQueryListsProps].removeEventListener(
          'change',
          handleMediaQueryChange,
        );
      }
    };
  }, []);

  return breakpoints;
};

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useListNavigation } from './useListNavigation';
import { findAtTokenAtCursor } from '../lib/tokenUtils';

type TriggerType = 'at' | 'tab' | null;

export interface PathSuggestion {
  name: string;
  description: string;
}

interface MatchResult {
  hasQuery: boolean;
  fullMatch: string;
  query: string;
  startIndex: number;
  triggerType: TriggerType;
}

interface UseFileSuggestionProps {
  value: string;
  cursorPosition: number;
  forceTabTrigger: boolean;
  fetchPaths: () => Promise<PathSuggestion[]>;
  disabled?: boolean; // Disable suggestions when in logger mode
}

export function useFileSuggestion({
  value,
  cursorPosition,
  forceTabTrigger,
  fetchPaths,
  disabled = false,
}: UseFileSuggestionProps) {
  const [paths, setPaths] = useState<PathSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const atMatch = useMemo((): MatchResult => {
    console.log(
      '[useFileSuggestion] computing atMatch, value:',
      JSON.stringify(value),
      'cursorPosition:',
      cursorPosition,
    );
    const tokenRange = findAtTokenAtCursor(value, cursorPosition);

    if (!tokenRange) {
      console.log('[useFileSuggestion] no tokenRange found');
      return {
        hasQuery: false,
        fullMatch: '',
        query: '',
        startIndex: -1,
        triggerType: null,
      };
    }

    const { startIndex, fullMatch } = tokenRange;
    // Query is text between @ and cursor (for partial matching during typing)
    let query = value.substring(startIndex + 1, cursorPosition);
    if (query.startsWith('"')) {
      query = query.slice(1).replace(/"$/, '');
    }

    return {
      hasQuery: true,
      fullMatch,
      query,
      startIndex,
      triggerType: 'at',
    };
  }, [value, cursorPosition]);

  const tabMatch = useMemo((): MatchResult => {
    if (!forceTabTrigger) {
      return {
        hasQuery: false,
        fullMatch: '',
        query: '',
        startIndex: -1,
        triggerType: null,
      };
    }

    const beforeCursor = value.substring(0, cursorPosition);
    const wordMatch = beforeCursor.match(/([^\s]*)$/);

    if (!wordMatch || !wordMatch[1] || beforeCursor.match(/@[^\s]*$/)) {
      return {
        hasQuery: false,
        fullMatch: '',
        query: '',
        startIndex: -1,
        triggerType: null,
      };
    }

    const currentWord = wordMatch[1];
    return {
      hasQuery: true,
      fullMatch: currentWord,
      query: currentWord,
      startIndex: beforeCursor.length - currentWord.length,
      triggerType: 'tab',
    };
  }, [value, cursorPosition, forceTabTrigger]);

  const activeMatch = atMatch.hasQuery ? atMatch : tabMatch;

  const matchedPaths = useMemo(() => {
    if (disabled) return [];
    if (!activeMatch.hasQuery) return [];
    if (activeMatch.query === '') return paths;
    return paths.filter((p) =>
      p.name.toLowerCase().includes(activeMatch.query.toLowerCase()) ||
      p.description.toLowerCase().includes(activeMatch.query.toLowerCase()),
    );
  }, [paths, activeMatch, disabled]);

  const navigation = useListNavigation(matchedPaths);

  useEffect(() => {
    if (disabled) return;
    if (activeMatch.hasQuery && paths.length === 0) {
      setIsLoading(true);
      fetchPaths()
        .then(setPaths)
        .finally(() => setIsLoading(false));
    }
  }, [activeMatch.hasQuery, paths.length, fetchPaths, disabled]);

  const getSelected = useCallback(() => {
    const selected = navigation.getSelected();
    if (!selected) return null;
    return selected;
  }, [navigation]);

  const clearPaths = useCallback(() => {
    setPaths([]);
  }, []);

  return {
    matchedPaths,
    isLoading,
    selectedIndex: navigation.selectedIndex,
    startIndex: activeMatch.startIndex,
    fullMatch: activeMatch.fullMatch,
    triggerType: activeMatch.triggerType,
    navigateNext: navigation.navigateNext,
    navigatePrevious: navigation.navigatePrevious,
    reset: navigation.reset,
    getSelected,
    clearPaths,
  };
}

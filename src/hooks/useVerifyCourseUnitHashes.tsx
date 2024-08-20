import useSWR from 'swr';
import api from '../api/backend';
import { CourseInfo } from '../@types';

/**
 * Fetcher function to get course unit hashes and verify them.
 * @param courseUnits Array of course units with expected hashes
 * @returns Set of course unit IDs with mismatched hashes
 */
const fetchAndVerifyCourseUnitHashes = async (courseUnits: CourseInfo[]) => {
  if (!courseUnits || courseUnits.length === 0) {
    return new Set<number>();
  }

  const ids = courseUnits.map(course => course.id);
  try {
    const response = await api.getCourseUnitHashes(ids);
    const currentHashes: Record<number, string> = response;

    const mismatchedIds = new Set<number>();

    courseUnits.forEach(course => {
      const backendHash = currentHashes[course.id];
      if (backendHash !== course.hash) {
        mismatchedIds.add(course.id);
      }
    });

    return mismatchedIds;
  } catch (error) {
    console.error('Failed to fetch or verify course unit hashes:', error);
    throw error;
  }
};

/**
 * Hook to fetch and verify course unit hashes using SWR for periodic revalidation.
 * @param courseUnits Array of course units to verify
 * @returns Object containing the set of IDs with mismatched hashes, any error, and a function to manually trigger revalidation
 */
const useVerifyCourseUnitHashes = (courseUnits: CourseInfo[]) => {
  const { data, error, mutate } = useSWR(
    courseUnits.length > 0 ? courseUnits : null,
    fetchAndVerifyCourseUnitHashes,
    {
      refreshInterval: 300000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    mismatchedIds: data ?? new Set<number>(),
    error,
    mutate,
  };
};

export default useVerifyCourseUnitHashes;

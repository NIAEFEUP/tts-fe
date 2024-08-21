import useSWR from 'swr';
import api from '../api/backend';
import { CourseInfo } from '../@types';

/**
 * Fetcher function to get course unit hashes and verify them.
 * @param courseUnits Array of course units with expected hashes
 * @returns Map of course unit IDs with correct hashes for mismatched ones
 */
const fetchAndVerifyCourseUnitHashes = async (courseUnits: CourseInfo[]) => {
  if (!courseUnits || courseUnits.length === 0) {
    return new Map<number, string>();
  }

  const ids = courseUnits.map(course => course.id);
  try {
    const response = await api.getCourseUnitHashes(ids);
    const currentHashes: Record<number, string> = response;

    const mismatchedMap = new Map<number, string>();

    courseUnits.forEach(course => {
      const backendHash = currentHashes[course.id];
      if (backendHash !== course.hash) {
        mismatchedMap.set(course.id, backendHash);
      }
    });

    return mismatchedMap;
  } catch (error) {
    console.error('Failed to fetch or verify course unit hashes:', error);
    throw error;
  }
};

/**
 * Hook to fetch and verify course unit hashes using SWR for periodic revalidation.
 * @param courseUnits Array of course units to verify
 * @returns Object containing the map of IDs with mismatched hashes and correct hashes, any error, and a function to manually trigger revalidation
 */
const useVerifyCourseUnitHashes = (courseUnits: CourseInfo[]) => {
  const { data, error, mutate } = useSWR(
    courseUnits.length > 0 ? courseUnits : null,
    fetchAndVerifyCourseUnitHashes,
    {
      revalidateOnReconnect: true,
    }
  );

  return {
    mismatchedMap: data ?? new Map<number, string>(),
    error,
    mutate,
  };
};

export default useVerifyCourseUnitHashes;

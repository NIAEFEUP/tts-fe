import useSWR from 'swr';
import api from '../api/backend';
import { CourseInfo } from '../@types';

/**
 * Fetcher function to get course unit hashes and verify them.
 * @param courseUnits Array of course units with expected hashes
 * @returns Object with course unit IDs, their hashes, and validity
 */
const fetchAndVerifyCourseUnitHashes = async (courseUnits: CourseInfo[]) => {
  if (!courseUnits || courseUnits.length === 0) {
    console.log('No course units provided');
    return { currentHashes: {}, hashValidationMap: {} };
  }

  const ids = courseUnits.map(course => course.id);
  console.log('Fetching and verifying course unit hashes for IDs:', ids);

  try {

    const response = await api.getCourseUnitHashes(ids);
    const currentHashes: Record<number, string> = response;

    const hashValidationMap: Record<number, boolean> = {};


    courseUnits.forEach(course => {
      const backendHash = currentHashes[course.id];
      const isValid = backendHash === course.hash;
      hashValidationMap[course.id] = isValid;


    });

    return {
      currentHashes,
      hashValidationMap,
    };
  } catch (error) {
    console.error('Failed to fetch or verify course unit hashes:', error);
    throw error;
  }
};


/**
 * Hook to fetch and verify course unit hashes using SWR for periodic revalidation.
 * @param courseUnits Array of course units to verify
 * @returns Object containing the hash validation map, any error, and a function to manually trigger revalidation
 */
const useVerifyCourseUnitHashes = (courseUnits: CourseInfo[]) => {
  const { data, error, mutate } = useSWR(
    courseUnits.length > 0 ? courseUnits : null,
    fetchAndVerifyCourseUnitHashes,
    {
      refreshInterval: 10000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    hashValidationMap: data?.hashValidationMap ?? {},
    error,
    mutate,
  };
};

export default useVerifyCourseUnitHashes;

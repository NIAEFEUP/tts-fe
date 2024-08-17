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
    // Fetch the current hashes from the backend
    const response = await api.getCourseUnitHashes(ids);
    const currentHashes: Record<number, string> = response;

    // Initialize hash validation map
    const hashValidationMap: Record<number, boolean> = {};

    // Validate the fetched hashes against expected hashes
    courseUnits.forEach(course => {
      const backendHash = currentHashes[course.id];
      const isValid = backendHash === course.hash;
      hashValidationMap[course.id] = isValid;

      // Detailed log for each course unit
      console.log(`Course ID: ${course.id}`);
      console.log(`Expected hash: ${course.hash}`);
      console.log(`Backend hash: ${backendHash}`);
      console.log(`Hash match: ${isValid}`);
    });

    // Log the complete validation map
    console.log('Hash Validation Map:', hashValidationMap);

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
    courseUnits.length > 0 ? courseUnits : null, // Use courseUnits as the key
    fetchAndVerifyCourseUnitHashes,              // Fetcher function
    {
      refreshInterval: 10000,                    // Periodically refresh data every 10 seconds
      revalidateOnFocus: true,                   // Revalidate when window gains focus
      revalidateOnReconnect: true,               // Revalidate when reconnecting
    }
  );

  return {
    hashValidationMap: data?.hashValidationMap ?? {}, // Map of course unit ID to boolean indicating hash validity
    error,                                          // Any error that occurred during the fetch
    mutate,                                         // Function to manually trigger revalidation
  };
};

export default useVerifyCourseUnitHashes;

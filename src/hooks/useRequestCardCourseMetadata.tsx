import useSWR from "swr";
import { CourseInfo } from "../@types";
import exchangeRequestService from "../api/services/exchangeRequestService";

/*
 * This hook contains logic to retrieve the students and classes of a course info to be used to populate the information
 * on the request cards
*/
export default (courseInfo: CourseInfo) => {
  const { data, isLoading } = useSWR(
    `${courseInfo.id}`,
    exchangeRequestService.retrieveRequestCardMetadata
  );

  return {
    data,
    isLoading,
  }
};


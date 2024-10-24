import useSentRequests from "../../../../hooks/useSentRequests"
import { Card } from "../../../ui/card";

export const ViewSentRequests = () => {
  const { data: requests } = useSentRequests();

  return <Card>

  </Card>
}

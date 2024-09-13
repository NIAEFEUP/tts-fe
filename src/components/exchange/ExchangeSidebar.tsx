import { useState } from "react";
import { CreateRequest } from "./requests/issue/CreateRequest";
import { ViewRequests } from "./requests/view/ViewRequests";

export const ExchangeSidebar = () => {
  const [creatingRequest, setCreatingRequest] = useState<boolean>(false);

  return <div className="lg:min-h-adjusted order-2 col-span-12 flex min-h-min flex-col justify-between rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-3 2xl:px-4 2xl:py-4">
    <div className="space-y-2">
      {
        creatingRequest
          ? <CreateRequest setCreatingRequest={setCreatingRequest} />
          : <ViewRequests setCreatingRequest={setCreatingRequest} />
      }
    </div>
  </div>
}

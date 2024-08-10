import { PlusIcon } from "@heroicons/react/24/outline"
import { useState } from "react";
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { IssueRequests } from "./requests/IssueRequests";
import { SeeRequests } from "./requests/SeeRequests";

export const ExchangeSidebar = () => {
  const [creatingRequest, setCreatingRequest] = useState<boolean>(false);

  return <div className="lg:min-h-adjusted order-2 col-span-12 flex min-h-min flex-col justify-between rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-3 2xl:px-4 2xl:py-4">
    <div className="space-y-2">
      {
        creatingRequest
          ? <IssueRequests setCreatingRequest={setCreatingRequest} />
          : <SeeRequests setCreatingRequest={setCreatingRequest} />
      }
    </div>
  </div>
}

import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import { getExportExchanges } from "../../../api/backend"
import { Button } from "../../ui/button"

export const ExportExchangeButton = () => {

  const exportExchanges = async () => {
    try {
      const res = await getExportExchanges();

      if (!res.ok) {
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'exchange_data.csv';
      document.body.appendChild(a);
      a.click();

    } catch (e) {
      return e;
    }
  }

  return (
    <Button variant="default" className="w-fit justify-center" onClick={exportExchanges}>
      <ArrowDownTrayIcon className="h-5 w-5 justify-center"></ArrowDownTrayIcon>
    </Button>
  )
}

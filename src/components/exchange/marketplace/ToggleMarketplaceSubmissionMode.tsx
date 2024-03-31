import { useContext } from "react"
import { DirectExchangeContext } from "../../../contexts/DirectExchangeContext"
import { Label } from "../../ui/label"
import { Switch } from "../../ui/switch"

export const ToggleMarketplaceSubmissionMode = ({ }) => {
    const { marketplaceToggled, setMarketplaceToggled } = useContext(DirectExchangeContext);

    return <div className="flex items-center space-x-2 w-full mx-auto">
        <Switch
            id="marketplace-mode"
            checked={marketplaceToggled}
            onCheckedChange={setMarketplaceToggled}
        />
        <Label htmlFor="marketplace-mode">Submissão para o marketplace</Label>
    </div>

}

import { ArrowRightIcon } from "@heroicons/react/24/outline"
import { Dispatch, SetStateAction } from "react"
import { DirectExchangeParticipant, DirectExchangeRequest, ExchangeOption, MarketplaceRequest } from "../../../../../@types"
import { Checkbox } from "../../../../ui/checkbox"
import { Separator } from "../../../../ui/separator"

type Props = {
    option: ExchangeOption | DirectExchangeParticipant
    selectedOptionsHook: [Map<string, boolean>, Dispatch<SetStateAction<Map<string, boolean>>>]
    setSelectAll: Dispatch<SetStateAction<boolean>>
    togglePreview: (selectedOptions: Map<string, boolean>) => void
    type: string
    showChooseCheckbox?: boolean
}

export const ListRequestChanges = ({
    option,
    selectedOptionsHook,
    setSelectAll,
    togglePreview,
    type,
    showChooseCheckbox = true
}: Props) => {
    const [selectedOptions, setSelectedOptions] = selectedOptionsHook;

    const handleOptionChange = (acronym: string) => {
        selectedOptions.set(acronym, !selectedOptions.get(acronym));
        setSelectedOptions(new Map(selectedOptions));

        const allSelected = Array.from(selectedOptions.values()).every((value) => value);
        setSelectAll(allSelected);

        togglePreview(selectedOptions);
    };

    return <>
        <div key={`option.course_info.acronym`}>
            <Separator className="my-2" />
            <div className="flex flex-row gap-x-4 items-center w-full mb-2">
                {showChooseCheckbox &&
                    <Checkbox
                        id={option.course_info.acronym}
                        className="flex-grow w-1/12 h-8"
                        checked={selectedOptions.get(option.course_info.acronym) || false}
                        onCheckedChange={() => handleOptionChange(option.course_info.acronym)}
                    />
                }
                <label htmlFor={option.course_info.acronym} className="w-11/12">
                    <div className="flex flex-col">
                        <p>
                            {option.course_info.acronym} - {option.course_info.name}
                        </p>
                        <div className="flex flex-row gap-x-2 items-center font-bold">
                            <p>{type === "directexchange" ? (option as DirectExchangeParticipant).class_participant_goes_from.name : (option as ExchangeOption).class_issuer_goes_from.name}</p>
                            <ArrowRightIcon className="w-5 h-5" />
                            <p>{type === "directexchange" ? (option as DirectExchangeParticipant).class_participant_goes_to.name : (option as ExchangeOption).class_issuer_goes_to.name}</p>
                        </div>
                    </div>
                </label>
            </div>
        </div>

    </>
}

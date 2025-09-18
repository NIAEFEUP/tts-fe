import { Dispatch, SetStateAction } from "react"
import { DirectExchangeParticipant, ExchangeOption } from "../../../../../@types"
import { Checkbox } from "../../../../ui/checkbox"
import { Card, CardContent } from "../../../../ui/card"

export enum OptionOrder {
    FROM_TO,
    TO_FROM
}

type Props = {
    option: ExchangeOption | DirectExchangeParticipant
    selectedOptionsHook: [Map<string, boolean>, Dispatch<SetStateAction<Map<string, boolean>>>]
    setSelectAll: Dispatch<SetStateAction<boolean>>
    togglePreview: (selectedOptions: Map<string, boolean>) => void
    type: string
    optionOrder?: OptionOrder,
    showChooseCheckbox?: boolean,
    userWillExchangeTo?: string
}

export const ListRequestChanges = ({
    option,
    selectedOptionsHook,
    setSelectAll,
    togglePreview,
    type,
    showChooseCheckbox = true,
    optionOrder = OptionOrder.TO_FROM,
    userWillExchangeTo = null
}: Props) => {
    const [selectedOptions, setSelectedOptions] = selectedOptionsHook;

    const handleOptionChange = (acronym: string) => {
        selectedOptions.set(acronym, !selectedOptions.get(acronym));
        setSelectedOptions(new Map(selectedOptions));

        const allSelected = Array.from(selectedOptions.values()).every((value) => value);
        setSelectAll(allSelected);

        togglePreview(selectedOptions);
    };

    return (
        <Card className="mb-3 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
            <div className="flex items-start gap-3">
                {showChooseCheckbox && (
                    <Checkbox
                        id={option.course_info.acronym}
                        className="mt-1"
                        checked={selectedOptions.get(option.course_info.acronym) || false}
                        onCheckedChange={() => handleOptionChange(option.course_info.acronym)}
                    />
                )}
                    <div className="flex-1 min-w-0">
                        <label htmlFor={option.course_info.acronym} className="cursor-pointer">
                            {/* Header com código e nome da disciplina */}
                            <div className="mb-3">
                                <h3 className="font-medium text-base text-gray-900">
                                    {option.course_info.acronym}
                                </h3>
                                <p className="text-xs text-gray-500 leading-tight mt-0.5">
                                    {option.course_info.name}
                                </p>
                                {userWillExchangeTo && (
                                    <p className="text-xs text-blue-600 font-medium mt-1">
                                        Troca com {userWillExchangeTo}
                                    </p>
                                )}
                            </div>

                            {/* Exchange info clean design */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 tracking-wide pb-2 border-b border-gray-300 text-left">
                                        {optionOrder === OptionOrder.TO_FROM
                                            ? "Turma onde estás"
                                            : "Turma para onde vais"}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-800 mt-2 text-center">
                                        {type === "directexchange" ? (option as DirectExchangeParticipant).class_participant_goes_from.name : (option as ExchangeOption).class_issuer_goes_from?.name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-gray-500 tracking-wide pb-2 border-b border-gray-300 text-left">
                                        {optionOrder === OptionOrder.TO_FROM
                                            ? "Turma para onde vais"
                                            : "Turma onde estás"}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-800 mt-2 text-center">
                                        {type === "directexchange" ? (option as DirectExchangeParticipant).class_participant_goes_to.name : (option as ExchangeOption).class_issuer_goes_to?.name}
                                    </p>
                                </div>
                    </div>
                </label>
            </div>
        </div>
            </CardContent>
        </Card>
    )
}

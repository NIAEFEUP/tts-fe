import { Dispatch, SetStateAction } from "react"
import { DirectExchangeParticipant, ExchangeOption } from "../../../../../@types"
import { Checkbox } from "../../../../ui/checkbox"
import { Separator } from "../../../../ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../ui/table"

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
    showChooseCheckbox?: boolean
}

export const ListRequestChanges = ({
    option,
    selectedOptionsHook,
    setSelectAll,
    togglePreview,
    type,
    showChooseCheckbox = true,
    optionOrder = OptionOrder.TO_FROM
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
                            <span className="font-bold">{option.course_info.acronym}</span> - {option.course_info.name}
                        </p>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-bold text-black">
                                        {optionOrder === OptionOrder.TO_FROM
                                            ? "Turma onde estás"
                                            : "Turma para onde vais"
                                        }
                                    </TableHead>
                                    <TableHead className="font-bold text-black">
                                        {optionOrder === OptionOrder.TO_FROM
                                            ? "Turma para onde vais"
                                            : "Turma onde estás"
                                        }
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{type === "directexchange" ? (option as DirectExchangeParticipant).class_participant_goes_from.name : (option as ExchangeOption).class_issuer_goes_from.name}</TableCell>
                                    <TableCell>{type === "directexchange" ? (option as DirectExchangeParticipant).class_participant_goes_to.name : (option as ExchangeOption).class_issuer_goes_to.name}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </label>
            </div>
        </div>
    </>
}

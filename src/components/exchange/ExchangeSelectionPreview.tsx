import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "../ui/command"
import { ArrowRightIcon } from "lucide-react";
import { useContext, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ClassExchange } from "../../@types";
import { DirectExchangeContext } from "../../contexts/DirectExchangeContext";

type Props = {
    exchange: ClassExchange
}

export const ExchangeSelectionPreview = ({
    exchange
}: Props) => {
    const { marketplaceToggled } = useContext(DirectExchangeContext);

    return <div className="flex w-full justify-around rounded-md border p-4 shadow-md">
        <div className="flex flex-col space-y-2">
            <span className="font-bold text-center">{exchange.course_unit}</span>
            <div className="flex flex-end">
                {/* The new class of the other student is our old class */}
                <p>{exchange.new_class}</p>
                <span>
                    <ArrowRightIcon className="mx-2 h-5 w-5"></ArrowRightIcon>
                </span>
                <p>{exchange.old_class}</p>
            </div>
        </div>

        {!marketplaceToggled ?
            <div className="flex flex-col space-y-2 mr-0">
                <span className="font-bold">Estudante</span>
                <span >{exchange.other_student}</span>
            </div>
            : ""}
    </div >

}

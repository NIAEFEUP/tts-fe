import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "../ui/command"
import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ClassExchange } from "../../@types";

type Props = {
    exchange: ClassExchange
}

export const ExchangeSelectionPreview = ({
    exchange
}: Props) => {
    return <div className="flex w-full justify-between space-x-4 items-center">
        <div className="flex flex-col space-y-2">
            <span className="font-bold">{exchange.course_unit}</span>
            <div className="flex flex-row items-center">
                <Input
                    disabled
                    type="text"
                    className="w-1/2 disabled:cursor-default disabled:opacity-100 placeholder:text-black dark:placeholder:text-white"
                    placeholder={exchange.old_class}></Input>
                <span>
                    <ArrowRightIcon className="mx-2 h-5 w-5"></ArrowRightIcon>
                </span>
                <Input
                    disabled
                    type="text"
                    className="w-1/2 disabled:cursor-default disabled:opacity-100 placeholder:text-black dark:placeholder:text-white"
                    placeholder={exchange.new_class}></Input>

            </div>
        </div>

        <div className="flex flex-col space-y-2">
            <span className="font-bold">Estudante</span>
            <Input />
        </div>
    </div >

}

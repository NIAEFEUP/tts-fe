import { ArrowRightIcon } from "@heroicons/react/24/outline";

export function DirectExchangeSelection(props) {
    return (
        <div className="flex justify-center">
            <div className="flex flex-col space-y-4 mt-4">
                <p>{props.UC}</p>
                <div className="flex flex-row items-center">
                    <span className="text-center bg-slate-200 w-fit p-2">{props.Class}</span>
                    <span><ArrowRightIcon className="h-5 w-5 mx-2"></ArrowRightIcon></span>
                </div>
            </div>
            <div className="flex flex-col space-y-4 mt-4">
                <p>Estudante</p>
            </div>
        </div>
    );
}
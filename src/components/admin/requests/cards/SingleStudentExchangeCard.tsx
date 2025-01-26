import { useState } from "react";
import { UrgentRequest, UrgentRequestOption } from "../../../../@types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { ArrowRightIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Separator } from "../../../ui/separator";
import { Person } from "./Person";
import { ExchangeStatus } from "./ExchangeStatus";

type Props = {
    exchange: UrgentRequest
}

export const SingleStudentExchangeCard = ({
    exchange
}: Props) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div className="flex gap-4 items-center">
                        <div className="flex flex-col gap-1 ">
                            <div className="flex gap-2 items-center">
                                <CardTitle>
                                    <h2 className="font-bold">
                                        {`#${exchange.id}`}
                                    </h2>
                                </CardTitle>
                                <ExchangeStatus exchange={exchange} />
                            </div>
                            <p className="text-sm">Criado às 15h30 de 15/09/2020</p>
                            <p className="text-sm">Atualizado às 15h30 de 15/09/2020</p>
                        </div>
                        {!open && <>
                            <Person name={exchange.user_nmec} nmec={exchange.user_nmec} />
                        </>}

                    </div>
                    <div>
                        <Button
                            onClick={() => setOpen(prev => !prev)}
                            className="bg-white text-black border-2 border-black hover:text-white"
                        >
                            {open
                                ? <ChevronUpIcon className="w-5 h-5" />
                                : <ChevronDownIcon className="w-5 h-5" />
                            }
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="w-full ">
                    {open && exchange.options.map((option: UrgentRequestOption) => (
                        <div className="flex flex-col gap-y-8">
                            <div className="flex justify-between">
                                <Person name={exchange.user_nmec} nmec={exchange.user_nmec} />
                                <div>
                                    <div
                                        key={crypto.randomUUID()}
                                        className="flex flex-col gap-y-2 items-center border-gray-200 border-2 rounded-md p-2 px-4"
                                    >
                                        <div className="flex gap-5 items-center">
                                            <h2 className="font-bold">{option.course_unit.acronym}</h2>
                                            <div className="flex gap-2 items-center">
                                                <p>{option.class_user_goes_from.name}</p>
                                                <ArrowRightIcon className="w-5 h-5" />
                                                <p>{option.class_user_goes_to.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Button variant="secondary">
                                        Visualizar
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <h2 className="font-bold text-xl">Motivo</h2>
                                <p>{exchange.message}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>

                {open &&
                    <>
                        <Separator className="my-4" />
                        <CardFooter className="justify-end gap-4">
                            <Button variant="secondary">
                                Rejeitar
                            </Button>
                            <Button>
                                Tratar
                            </Button>
                        </CardFooter>
                    </>
                }
            </Card>
        </>
    )
}
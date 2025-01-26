import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { CourseUnitEnrollment, CourseUnitEnrollmentOption } from "../../../../@types"
import { Button } from "../../../ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../ui/card"
import { Person } from "./Person"
import { useState } from "react"
import { Separator } from "../../../ui/separator"

type Props = {
    enrollment: CourseUnitEnrollment
}

export const StudentEnrollmentCard = ({
    enrollment
}: Props) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div className="flex gap-4 items-center">
                    <div className="flex flex-col gap-1 ">
                        <div className="flex gap-2 items-center">
                            <CardTitle>
                                <h2 className="font-bold">
                                    {`#${enrollment.id}`}
                                </h2>
                            </CardTitle>
                            {/* <ExchangeStatus exchange={exchange} /> */}
                        </div>
                        <p className="text-sm">Criado às 15h30 de 15/09/2020</p>
                        <p className="text-sm">Atualizado às 15h30 de 15/09/2020</p>
                    </div>
                    {!open && <>
                        <Person name={enrollment.user_nmec} nmec={enrollment.user_nmec} />
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
                {open && enrollment.options.map((option: CourseUnitEnrollmentOption) => (
                    <div className="flex flex-col gap-y-8">
                        <div className="flex justify-between">
                            <Person name={enrollment.user_nmec} nmec={enrollment.user_nmec} />
                            <div>
                                <div
                                    key={crypto.randomUUID()}
                                    className="flex flex-col gap-y-2 items-center border-gray-200 border-2 rounded-md p-2 px-4"
                                >
                                    <div className="flex gap-5 items-center">
                                        <h2 className="font-bold">{option.course_unit.acronym}</h2>
                                        <div className="flex gap-2 items-center">
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
                    </div>
                ))}

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
            </CardContent>
        </Card>
    )
}
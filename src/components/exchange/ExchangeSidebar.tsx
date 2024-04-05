import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DirectExchange } from "./DirectExchange";
import { Dispatch, SetStateAction } from "react";
import { CourseOption } from "../../@types";

type Props = {
    setCourseOptions: Dispatch<SetStateAction<CourseOption[]>>
    courseOptions: CourseOption[]
}

export const ExchangeSidebar = ({
    setCourseOptions,
    courseOptions
}: Props) => {
    return (
        <div className="sidebar">
            <Tabs defaultValue="direta" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="direta">Troca direta</TabsTrigger>
                    <TabsTrigger value="indireta">Troca indireta</TabsTrigger>
                </TabsList>
                <TabsContent value="direta">
                    <DirectExchange courseOptions={courseOptions} setCourseOptions={setCourseOptions} />
                </TabsContent>
                <TabsContent value="indireta"></TabsContent>
            </Tabs>
        </div>
    );
}

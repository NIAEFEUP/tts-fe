import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DirectExchange } from "./DirectExchange";


export const ExchangeSidebar = () => {
    return (
        <div className="sidebar">
            <Tabs defaultValue="direta" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="direta">Troca direta</TabsTrigger>
                    <TabsTrigger value="indireta">Troca indireta</TabsTrigger>
                </TabsList>
                <TabsContent value="direta"><DirectExchange></DirectExchange></TabsContent>
                <TabsContent value="indireta"></TabsContent>
            </Tabs>   
        </div>
    );
}
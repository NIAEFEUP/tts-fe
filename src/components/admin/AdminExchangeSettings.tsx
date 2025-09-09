"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { AdminExchangeCourseSettings } from "./AdminExchangeCourseSettings";
import { AdminExchangeCourseUnitSettings } from "./AdminExchangeCourseUnitSettings";

export const AdminExchangeSettings = () => {
  return (
    <div className="flex flex-col gap-y-4 p-4">
      <div>
        <h1 className="text-3xl font-bold">Definições</h1>
      </div>
      
      <Tabs defaultValue="course-settings">
        <TabsList className="w-1/2 ">
          <TabsTrigger value="course-settings">
            Definições de Curso
          </TabsTrigger>
          <TabsTrigger value="course-unit-settings">
            Definições de Cadeira
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="course-settings">
          <AdminExchangeCourseSettings />
        </TabsContent>
        
        <TabsContent value="course-unit-settings">
          <AdminExchangeCourseUnitSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
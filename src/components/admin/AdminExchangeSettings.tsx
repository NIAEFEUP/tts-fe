'use client'

import { Tabs, TabsItem, TabsItems, TabsPanel, TabsPanels } from '../ui/new/tabs'
import { AdminExchangeCourseSettings } from './AdminExchangeCourseSettings'
import { AdminExchangeCourseUnitSettings } from './AdminExchangeCourseUnitSettings'

export const AdminExchangeSettings = () => {
  return (
    <div className="flex flex-col gap-y-4 p-4">
      <div>
        <h1 className="text-3xl font-bold">Definições</h1>
      </div>

      <Tabs>
        <TabsItems className="w-1/2">
          <TabsItem className="flex-1">Definições de Curso</TabsItem>
          <TabsItem className="flex-1">Definições de Cadeira</TabsItem>
        </TabsItems>

        <TabsPanels>
          <TabsPanel>
            <AdminExchangeCourseSettings />
          </TabsPanel>
          <TabsPanel>
            <AdminExchangeCourseUnitSettings />
          </TabsPanel>
        </TabsPanels>
      </Tabs>
    </div>
  )
}

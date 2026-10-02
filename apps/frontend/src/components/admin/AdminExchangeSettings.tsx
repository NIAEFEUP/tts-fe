'use client'

import { Tabs } from '../ui/new/tabs'
import { AdminExchangeCourseSettings } from './AdminExchangeCourseSettings'
import { AdminExchangeCourseUnitSettings } from './AdminExchangeCourseUnitSettings'

export const AdminExchangeSettings = () => {
  return (
    <div className="flex flex-col gap-y-4 p-4">
      <div>
        <h1 className="text-3xl font-bold">Definições</h1>
      </div>

      <Tabs>
        <Tabs.Items className="w-1/2">
          <Tabs.Item className="flex-1">Definições de Curso</Tabs.Item>
          <Tabs.Item className="flex-1">Definições de Cadeira</Tabs.Item>
        </Tabs.Items>

        <Tabs.Panels>
          <Tabs.Panel>
            <AdminExchangeCourseSettings />
          </Tabs.Panel>
          <Tabs.Panel>
            <AdminExchangeCourseUnitSettings />
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    </div>
  )
}

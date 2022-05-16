import React from 'react'
import classNames from 'classnames'
import { Tab } from '@headlessui/react'

const Main = () => {
  return (
    <div className="w-full h-full min-h-adjusted border">
      <Tab.Panels>
        <Tab.Panel>Content 1</Tab.Panel>
        <Tab.Panel>Content 2</Tab.Panel>
        <Tab.Panel>Content 3</Tab.Panel>
      </Tab.Panels>
    </div>
  )
}

export default Main

import { Tab } from '@headlessui/react'

const Main = () => {
  return (
    <div className="min-h-adjusted h-full w-full rounded bg-lightest px-4 py-4 dark:bg-dark">
      <Tab.Panels>
        <Tab.Panel>Content 1</Tab.Panel>
        <Tab.Panel>Content 2</Tab.Panel>
        <Tab.Panel>Content 3</Tab.Panel>
      </Tab.Panels>
    </div>
  )
}

export default Main

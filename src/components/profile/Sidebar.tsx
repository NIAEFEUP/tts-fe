import React, { useState } from 'react'
import classNames from 'classnames'
import { Tab } from '@headlessui/react'
import { LogoNIAEFEUPImage } from '../../images'
import { AcademicCapIcon, CalendarIcon } from '@heroicons/react/outline'

type SelectedProps = {
  selected: boolean
}

const Sidebar = () => {
  const navigation = [
    { label: 'Overview', icon: AcademicCapIcon, active: true },
    { label: 'Schedule', icon: CalendarIcon, active: false },
  ]

  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <aside className="flex h-full flex-col justify-between">
      <div className="flex h-full flex-col space-y-6 divide-y p-4">
        <div className="flex flex-col items-start justify-start space-y-4">
          <div className="flex items-center justify-start space-x-2">
            <img src={LogoNIAEFEUPImage} className="h-12 w-auto rounded" alt="App" />
            <div>
              <h3 className="text-lg font-medium leading-tight tracking-tight text-feup">Afonso Medeiros</h3>
              <h5 className="text-xs font-normal tracking-tighter text-gray-400">up202212345@fe.up.pt</h5>
            </div>
          </div>
          <button className="w-full rounded border-2 border-primary/50 bg-primary/10 py-2">Sign Out</button>
        </div>
        <div className="flex py-4">
          <Tab.Group vertical selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <Tab.List className="flex w-full flex-col space-y-1 rounded-xl">
              {navigation.map((item, itemIdx) => (
                <Tab
                  key={`nav-profile-${itemIdx}`}
                  className={({ selected }: SelectedProps) =>
                    classNames(
                      'inline-flex w-full items-center space-x-2 rounded px-2 py-2 text-sm font-medium transition',
                      selected ? 'bg-primary text-white' : 'hover:bg-primary/10'
                    )
                  }
                >
                  <item.icon className="h-6 w-6" />
                  <span>{item.label}</span>
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group>
        </div>
      </div>

      <div className="flex h-full flex-col divide-y px-4 py-2">
        <p className="border-t py-2 text-sm">
          Need help?{' '}
          <a className="text-primary hover:underline" href="mailto:ni@fe.up.pt">
            Contact Support
          </a>
        </p>
      </div>
    </aside>
  )
}

export default Sidebar

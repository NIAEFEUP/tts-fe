import { useState } from 'react'
import { Tab } from '@headlessui/react'
import Main from '../components/profile/Main'
import Sidebar from '../components/profile/Sidebar'
import { ComingSoon } from '../components/layout/ComingSoon'

const ProfilePage = () => {
  const isComingSoon = true
  const [selectedIndex, setSelectedIndex] = useState(0)

  return isComingSoon ? (
    <div className="mx-auto w-full">
      <ComingSoon />
    </div>
  ) : (
    <div className="grid w-full grid-cols-12 gap-x-4 gap-y-8 px-4 py-4 xl:gap-x-4 xl:gap-y-0">
      <Tab.Group vertical selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <div className="col-span-12 xl:col-span-2">
          <Sidebar />
        </div>
        <div className="col-span-12 m-0 xl:col-span-10">
          <Main />
        </div>
      </Tab.Group>
    </div>
  )
}

export default ProfilePage

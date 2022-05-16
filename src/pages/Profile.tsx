import { useState } from 'react'
import Main from '../components/profile/Main'
import Sidebar from '../components/profile/Sidebar'
import { Tab } from '@headlessui/react'

const ProfilePage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className="grid w-full grid-cols-12 gap-x-0 gap-y-8 px-4 py-4 xl:gap-x-4 xl:gap-y-0">
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

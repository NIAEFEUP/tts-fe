import React from 'react'
import Main from '../components/profile/Main'
import Sidebar from '../components/profile/Sidebar'

const ProfilePage = () => (
  <div className="grid w-full grid-cols-12 gap-y-8 xl:gap-y-0">
    <div className="col-span-12 xl:col-span-2">
      <Sidebar />
    </div>
    <div className="col-span-12 m-0 xl:col-span-10">
      <Main />
    </div>
  </div>
)

export default ProfilePage

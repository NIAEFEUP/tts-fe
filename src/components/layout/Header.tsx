import { Link } from 'react-router-dom'
import { Disclosure } from '@headlessui/react'
import { DarkModeSwitch } from './DarkModeSwitch'
import { AppLogo } from '../../images'
import {
  MenuIcon,
  XIcon,
  HomeIcon,
  EmojiHappyIcon,
  CollectionIcon,
  CalendarIcon,
  SwitchHorizontalIcon,
} from '@heroicons/react/outline'

const navigation = [
  { title: 'Home', location: '/', icon: <HomeIcon className="h-5 w-5" /> },
  { title: 'Profile', location: '/profile', icon: <EmojiHappyIcon className="h-5 w-5" /> },
  { title: 'Schedule', location: '/schedule', icon: <CalendarIcon className="h-5 w-5" /> },
  { title: 'Planner', location: '/tts', icon: <CollectionIcon className="h-5 w-5" /> },
  { title: 'Exchange', location: '/feupexchange', icon: <SwitchHorizontalIcon className="h-5 w-5" /> },
]

type Props = {
  siteTitle: string
  location: string
}

const Header = ({ siteTitle, location }: Props) => {
  return (
    <Disclosure as="nav" className="navbar">
      {({ open }) => {
        return (
          <>
            <div className={`${open ? 'p-0' : 'p-2'} relative flex items-center justify-between md:py-0`}>
              <Hamburger open={open} />
              <div className="header">
                <div className="relative hidden h-auto space-x-12 self-center duration-200 hover:opacity-75 md:inline-flex">
                  <Link to="/" className="flex items-center space-x-2">
                    <img
                      src={AppLogo}
                      alt="Time Table Selector"
                      className="z-20 inline-flex h-6 w-auto rounded-full transition dark:hidden"
                    />
                    <img
                      src={AppLogo}
                      alt="Time Table Selector"
                      className="z-20 hidden h-6 w-auto rounded-full transition dark:inline-flex"
                    />
                    <h2 className="text-xs font-bold tracking-tighter duration-150 lg:text-base">{siteTitle}</h2>
                  </Link>
                </div>

                <div className="hidden space-x-8 self-center md:inline-flex">
                  {navigation.map((link, index) => (
                    <Link to={link.location} key={`nav-${index}`} className="relative py-1">
                      <button
                        type="button"
                        className={`flex h-12 items-center justify-center font-medium capitalize tracking-wide transition ${
                          location === link.title
                            ? 'text-primary dark:text-white'
                            : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
                        }`}
                      >
                        <span className="flex items-center justify-center space-x-1.5">
                          <span>{link.icon}</span>
                          <span>{link.title}</span>
                        </span>
                      </button>
                      {location === link.title ? (
                        <span className="absolute bottom-0 h-1 w-full rounded-t-sm bg-primary dark:bg-primary" />
                      ) : null}
                    </Link>
                  ))}
                </div>

                <div className="hidden self-center md:inline-flex">
                  <DarkModeSwitch />
                </div>
              </div>
            </div>
            <Mobile location={location} />
          </>
        )
      }}
    </Disclosure>
  )
}

export default Header

type HamburgerProps = {
  open: boolean
}

const Hamburger = ({ open }: HamburgerProps) => (
  <div
    className={`z-50 md:hidden ${
      open
        ? 'absolute top-2 right-2 my-auto flex h-6 items-center justify-end space-x-2'
        : 'flex w-full items-center justify-between'
    }`}
  >
    <Link to="/">
      {open ? (
        <img className="avatar top-0.5 h-5 w-auto dark:inline-flex" src={AppLogo} alt="Time Table Selector" />
      ) : (
        <img className="avatar h-6 w-auto" src={AppLogo} alt="Time Table Selector" />
      )}
    </Link>

    <div className="flex items-center space-x-1">
      <DarkModeSwitch />
      <Disclosure.Button className="hamburger group">
        <span className="sr-only">Open nav menu</span>
        {open ? (
          <XIcon
            className="ease block h-6 w-6 transition duration-200 group-hover:text-primary/75 dark:group-hover:text-primary/75"
            aria-hidden="true"
          />
        ) : (
          <MenuIcon
            className="ease block h-6 w-6 transition duration-200 group-hover:text-primary/75 dark:group-hover:text-primary/75"
            aria-hidden="true"
          />
        )}
      </Disclosure.Button>
    </div>
  </div>
)

type MobileProps = {
  location: string
}

const Mobile = ({ location }: MobileProps) => (
  <Disclosure.Panel className="flex flex-col space-y-3 py-2 md:hidden">
    {navigation.map((link, index) => (
      <Link to={link.location} className="relative h-auto" key={`mobile-nav-${index}`}>
        <button
          type="button"
          className={`flex h-auto items-center justify-center font-medium capitalize tracking-wide transition ${
            location === link.title
              ? 'text-primary dark:text-white'
              : 'text-gray-800/70 hover:text-gray-800 dark:text-white/60 dark:hover:text-white'
          }`}
        >
          <span className="flex items-center justify-center space-x-2">
            <span>{link.icon}</span>
            <span>{link.title}</span>
          </span>
          {location === link.title ? (
            <span className="absolute -left-4 h-full w-1 rounded-sm bg-primary dark:bg-primary" />
          ) : null}
        </button>
      </Link>
    ))}
  </Disclosure.Panel>
)

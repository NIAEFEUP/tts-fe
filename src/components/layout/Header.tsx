import { Link } from 'react-router-dom'
import { Popover, Transition } from '@headlessui/react'
import { DarkModeSwitch } from './DarkModeSwitch'
import {
  Bars3Icon,
  XMarkIcon,
  AtSymbolIcon,
  RectangleStackIcon,
  QuestionMarkCircleIcon,
  ArrowsRightLeftIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import { LogoNIAEFEUPImage } from '../../images'
import { getPath, config } from '../../utils'
import { FeedbackReport } from '../FeedbackReport'
import SessionContext from '../../contexts/SessionContext'
import { useContext } from 'react'
import { LoginButton } from '../auth/LoginButton'
import { HeaderProfileDropdown } from '../auth/HeaderProfileDropdown'

const navigation = [
  {
    title: 'Horários',
    location: getPath(config.paths.planner),
    icon: <RectangleStackIcon className="h-5 w-5" />,
    wip: false,
  },
  {
    title: 'Turmas',
    location: getPath(config.paths.exchange),
    icon: <ArrowsRightLeftIcon className="h-5 w-5" />,
    wip: false,
  },
  { title: 'Sobre', location: getPath(config.paths.about), icon: <AtSymbolIcon className="h-5 w-5" />, wip: false },
  {
    title: 'FAQs',
    location: getPath(config.paths.faqs),
    icon: <QuestionMarkCircleIcon className="h-5 w-5" />,
    wip: false,
  },
  {
    title: 'Admin',
    location: getPath(config.paths.admin),
    icon: <WrenchScrewdriverIcon className="h-5 w-5" />,
    wip: false,
  },
]

type Props = {
  siteTitle: string
  location: string
}

const Header = ({ siteTitle, location }: Props) => {
  const { signedIn, user } = useContext(SessionContext)

  return (
    <Popover
      as="nav"
      className="bg-light dark:bg-darkest sticky top-0 z-50 space-x-4 px-3 py-2 text-gray-800 max-sm:flex max-sm:flex-col md:px-3 md:py-0 dark:text-white"
    >
      {({ open }) => {
        return (
          <>
            <div className={'relative flex items-center justify-between p-2 md:py-0'}>
              <Hamburger open={open} signedIn={signedIn} />
              <div className="flex items-center justify-between md:flex-1 md:items-stretch md:justify-between">
                <div className="relative hidden h-auto space-x-12 self-center duration-200 hover:opacity-75 md:inline-flex">
                  <Link to={config.pathPrefix} className="flex items-center space-x-2">
                    <img
                      src={LogoNIAEFEUPImage}
                      alt="Time Table Selector"
                      className="z-20 inline-flex h-6 w-auto rounded-full transition"
                    />
                    <h3 className="text-xs font-bold tracking-tighter duration-150 lg:text-base">{siteTitle}</h3>
                  </Link>
                </div>

                <div className="hidden space-x-8 self-center md:inline-flex">
                  {navigation
                    .filter(
                      (link) =>
                        !link.wip ||
                        (link.wip &&
                          (import.meta.env.VITE_APP_PROD === '0' || import.meta.env.VITE_APP_STAGING === '1'))
                    )
                    .filter((link) => link.title !== 'Admin' || (signedIn && user?.is_admin))
                    .map((link, index) => (
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
                          <span className="bg-primary dark:bg-primary absolute bottom-0 h-1 w-full rounded-t" />
                        ) : null}
                      </Link>
                    ))}
                </div>

                <div className="hidden items-center gap-x-2 self-center md:inline-flex">
                  <DarkModeSwitch />
                  {signedIn ? <HeaderProfileDropdown /> : <LoginButton expanded={false} />}
                </div>
              </div>
            </div>
            <Mobile location={location} />
          </>
        )
      }}
    </Popover>
  )
}

export default Header

type HamburgerProps = {
  open: boolean
  signedIn: boolean
}

const Hamburger = ({ open, signedIn }: HamburgerProps) => {
  return (
    <div className={'z-50 flex w-full items-center justify-between md:hidden'}>
      <Link to={config.pathPrefix}>
        <img
          className="h-6 w-auto rounded-full transition hover:opacity-80 md:hidden"
          src={LogoNIAEFEUPImage}
          alt="Time Table Selector"
        />
      </Link>

      <div className="flex items-center space-x-1">
        <DarkModeSwitch />
        <FeedbackReport />
        {signedIn ? <HeaderProfileDropdown /> : <LoginButton expanded={false} />}

        <Popover.Button className="group text-gray-800 transition duration-200 ease-in md:hidden dark:text-white">
          <span className="sr-only">Open nav menu</span>
          {open ? (
            <XMarkIcon
              className="ease group-hover:text-primary/75 dark:group-hover:text-primary/75 block h-6 w-6 transition duration-200"
              aria-hidden="true"
            />
          ) : (
            <Bars3Icon
              className="ease group-hover:text-primary/75 dark:group-hover:text-primary/75 block h-6 w-6 transition duration-200"
              aria-hidden="true"
            />
          )}
        </Popover.Button>
      </div>
    </div>
  )
}

type MobileProps = {
  location: string
}

const Mobile = ({ location }: MobileProps) => {
  const { signedIn, user } = useContext(SessionContext)

  return (
    <Transition
      enter="transition duration-200 ease-out"
      enterFrom="transform -translate-y-2 opacity-0"
      enterTo="transform translate-y-0 opacity-100"
      leave="transition duration-150 ease-out"
      leaveFrom="transform translate-y-0 opacity-100"
      leaveTo="transform -translate-y-2 opacity-0"
      className="bg-light dark:bg-darkest absolute left-0 top-full z-40 !ml-0 w-full origin-top rounded-b-lg shadow-xl md:hidden"
    >
      <Popover.Panel className="flex flex-col space-y-3 px-3 py-4 pl-8">
        {navigation
          .filter((link) => !link.wip)
          .filter((link) => link.title !== 'Admin' || (signedIn && user?.is_admin))
          .map((link, index) => (
            <Popover.Button as={Link} to={link.location} className="relative h-auto" key={`mobile-nav-${index}`}>
              <span
                className={`flex h-auto items-center justify-start font-medium capitalize tracking-wide transition ${
                  location === link.title
                    ? 'text-primary dark:text-white'
                    : 'text-gray-800/70 hover:text-gray-800 dark:text-white/60 dark:hover:text-white'
                }`}
              >
                <span className="flex items-center justify-start space-x-2">
                  <span>{link.icon}</span>
                  <span>{link.title}</span>
                </span>
                {location === link.title && (
                  <span className="bg-primary dark:bg-primary absolute -left-4 h-full w-1 rounded" />
                )}
              </span>
            </Popover.Button>
          ))}
      </Popover.Panel>
    </Transition>
  )
}

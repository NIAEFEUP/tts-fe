import { LogoNIAEFEUPImage } from '../../images'
import { GithubIcon, FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon } from '../svgs'
import { GlobeAltIcon, InboxArrowDownIcon } from '@heroicons/react/24/outline'

type Social = {
  label: string
  url: string
  icon: any
}

const socials: Social[] = [
  { label: 'Github', url: 'https://github.com/NIAEFEUP', icon: GithubIcon },
  { label: 'Facebook', url: 'https://facebook.com/NIAEFEUP', icon: FacebookIcon },
  { label: 'Twitter', url: 'https://twitter.com/niaefeup', icon: TwitterIcon },
  { label: 'Instagram', url: 'https://www.instagram.com/niaefeup', icon: InstagramIcon },
  { label: 'Linkedin', url: 'https://pt.linkedin.com/company/nifeup', icon: LinkedinIcon },
  { label: 'Website', url: 'https://ni.fe.up.pt/', icon: GlobeAltIcon },
  { label: 'Email us', url: 'mailto:ni@aefeup.pt', icon: InboxArrowDownIcon },
]

const Footer = () => {
  return (
    <footer className="mt-8 bg-navy px-2 py-4 transition dark:bg-darker md:px-6 md:py-8">
      <div className="flex flex-col items-center justify-between space-y-4 lg:flex-row">
        {/* Social Media */}
        <ul className="order-2 mt-4 flex items-center justify-center space-x-4 lg:order-1">
          {socials.map((social, socialIdx) => (
            <li key={`footer-social-${socialIdx}`}>
              <a
                className="inline-flex items-center justify-center text-sm transition hover:opacity-80"
                href={social.url}
                target="_blank"
                rel="noreferrer"
              >
                <social.icon className="hover:-trangray-y-1 h-8 w-8 rounded text-white transition hover:opacity-80" />
              </a>
            </li>
          ))}
        </ul>

        {/* NI */}
        <div className="order-1 flex items-center justify-center space-x-4 lg:order-2">
          <img src={LogoNIAEFEUPImage} alt="NIAEFEUP" className="h-auto w-20" />
          <h1 className="flex flex-col items-center text-3xl font-bold text-white lg:text-4xl">NIAEFEUP</h1>
        </div>

        {/* Direitos */}
        <div className="order-3 flex flex-col items-center justify-center">
          <p className="text-base font-medium text-white dark:text-gray-300 sm:text-center">
            © {new Date().getFullYear()+' '}
            <a href="https://niaefeup.pt" className="hover:underline">
              NIAEFEUP
            </a>
            ™. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

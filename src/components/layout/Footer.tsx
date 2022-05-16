import { LogoNIAEFEUPImage } from '../../images'
import { GithubIcon, FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon } from '../svgs'
import { GlobeAltIcon, InboxInIcon } from '@heroicons/react/outline'

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
  { label: 'Email us', url: 'mailto:ni@aefeup.pt', icon: InboxInIcon },
]

const Footer = () => {
  return (
    <div className="bg-gray-700 px-2 py-3 dark:bg-dark md:px-5 md:py-3">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-9">
          <div className="flex items-center justify-center space-x-4 md:items-start md:justify-start">
            <img src={LogoNIAEFEUPImage} alt="NIAEFEUP" className="h-auto w-12" />
            <ul>
              <li>
                <h4 className="text- leading-5 font-bold text-white dark:text-white">NIAEFEUP</h4>
              </li>
              <li className="text-sm text-gray-300 dark:text-gray-400">
                <p>Rua Dr. Roberto Frias 4200-465, Porto</p>
              </li>
              <li className="text-sm text-gray-400 dark:text-gray-500">
                <p>Sala B315</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-span-12 my-auto md:col-span-3">
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:items-end md:justify-end">
            {socials.map((social, socialIdx) => (
              <li key={`social-${socialIdx}`}>
                <a
                  className="inline-flex items-center justify-center space-x-1 text-sm transition hover:opacity-80"
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <social.icon className="h-5 w-5 text-white dark:text-white" />
                  <span className="text-white dark:text-white">{social.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Footer

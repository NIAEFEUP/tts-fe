import { LogoNIAEFEUPImage, LogoAEFEUPImage, LogoFEUPImage } from '../../images'
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
    <footer className="mt-8 bg-gradient-to-t from-secondary to-secondary px-2 py-4 transition dark:from-dark dark:to-dark md:px-6 md:py-8">
      <div className="justify-center md:flex md:justify-between">
        {/* Left */}
        <div className="flex items-center justify-center space-x-4 md:items-start md:justify-start">
          <img src={LogoNIAEFEUPImage} alt="NIAEFEUP" className="h-auto w-28" />
          <ul className="w-min py-2 tracking-tight lg:w-max">
            <li>
              <h4 className="text-3xl font-bold text-white lg:text-4xl">NIAEFEUP</h4>
            </li>
            <li className="text-base font-medium text-gray-400 lg:text-lg">
              <p>Rua Dr. Roberto Frias 4200-465, Porto</p>
            </li>
            <li className="mt-1 text-base font-normal text-gray-400 lg:text-lg">
              <p>Sala B315</p>
            </li>
          </ul>
        </div>

        {/* Right */}
        <div className="mt-4 flex flex-col items-center space-y-4 md:mt-0">
          <a className="transition hover:opacity-90" href="https://sigarra.up.pt/feup">
            <img src={LogoFEUPImage} alt="FEUP" className="h-auto w-48 rounded bg-gray-50 p-1" />
          </a>
          <a className="transition hover:opacity-90" href="https://www.aefeup.pt">
            <img src={LogoAEFEUPImage} alt="AEFEUP" className="h-auto w-48 rounded bg-gray-50 p-2" />
          </a>
        </div>
      </div>

      <hr className="my-6 sm:mx-auto lg:my-8" />

      <div className="flex flex-col items-center justify-between space-y-4 lg:flex-row lg:space-y-0">
        <ul className="mt-4 flex items-center justify-center space-x-4 sm:mt-0">
          {socials.map((social, socialIdx) => (
            <li key={`social-${socialIdx}`}>
              <a
                className="inline-flex items-center justify-center text-sm transition hover:opacity-80"
                href={social.url}
                target="_blank"
                rel="noreferrer"
              >
                <social.icon className="h-8 w-8 rounded text-white transition hover:-trangray-y-1 hover:opacity-80" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center justify-center">
          <p className="text-base font-medium text-white dark:text-gray-300 sm:text-center">
            © 2022{' '}
            <a href="https://ni.fe.up.pt" className="hover:underline">
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

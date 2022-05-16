import React from 'react'
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
    <div className="bg-tertiary px-6 py-4 dark:bg-dark">
      <div className="flex items-center justify-center">
        <div className="flex grow">
          <div className="flex items-center justify-center space-x-4">
            <img src={LogoNIAEFEUPImage} alt="NIAEFEUP" className="h-auto w-20" />
            <ul>
              <li>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">NIAEFEUP</h4>
              </li>
              <li className="text-base text-gray-700 dark:text-gray-400">
                <p>Rua Dr. Roberto Frias 4200-465, Porto</p>
              </li>
              <li className="text-sm text-gray-500 dark:text-gray-500">
                <p>Sala B315</p>
              </li>
            </ul>
          </div>
        </div>

        <ul className="grid grid-cols-4 gap-2">
          {socials.map((social, socialIdx) => (
            <li key={`social-${socialIdx}`}>
              <a
                className="inline-flex items-center justify-center space-x-2 text-sm transition hover:opacity-80"
                href={social.url}
                target="_blank"
                rel="noreferrer"
              >
                <social.icon className="h-5 w-5 text-primary dark:text-white" />
                <span className="text-gray-800 dark:text-white">{social.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Footer

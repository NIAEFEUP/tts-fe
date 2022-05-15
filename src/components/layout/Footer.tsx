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
    <div className="">
      <div className="flex items-center justify-between">
        <div className="xs:grid-cols-12 grid sm:grid-cols-6 md:grid-cols-3">
          <ul>
            <li>
              <div className="grid gap-1">
                <img src={LogoNIAEFEUPImage} alt="NIAEFEUP" className="h-auto w-[65rem]" />
                <h4 className="text-lg font-bold">NIAEFEUP</h4>
              </div>
            </li>
            <li>
              <p>Rua Dr. Roberto Frias 4200-465, Porto</p>
            </li>
            <li>
              <p>Sala B315</p>
            </li>
          </ul>
        </div>

        <ul className="xs:grid-cols-12 grid sm:grid-cols-6 md:grid-cols-3">
          {socials.map((social, socialIdx) => (
            <li key={`social-${socialIdx}`}>
              <a href={social.url} target="_blank" rel="noreferrer">
                <social.icon className="z-50 h-6 w-6 text-black" />
                <span className="text-tertiary">{social.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Footer

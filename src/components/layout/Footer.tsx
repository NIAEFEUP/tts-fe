import React from 'react'
import { LogoNIAEFEUP } from '../../images'
import { Email, Language, LinkedIn, Facebook, Twitter, Instagram, GitHub } from '@mui/icons-material'

type Social = {
  label: string
  url: string
  icon: any
}

const socials: Social[] = [
  { label: 'Github', url: 'https://github.com/NIAEFEUP', icon: GitHub },
  { label: 'Facebook', url: 'https://facebook.com/NIAEFEUP', icon: Facebook },
  { label: 'Twitter', url: 'https://twitter.com/niaefeup', icon: Twitter },
  { label: 'Instagram', url: 'https://www.instagram.com/niaefeup', icon: Instagram },
  { label: 'Linkedin', url: 'https://pt.linkedin.com/company/nifeup', icon: LinkedIn },
  { label: 'Website', url: 'https://ni.fe.up.pt/', icon: Language },
  { label: 'Email us', url: 'mailto:ni@aefeup.pt', icon: Email },
]

const Footer = () => {
  return (
    <div className="bg-dark text-tertiary">
      <div className="flex items-center justify-between">
        <div className="xs:grid-cols-12 grid sm:grid-cols-6 md:grid-cols-3">
          <ul>
            <li>
              <div className="grid gap-1">
                <img src={LogoNIAEFEUP} alt="NIAEFEUP" className="h-auto w-[65rem]" />
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
            <li>
              <a href={social.url} target="_blank" rel="noreferrer">
                <social.icon className="text-tertiary" />
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

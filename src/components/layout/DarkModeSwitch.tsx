import { Switch } from '@headlessui/react'
import { Sun, Moon } from 'lucide-react'
import { useContext } from 'react'
import { ThemeContext } from '../../contexts/ThemeContext'

export const DarkModeSwitch = () => {
  const { enabled, setEnabled } = useContext(ThemeContext)

  return (
    <Switch.Group>
      <div className="flex items-center">
        <Switch
          className={`${enabled ? 'animate-dark' : 'animate-light'} rounded-full`}
          checked={enabled}
          onChange={() => setEnabled(!enabled)}
        >
          {enabled ? <Moon size="22" aria-hidden="true" /> : <Sun size="22" aria-hidden="true" />}
        </Switch>
      </div>
    </Switch.Group>
  )
}

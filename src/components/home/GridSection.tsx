import React from 'react'
import { CalendarIcon, PencilAltIcon, ClockIcon } from '@heroicons/react/outline'

const information = [
  {
    icon: CalendarIcon,
    headline: 'Horário Inicial',
    text: 'Consultar horário incial feito pelo departamento do curso',
  },
  {
    icon: PencilAltIcon,
    headline: 'Solicitar Troca',
    text: 'Escolher a(s) turma(s) destino para as unidades curriculares com horários indesejados',
  },
  {
    icon: ClockIcon,
    headline: 'Aguardar Resultados',
    text: 'Consultar horário incial feito pelo departamento do curso',
  },
]

export default function GridSection() {
  return (
    <div className="my-8 mx-auto w-full grow rounded border-2 bg-lighter py-2 px-0">
      <div className="container grid grid-cols-3 gap-4">
        {information.map((item, itemIdx) => (
          <div key={`item-${itemIdx}`} className="flex flex-col items-center justify-center">
            <span className="m-auto w-1/5 rounded text-white opacity-90">
              <item.icon className="z-50 h-24 w-auto text-primary" />
            </span>
            <span className="text-center text-gray-700">
              <h2>{item.headline}</h2>
              <p className="text-lg">{item.text}</p>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

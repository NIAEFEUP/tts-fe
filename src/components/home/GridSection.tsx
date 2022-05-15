import React from 'react'
import { Event, Edit, Schedule } from '@mui/icons-material'

const information = [
  {
    icon: Event,
    headline: 'Horário Inicial',
    text: 'Consultar horário incial feito pelo departamento do curso',
  },
  {
    icon: Edit,
    headline: 'Solicitar Troca',
    text: 'Escolher a(s) turma(s) destino para as unidades curriculares com horários indesejados',
  },
  {
    icon: Schedule,
    headline: 'Aguardar Resultados',
    text: 'Consultar horário incial feito pelo departamento do curso',
  },
]

export default function GridSection() {
  return (
    <div className="my-8 mx-auto w-full grow rounded border-2 bg-lighter py-2 px-0">
      <div className="container grid grid-cols-3 gap-4">
        {information.map((item, itemIdx) => (
          <div key={`item-${itemIdx}`}>
            <span className="m-auto w-1/5 rounded bg-lightest text-white opacity-90">
              <item.icon className="h-auto w-auto px-40 text-primary" />
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

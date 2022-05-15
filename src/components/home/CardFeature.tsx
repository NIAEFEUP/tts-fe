import React from 'react'

type Props = {
  title: string
  subtitle: string
  text: string
  image: string
  direction: string
}

const CardFeature = ({ title, subtitle, text, image, direction }: Props) => {
  return (
    <div className="mt-16 flex justify-around">
      <div className="container max-w-lg">
        <h4 className="text-lg font-medium">{title}</h4>
        <h6 className="mb-4 text-base font-normal text-primary">{subtitle}</h6>
        <p className="prose">{text}</p>
      </div>
      <img className="w-[600px]" src={image} alt="card" />
    </div>
  )
}

export default CardFeature

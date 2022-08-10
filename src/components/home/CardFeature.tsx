import classNames from 'classnames'

type Props = {
  id: string
  title: string
  subtitle: string
  image: string
  reverse: boolean
  children: React.ReactNode[] | React.ReactNode
}

const CardFeature = ({ id, title, subtitle, image, reverse, children }: Props) => (
  <div id={id} className="px-8 py-8">
    {/* Desktop */}
    <div className="hidden items-start justify-between md:flex">
      <div className={classNames('container grow', reverse ? 'order-2 ml-8' : 'mr-8')}>
        <h4 className="text-xl font-semibold">{title}</h4>
        <h6 className="mb-3 text-base font-medium text-primary">{subtitle}</h6>
        <div className="prose text-justify">{children}</div>
      </div>
      <img className="max-w-lg rounded shadow" src={image} alt="card" />
    </div>

    {/* Mobile */}
    <div className="flex flex-col items-start justify-between gap-y-4 md:hidden">
      <img className="w-full rounded shadow" src={image} alt="card" />
      <div className="container grow">
        <h4 className="text-center text-xl font-semibold">{title}</h4>
        <h6 className="mb-3 text-center text-base font-medium text-primary">{subtitle}</h6>
        <div className="prose text-justify text-sm">{children}</div>
      </div>
    </div>
  </div>
)

export default CardFeature

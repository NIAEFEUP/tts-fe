import classNames from 'classnames'

type Props = {
  title: string
  subtitle: string
  text: string
  image: string
  reverse: boolean
}

const CardFeature = ({ title, subtitle, text, image, reverse }: Props) => (
  <>
    {/* Desktop */}
    <div className="hidden items-start justify-between py-8 md:flex">
      <div className={classNames('container grow', reverse ? 'order-2 ml-8' : 'mr-8')}>
        <h4 className="text-xl font-semibold">{title}</h4>
        <h6 className="mb-3 text-base font-medium text-primary">{subtitle}</h6>
        <p className="prose">{text}</p>
      </div>
      <img className="max-w-lg rounded shadow" src={image} alt="card" />
    </div>
    {/* Mobile */}
    <div className="flex flex-col items-start justify-between space-y-4 py-8 md:hidden">
      <img className="w-full rounded shadow" src={image} alt="card" />
      <div className="container grow">
        <h4 className="text-center text-xl font-semibold">{title}</h4>
        <h6 className="mb-3 text-center text-base font-medium text-primary">{subtitle}</h6>
        <p className="prose text-center text-sm">{text}</p>
      </div>
    </div>
  </>
)

export default CardFeature

import { Link } from 'react-router-dom'
import { config } from '../utils/utils'

const NotFoundPage = () => (
  <>
    {/* Desktop */}
    <div className="flex flex-col items-center justify-between space-y-4 py-8 md:flex">
      <h1 className="text-center text-4xl font-semibold">404</h1>
      <h2 className="mb-2 text-center text-3xl font-medium">PAGE NOT FOUND</h2>
      <Link
        to={config.pathPrefix}
        className="flex h-auto w-fit items-center justify-center rounded border-2 border-primary 
        bg-primary px-3 py-2 text-xs font-medium text-white transition hover:opacity-80 lg:text-sm xl:px-4"
      >
        Go to Planner
      </Link>
    </div>
    {/* Mobile */}
    <div className="flex flex-col items-center justify-between space-y-4 py-8 md:hidden">
      <h1 className="text-center text-4xl font-semibold">404</h1>
      <h2 className="mb-2 text-center text-3xl font-medium">PAGE NOT FOUND</h2>
      <Link
        to={config.pathPrefix}
        className="flex h-auto w-fit items-center justify-center rounded border-2 border-primary 
        bg-primary px-3 py-2 text-xs font-medium text-white transition hover:opacity-80 lg:text-sm xl:px-4"
      >
        Go to Planner
      </Link>
    </div>
  </>
)

export default NotFoundPage

import { Link } from "react-router-dom"

const NotFoundPage = () => (
    <>
        {/* Desktop */}
        <div className="hidden flex flex-col items-center justify-between space-y-4 py-8 md:flex">
            <h1 className="text-4xl text-center font-semibold">404</h1>
            <h2 className="text-3xl mb-2 text-center font-medium">PAGE NOT FOUND</h2>
            <Link to="/" className="flex h-auto w-fit items-center justify-center rounded border-2 border-primary bg-primary px-3 py-2 text-xs font-medium text-white transition hover:opacity-80 lg:text-sm xl:px-4">
                Go to Planner
            </Link>
        </div>
        {/* Mobile */}
        <div className="flex flex-col items-center justify-between space-y-4 py-8 md:hidden">
            <h1 className="text-4xl text-center font-semibold">404</h1>
            <h2 className="text-3xl mb-2 text-center font-medium">PAGE NOT FOUND</h2>
            <Link to="/" className="flex h-auto w-fit items-center justify-center rounded border-2 border-primary bg-primary px-3 py-2 text-xs font-medium text-white transition hover:opacity-80 lg:text-sm xl:px-4">
                Go to Planner
            </Link>
        </div>
    </>
  )
  
  export default NotFoundPage
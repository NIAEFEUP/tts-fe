import HeroPlanner from '../components/home/HeroPlanner'
import HeroExchange from '../components/home/HeroExchange'

const HomePage = () => (
  <div className="container mx-auto w-full space-y-12 py-6 px-4 md:py-10 md:px-6">
    <HeroPlanner />
    <hr />
    <HeroExchange />
  </div>
)

export default HomePage

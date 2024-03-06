import { LoginDialog } from '../components/auth/LoginDialog'

const NotAuthorizedPage = () => (
  <div className="flex flex-col items-center justify-between space-y-4 py-8 md:flex">
    <h1 className="text-center text-4xl font-semibold">403</h1>
    <h2 className="mb-2 text-center text-3xl font-medium">Entre na conta para aceder a esta página</h2>
    <LoginDialog />
  </div>
)

export default NotAuthorizedPage

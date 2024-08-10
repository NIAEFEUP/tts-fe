import { Badge } from "../../../ui/badge"

type Props = {
  loggedUserCourseUnits: Array<string>
}

export const ViewRequestsFilters = ({
  loggedUserCourseUnits
}: Props) => {
  return <div className="flex flex-row justify-between">
    <div>
      <Badge
        className="bg-gray-200 text-gray-700 cursor-pointer hover:text-white"
      >
        CG
      </Badge>
    </div>
  </div>
}

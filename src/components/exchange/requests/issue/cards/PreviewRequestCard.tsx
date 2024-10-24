import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { CreateRequestData } from "../../../../../@types";
import { Card, CardContent, CardHeader } from "../../../../ui/card";
import { Separator } from "../../../../ui/separator";

type Props = {
  request: CreateRequestData
}

const PreviewRequestCard = ({ request }: Props) => {
  return <Card className="shadow-sm">
    <CardContent className="p-4">
      <div className="flex flex-row items-center align-middle w-full justify-center gap-x-8">
        <div className="flex flex-col items-center">
          <p className="text-center font-bold">{request.courseUnitName}</p>
          <div className="flex flex-end">
            {/* The new class of the other student is our old class */}
            <p>{request.classNameRequesterGoesFrom}</p>
            <span>
              <ArrowRightIcon className="mx-2 h-5 w-5"></ArrowRightIcon>
            </span>
            <p>{request.classNameRequesterGoesTo}</p>
          </div>
        </div>

        {request.other_student &&
          <div className="flex flex-col items-center">
            <p className="text-center font-bold">Estudante</p>
            <p>{request.other_student.mecNumber}</p>
          </div>
        }
      </div>
    </CardContent>
  </Card>

};

export default PreviewRequestCard;

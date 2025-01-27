import { Button } from "../../../ui/button"
import { CardFooter } from "../../../ui/card"
import { Separator } from "../../../ui/separator"
import { AdminSendEmail } from "../AdminSendEmail"

type Props = {
    nmecs: Array<string>
}

export const AdminRequestCardFooter = ({
    nmecs
}: Props) => {
    return <>
        <Separator className="my-4" />
        <CardFooter className="justify-end gap-4">
            <Button variant="secondary">
                Rejeitar
            </Button>
            <Button>
                Tratar
            </Button>
            <AdminSendEmail
                nmec={nmecs}
            />
        </CardFooter>
    </>
}
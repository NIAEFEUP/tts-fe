import { mailtoStringBuilder } from "../../../utils/mail"
import { Button } from "../../ui/button"

type Props = {
    nmec: string | Array<string>
}

export const AdminSendEmail = ({
    nmec
}: Props) => {
    return <>
        <a href={mailtoStringBuilder(nmec)}>
            <Button
                variant="secondary"
            >
                Email
            </Button>
        </a>
    </>
}
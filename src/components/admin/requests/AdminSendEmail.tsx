import { Button } from "../../ui/button"

const mailtoStringBuilder = (nmec: string | Array<string>) => {
    if (Array.isArray(nmec)) {
        let mailto = "mailto:"
        nmec.forEach(nmec => {
            mailto += `up${nmec}@up.pt,`
        })

        return mailto;
    }

    return `mailto:up${nmec}@up.pt`
}

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
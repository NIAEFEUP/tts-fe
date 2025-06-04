type Props = {
    accepted: boolean
}

/**
 * This state is used to show whether the students accepted or not the request.
 * This is not related as if the admins approved the request or not.
 */
export const RequestStudentState = ({
    accepted
}: Props) => {
    return <p className="font-bold">
        {accepted
            ? "Envolvidos aceitaram"
            : "Envolvidos não aceitaram"}
    </p>
}
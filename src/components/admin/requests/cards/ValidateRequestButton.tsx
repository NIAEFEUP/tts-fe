import useDirectExchangeValidation from '../../../../hooks/useDirectExchangeValidation'
import { Button } from '../../../ui/new/newButton'

type Props = {
  id: number
  onValidation: (result: { valid: boolean; last_validated?: string | null }) => void
}

export const ValidateRequestButton = ({ id, onValidation }: Props) => {
  const { trigger, isMutating } = useDirectExchangeValidation(id)

  return (
    <Button
      variant="primary"
      className="hover:bg-accent/90"
      onClick={async () => {
        const result = await trigger()
        onValidation(result) // <-- envia para o pai
      }}
    >
      {isMutating ? '...' : 'Validar'}
    </Button>
  )
}

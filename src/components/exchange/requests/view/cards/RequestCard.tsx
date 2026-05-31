import { useContext, useState, useEffect } from 'react'
import { Button } from '../../../../ui/new/button'
import { Card, CardContent, CardFooter } from '../../../../ui/card'
import { Checkbox } from '../../../../ui/new/checkbox'
import { Divider } from '../../../../ui/new/divider'
import { ListRequestChanges, OptionOrder } from './ListRequestChanges'
import ExchangeRequestCommonContext from '../../../../../contexts/ExchangeRequestCommonContext'
import { CommonCardHeader } from './CommonCardHeader'
import ConflictsContext from '../../../../../contexts/ConflictsContext'
import { toast } from '../../../../ui/new/toaster'
import { exchangeErrorToText } from '../../../../../utils/error'
import useMarketplaceAcceptExchange from '../../../../../hooks/useMarketplaceAcceptExchange'
import { MoonLoader } from 'react-spinners'

export const RequestCard = () => {
  const {
    chosenRequest,
    hiddenRequests,
    request,
    open,
    setOpen,
    selectedOptions,
    setSelectedOptions,
    selectAll,
    setSelectAll,
    hide,
    togglePreview,
  } = useContext(ExchangeRequestCommonContext)

  const [hovered, setHovered] = useState<boolean>(false)

  const { conflictSeverity } = useContext(ConflictsContext)


  const { trigger: requestExchangeProposal, isMutating: isProcessingExchangeProposal } = useMarketplaceAcceptExchange(
    request,
    selectedOptions,
  )

  useEffect(() => {
    if (chosenRequest?.id !== request.id) {
      setOpen(false)
    }
  }, [chosenRequest])

  const handleSelectAll = () => {
    const newState = !selectAll
    setSelectAll(newState)

    for (const key of selectedOptions.keys()) {
      selectedOptions.set(key, newState)
    }

    const newSelectedOptions = new Map(selectedOptions)
    setSelectedOptions(newSelectedOptions)
    togglePreview(newSelectedOptions)
  }

  const submitExchange = async (e) => {
    e.preventDefault()

    try {
      const response = await requestExchangeProposal()
      if (response && response.ok) {
        toast({
          title: 'Troca proposta com sucesso!',
          description:
            'A proposta de troca foi realizada com sucesso. Podes confirmar a troca no email institucional ou na aba "recebidos" da página dos pedidos.',
        })
      } else {
        toast({
          title: 'Erro ao propor troca.',
          description: exchangeErrorToText[(await response.json())['error']],
          variant: 'negative',
        })
      }
    } catch (error) {
      toast({
        title: 'Erro ao propor a troca.',
        description: `Houve um erro desconhecido: ${error.message}`,
        variant: 'negative',
      })
    }
  }

  return (
    <>
      {request.type === 'marketplaceexchange' && (
        <Card
          onMouseOver={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          key={request.id}
          className={`shadow-md exchange-request-card ${hiddenRequests.has(request.id) ? 'hidden' : ''}`}
        >
          <CommonCardHeader
            name={request.issuer_name}
            username={request.issuer_nmec}
            hovered={hovered}
            request={request}
            openHook={[open, setOpen]}
            showRequestStatus={false}
            hideAbility={false}
            hideHandler={hide}
            classUserGoesToName="class_issuer_goes_from"
          />

          <CardContent className={`p-0 px-4 ${open ? '' : 'hidden'}`}>
            {request.options?.map((option) => (
              <ListRequestChanges
                key={crypto.randomUUID()}
                option={option}
                selectedOptionsHook={[selectedOptions, setSelectedOptions]}
                setSelectAll={setSelectAll}
                togglePreview={togglePreview}
                type={'marketplaceexchange'}
                optionOrder={OptionOrder.FROM_TO}
              />
            ))}
          </CardContent>
          {open && (
            <div className="px-4 mb-2">
              <Divider />
            </div>
          )}
          <CardFooter className={open ? '' : 'hidden'}>
            <div className="flex flex-col w-full space-y-3">
              <div className="flex flex-row items-center justify-center gap-x-2">
                <Checkbox id={`select-all-${request.id}`} checked={selectAll} onChange={handleSelectAll} />
                <label htmlFor={`select-all-${request.id}`} className="text-sm cursor-pointer select-none">
                  Selecionar todas
                </label>
              </div>
              <form className="flex justify-center">
                <Button
                  type="submit"
                  size="md"
                  onClick={!conflictSeverity ? submitExchange : () => {}}
                  className={
                    conflictSeverity
                      ? 'bg-red-400 cursor-not-allowed opacity-50'
                      : 'bg-green-600 text-white hover:bg-green-700 w-full'
                  }
                  disabled={conflictSeverity}
                >
                  {isProcessingExchangeProposal ? <MoonLoader size={20} /> : <span>Propôr troca</span>}
                </Button>
              </form>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  )
}

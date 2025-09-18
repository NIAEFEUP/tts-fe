import { useContext, useState } from "react";
import { MarketplaceRequest, UrgentRequest } from "../../../../../@types";
import ExchangeRequestCommonContext from "../../../../../contexts/ExchangeRequestCommonContext";
import SessionContext from "../../../../../contexts/SessionContext";
import { Card, CardContent, CardFooter } from "../../../../ui/card"
import { CommonCardHeader } from "./CommonCardHeader";
import { ListRequestChanges } from "./ListRequestChanges";
import { Button } from "../../../../ui/button";
import useCancelMarketplaceExchange from "../../../../../hooks/exchange/useCancelMarketplaceExchange";
import { MoonLoader } from "react-spinners";
import { StudentRequestCardStatus } from "../../../../../utils/requests";
import { useToast } from "../../../../ui/use-toast";
import { SWRInfiniteKeyedMutator } from "swr/infinite";

import api from "../../../../../api/backend";

type Props = {
    request: MarketplaceRequest | UrgentRequest;
    mutate: SWRInfiniteKeyedMutator<Promise<MarketplaceRequest[]>[]>;
}

export const MineRequestCard = ({ request, mutate }: Props) => {
    const {
        open, setOpen, selectedOptions, setSelectedOptions, setSelectAll, togglePreview,
        setRequestStatus
    } = useContext(ExchangeRequestCommonContext);
    

    
    const [hovered, setHovered] = useState<boolean>(false);
    const { toast } = useToast();

    const handleSave = async (id: number, message: string) => {
        setSaving(true)
        try {
            const res = await fetch(`${api.BACKEND_URL}/exchange/urgent/`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', [api.csrfTokenName()]: api.getCSRFToken() },
            body: JSON.stringify({ urgent_request_id: id, message })
            })
            if (!res.ok) {
                const text = await res.text()
                toast({ title: 'Erro a atualizar', description: text, variant: 'destructive' })
                return
            }
            const updated = await res.json()
            if (mutate) {
            mutate((pages:any) => pages.map((p:any)=>({
                ...p,
                data: p.data.map((r:any)=> r.id === id ? { ...r, ...updated } : r)
            })), { revalidate:false })
            }
            toast({ title: 'Atualizado com sucesso' })
            setEditing(false)
        } catch (e) {
            console.error(e);
            toast({ title: 'Erro inesperado', variant: 'destructive' })
        } finally { setSaving(false) }
    }

    const { trigger: cancelMarketplaceExchange, isMutating: cancelingMarketplaceExchange } = useCancelMarketplaceExchange(request.id);

    const { user } = useContext(SessionContext);
    const isIssuer = user.username === request.issuer_nmec;
    const [editing, setEditing] = useState(false);
    const [draftMessage, setDraftMessage] = useState<string | undefined>(() => request.type === 'urgentexchange' ? (request as UrgentRequest).message : undefined);
    const [saving, setSaving] = useState(false);

    return <Card
        onMouseOver={() => { setHovered(true) }}
        onMouseLeave={() => { setHovered(false) }}
    >
        <CommonCardHeader
            name={request.issuer_name}
            username={user.username}
            request={request as MarketplaceRequest}
            hovered={hovered}
            openHook={[open, setOpen]}
            classUserGoesToName={request.type === "directexchange" ? "class_participant_goes_to" : "class_issuer_goes_to"}
            showRequestStatus={true}
            hideAbility={false}
            hideHandler={() => { }}
        />
        <CardContent>
            {open && request.type === "urgentexchange" && (
                <div className="px-4">                    
                    {isIssuer ? (
                        editing ? (
                            <div className="flex flex-col gap-2">
                                <textarea className="w-full border rounded-md p-2" rows={3} value={draftMessage ?? ''} onChange={(e) => setDraftMessage(e.target.value)} />
                                <div className="flex gap-2">
                                    <Button disabled={saving} onClick={() =>{ handleSave(request.id, draftMessage ?? '')}} >Salvar
                                    </Button>
                                    <Button variant="outline" onClick={() => { setEditing(false); setDraftMessage((request as UrgentRequest).message); }}>Cancelar</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-2">
                                <div className="flex-1">{(request as UrgentRequest).message}</div>
                                <Button onClick={() => { setDraftMessage((request as UrgentRequest).message); setEditing(true); }}>Editar</Button>
                            </div>
                        )
                    ) : (
                        (request as UrgentRequest).message && <div>{(request as UrgentRequest).message}</div>
                    )}
                </div>)
            }
            {open && (
                <>
                    {request.options.map((option) => (
                        <ListRequestChanges
                            key={request.id}
                            option={option}
                            selectedOptionsHook={[selectedOptions, setSelectedOptions]}
                            setSelectAll={setSelectAll}
                            togglePreview={togglePreview}
                            showChooseCheckbox={false}
                            type={request.type}
                            userWillExchangeTo={option.other_student ? `${option.other_student}` : null}
                        />
                    ))}
                </>
            )}
        </CardContent>
        <CardFooter className={open ? "" : "hidden"}>
            {(!(request as MarketplaceRequest).canceled && !request.accepted && request.type != "urgentexchange") && <Button
                variant="destructive"
                onClick={async () => {
                    await cancelMarketplaceExchange();
                    setRequestStatus(StudentRequestCardStatus.CANCELED)
                }}
            >
                {cancelingMarketplaceExchange
                    ? <MoonLoader size={20} />
                    : "Cancelar"
                }
            </Button>
            }
        </CardFooter>
    </Card>
}
import { useContext, useEffect, useState } from "react";
import { DirectExchangeRequest } from "../../../../../@types"
import ExchangeRequestCommonContext from "../../../../../contexts/ExchangeRequestCommonContext";
import SessionContext from "../../../../../contexts/SessionContext";
import { useSession } from "../../../../../hooks";
import { DirectExchangePendingMotive } from "../../../../../utils/exchange";
import { Button } from "../../../../ui/button";
import { Card, CardContent, CardFooter } from "../../../../ui/card";
import { Checkbox } from "../../../../ui/checkbox";
import { CommonCardHeader } from "./CommonCardHeader";
import { ListRequestChanges } from "./ListRequestChanges";

type Props = {
  request: DirectExchangeRequest
}

export const ReceivedRequestCard = ({
  request
}: Props) => {
  const { open, setOpen, selectedOptions, setSelectedOptions, selectAll, setSelectAll, togglePreview, handleSelectAll } = useContext(ExchangeRequestCommonContext);
  const [hovered, setHovered] = useState<boolean>(false);

  const { user } = useContext(SessionContext);

  useEffect(() => {
    if (request.type === "directexchange") request.options = request.options.filter((option) => option.participant_nmec === user?.username);
  }, [request]);

  return <>
    {request.type === "directexchange" &&
      <Card
        className="exchange-request-card"
        onMouseOver={() => { setHovered(true) }}
        onMouseLeave={() => { setHovered(false) }}
      >
        <CommonCardHeader
          name={request.issuer_name}
          username={request.issuer_nmec}
          request={request}
          hovered={hovered}
          openHook={[open, setOpen]}
          showRequestStatus={true}
          hideAbility={false}
          hideHandler={() => { }}
          classUserGoesToName="class_participant_goes_to"
        />
        <CardContent>
          {/*
        Show the changes that will be made for the auth user only.
        The other changes that do not change the class of the student
        should not be shown
      */}
          {open && (
            <>
              {request.options.map((option) => (
                <ListRequestChanges
                  option={option}
                  selectedOptionsHook={[selectedOptions, setSelectedOptions]}
                  setSelectAll={setSelectAll}
                  togglePreview={togglePreview}
                  type={"directexchange"}
                />
              ))}
            </>
          )}
        </CardContent>
        <CardFooter className={open ? "" : "hidden"}>
          <div className="flex flex-row justify-between w-full items-center">
            <div className="flex flex-row items-center gap-x-2">
              <Checkbox
                id="select-all"
                checked={selectAll}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all">Selecionar todas</label>
            </div>
            <form className="flex flex-row gap-2">
              {!request.accepted && request.pending_motive === DirectExchangePendingMotive.USER_DID_NOT_ACCEPT &&
                <Button type="submit">Aceitar</Button>
              }
            </form>
          </div>

        </CardFooter>
      </Card>}
  </>


}

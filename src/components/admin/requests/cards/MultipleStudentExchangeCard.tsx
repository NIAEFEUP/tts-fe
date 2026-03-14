import { useState } from "react";
import { DirectExchangeParticipant, DirectExchangeRequest } from "../../../../@types";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Person } from "./Person";
import { ExchangeStatus } from "./ExchangeStatus";
import { PersonExchanges } from "./PersonExchanges";
import { AdminRequestCardFooter } from "./AdminRequestCardFooter";
import { RequestDate, RequestLastUpdatedDate } from "./RequestDate";
import { listEmailExchanges } from "../../../../utils/mail";
import { AdminRequestType } from "../../../../utils/exchange";
import { ValidateRequestButton } from "./ValidateRequestButton"; 

type Props = {
  exchange: DirectExchangeRequest;
};

const participantExchangesMap = (exchange: DirectExchangeRequest) => {
  const participants = exchange.options;
  const map = new Map<string, Array<DirectExchangeParticipant>>();

  participants.forEach((participant) => {
    const key = `${participant.participant_nmec},${participant.participant_name}`;
    const existingEntry = map.get(key);

    if (existingEntry) {
      existingEntry.push(participant);
    } else {
      map.set(key, [participant]);
    }
  });

  return map;
};

export const MultipleStudentExchangeCard = ({ exchange }: Props) => {
  const [open, setOpen] = useState(false);
  const [exchangeState, setExchangeState] = useState(exchange);
  const [justValidated, setJustValidated] = useState<"valid" | "invalid" | false>(false);

  const handleValidation = (result: { valid: boolean; last_validated?: string | null }) => {
    if (result.valid && result.last_validated) {
      setExchangeState(prev => ({
        ...prev,
        last_validated: result.last_validated,
      }));
      setJustValidated("valid"); // Validado agora mesmo
    } else {
      setJustValidated("invalid"); // Inválido!
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center py-4 px-9">
        <div className="flex gap-4 items-center">
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <CardTitle>
              <h2 className="font-bold">#{exchangeState.id}</h2>
            </CardTitle>
            <ExchangeStatus exchange={exchangeState} />
          </div>

          {!open && (
            <>
              <RequestDate date={exchangeState.date} />
          <RequestLastUpdatedDate
            date={exchangeState.last_validated}
            justValidated={justValidated}
          />
              </>
            )}
          </div>

          {!open &&
            [...new Map(exchangeState.options.map((p) => [p.participant_nmec, p])).values()].map(
              (participant) => (
                <Person
                  key={"multiple-student-person-" + participant.participant_nmec}
                    name={participant.participant_name}
                    nmec={participant.participant_nmec}
                  />
              )
            )}
        </div>

        <div className="flex gap-2 items-center">
          {!open && justValidated !== "invalid" && (
            <ValidateRequestButton id={exchangeState.id} onValidation={handleValidation} />
          )}
          
          <Button
            onClick={() => setOpen((prev) => !prev)}
            variant="outline"
            className="ml-6 h-9 w-9 p-0 border-2 border-slate-200 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-all duration-200 shadow-sm"
          >
            {open ? (
              <ChevronUpIcon size={18} strokeWidth={2.5} />
            ) : (
              <ChevronDownIcon size={18} strokeWidth={2.5} />
            )
            }
          </Button>
        </div>
      </CardHeader>

    <CardContent className={`w-full ${open ? "pt-0 pb-4 px-9" : "p-0"}`}>
      {open && (
        <div className="flex flex-col gap-y-6">
          {Array.from(participantExchangesMap(exchangeState).entries()).map(([participant, exchanges]) => {
            const [nmec, name] = participant.split(",");
            return (
              <PersonExchanges
                key={"multiple-student-person-exchanges-" + nmec}
                exchanges={exchanges}
                participant_name={name}
                participant_nmec={nmec}
                showTreatButton={true}
              />
            );
          })}
        </div>
      )}
      </CardContent>

      {open && (
        <AdminRequestCardFooter
          nmecs={[...new Set(exchangeState.options.map((option) => option.participant_nmec))]}
          exchangeMessage={listEmailExchanges(
            exchangeState.options.map((option) => ({
              participant_nmec: option.participant_nmec,
              participant_name: option.participant_name,
              goes_from: option.class_participant_goes_from.name,
              goes_to: option.class_participant_goes_to.name,
              course_acronym: option.course_unit,
            }))
          )}
          requestType={AdminRequestType.DIRECT_EXCHANGE}
          requestId={exchangeState.id}
          showTreatButton={false}
          setExchange={setExchangeState}
          courseId={exchangeState.options.map((option) => option.course_info.course)}
        />
      )}
    </Card>
  );
};

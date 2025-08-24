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
      <CardHeader className="flex flex-row justify-between items-start gap-4">
        {/* Coluna da esquerda - 30% */}
        <div className="flex flex-col w-1/3 gap-2 relative">
          <div className="flex gap-2 items-center">
            <CardTitle>
              <h2 className="font-bold">#{exchangeState.id}</h2>
            </CardTitle>
            <ExchangeStatus exchange={exchangeState} />
          </div>

          <RequestDate date={exchangeState.date} />

          <RequestLastUpdatedDate
            date={exchangeState.last_validated}
            justValidated={justValidated}
          />

          <div className="mt-4 relative">
            <ValidateRequestButton id={exchangeState.id} onValidation={handleValidation} />
          </div>
        </div>

        {/* Coluna da direita - 60% */}
        <div className="flex flex-wrap w-2/3 gap-2">
          {!open &&
            [...new Map(exchangeState.options.map((p) => [p.participant_nmec, p])).values()].map(
              (participant) => (
                <div
                  key={"multiple-student-person-" + participant.participant_nmec}
                  className="max-w-[45%] truncate whitespace-nowrap"
                >
                  <Person
                    name={participant.participant_name}
                    nmec={participant.participant_nmec}
                  />
                </div>
              )
            )}
        </div>



        {/* Botão de expandir */}
        <div>
          <Button
            onClick={() => setOpen((prev) => !prev)}
            className="bg-white text-black border-2 border-black hover:text-white"
          >
            {open ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="w-full flex flex-col flex-wrap gap-y-4">
        {open &&
          Array.from(participantExchangesMap(exchangeState).entries()).map(([participant, exchanges]) => {
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

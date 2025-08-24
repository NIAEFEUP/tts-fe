import { requestCreatedAtDate, requestLastUpdatedDate } from "../../../../utils/date";

// Componente para mostrar a data de criação
type RequestDateProps = { date: string };
export const RequestDate = ({ date }: RequestDateProps) => (
  <p className="text-sm">{requestCreatedAtDate(date)}</p>
);

// Componente para mostrar a última validação
type RequestLastUpdatedDateProps = {
  date?: string;
  justValidated?: "valid" | "invalid" | false;
};
export const RequestLastUpdatedDate = ({ date, justValidated }: RequestLastUpdatedDateProps) => {
  if (justValidated === "valid") {
    return <p className="text-sm text-green-600">Validado agora mesmo</p>;
  }

  if (justValidated === "invalid") {
    return <p className="text-sm text-red-600">Inválido!</p>;
  }

  if (!date) return null;

  return <p className="text-sm text-gray-500">{requestLastUpdatedDate(date)}</p>;
};

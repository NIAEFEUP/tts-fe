import { CardDescription, CardTitle } from "../../../ui/card";
import studentInfoService from "../../../../api/services/studentInfo"


export const Person = ({ name, nmec }: { name: string, nmec: string }) => (
    <div className="flex gap-1 items-center">
        <img src={studentInfoService.getStudentPictureUrl(nmec)} alt="Foto do estudante" className="w-16 h-16 rounded-full" />
        <div className="flex flex-col gap-1">
            <CardTitle>
                <a className="hover:underline" href={`https://sigarra.up.pt/feup/pt/fest_geral.cursos_list?pv_num_unico=${nmec}`}>
                    {name}
                </a>
            </CardTitle>
            <CardDescription>
                {nmec}
            </CardDescription>
        </div>
    </div>
);
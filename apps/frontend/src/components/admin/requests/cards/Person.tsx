import { CardDescription, CardTitle } from "../../../ui/card";

export const Person = ({ name, nmec }: { name: string, nmec: string }) => (
    <div className="flex gap-1 items-center">
        <img src="https://gravatar.com/avatar/8c64fbfa02d0a9f45ca4a903826e2e5e?s=400&d=robohash&r=x" alt="Foto do estudante" className="w-16 h-16 rounded-full" />
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
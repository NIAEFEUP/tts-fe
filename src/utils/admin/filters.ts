import { requestFilterProperties, RequestFiltersContextContent } from "../../contexts/admin/RequestFiltersContext";

export const buildUrlWithFilterParams = (
    url: string, 
    filterContext: RequestFiltersContextContent
) => {
    let newUrl = `${url}?`;

    for (const property of requestFilterProperties) {
        const propertValue = filterContext[property];

        if(propertValue) {
            newUrl += `${property}=${propertValue}&`;
        }
    }

    return newUrl;
}
import { requestFilterProperties, RequestFiltersContextContent } from "../../contexts/admin/RequestFiltersContext";

export const buildUrlWithFilterParams = (
    url: string, 
    filterContext: RequestFiltersContextContent
) => {
    let newUrl = `${url}`;

    for (const property of requestFilterProperties) {
        const propertyValue = filterContext[property];

        if(Array.isArray(propertyValue)) {
            newUrl += `&${property}=`;
            propertyValue.forEach((value, idx) => {
                if(idx > 0) newUrl += ",";
                newUrl += `${value}`;
            });
        } else if(propertyValue) {
            newUrl += `&${property}=${propertyValue}`;
        }
    }

    return newUrl;
}
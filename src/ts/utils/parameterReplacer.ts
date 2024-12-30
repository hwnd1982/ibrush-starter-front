export const replaceParameter = (parameter: string, url: string) => {
    const urlRealParams = new URLSearchParams(window.location.search);
    const param = urlRealParams.get(parameter);
    const urlArgumentParams = new URLSearchParams(url);
    let newUrl = url;

    if (!urlArgumentParams.has(parameter) && urlRealParams.has(parameter)) {
        const separator = url.includes('?') ? '&' : '?';
        newUrl = `${url}${separator}${parameter}=${param}`;
    }

    return newUrl;
}
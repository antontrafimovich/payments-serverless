const boundaryRegex = /------(.*?)\\r?\\n/;
const dispositionRegex =
  /Content-Disposition: form-data;(.*?)(?=\\r?\\nContent-Type)/;
const contentTypeRegex = /Content-Type: (.*?)\\r?\\n/;
const contentRegex = /\\r?\\n\\r?\\n([\s\S]*?)------/;

export const parseFormData = (inputText: string) => {
  const boundaryMatch = inputText.match(boundaryRegex);
  const dispositionMatch = inputText.match(dispositionRegex);
  const contentTypeMatch = inputText.match(contentTypeRegex);
  const contentMatch = inputText.match(contentRegex);

  console.log("boundaryMatch", boundaryMatch);
  console.log("dispositionMatch", dispositionMatch);
  console.log("contentTypeMatch", contentTypeMatch);
  console.log("contentMatch", contentMatch);

  if (
    !boundaryMatch ||
    !dispositionMatch ||
    !contentTypeMatch ||
    !contentMatch
  ) {
    return null;
  }

  return {
    meta: dispositionMatch[0].trim(),
    contentType: contentTypeMatch[1],
    content: contentMatch[1].trim(),
  };
};

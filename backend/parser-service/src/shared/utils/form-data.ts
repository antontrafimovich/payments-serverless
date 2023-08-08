export const parseFormData = (inputText: string) => {
  const inputString = inputText; // Your input string

  const regex =
    /filename="([^"]+)"\s+Content-Type: ([^\n]+)([\s\S]*?)\n----------------------------/g;
  const [data] = [...inputString.matchAll(regex)];

  return {
    filename: data[1].trim(),
    content: data[3].trim(),
    contentType: data[2].trim(),
  };
};

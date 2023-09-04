export const download = (content: string, name = "report.txt") => {
  const base64 = btoa(content);

  const linkSource = `data:application/json;base64,${base64}`;
  const downloadLink = document.createElement("a");
  document.body.appendChild(downloadLink);

  downloadLink.href = linkSource;
  downloadLink.target = "_self";
  downloadLink.download = name;
  downloadLink.click();

  document.body.removeChild(downloadLink);
};

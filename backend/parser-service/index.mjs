import { createServer } from "http";
import { readFile } from "node:fs/promises";
import { StringDecoder } from "node:string_decoder";

const PORT = 5123;

const boundaryRegex = /------(.*?)\r?\n/;
const dispositionRegex =
  /Content-Disposition: form-data;(.*?)(?=\r?\nContent-Type)/;
const contentTypeRegex = /Content-Type: (.*?)\r?\n/;
const contentRegex = /\r?\n\r?\n([\s\S]*?)------/;

// Function to extract the fields from the input text
function parseFormData(inputText) {
  const boundaryMatch = inputText.match(boundaryRegex);
  const dispositionMatch = inputText.match(dispositionRegex);
  const contentTypeMatch = inputText.match(contentTypeRegex);
  const contentMatch = inputText.match(contentRegex);

  if (
    !boundaryMatch ||
    !dispositionMatch ||
    !contentTypeMatch ||
    !contentMatch
  ) {
    return null;
  }

  const result = {
    "Content-Disposition": dispositionMatch[0].trim(),
    name: dispositionMatch[1].match(/name="(.*?)"/)[1],
    filename: dispositionMatch[1].match(/filename="(.*?)"/)[1],
    "Content-Type": contentTypeMatch[1],
    content: contentMatch[1].trim(),
  };

  return result;
}

createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "text/html",
    });
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/") {
    const file = await readFile("./index.html", { encoding: "utf-8" });
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    res.end(file);
  }

  if (req.method === "POST" && req.url.startsWith("/upload")) {
    let data = "";

    req
      .on("data", (chunk) => {
        console.log(chunk.toString());
        data += chunk;
      })
      .on("end", () => {
        const result = parseFormData(data);
        console.log(JSON.stringify(result));
      });

    res.writeHead(204);
    res.end();
  }
}).listen(PORT, () => {
  console.log(`Server is listening ${PORT} port`);
});

import { parseFormData } from "../../../../src/shared/utils/form-data";

describe("Utils form-data", () => {
  it("parseFormData method should return parsed data on input", () => {
    const data = `
    ------WebKitFormBoundaryUcFJqbfiu6AGj418
Content-Disposition: form-data; name="report"; filename="pko_original_01_2023.csv"
Content-Type: text/csv

asd
------WebKitFormBoundaryUcFJqbfiu6AGj418--
    `;
    const result = parseFormData(data);

    console.log(result);

    expect(result.contentType).toEqual("text/csv");
    expect(result.filename).toEqual("pko_original_01_2023.csv");
    expect(result.content).toEqual(`asd`);
  });
});

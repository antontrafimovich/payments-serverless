import { parseFormData } from "../../../../src/shared/utils/form-data";

describe("Utils form-data", () => {
  it("parseFormData method should return parsed data on input", () => {
    const data = `
    ----------------------------120343901028425907851304
Content-Disposition: form-data; name="report"; filename="original_01_2023.csv"
Content-Type: text/csv

Data operacji,Data waluty,Typ transakcji,Kwota,Waluta,Saldo po transakcji,Opis transakcji,,,,
2/1/2023,1/30/2023,P�atno��,-1.95,PLN,106726.72,Tytu�: 010061097 741695030305803033514,Lokalizacja: Kraj: POLSKA Miasto: WARSZAWA Adres: PUTKA OBRZEZNA 1F,Data i czas operacji: 2023-01-30,"Oryginalna kwota operacji: 1,95 PLN",Numer karty: 425125******0521

----------------------------120343901028425907851304
Content-Disposition: form-data; name="bank"

pko
----------------------------120343901028425907851304--
    `;

    const result = parseFormData(
      data,
      "multipart/form-data; boundary=--------------------------120343901028425907851304"
    );

    expect(result).not.toBeNull();
    expect(typeof result!["bank"]).toEqual("string");
  });
});

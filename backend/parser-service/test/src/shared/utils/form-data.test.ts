import { parseFormData } from "../../../../src/shared/utils/form-data";

describe("Utils form-data", () => {
  it("parseFormData method should return parsed data on input", () => {
    const data = `
    ----------------------------120343901028425907851304
Content-Disposition: form-data; name="report"; filename="pko_original_01_2023.csv"
Content-Type: text/csv

Data operacji,Data waluty,Typ transakcji,Kwota,Waluta,Saldo po transakcji,Opis transakcji,,,,
2/1/2023,1/30/2023,P�atno��,-1.95,PLN,106726.72,Tytu�: 010061097 741695030305803033514,Lokalizacja: Kraj: POLSKA Miasto: WARSZAWA Adres: PUTKA OBRZEZNA 1F,Data i czas operacji: 2023-01-30,"Oryginalna kwota operacji: 1,95 PLN",Numer karty: 425125******0521
2/1/2023,1/30/2023,P�atno��,-75,PLN,106728.67,Tytu�:  743788330300846142501,Lokalizacja: Kraj: POLSKA Miasto: Kobylka Adres: KSK Krystian Sienko,Data i czas operacji: 2023-01-30,"Oryginalna kwota operacji: 75,00 PLN",Numer karty: 425125******0521
1/31/2023,1/29/2023,P�atno��,-151.99,PLN,106803.67,Tytu�: 010085822 749875030290025063987,Lokalizacja: Kraj: HOLANDIA Miasto: Amsterdam Adres: UBER *EATS HELP.UBER.COM,Data i czas operacji: 2023-01-29,"Oryginalna kwota operacji: 151,99 PLN",Numer karty: 425125******0521
1/31/2023,1/29/2023,P�atno��,-20.4,PLN,106955.66,Tytu�:  748384930301947905901,Lokalizacja: Kraj: POLSKA Miasto: WARSZAWA Adres: MCDONALD'S 217 W-WA 28,Data i czas operacji: 2023-01-29,"Oryginalna kwota operacji: 20,40 PLN",Numer karty: 425125******0521
1/31/2023,1/29/2023,P�atno��,-20.83,PLN,106976.06,Tytu�:  749888530294962706715,Lokalizacja: Kraj: POLSKA Miasto: WARSZAWA Adres: JMP S.A. BIEDRONKA 4884,Data i czas operacji: 2023-01-29,"Oryginalna kwota operacji: 20,83 PLN",Numer karty: 425125******0521

----------------------------120343901028425907851304
Content-Disposition: form-data; name="bank"

pko
----------------------------120343901028425907851304--
    `;

    const result = parseFormData(
      data,
      "multipart/form-data; boundary=--------------------------120343901028425907851304"
    );

    console.log(result);

    expect(result).not.toBeNull();
    expect(typeof result!["bank"]).toEqual("string");
  });
});

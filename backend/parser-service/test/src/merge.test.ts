import { merge } from "../../src/merge";

describe("merge", () => {
  it("should correctly merge payments and shop metadata with alias", () => {
    const PAYMENTS_INFO = [
      {
        address:
          "Lokalizacja: Kraj: POLSKA Miasto: Kobylka Adres: KSK Krystian Sienko",
        date: "1/9/2023",
        value: "-75",
      },
    ];

    const SHOPS_INFO = [
      {
        address: "KSK Krystian Sienko /// ZABKA",
        type: "Groceries",
      },
    ];

    const result = merge(PAYMENTS_INFO, SHOPS_INFO);

    console.log(result);
  });
});

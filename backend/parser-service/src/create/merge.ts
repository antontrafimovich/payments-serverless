import { Shop } from "./shop/shop.model";

export const merge = (
  paymentsData: {
    address: string;
    date: string;
    value: string;
  }[],
  shopsMetadata: Shop[]
) => {
  return paymentsData.map((item, index) => {
    const shopInfo = shopsMetadata.find((shopInfo) => {
      const [address] = shopInfo.address.split(" /// ");
      const addressWords = address.split(" ");

      return addressWords.every((word) =>
        item.address.toLowerCase().includes(word.toLowerCase())
      );
    });

    let counterparty = item.address;

    if (shopInfo) {
      const [address, alias] = shopInfo.address.split(" /// ");

      counterparty = alias ?? address;
    }

    return [index, item.value, item.date, shopInfo?.type, counterparty];
  });
};

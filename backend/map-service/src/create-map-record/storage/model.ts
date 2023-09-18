export type StorageRecord = {
  type: string;
  address: string;
};

export type Storage = {
  post(record: StorageRecord): Promise<StorageRecord>;
};

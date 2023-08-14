type FormDataItemFile = {
  filename: string;
  contentType: string;
  content: string;
};

type FormDataItemString = string;

type FormDataItem = FormDataItemFile | FormDataItemString;

export const isFormDataFile = (
  item: FormDataItem
): item is FormDataItemFile => {
  return typeof item === "object";
};

export const isFormDataString = (
  item: FormDataItem
): item is FormDataItemString => {
  return typeof item === "string";
};

const getBoundary = (contentType: string) => {
  return contentType.split("=")[1];
};

export const parseFormData = (
  formDataString: string,
  contentType: string | undefined
): Record<string, FormDataItem> | null => {
  if (contentType === undefined) {
    return null;
  }

  const boundary = getBoundary(contentType);

  const result: Record<string, FormDataItem> = {};

  const formDataItems = formDataString.split(boundary);

  for (let i = 0; i < formDataItems.length; i++) {
    const item = formDataItems[i];

    const fileName = item.match(/filename=".+"/g)?.[0];

    if (fileName) {
      const contentType = item.match(/Content-Type:\s.+/g)?.[0];
      const itemName = item.match(/name=".+";/g)?.[0];

      if (!contentType || !itemName) {
        continue;
      }

      result[itemName.slice(6, -2)] = {
        filename: fileName.slice(10, -1),
        contentType: contentType.slice(14),
        content: item.slice(
          item.search(/Content-Type:\s.+/g) + contentType.length + 4,
          -4
        ),
      };
    } else if (/name=".+"/g.test(item)) {
      const itemName = item.match(/name=".+"/g)![0];

      result[itemName.slice(6, -1)] = item.slice(
        item.search(/name=".+"/g) + itemName.length + 4,
        -4
      );
    }
  }

  return result;
};

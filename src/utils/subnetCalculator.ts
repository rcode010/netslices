export const parseInput = (input: string) => {
  let Ip: string = "";
  let prefix: number = 0;

  if (input.includes("/")) {
    const splitedInput = input.split("/");

    if (!splitedInput[0]) {
      return "invalid IP";
    }
    if (!splitedInput[1]) {
      return "invalid prefix";
    }
    if (splitedInput[1].includes(".")) {
      const subnetMask = splitedInput[1].split(".");
      let result: number = 0;
      subnetMask.forEach((el) => {
        const possition = parseInt(el).toString(2).indexOf("0");
        if (possition == -1) {
          result += 8;
        } else {
          result += possition;
        }
      });
      prefix = result;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      prefix = parseInt(splitedInput[1], 10);
    }
    if (splitedInput[0].split(".").length != 4) {
      return "invalid Ip";
    }
    Ip = splitedInput[0];
  } else if (input.includes(" ")) {
    const splitedInput = input.split(" ");

    if (!splitedInput[0]) {
      return "invalid IP";
    }
    if (!splitedInput[1]) {
      return "invalid prefix";
    }
    if (splitedInput[1].includes(".")) {
      const subnetMask = splitedInput[1].split(".");
      let result: number = 0;
      subnetMask.forEach((el) => {
        const possition = parseInt(el).toString(2).indexOf("0");
        if (possition == -1) {
          result += 8;
        } else {
          result += possition;
        }
      });
      prefix = result;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      prefix = parseInt(splitedInput[1], 10);
    }
    if (splitedInput[0].split(".").length != 4) {
      return "invalid Ip";
    }
    Ip = splitedInput[0];
  }

  return { Ip, prefix };
};

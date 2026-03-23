import type { Mode, CalculationResult, SubnetInfo } from "../types/subnet";

export const subnetCalculator = (
  ip: string[],
  prefix: number = 0,
  mode: Mode,
  value: number,
): CalculationResult => {
  let subnets: SubnetInfo[] = [];
  let borrowedBits = 0;
  while (Math.pow(2, borrowedBits) < value) {
    borrowedBits++;
  }
  const newPrefix: number = borrowedBits + prefix;
  let temp: string = "";
  let newSubnetMask: string = "";

  let dotValue: number = 7;
  for (let i = 0; i <= 31; i++) {
    if (i < newPrefix) {
      temp += 1;
    } else {
      temp += 0;
    }
    if (i == dotValue) {
      newSubnetMask += parseInt(temp, 2) + ".";
      temp = "";
      dotValue += 8;
    }
  }
  newSubnetMask = newSubnetMask.slice(0, -1);
  const increment: number = Math.pow(2, 32 - newPrefix);
  for (let i = 0; i < Math.pow(2, borrowedBits); i++) {
    subnets[i] = {} as SubnetInfo;
    subnets[i].networkAddress = ip.join(".");
    subnets[i].subnetMask = newSubnetMask;
    ip[ip.length - 1] = String(Number(ip[ip.length - 1]) + 1);
    subnets[i].firstHost = ip.join(".");
    ip[ip.length - 1] = String(Number(ip[ip.length - 1]) + increment - 3);

    subnets[i].lastHost = ip.join(".");
    ip[ip.length - 1] = String(Number(ip[ip.length - 1]) + 1);

    subnets[i].broadcastAddress = ip.join(".");

    subnets[i].usableHosts = Math.pow(2, 32 - newPrefix) - 2;
    ip[ip.length - 1] = String(Number(ip[ip.length - 1]) + 1);
  }
  return {
    mode,
    originalNetwork: ip.join("."),
    originalPrefix: prefix,
    borrowedBits,
    newPrefix,
    newMask: newSubnetMask,
    totalSubnets: Math.pow(2, borrowedBits),
    subnets,
    steps: [],
  };
};

import type { Mode, CalculationResult, SubnetInfo } from "../types/subnet";

/** Builds a subnet mask string from a prefix length (e.g. 24 → "255.255.255.0") */
const buildSubnetMask = (prefix: number): string => {
  let mask = "";
  let remaining = prefix;

  for (let octet = 0; octet < 4; octet++) {
    const bits = Math.min(remaining, 8);
    mask += (256 - Math.pow(2, 8 - bits)) + (octet < 3 ? "." : "");
    remaining = Math.max(0, remaining - 8);
  }

  return mask;
};

export const subnetCalculator = (
  ip: string[],
  prefix: number = 0,
  mode: Mode,
  value: number,
): CalculationResult => {
  // Determine how many bits to borrow to satisfy the requested number of subnets/hosts
  let borrowedBits = 0;
  while (Math.pow(2, borrowedBits) < value) {
    borrowedBits++;
  }

  const newPrefix = borrowedBits + prefix;
  const subnetSize = Math.pow(2, 32 - newPrefix);
  const totalSubnets = Math.pow(2, borrowedBits);
  const newSubnetMask = buildSubnetMask(newPrefix);

  // Work on a local copy so the original input array is never mutated
  const octets = [...ip].map(Number);
  const subnets: SubnetInfo[] = [];

  for (let i = 0; i < totalSubnets; i++) {
    const networkAddress = octets.join(".");

    octets[3] += 1;
    const firstHost = octets.join(".");

    octets[3] += subnetSize - 3;
    const lastHost = octets.join(".");

    octets[3] += 1;
    const broadcastAddress = octets.join(".");

    subnets.push({
      networkAddress,
      subnetMask: newSubnetMask,
      cidrPrefix: newPrefix,
      firstHost,
      lastHost,
      broadcastAddress,
      usableHosts: subnetSize - 2,
    });

    octets[3] += 1;
  }

  return {
    mode,
    originalNetwork: ip.join("."),
    originalPrefix: prefix,
    borrowedBits,
    newPrefix,
    newMask: newSubnetMask,
    totalSubnets,
    subnets,
    steps: [],
  };
};

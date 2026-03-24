import type { Mode, CalculationResult, SubnetInfo } from "../types/subnet";

/** Converts an octet array to a 32-bit unsigned integer */
const ipToInt = (octets: number[]): number =>
  ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;

/** Converts a 32-bit unsigned integer back to an octet array */
const intToIp = (int: number): number[] => [
  (int >>> 24) & 255,
  (int >>> 16) & 255,
  (int >>> 8) & 255,
  int & 255,
];

/** Builds a subnet mask string from a prefix length (e.g. 24 → "255.255.255.0") */
const buildSubnetMask = (prefix: number): string => {
  let remaining = prefix;
  return Array.from({ length: 4 }, () => {
    const bits = Math.min(remaining, 8);
    remaining = Math.max(0, remaining - 8);
    return 256 - Math.pow(2, 8 - bits);
  }).join(".");
};

/** Validates each octet is between 0 and 255 */
const validateIp = (octets: number[]): void => {
  if (octets.length !== 4)
    throw new Error("Invalid IP address — must have exactly 4 octets.");
  for (const octet of octets) {
    if (isNaN(octet) || octet < 0 || octet > 255)
      throw new Error(
        `Invalid IP address — each octet must be between 0 and 255. Got: ${octet}`
      );
  }
};

/** Validates the prefix length is within range */
const validatePrefix = (prefix: number): void => {
  if (prefix < 0 || prefix > 32)
    throw new Error(`Invalid prefix — must be between 0 and 32. Got: ${prefix}`);
};

export const subnetCalculator = (
  ip: string[],
  prefix: number = 0,
  mode: Mode,
  value: number,
): CalculationResult => {
  const octets = ip.map(Number);

  // --- Validation ---
  validateIp(octets);
  validatePrefix(prefix);

  if (value < 1)
    throw new Error("Value must be at least 1.");

  // --- Determine bits to borrow based on mode ---
  let borrowedBits = 0;
  let newPrefix: number;

  if (mode === "subnets") {
    // Borrow from the left of the host portion to create enough subnets
    while (Math.pow(2, borrowedBits) < value) borrowedBits++;
    newPrefix = prefix + borrowedBits;
  } else {
    // hosts mode — need enough host bits to accommodate value + 2 (network + broadcast)
    let hostBits = 0;
    while (Math.pow(2, hostBits) < value + 2) hostBits++;
    newPrefix = 32 - hostBits;
    borrowedBits = newPrefix - prefix;
  }

  // --- Guard against impossible subnets ---
  if (newPrefix > 30)
    throw new Error(
      "Not enough address space — requested too many subnets or too many hosts."
    );
  if (borrowedBits < 0)
    throw new Error(
      "Cannot satisfy request — not enough bits available to borrow."
    );

  const subnetSize = Math.pow(2, 32 - newPrefix);
  const totalSubnets = Math.pow(2, borrowedBits);
  const newSubnetMask = buildSubnetMask(newPrefix);
  const increment = subnetSize;

  // --- Build subnets using 32-bit integer arithmetic (handles carry over correctly) ---
  let baseInt = ipToInt(octets);
  const subnets: SubnetInfo[] = [];

  for (let i = 0; i < totalSubnets; i++) {
    const networkOctets  = intToIp(baseInt);
    const firstOctets    = intToIp(baseInt + 1);
    const lastOctets     = intToIp(baseInt + subnetSize - 2);
    const broadcastOctets = intToIp(baseInt + subnetSize - 1);

    subnets.push({
      networkAddress:   networkOctets.join("."),
      subnetMask:       newSubnetMask,
      cidrPrefix:       newPrefix,
      firstHost:        firstOctets.join("."),
      lastHost:         lastOctets.join("."),
      broadcastAddress: broadcastOctets.join("."),
      usableHosts:      subnetSize - 2,
    });

    baseInt += subnetSize;
  }

  // --- Build step-by-step explanation ---
  const steps: string[] = [
    `Step 1: Original network is ${ip.join(".")}/${prefix} with ${Math.pow(2, 32 - prefix)} total addresses.`,
    `Step 2: You need ${value} ${mode === "subnets" ? "subnets" : "hosts per subnet"}.`,
    `Step 3: Find the smallest power of 2 ≥ ${value} → 2^${borrowedBits} = ${Math.pow(2, borrowedBits)}.`,
    `Step 4: Borrow ${borrowedBits} bit${borrowedBits !== 1 ? "s" : ""} from the host portion.`,
    `Step 5: New prefix length is /${newPrefix} (was /${prefix}).`,
    `Step 6: New subnet mask is ${newSubnetMask}.`,
    `Step 7: Each subnet has ${subnetSize} addresses (${subnetSize - 2} usable hosts).`,
    `Step 8: Increment between subnets is ${increment}.`,
    `Step 9: Total subnets created: ${totalSubnets} (you need ${value}, ${totalSubnets - value} are available for future use).`,
  ];

  return {
    mode,
    originalNetwork: ip.join("."),
    originalPrefix: prefix,
    borrowedBits,
    newPrefix,
    newMask: newSubnetMask,
    totalSubnets,
    subnets,
    steps,
  };
};
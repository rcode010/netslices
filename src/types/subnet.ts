export type Mode = 'subnets' | 'hosts'

export interface SubnetInfo {
  networkAddress: string
  subnetMask: string
  cidrPrefix: number
  firstHost: string
  lastHost: string
  broadcastAddress: string
  usableHosts: number
}

export interface CalculationStep {
  title: string
  explanation: string
}

export interface CalculationResult {
  mode: Mode
  originalNetwork: string
  originalPrefix: number
  borrowedBits: number
  newPrefix: number
  newMask: string
  totalSubnets: number
  subnets: SubnetInfo[]
  steps: CalculationStep[]
}
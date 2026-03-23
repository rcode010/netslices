# NetSlices

A visual IPv4 subnet calculator that calculates, explains, and visualizes subnets in real time.

---

## Features

- Supports both **number of subnets** and **hosts per subnet** modes
- Accepts multiple input formats: `192.168.1.0/24`, `192.168.1.0 255.255.255.0`, `192.168.1.0/255.255.255.0`
- Displays full subnet breakdown — network address, first/last host, broadcast, mask, usable hosts
- Step-by-step explanation of the math — borrowed bits, new prefix, increment
- Visual color-coded subnet diagram
- Clean dark UI built for readability

---

## Tech Stack

- React + Vite
- TypeScript
- Tailwind CSS v4

---

## Run Locally

```bash
git clone https://github.com/rcode010/netslices.git
cd netslices
npm install
npm run dev
```

---

## How It Works

NetSlices takes a base network address and either a subnet count or host requirement, then:

1. Calculates how many bits to borrow from the host portion
2. Derives the new subnet mask and prefix length
3. Generates every subnet range with full address details
4. Visualizes the address space as proportional color-coded blocks

---

## What I Learned

- How subnetting math works at the bit level
- Separating pure calculation logic from UI components
- Building real-time reactive interfaces with React and TypeScript

---

## Roadmap

- [ ] Hosts per subnet mode
- [ ] CIDR notation export
- [ ] VLSM (variable length subnet masking)
- [ ] IPv6 support
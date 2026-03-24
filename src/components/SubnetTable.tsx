import type { CalculationResult } from "../types/subnet";

interface SubnetTableProps {
  result: CalculationResult;
}

export const SubnetTable = ({ result }: SubnetTableProps) => {
  const columns = [
    "#",
    "Network Address",
    "First Host",
    "Last Host",
    "Broadcast",
    "Subnet Mask",
    "Usable Hosts",
  ];
  return (
    <div className="w-full max-w-6xl mx-auto mt-10">
      {/* Summary bar */}
      <div
        className="flex flex-wrap gap-6 px-6 py-4 rounded-xl mb-4"
        style={{
          background: "rgba(6, 182, 212, 0.05)",
          border: "1px solid rgba(6, 182, 212, 0.15)",
          fontFamily: "'Space Mono', monospace",
        }}
      >
        {[
          {
            label: "Original Network",
            value: `${result.originalNetwork}/${result.originalPrefix}`,
          },
          { label: "New Mask", value: result.newMask },
          { label: "New Prefix", value: `/${result.newPrefix}` },
          { label: "Bits Borrowed", value: result.borrowedBits },
          { label: "Total Subnets", value: result.totalSubnets },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1">
            <span
              className="text-xs uppercase tracking-widest"
              style={{ color: "#475569" }}
            >
              {label}
            </span>
            <span className="text-sm font-bold" style={{ color: "#06b6d4" }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(6, 182, 212, 0.15)" }}
      >
        <table
          className="w-full text-sm"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr style={{ background: "rgba(6, 182, 212, 0.08)" }}>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs uppercase tracking-widest"
                  style={{
                    color: "#06b6d4",
                    fontFamily: "'Space Mono', monospace",
                    borderBottom: "1px solid rgba(6, 182, 212, 0.15)",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.subnets.map((subnet, i) => (
              <tr
                key={i}
                style={{
                  background:
                    i % 2 === 0
                      ? "rgba(15, 23, 42, 0.6)"
                      : "rgba(15, 23, 42, 0.3)",
                  borderBottom: "1px solid rgba(6, 182, 212, 0.06)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "rgba(6, 182, 212, 0.08)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    i % 2 === 0
                      ? "rgba(15, 23, 42, 0.6)"
                      : "rgba(15, 23, 42, 0.3)")
                }
              >
                <td
                  className="px-4 py-3"
                  style={{
                    color: "#475569",
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  {i}
                </td>
                <td
                  className="px-4 py-3 font-bold"
                  style={{
                    color: "#06b6d4",
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  {subnet.networkAddress}
                </td>
                <td
                  className="px-4 py-3"
                  style={{
                    color: "#e2e8f0",
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  {subnet.firstHost}
                </td>
                <td
                  className="px-4 py-3"
                  style={{
                    color: "#e2e8f0",
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  {subnet.lastHost}
                </td>
                <td
                  className="px-4 py-3"
                  style={{
                    color: "#f87171",
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  {subnet.broadcastAddress}
                </td>
                <td
                  className="px-4 py-3"
                  style={{
                    color: "#94a3b8",
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  {subnet.subnetMask}
                </td>
                <td
                  className="px-4 py-3 text-center"
                  style={{
                    color: "#34d399",
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  {subnet.usableHosts}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React, { useEffect, useMemo, useState, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { leadsAPI } from "../services/api";
import toast from "react-hot-toast";
import { format, subDays } from "date-fns";
import Button from "../components/Button";
import Card from "../components/Card";
import {
  LeadsTrendChart,
  LeadsBySourceChart,
} from "../components/Charts/SummaryCharts";

// filter helpers
const ranges = {
  7: { label: "7 days", from: () => subDays(new Date(), 7) },
  30: { label: "30 days", from: () => subDays(new Date(), 30) },
  90: { label: "90 days", from: () => subDays(new Date(), 90) },
  all: { label: "All", from: () => null },
};

const buildTrend = (leads) => {
  const map = {};
  leads.forEach((l) => {
    const d = format(new Date(l.createdAt), "yyyy-MM-dd");
    map[d] = (map[d] || 0) + 1;
  });
  return Object.keys(map)
    .sort()
    .map((date) => ({ date, count: map[date] }));
};

const buildSources = (leads) => {
  const map = {};
  leads.forEach((l) => {
    const s = l.source || "Unknown";
    map[s] = (map[s] || 0) + 1;
  });
  return Object.keys(map).map((name) => ({ name, value: map[name] }));
};

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState("7");
  const wsRef = useRef(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await leadsAPI.getAll();
      setLeads(res.data.results || []);
    } catch (err) {
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // WebSocket placeholder: if you have a WS server, set URL in .env and enable
  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL;
    if (!wsUrl) return;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === "new_lead") {
          setLeads((prev) => [msg.lead, ...prev]);
        }
      } catch (e) {
        console.warn("ws parse err", e);
      }
    };
    ws.onopen = () => console.log("ws open");
    ws.onclose = () => console.log("ws closed");
    return () => ws.close();
  }, []);

  const filtered = useMemo(() => {
    const from = ranges[range].from();
    if (!from) return leads;
    return leads.filter((l) => new Date(l.createdAt) >= from);
  }, [leads, range]);

  const trend = useMemo(() => buildTrend(filtered), [filtered]);
  const sources = useMemo(() => buildSources(filtered), [filtered]);

  const handleExport = async () => {
    try {
      const res = await leadsAPI.exportCSV();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-${format(new Date(), "yyyy-MM-dd")}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Exported");
    } catch {
      toast.error("Export failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Overview</h1>
            <p className="text-sm text-gray-500">
              Recent performance and leads
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2 bg-white p-2 rounded-md shadow">
              {Object.entries(ranges).map(([key, v]) => (
                <button
                  key={key}
                  onClick={() => setRange(key)}
                  className={`px-3 py-1 rounded ${
                    range === key
                      ? "bg-primary-600 text-white"
                      : "text-gray-700"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <Button onClick={fetchLeads}>Refresh</Button>
            <Button onClick={handleExport}>Export</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LeadsTrendChart data={trend} />
          <LeadsBySourceChart data={sources} />
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2">Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l._id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{l.name}</td>
                    <td>{l.email}</td>
                    <td className="truncate max-w-xs">{l.message}</td>
                    <td>{new Date(l.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

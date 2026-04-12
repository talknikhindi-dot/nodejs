/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Server, Globe, Cpu, CheckCircle2 } from "lucide-react";

export default function App() {
  const [message, setMessage] = useState<string>("Connecting to backend...");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const [statusInfo, setStatusInfo] = useState<any>(null);

  useEffect(() => {
    // Fetch hello message
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        setStatus("success");
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to connect to backend.");
        setStatus("error");
      });

    // Fetch backend status
    fetch("/api/hello/status")
      .then((res) => res.json())
      .then((data) => setStatusInfo(data))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
            <Server className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Full-Stack Setup</h1>
            <p className="text-sm text-slate-500">Node.js + Express + React</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Backend Response</span>
            </div>
            <p className={`text-lg font-medium ${status === 'error' ? 'text-red-500' : 'text-slate-700'}`}>
              {message}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-100 bg-white">
              <Cpu className="w-5 h-5 text-indigo-500 mb-2" />
              <h3 className="text-sm font-medium">Structure</h3>
              <p className="text-xs text-slate-500">MVC Pattern Ready</p>
            </div>
            <div className="p-4 rounded-2xl border border-slate-100 bg-white">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-2" />
              <h3 className="text-sm font-medium">Security</h3>
              <p className="text-xs text-slate-500">Helmet + CORS</p>
            </div>
          </div>

          {statusInfo && (
            <div className="text-[10px] font-mono text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100 overflow-hidden">
              <div className="flex justify-between mb-1">
                <span>BACKEND_STATUS:</span>
                <span className="text-emerald-500 font-bold">{statusInfo.status.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>TIMESTAMP:</span>
                <span>{statusInfo.timestamp}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <p className="text-xs text-slate-400">
            Your full-stack environment is now fully configured and ready for development.
          </p>
        </div>
      </motion.div>
    </div>
  );
}


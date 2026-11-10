"use client";

import { useEffect, useState } from "react";
import { Calendar, X } from "lucide-react";

interface ReportItem {
  dateLabel: string;
  profit: number;
  losses: number;
  difference: number;
}

interface WeeklyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const euro = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "EUR",
});

const formatCurrency = (amount: number) => euro.format(amount);

export default function WeeklyReportModal({ isOpen, onClose }: WeeklyReportModalProps) {
  const [report, setReport] = useState<ReportItem[]>([]);
  const [period, setPeriod] = useState<"weekly" | "daily">("weekly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchReport(period);
    }
  }, [isOpen, period]);

  const fetchReport = async (selectedPeriod: "weekly" | "daily") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reports/weekly?period=${selectedPeriod}`);
      if (res.ok) {
        const data = await res.json();
        setReport(data.report ?? []);
      }
    } catch (err) {
      console.error("Erro ao carregar relatório:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Cabeçalho */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Histórico de Lucros e Perdas</h2>
              <p className="text-xs text-slate-500">
                {period === "weekly" ? "Agrupado semanalmente (Sexta-feira)" : "Agrupado dia a dia"}
              </p>
            </div>
          </div>

          {/* Seletor de Período (Semanal / Diário) */}
          <div className="flex items-center bg-slate-200/80 p-1 rounded-xl gap-1 self-start sm:self-auto">
            <button
              onClick={() => setPeriod("weekly")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                period === "weekly"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => setPeriod("daily")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                period === "daily"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Diário
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabela de Dados */}
        <div className="p-5 overflow-y-auto flex-1">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm">A carregar dados...</div>
          ) : report.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">Sem registos disponíveis para este período.</div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3.5">{period === "weekly" ? "Sexta-feira" : "Data"}</th>
                    <th className="p-3.5 text-right">Lucros</th>
                    <th className="p-3.5 text-right">Perdas</th>
                    <th className="p-3.5 text-right">Diferença</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.map((row) => {
                    const isProfit = row.difference > 0;
                    const isLoss = row.difference < 0;
                    return (
                      <tr key={row.dateLabel} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-medium text-slate-800">{row.dateLabel}</td>
                        <td className="p-3.5 text-right font-mono text-emerald-600 font-semibold">
                          + {formatCurrency(row.profit)}
                        </td>
                        <td className="p-3.5 text-right font-mono text-rose-600 font-semibold">
                          - {formatCurrency(row.losses)}
                        </td>
                        <td
                          className={`p-3.5 text-right font-mono font-bold ${
                            isProfit ? "text-emerald-600" : isLoss ? "text-rose-600" : "text-slate-600"
                          }`}
                        >
                          {isProfit ? "+ " : ""}
                          {formatCurrency(row.difference)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}
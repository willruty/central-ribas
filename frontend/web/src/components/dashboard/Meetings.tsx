import { motion } from "framer-motion";
import { Clock, Users } from "lucide-react";

import { Meeting } from "@/types/dashboard";

const meetings: Meeting[] = [];

const Meetings = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.35 }}
      className="section-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold font-display text-card-foreground">Reuniões Agendadas</h2>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-muted-foreground/70 uppercase tracking-wider">
            <th className="text-left pb-2 font-medium">Empresa</th>
            <th className="text-right pb-2 font-medium">Horário</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {meetings.length === 0 ? (
            <tr>
              <td colSpan={2} className="py-8 text-center text-muted-foreground italic">
                Nenhuma reunião agendada.
              </td>
            </tr>
          ) : (
            meetings.map((m, i) => (
              <tr key={i} className="table-row-hover">
                <td className="py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-sm">
                      {m.icon}
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{m.company}</p>
                      <p className="text-xs text-muted-foreground/70">{m.desc}</p>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 text-right">
                  <div className="flex items-center gap-1.5 justify-end text-xs text-muted-foreground/80">
                    <Clock size={12} />
                    <span>{m.time}</span>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default Meetings;

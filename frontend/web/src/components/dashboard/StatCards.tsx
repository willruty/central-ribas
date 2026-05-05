import { motion } from "framer-motion";
import { FileText, AlertTriangle, FolderClock, Users } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useGsapCounter } from "@/hooks/useGsapCounter";
import { Contract } from "@/types/dashboard";
import { ClientData } from "./ClientsTable";

/** Renders a number that counts up from 0 using GSAP. */
const AnimatedNumber = ({
  value,
  delay,
}: {
  value: number;
  delay: number;
}) => {
  // starts counting after Framer Motion finishes the card entrance (~delay + 0.3s)
  const ref = useGsapCounter(value, delay + 0.3, 1.0);
  return <span ref={ref as React.RefObject<HTMLSpanElement>}>0</span>;
};

const StatCards = () => {
  const [contracts] = useLocalStorage<Contract[]>("gr:contracts", []);
  const [clients] = useLocalStorage<ClientData[]>("gr:clients", []);

  const ativos = contracts.filter(c => c.status === "Ativo").length;
  const pendentes = contracts.filter(c => c.status === "Pendente").length;
  const clientesAtivos = clients.filter(c => c.status === "Ativo").length;

  const cards = [
    {
      title: "Contratos Ativos",
      value: ativos,
      subtitle: `de ${contracts.length} total`,
      note: "Dados locais",
      bg: "from-emerald-500 to-emerald-600",
      icon: FileText,
      delay: 0,
    },
    {
      title: "Vencendo em Breve",
      value: pendentes,
      subtitle: "nos próximos 30 dias",
      note: pendentes > 0 ? "requer atenção" : "Tudo em dia",
      bg: "from-amber-400 to-amber-500",
      icon: AlertTriangle,
      delay: 0.06,
    },
    {
      title: "Documentos Pendentes",
      value: 0,
      subtitle: "aguardando revisão",
      note: "Aguarda backend",
      bg: "from-orange-500 to-orange-600",
      icon: FolderClock,
      delay: 0.12,
    },
    {
      title: "Clientes Ativos",
      value: clientesAtivos,
      subtitle: `de ${clients.length} cadastrados`,
      note: "Dados locais",
      bg: null,
      icon: Users,
      delay: 0.18,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -3, transition: { duration: 0.18 } }}
          transition={{ duration: 0.3, delay: card.delay }}
          className={`relative rounded p-5 overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-shadow ${
            card.bg
              ? `bg-gradient-to-br ${card.bg} text-white`
              : "bg-card text-card-foreground border border-border"
          }`}
        >
          {/* Decorative circle */}
          <div
            className={`absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-10 ${
              card.bg ? "bg-white" : "bg-primary"
            }`}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-[10px] font-black uppercase tracking-widest leading-tight ${
                  card.bg ? "opacity-80" : "text-muted-foreground"
                }`}
              >
                {card.title}
              </span>
              <card.icon
                size={15}
                className={card.bg ? "opacity-70" : "text-primary opacity-70"}
              />
            </div>

            {/* GSAP counter — Framer animates the card container, GSAP animates the number inside */}
            <p className="text-4xl font-black mb-0.5 leading-none">
              <AnimatedNumber value={card.value} delay={card.delay} />
            </p>

            <p
              className={`text-xs ${
                card.bg ? "opacity-70" : "text-muted-foreground"
              }`}
            >
              {card.subtitle}
            </p>

            <p
              className={`text-[10px] font-medium mt-3 ${
                card.bg ? "opacity-60" : "text-muted-foreground/60"
              }`}
            >
              {card.note}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatCards;

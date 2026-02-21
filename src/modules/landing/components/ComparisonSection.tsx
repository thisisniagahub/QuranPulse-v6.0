import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

const ComparisonSection = () => {
  const features = [
    { name: "Quran Reader", qp: "Premium", mp: "Basic", mc: "Basic", ab: "Basic" },
    { name: "Iqra' 1-6 Module", qp: "Full AI", mp: "—", mc: "—", ab: "—" },
    { name: "AI Ustaz / Chatbot", qp: "Full AI", mp: "—", mc: "—", ab: "—" },
    { name: "Tajweed Feedback", qp: "Real-time AI", mp: "Color-coded", mc: "Basic", ab: "—" },
    { name: "Hafazan Tracker", qp: "Smart AI", mp: "Basic", mc: "—", ab: "Basic" },
    { name: "JAKIM Tauliah", qp: "✓", mp: "✓", mc: "—", ab: "—" },
    { name: "Proactive Reminders", qp: "WhatsApp AI", mp: "Push Notif", mc: "Push Notif", ab: "—" },
    { name: "Ad-Free", qp: "✓", mp: "Paid Only", mc: "—", ab: "—" },
  ];

  const getStatusIcon = (value: string) => {
    if (value === "—") return <XCircle className="w-4 h-4 text-raudhah-ink/15 mx-auto" />;
    if (value === "✓") return <CheckCircle2 className="w-4 h-4 text-raudhah-teal mx-auto" />;
    return <span className="text-xs font-medium text-raudhah-ink/60">{value}</span>;
  };

  const getQPStatus = (value: string) => {
    if (value === "✓") return <CheckCircle2 className="w-4 h-4 text-raudhah-teal mx-auto" />;
    return <span className="text-xs font-bold text-raudhah-teal">{value}</span>;
  };

  return (
    <section className="py-12 md:py-16 bg-raudhah-ivory relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-raudhah-teal/10 text-raudhah-teal font-bold tracking-widest uppercase text-xs mb-4 border border-raudhah-teal/20">
            Perbandingan
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-raudhah text-raudhah-ink tracking-tight">
            Kenapa QuranPulse <span className="text-raudhah-teal">Berbeza</span>?
          </h2>
        </motion.div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-raudhah-teal/20">
                <th className="text-left py-4 pr-4 font-bold text-raudhah-ink/70">Ciri-ciri</th>
                <th className="py-4 px-3 text-center">
                  <div className="font-bold text-raudhah-teal">QuranPulse</div>
                  <div className="text-[10px] text-raudhah-teal/60 uppercase tracking-wider">AI-Powered</div>
                </th>
                <th className="py-4 px-3 text-center">
                  <div className="font-medium text-raudhah-ink/50">Muslim Pro</div>
                </th>
                <th className="py-4 px-3 text-center hidden sm:table-cell">
                  <div className="font-medium text-raudhah-ink/50">Muslim Companion</div>
                </th>
                <th className="py-4 px-3 text-center hidden md:table-cell">
                  <div className="font-medium text-raudhah-ink/50">App Biasa</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-b border-raudhah-ink/5 hover:bg-raudhah-teal/[0.02] transition-colors">
                  <td className="py-3 pr-4 font-medium text-raudhah-ink/80">{feature.name}</td>
                  <td className="py-3 px-3 text-center bg-raudhah-teal/[0.03]">{getQPStatus(feature.qp)}</td>
                  <td className="py-3 px-3 text-center">{getStatusIcon(feature.mp)}</td>
                  <td className="py-3 px-3 text-center hidden sm:table-cell">{getStatusIcon(feature.mc)}</td>
                  <td className="py-3 px-3 text-center hidden md:table-cell">{getStatusIcon(feature.ab)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-raudhah-ink/30 mt-4 text-center italic">
          * Perbandingan berdasarkan ciri-ciri yang tersedia secara umum pada Feb 2026. Setiap app mempunyai kekuatan tersendiri.
        </p>
      </div>
    </section>
  );
};

export default ComparisonSection;

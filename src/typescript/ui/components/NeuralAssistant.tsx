import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";

interface NeuralAssistantProps {
  isProcessing?: boolean;
  status?: string;
}

export const NeuralAssistant = ({ isProcessing = false, status = "IDLE" }: NeuralAssistantProps) => {
  return (
    <div className="relative flex flex-col items-center justify-center p-8 bg-black/40 rounded-3xl border border-white/5 backdrop-blur-3xl overflow-hidden">
      {/* Background Glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-core-green/10 via-transparent to-neural-violet/10"
        animate={{
          opacity: isProcessing ? [0.2, 0.4, 0.2] : 0.1,
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Neural Core */}
      <div className="relative z-10">
        <motion.div
          className="relative"
          animate={isProcessing ? {
            scale: [1, 1.05, 1],
            filter: ["drop-shadow(0 0 10px rgba(0,255,157,0.5))", "drop-shadow(0 0 30px rgba(0,255,157,0.8))", "drop-shadow(0 0 10px rgba(0,255,157,0.5))"]
          } : {
            scale: 1,
            filter: "drop-shadow(0 0 15px rgba(0,255,157,0.3))"
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-32 h-32 rounded-full border-2 border-core-green/20 flex items-center justify-center bg-black/50 overflow-hidden relative">
             <motion.div 
               animate={isProcessing ? {
                 rotate: [0, 360],
               } : {}}
               transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] scale-150"
             />
             <Brain size={64} className="text-core-green relative z-10" />
          </div>

          {/* Orbiting Particles */}
          <AnimatePresence>
            {isProcessing && [0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-neural-violet rounded-full shadow-[0_0_10px_#8A2BE2]"
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: [0, Math.cos(i * 120) * 100, 0],
                  y: [0, Math.sin(i * 120) * 100, 0],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Status Indicators */}
      <div className="mt-8 text-center z-10">
        <motion.div 
          className="flex items-center justify-center gap-2 mb-2"
          animate={isProcessing ? { opacity: [1, 0.5, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Sparkles size={14} className="text-neural-violet" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-core-green">
            {status}
          </span>
        </motion.div>
        
        <div className="flex gap-1 justify-center">
            {[1, 0.6, 0.3].map((op, i) => (
                <motion.div 
                    key={i}
                    className="h-1 w-8 bg-core-green/40 rounded-full"
                    animate={isProcessing ? {
                        backgroundColor: ["rgba(0,255,157,0.1)", "rgba(0,255,157,0.8)", "rgba(0,255,157,0.1)"]
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                />
            ))}
        </div>
      </div>

      {/* Subtle Glitch Overlay */}
      <motion.div
        className="absolute inset-0 bg-core-green/5 pointer-events-none"
        animate={isProcessing ? {
          x: [-2, 2, -1, 3, 0],
          opacity: [0, 0.2, 0, 0.1, 0],
        } : { opacity: 0 }}
        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 5 }}
      />
    </div>
  );
};

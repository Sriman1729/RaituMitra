import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Sprout,
  Wrench,
  BookOpen,
  GraduationCap,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import GovernmentSchemes from "./GovernmentSchemes";
import TechnicalSupport from "./TechnicalSupport";
import InputSuppliers from "./InputSuppliers";
import TrainingPrograms from "./TrainingPrograms";
import EmergencyContacts from "./EmergencyContacts";

export default function Resources() {
  const tabs = [
    { value: "schemes", label: "Schemes", icon: Sprout, component: <GovernmentSchemes /> },
    { value: "support", label: "Support", icon: Wrench, component: <TechnicalSupport /> },
    { value: "suppliers", label: "Suppliers", icon: BookOpen, component: <InputSuppliers /> },
    { value: "training", label: "Training", icon: GraduationCap, component: <TrainingPrograms /> },
    { value: "contacts", label: "Contacts", icon: Phone, component: <EmergencyContacts /> },
  ];

  const [activeTab, setActiveTab] = React.useState("schemes");
  const activeContent = tabs.find((t) => t.value === activeTab)?.component;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-[#0b0b0f] dark:to-[#0b0b0f] transition-colors duration-500 p-4 sm:p-6 lg:p-10 space-y-10 overflow-hidden">

      {/* Aurora-like Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-20 h-[60rem] w-[60rem] rounded-full blur-3xl opacity-20 bg-gradient-to-tr from-green-300 via-violet-200 to-fuchsia-200 dark:from-fuchsia-600/40 dark:via-violet-600/30 dark:to-indigo-600/30 animate-pulse" />
        <div className="absolute -bottom-40 -right-20 h-[60rem] w-[60rem] rounded-full blur-3xl opacity-20 bg-gradient-to-br from-indigo-300 via-violet-200 to-green-200 dark:from-indigo-600/40 dark:via-violet-600/30 dark:to-fuchsia-600/30 animate-pulse" />
      </div>

      {/* Header */}
      <div className="relative text-center space-y-3 z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-violet-500 to-fuchsia-500 dark:from-fuchsia-400 dark:via-violet-400 dark:to-indigo-400"
        >
          🌿 Farming Resources Hub
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-sm sm:text-base"
        >
          One-stop guide to agricultural resources — explore schemes, training, support programs, and emergency help.
        </motion.p>
      </div>

      {/* Tabs */}
      <div className="relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab List */}
          <TabsList className="flex overflow-x-auto scrollbar-hide gap-2 justify-start md:justify-center bg-transparent py-2">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="
                  flex items-center gap-2 px-5 py-2 rounded-full
                  text-sm font-medium
                  text-gray-800 dark:text-gray-300
                  border border-gray-200 dark:border-white/10
                  bg-white/70 dark:bg-white/5 backdrop-blur-sm
                  hover:scale-[1.05] hover:bg-gradient-to-r hover:from-fuchsia-50 hover:to-green-50 
                  dark:hover:from-fuchsia-700/30 dark:hover:to-violet-700/30
                  hover:shadow-lg transition-all duration-300
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-fuchsia-600 data-[state=active]:to-indigo-600
                  data-[state=active]:text-white data-[state=active]:shadow-[0_0_25px_-6px_rgba(139,92,246,0.8)]
                "
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Animated Tab Content */}
          <div className="mt-6 min-h-[60vh]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                {activeContent}
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

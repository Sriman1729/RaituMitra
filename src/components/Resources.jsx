import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Sprout,
  Store,
  Wrench,
  BookOpen,
  GraduationCap,
  Phone,
} from "lucide-react";

// Import subcomponents
import GovernmentSchemes from "./GovernmentSchemes";
import MarketInfo from "./MarketInfo";
import TechnicalSupport from "./TechnicalSupport";
import InputSuppliers from "./InputSuppliers";
import TrainingPrograms from "./TrainingPrograms";
import EmergencyContacts from "./EmergencyContacts";

export default function Resources() {
  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-green-700 dark:text-green-400">
          🌿 Farming Resources Hub
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
          One-stop guide to agricultural resources — explore schemes, markets,
          training, support programs, and emergency help.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="schemes" className="w-full">
        {/* Mobile-friendly Tabs List */}
        <TabsList
          className="flex overflow-x-auto no-scrollbar gap-2 p-2 
                     bg-gray-100 dark:bg-gray-800 rounded-xl"
        >
          <TabsTrigger
            value="schemes"
            className="flex items-center gap-2 px-3 py-2 rounded-lg 
                       text-sm sm:text-base font-medium 
                       data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 
                       data-[state=active]:shadow-sm"
          >
            <Sprout className="w-4 h-4" /> Schemes
          </TabsTrigger>

          <TabsTrigger
            value="market"
            className="flex items-center gap-2 px-3 py-2 rounded-lg 
                       text-sm sm:text-base font-medium 
                       data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 
                       data-[state=active]:shadow-sm"
          >
            <Store className="w-4 h-4" /> Market
          </TabsTrigger>

          <TabsTrigger
            value="support"
            className="flex items-center gap-2 px-3 py-2 rounded-lg 
                       text-sm sm:text-base font-medium 
                       data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 
                       data-[state=active]:shadow-sm"
          >
            <Wrench className="w-4 h-4" /> Support
          </TabsTrigger>

          <TabsTrigger
            value="suppliers"
            className="flex items-center gap-2 px-3 py-2 rounded-lg 
                       text-sm sm:text-base font-medium 
                       data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 
                       data-[state=active]:shadow-sm"
          >
            <BookOpen className="w-4 h-4" /> Suppliers
          </TabsTrigger>

          <TabsTrigger
            value="training"
            className="flex items-center gap-2 px-3 py-2 rounded-lg 
                       text-sm sm:text-base font-medium 
                       data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 
                       data-[state=active]:shadow-sm"
          >
            <GraduationCap className="w-4 h-4" /> Training
          </TabsTrigger>

          <TabsTrigger
            value="contacts"
            className="flex items-center gap-2 px-3 py-2 rounded-lg 
                       text-sm sm:text-base font-medium 
                       data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 
                       data-[state=active]:shadow-sm"
          >
            <Phone className="w-4 h-4" /> Contacts
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <div className="mt-6">
          <TabsContent value="schemes">
            <GovernmentSchemes />
          </TabsContent>

          <TabsContent value="market">
            <MarketInfo />
          </TabsContent>

          <TabsContent value="support">
            <TechnicalSupport />
          </TabsContent>

          <TabsContent value="suppliers">
            <InputSuppliers />
          </TabsContent>

          <TabsContent value="training">
            <TrainingPrograms />
          </TabsContent>

          <TabsContent value="contacts">
            <EmergencyContacts />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

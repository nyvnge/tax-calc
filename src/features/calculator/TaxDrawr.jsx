import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

function TaxInfoDrawer({ isOpen, onClose, isDarkMode }){
  const sectionClass = isDarkMode
    ? "bg-slate-800/50 border-slate-700"
    : "bg-slate-50 border-slate-200";

  const headingClass = isDarkMode ? "text-slate-200" : "text-slate-900";
  const textClass = isDarkMode ? "text-slate-300" : "text-slate-700";
  const mutedClass = isDarkMode ? "text-slate-400" : "text-slate-500";

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent
        className={`h-[96vh] z-[100] ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white"
        }`}
      >
        <div className="mx-auto w-full max-w-4xl h-full flex flex-col">
          <DrawerHeader className="border-b px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className={`text-xl font-bold ${headingClass}`}>
                  Tax Rates & Parameters
                </DrawerTitle>
                <DrawerDescription className={`text-sm mt-1 ${mutedClass}`}>
                  Kenya Revenue Authority rates for 2025
                </DrawerDescription>
              </div>
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-6 pb-6">
              <section className={`p-5 rounded-xl border ${sectionClass}`}>
                <h3 className={`text-lg font-bold mb-4 ${headingClass}`}>
                  PAYE (Pay As You Earn)
                </h3>
                <p className={`text-sm mb-4 ${textClass}`}>
                  Tax rates effective from 1 July 2023:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        className={`border-b ${
                          isDarkMode ? "border-slate-700" : "border-slate-200"
                        }`}
                      >
                        <th
                          className={`text-left py-2 px-3 font-semibold ${textClass}`}
                        >
                          Monthly Taxable Pay
                        </th>
                        <th
                          className={`text-left py-2 px-3 font-semibold ${textClass}`}
                        >
                          Annual Taxable Pay
                        </th>
                        <th
                          className={`text-right py-2 px-3 font-semibold ${textClass}`}
                        >
                          Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        className={`border-b ${
                          isDarkMode
                            ? "border-slate-700/50"
                            : "border-slate-100"
                        }`}
                      >
                        <td className={`py-2 px-3 ${textClass}`}>
                          Up to 24,000
                        </td>
                        <td className={`py-2 px-3 ${textClass}`}>
                          Up to 288,000
                        </td>
                        <td
                          className={`py-2 px-3 text-right font-semibold ${
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                        >
                          10%
                        </td>
                      </tr>
                      <tr
                        className={`border-b ${
                          isDarkMode
                            ? "border-slate-700/50"
                            : "border-slate-100"
                        }`}
                      >
                        <td className={`py-2 px-3 ${textClass}`}>
                          24,001 - 32,333
                        </td>
                        <td className={`py-2 px-3 ${textClass}`}>
                          288,001 - 388,000
                        </td>
                        <td
                          className={`py-2 px-3 text-right font-semibold ${
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                        >
                          25%
                        </td>
                      </tr>
                      <tr
                        className={`border-b ${
                          isDarkMode
                            ? "border-slate-700/50"
                            : "border-slate-100"
                        }`}
                      >
                        <td className={`py-2 px-3 ${textClass}`}>
                          32,334 - 500,000
                        </td>
                        <td className={`py-2 px-3 ${textClass}`}>
                          388,001 - 6,000,000
                        </td>
                        <td
                          className={`py-2 px-3 text-right font-semibold ${
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                        >
                          30%
                        </td>
                      </tr>
                      <tr
                        className={`border-b ${
                          isDarkMode
                            ? "border-slate-700/50"
                            : "border-slate-100"
                        }`}
                      >
                        <td className={`py-2 px-3 ${textClass}`}>
                          500,001 - 800,000
                        </td>
                        <td className={`py-2 px-3 ${textClass}`}>
                          6,000,001 - 9,600,000
                        </td>
                        <td
                          className={`py-2 px-3 text-right font-semibold ${
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                        >
                          32.5%
                        </td>
                      </tr>
                      <tr>
                        <td className={`py-2 px-3 ${textClass}`}>
                          Above 800,000
                        </td>
                        <td className={`py-2 px-3 ${textClass}`}>
                          Above 9,600,000
                        </td>
                        <td
                          className={`py-2 px-3 text-right font-semibold ${
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                        >
                          35%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6">
                  <h4 className={`text-sm font-bold mb-3 ${headingClass}`}>
                    Other PAYE Parameters
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2">
                      <span className={textClass}>Personal Relief</span>
                      <span
                        className={`font-semibold ${
                          isDarkMode ? "text-green-400" : "text-green-600"
                        }`}
                      >
                        KES 2,400/month
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className={textClass}>
                        Allowable Pension Contribution
                      </span>
                      <span className={`font-semibold ${textClass}`}>
                        Up to 30,000/month
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className={textClass}>Allowable Benefits</span>
                      <span className={`font-semibold ${textClass}`}>
                        5,000/month
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className={textClass}>Owner Occupier Interest</span>
                      <span className={`font-semibold ${textClass}`}>
                        Up to 30,000/month
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className={`p-5 rounded-xl border ${sectionClass}`}>
                <h3 className={`text-lg font-bold mb-3 ${headingClass}`}>
                  SHIF (Social Health Insurance Fund)
                </h3>
                <p className={`text-sm mb-3 ${textClass}`}>
                  Effective from 1 October 2024, replacing NHIF
                </p>
                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode
                      ? "bg-blue-900/20 border border-blue-800/50"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-semibold ${textClass}`}>
                      Contribution Rate
                    </span>
                    <span
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      2.75%
                    </span>
                  </div>
                  <p className={`text-xs mt-2 ${mutedClass}`}>
                    of gross monthly salary
                  </p>
                </div>
                <p className={`text-xs mt-3 ${mutedClass}`}>
                  ✓ Fully tax-deductible from 27 December 2024
                </p>
              </section>

              <section className={`p-5 rounded-xl border ${sectionClass}`}>
                <h3 className={`text-lg font-bold mb-3 ${headingClass}`}>
                  NSSF (National Social Security Fund)
                </h3>
                <p className={`text-sm mb-4 ${textClass}`}>
                  Both employer and employee contribute 6% each
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className={`text-sm font-bold mb-2 ${headingClass}`}>
                      From February 2025
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className={`p-3 rounded-lg ${
                          isDarkMode
                            ? "bg-orange-900/20 border border-orange-800/50"
                            : "bg-orange-50 border border-orange-200"
                        }`}
                      >
                        <div
                          className={`text-xs font-semibold mb-1 ${mutedClass}`}
                        >
                          Tier I
                        </div>
                        <div className={`font-bold ${textClass}`}>
                          Up to 8,000
                        </div>
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          isDarkMode
                            ? "bg-orange-900/20 border border-orange-800/50"
                            : "bg-orange-50 border border-orange-200"
                        }`}
                      >
                        <div
                          className={`text-xs font-semibold mb-1 ${mutedClass}`}
                        >
                          Tier II
                        </div>
                        <div className={`font-bold ${textClass}`}>
                          8,001 - 72,000
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className={`text-sm font-bold mb-2 ${headingClass}`}>
                      Up to January 2025
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className={`p-3 rounded-lg ${
                          isDarkMode
                            ? "bg-slate-800 border border-slate-700"
                            : "bg-slate-100 border border-slate-200"
                        }`}
                      >
                        <div
                          className={`text-xs font-semibold mb-1 ${mutedClass}`}
                        >
                          Tier I
                        </div>
                        <div className={`font-bold ${textClass}`}>
                          Up to 7,000
                        </div>
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          isDarkMode
                            ? "bg-slate-800 border border-slate-700"
                            : "bg-slate-100 border border-slate-200"
                        }`}
                      >
                        <div
                          className={`text-xs font-semibold mb-1 ${mutedClass}`}
                        >
                          Tier II
                        </div>
                        <div className={`font-bold ${textClass}`}>
                          7,001 - 36,000
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className={`text-xs mt-3 ${mutedClass}`}>
                  ✓ Employee contributions are tax-deductible
                </p>
                <p className={`text-xs mt-1 ${mutedClass}`}>
                  ℹ️ Organizations may opt out of Tier II if they have
                  alternative pension schemes
                </p>
              </section>

              <section className={`p-5 rounded-xl border ${sectionClass}`}>
                <h3 className={`text-lg font-bold mb-3 ${headingClass}`}>
                  Housing Levy
                </h3>
                <p className={`text-sm mb-3 ${textClass}`}>
                  Reintroduced effective 19 March 2024 under the Affordable
                  Housing Act
                </p>
                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode
                      ? "bg-yellow-900/20 border border-yellow-800/50"
                      : "bg-yellow-50 border border-yellow-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-semibold ${textClass}`}>
                      Contribution Rate
                    </span>
                    <span
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-yellow-400" : "text-yellow-600"
                      }`}
                    >
                      1.5%
                    </span>
                  </div>
                  <p className={`text-xs mt-2 ${mutedClass}`}>
                    of gross monthly salary (both employer and employee)
                  </p>
                </div>
                <p className={`text-xs mt-3 ${mutedClass}`}>
                  ✓ Employee contributions fully tax-deductible from 27 December
                  2024
                </p>
              </section>

              <section className={`p-5 rounded-xl border ${sectionClass}`}>
                <h3 className={`text-lg font-bold mb-3 ${headingClass}`}>
                  Fringe Benefit Tax
                </h3>
                <p className={`text-sm mb-4 ${textClass}`}>
                  Applies to loans advanced to employees at below-market
                  interest rates
                </p>

                <div className="space-y-3">
                  <div>
                    <h4 className={`text-sm font-bold mb-2 ${headingClass}`}>
                      2025 Market Interest Rates
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div
                        className={`p-2 rounded ${
                          isDarkMode ? "bg-slate-800" : "bg-slate-100"
                        }`}
                      >
                        <div className={mutedClass}>Q1 (Jan-Mar)</div>
                        <div className={`font-bold ${textClass}`}>13%</div>
                      </div>
                      <div
                        className={`p-2 rounded ${
                          isDarkMode ? "bg-slate-800" : "bg-slate-100"
                        }`}
                      >
                        <div className={mutedClass}>Q2 (Apr-Jun)</div>
                        <div className={`font-bold ${textClass}`}>9%</div>
                      </div>
                      <div
                        className={`p-2 rounded ${
                          isDarkMode ? "bg-slate-800" : "bg-slate-100"
                        }`}
                      >
                        <div className={mutedClass}>Q3 (Jul-Sep)</div>
                        <div className={`font-bold ${textClass}`}>8%</div>
                      </div>
                      <div
                        className={`p-2 rounded ${
                          isDarkMode ? "bg-slate-800" : "bg-slate-100"
                        }`}
                      >
                        <div className={mutedClass}>Q4 (Oct-Dec)</div>
                        <div className={`font-bold ${textClass}`}>8%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div
                className={`p-4 rounded-lg border ${
                  isDarkMode
                    ? "bg-amber-900/20 border-amber-800/50"
                    : "bg-amber-50 border-amber-200"
                }`}
              >
                <p className={`text-xs ${textClass}`}>
                  <strong>Note:</strong> This information is based on Kenya
                  Revenue Authority regulations and the latest tax legislation.
                  Always consult with a qualified tax professional for official
                  advice. For more information, visit{" "}
                  <a
                    href="https://www.kra.go.ke"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-semibold underline ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    www.kra.go.ke
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TaxInfoDrawer;

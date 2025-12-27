import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calculator,
  Printer,
  TrendingDown,
  Wallet,
  Shield,
  Home,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  X,
  Settings,
  Download,
} from "lucide-react";

const KenyanTaxCalculator = () => {
  const [grossSalary, setGrossSalary] = useState("");
  const [nonCashBenefits, setNonCashBenefits] = useState("");
  const [pensionContribution, setPensionContribution] = useState("");
  const [otherDeductions, setOtherDeductions] = useState("");
  const [isHousedByEmployer, setIsHousedByEmployer] = useState(false);
  const [housingType, setHousingType] = useState("ordinary");
  const [ignoreBenefitsUpTo5000, setIgnoreBenefitsUpTo5000] = useState(true);
  const [use2025NSSFTiers, setUse2025NSSFTiers] = useState(true);
  const [deductTierIINSSF, setDeductTierIINSSF] = useState(true);
  const [deductHousingLevy, setDeductHousingLevy] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  const printRef = useRef(null);
  const mainContainerRef = useRef(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (mainContainerRef.current?.requestFullscreen) {
        mainContainerRef.current.requestFullscreen();
      } else if (mainContainerRef.current?.webkitRequestFullscreen) {
        mainContainerRef.current.webkitRequestFullscreen();
      } else if (mainContainerRef.current?.msRequestFullscreen) {
        mainContainerRef.current.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("msfullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullScreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullScreenChange
      );
    };
  }, []);

  const calculateTax = () => {
    let gross = parseFloat(grossSalary) || 0;
    const benefitsAmount = parseFloat(nonCashBenefits) || 0;
    let pensionAmount = Math.min(parseFloat(pensionContribution) || 0, 30000);
    let otherDeductionsAmount = parseFloat(otherDeductions) || 0;

    if (gross === 0) {
      return {
        gross: 0,
        nonCashBenefits: 0,
        taxableBenefits: 0,
        pensionContribution: 0,
        otherDeductions: 0,
        ownerOccupierInterest: 0,
        taxableIncome: 0,
        paye: 0,
        shif: 0,
        nssf: 0,
        housingLevy: 0,
        personalRelief: 2400,
        totalDeductibles: 0,
        totalDeductions: 0,
        netSalary: 0,
      };
    }

    let taxableBenefits = benefitsAmount;
    if (ignoreBenefitsUpTo5000) {
      taxableBenefits = Math.max(0, benefitsAmount - 5000);
    }

    let nssfContribution = 0;
    if (deductTierIINSSF) {
      if (use2025NSSFTiers) {
        const tierILimit = 8000;
        const tierIILimit = 72000;

        if (gross <= tierILimit) {
          nssfContribution = gross * 0.06;
        } else if (gross <= tierIILimit) {
          nssfContribution = tierILimit * 0.06 + (gross - tierILimit) * 0.06;
        } else {
          nssfContribution =
            tierILimit * 0.06 + (tierIILimit - tierILimit) * 0.06;
        }
      } else {
        const tierILimit = 7000;
        const tierIILimit = 36000;

        if (gross <= tierILimit) {
          nssfContribution = gross * 0.06;
        } else if (gross <= tierIILimit) {
          nssfContribution = tierILimit * 0.06 + (gross - tierILimit) * 0.06;
        } else {
          nssfContribution =
            tierILimit * 0.06 + (tierIILimit - tierILimit) * 0.06;
        }
      }
    }

    const shifContribution = gross * 0.0275;
    let housingLevy = deductHousingLevy ? gross * 0.015 : 0;

    let ownerOccupierInterest = 0;
    if (isHousedByEmployer) {
      const percentage = housingType === "farm" ? 0.1 : 0.15;
      ownerOccupierInterest = Math.min(gross * percentage, 30000);
    }

    const totalDeductibles =
      nssfContribution +
      shifContribution +
      housingLevy +
      pensionAmount +
      ownerOccupierInterest +
      otherDeductionsAmount;

    const taxableIncome = Math.max(
      0,
      gross + taxableBenefits - totalDeductibles
    );

    let paye = 0;
    if (taxableIncome <= 24000) {
      paye = taxableIncome * 0.1;
    } else if (taxableIncome <= 32333) {
      paye = 2400 + (taxableIncome - 24000) * 0.25;
    } else if (taxableIncome <= 500000) {
      paye = 2400 + 2083.25 + (taxableIncome - 32333) * 0.3;
    } else if (taxableIncome <= 800000) {
      paye = 2400 + 2083.25 + 140300.1 + (taxableIncome - 500000) * 0.325;
    } else {
      paye =
        2400 + 2083.25 + 140300.1 + 97500 + (taxableIncome - 800000) * 0.35;
    }

    const personalRelief = 2400;
    paye = Math.max(0, paye - personalRelief);

    const totalDeductions =
      paye + shifContribution + nssfContribution + housingLevy;
    let netSalary = gross - totalDeductions;

    return {
      gross,
      nonCashBenefits: benefitsAmount,
      taxableBenefits,
      pensionContribution: pensionAmount,
      otherDeductions: otherDeductionsAmount,
      ownerOccupierInterest,
      taxableIncome,
      paye,
      shif: shifContribution,
      nssf: nssfContribution,
      housingLevy,
      personalRelief,
      totalDeductibles,
      totalDeductions,
      netSalary,
    };
  };

  const results = calculateTax();

  const handlePrint = () => {
    const printContent = printRef.current;
    const printWindow = window.open("", "", "width=800,height=600");

    printWindow.document.write(`
      <html>
        <head>
          <title>Tax Calculation Report 2025</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 40px;
              color: #1e293b;
              background: #ffffff;
              line-height: 1.6;
            }
            
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 3px solid #3b82f6;
            }
            
            .logo-circle {
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
              border-radius: 50%;
              margin: 0 auto 15px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            }
            
            .logo-icon {
              width: 40px;
              height: 40px;
              border: 3px solid white;
              border-radius: 8px;
            }
            
            h1 { 
              color: #0f172a;
              font-size: 28px;
              font-weight: 800;
              margin-bottom: 8px;
              letter-spacing: -0.5px;
            }
            
            .subtitle {
              color: #64748b;
              font-size: 14px;
              font-weight: 500;
            }
            
            .report-date {
              text-align: right;
              color: #64748b;
              font-size: 12px;
              margin-bottom: 30px;
              font-weight: 500;
            }
            
            .section { 
              margin-bottom: 25px;
              page-break-inside: avoid;
            }
            
            .section-header {
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              padding: 12px 16px;
              border-radius: 8px 8px 0 0;
              border-left: 4px solid #3b82f6;
              margin-bottom: 0;
            }
            
            .section-header h3 {
              color: #0f172a;
              font-size: 14px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .section-content {
              border: 1px solid #e2e8f0;
              border-top: none;
              border-radius: 0 0 8px 8px;
              padding: 16px;
              background: #ffffff;
            }
            
            .row { 
              display: flex; 
              justify-content: space-between;
              align-items: center;
              padding: 10px 0;
              border-bottom: 1px solid #f1f5f9;
            }
            
            .row:last-child {
              border-bottom: none;
            }
            
            .label { 
              font-weight: 600;
              color: #475569;
              font-size: 13px;
            }
            
            .value { 
              color: #0f172a;
              font-weight: 700;
              font-size: 14px;
            }
            
            .highlight-row {
              background: #f8fafc;
              padding: 12px;
              margin: 8px -16px;
              border-left: 4px solid #3b82f6;
            }
            
            .highlight-row .label {
              color: #1e293b;
              font-size: 14px;
            }
            
            .highlight-row .value {
              color: #3b82f6;
              font-size: 16px;
            }
            
            .deduction-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
              margin-top: 12px;
            }
            
            .deduction-card {
              padding: 12px;
              border-radius: 8px;
              border: 1px solid;
            }
            
            .deduction-card.paye {
              background: #fef2f2;
              border-color: #fecaca;
            }
            
            .deduction-card.shif {
              background: #eff6ff;
              border-color: #bfdbfe;
            }
            
            .deduction-card.nssf {
              background: #fff7ed;
              border-color: #fed7aa;
            }
            
            .deduction-card.housing {
              background: #fefce8;
              border-color: #fef08a;
            }
            
            .deduction-card .card-label {
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }
            
            .deduction-card.paye .card-label { color: #991b1b; }
            .deduction-card.shif .card-label { color: #1e40af; }
            .deduction-card.nssf .card-label { color: #9a3412; }
            .deduction-card.housing .card-label { color: #854d0e; }
            
            .deduction-card .card-value {
              font-size: 16px;
              font-weight: 800;
            }
            
            .deduction-card.paye .card-value { color: #dc2626; }
            .deduction-card.shif .card-value { color: #2563eb; }
            .deduction-card.nssf .card-value { color: #ea580c; }
            .deduction-card.housing .card-value { color: #ca8a04; }
            
            .deduction-card .card-description {
              font-size: 10px;
              color: #64748b;
              margin-top: 2px;
            }
            
            .net-salary-box {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              padding: 24px;
              border-radius: 12px;
              text-align: center;
              margin-top: 30px;
              box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            }
            
            .net-salary-label {
              color: #d1fae5;
              font-size: 12px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 8px;
            }
            
            .net-salary-value {
              color: #ffffff;
              font-size: 36px;
              font-weight: 900;
              letter-spacing: -1px;
            }
            
            .total-deductions-note {
              color: #d1fae5;
              font-size: 11px;
              margin-top: 8px;
              font-weight: 500;
            }
            
            .settings-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
            }
            
            .settings-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 8px 12px;
              background: #f8fafc;
              border-radius: 6px;
              font-size: 12px;
            }
            
            .settings-item .label {
              font-size: 12px;
            }
            
            .settings-item .value {
              font-size: 12px;
              color: #3b82f6;
            }
            
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e2e8f0;
              text-align: center;
              color: #94a3b8;
              font-size: 11px;
            }
            
            .disclaimer {
              background: #fef3c7;
              border: 1px solid #fcd34d;
              border-radius: 8px;
              padding: 12px 16px;
              margin-top: 25px;
              font-size: 11px;
              color: #92400e;
              line-height: 1.5;
            }
            
            .disclaimer strong {
              color: #78350f;
            }
            
            @media print {
              body { 
                padding: 20px;
              }
              
              .section {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Tax Calculation Report</h1>
          </div>
          
          <div class="report-date">
            Generated on ${new Date().toLocaleDateString("en-KE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          <!-- Settings Summary -->
          <div class="section">
            <div class="section-header">
              <h3>Calculation Settings</h3>
            </div>
            <div class="section-content">
              <div class="settings-grid">
                <div class="settings-item">
                  <span class="label">Benefits Exemption:</span>
                  <span class="value">${
                    ignoreBenefitsUpTo5000 ? "KES 5,000" : "None"
                  }</span>
                </div>
                <div class="settings-item">
                  <span class="label">NSSF Tiers:</span>
                  <span class="value">${
                    use2025NSSFTiers ? "2025" : "Pre-2025"
                  }</span>
                </div>
                <div class="settings-item">
                  <span class="label">Tier II NSSF:</span>
                  <span class="value">${
                    deductTierIINSSF ? "Deducted" : "Not Deducted"
                  }</span>
                </div>
                <div class="settings-item">
                  <span class="label">Housing Levy:</span>
                  <span class="value">${
                    deductHousingLevy ? "1.5%" : "Not Deducted"
                  }</span>
                </div>
                <div class="settings-item">
                  <span class="label">Employer Housing:</span>
                  <span class="value">${
                    isHousedByEmployer
                      ? housingType === "farm"
                        ? "Farm (10%)"
                        : "Ordinary (15%)"
                      : "No"
                  }</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Income Details -->
          <div class="section">
            <div class="section-header">
              <h3>Income Breakdown</h3>
            </div>
            <div class="section-content">
              <div class="row">
                <span class="label">Gross Monthly Salary:</span>
                <span class="value">${formatCurrency(results.gross)}</span>
              </div>
              ${
                results.nonCashBenefits > 0
                  ? `
                <div class="row">
                  <span class="label">Non-Cash Benefits (Total):</span>
                  <span class="value">${formatCurrency(
                    results.nonCashBenefits
                  )}</span>
                </div>
                <div class="row">
                  <span class="label">Taxable Benefits (After Exemption):</span>
                  <span class="value">${formatCurrency(
                    results.taxableBenefits
                  )}</span>
                </div>
              `
                  : ""
              }
              ${
                results.pensionContribution > 0
                  ? `
                <div class="row">
                  <span class="label">Pension Contribution:</span>
                  <span class="value" style="color: #059669;">-${formatCurrency(
                    results.pensionContribution
                  )}</span>
                </div>
              `
                  : ""
              }
              ${
                results.otherDeductions > 0
                  ? `
                <div class="row">
                  <span class="label">Other Allowable Deductions:</span>
                  <span class="value" style="color: #059669;">-${formatCurrency(
                    results.otherDeductions
                  )}</span>
                </div>
              `
                  : ""
              }
              ${
                results.ownerOccupierInterest > 0
                  ? `
                <div class="row">
                  <span class="label">Owner Occupier Interest:</span>
                  <span class="value" style="color: #059669;">-${formatCurrency(
                    results.ownerOccupierInterest
                  )}</span>
                </div>
              `
                  : ""
              }
              <div class="row">
                <span class="label">Total Tax-Deductible Amount:</span>
                <span class="value" style="color: #059669;">-${formatCurrency(
                  results.totalDeductibles
                )}</span>
              </div>
              <div class="row highlight-row">
                <span class="label">Taxable Income:</span>
                <span class="value">${formatCurrency(
                  results.taxableIncome
                )}</span>
              </div>
            </div>
          </div>

          <!-- Statutory Deductions -->
          <div class="section">
            <div class="section-header">
              <h3>Statutory Deductions</h3>
            </div>
            <div class="section-content">
              <div class="deduction-grid">
                <div class="deduction-card paye">
                  <div class="card-label">PAYE (Income Tax)</div>
                  <div class="card-value">-${formatCurrency(results.paye)}</div>
                  <div class="card-description">After KES 2,400 personal relief</div>
                </div>
                
                <div class="deduction-card shif">
                  <div class="card-label">SHIF Contribution</div>
                  <div class="card-value">-${formatCurrency(results.shif)}</div>
                  <div class="card-description">2.75% of gross salary</div>
                </div>
                
                ${
                  deductTierIINSSF
                    ? `
                  <div class="deduction-card nssf">
                    <div class="card-label">NSSF Contribution</div>
                    <div class="card-value">-${formatCurrency(
                      results.nssf
                    )}</div>
                    <div class="card-description">6% (${
                      use2025NSSFTiers ? "2025 tiers" : "Pre-2025 tiers"
                    })</div>
                  </div>
                `
                    : ""
                }
                
                ${
                  deductHousingLevy
                    ? `
                  <div class="deduction-card housing">
                    <div class="card-label">Housing Levy</div>
                    <div class="card-value">-${formatCurrency(
                      results.housingLevy
                    )}</div>
                    <div class="card-description">1.5% of gross salary</div>
                  </div>
                `
                    : ""
                }
              </div>
              
              <div class="row highlight-row" style="margin-top: 16px;">
                <span class="label">Total Monthly Deductions:</span>
                <span class="value" style="color: #dc2626;">-${formatCurrency(
                  results.totalDeductions
                )}</span>
              </div>
            </div>
          </div>

          <!-- Net Salary -->
          <div class="net-salary-box">
            <div class="net-salary-label">Your Net Monthly Salary</div>
            <div class="net-salary-value">${formatCurrency(
              results.netSalary
            )}</div>
            <div class="total-deductions-note">
              Take-home pay after all statutory deductions
            </div>
          </div>

          <!-- Disclaimer -->
          <div class="disclaimer">
            <strong>Disclaimer:</strong> This calculation is for informational purposes only and is based on the 2025 Kenya Revenue Authority tax rates and regulations. 
            This calculator is not affiliated with or endorsed by KRA, SHIF, NSSF, or any government agency. 
            For official tax advice, please consult with a qualified tax professional or contact KRA directly.
          </div>

          <div class="footer">
            <div>Kenya Net Pay Calculator 2025 · Unofficial Tax Estimation Tool</div>
            <div style="margin-top: 4px;">For official information, visit www.kra.go.ke</div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const formatCurrency = (amount) => {
    const numAmount =
      typeof amount === "number" ? amount : parseFloat(amount) || 0;
    return `KES ${numAmount.toLocaleString("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const hasInput = grossSalary !== "";

  useEffect(() => {
    if (hasInput) {
      setStatsVisible(false);
      setTimeout(() => setStatsVisible(true), 50);
    }
  }, [hasInput, results.gross]);

  const darkModeClasses = isDarkMode
    ? "dark bg-slate-950"
    : "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900";
  const cardDarkClasses = isDarkMode
    ? "bg-slate-900 border-slate-800"
    : "bg-white/95 border-0";
  const inputDarkClasses = isDarkMode
    ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
    : "";
  const labelDarkClasses = isDarkMode ? "text-slate-300" : "";
  const sectionDarkClasses = isDarkMode
    ? "bg-slate-800/50 border-slate-700"
    : "bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200";
  const resultSectionDarkClasses = isDarkMode
    ? "bg-slate-900/50 border-slate-700"
    : "bg-slate-50 border-slate-200";
  const statCardDarkClasses = isDarkMode
    ? "bg-slate-800/50 border-slate-700"
    : "";

  return (
    <div
      ref={mainContainerRef}
      className={`min-h-screen ${darkModeClasses} p-4 transition-colors duration-300 ${
        isFullScreen
          ? "fixed inset-0 z-50 overflow-auto"
          : "flex items-center justify-center"
      } scrollbar-hide`}
    >
      <div className="fixed top-4 right-4 z-40 flex gap-2">
        <Button
          onClick={() => setShowSettings(!showSettings)}
          variant="outline"
          size="sm"
          className={`h-9 w-9 p-0 rounded-full backdrop-blur-sm ${
            isDarkMode
              ? "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700"
              : "bg-white/80 border-slate-300 text-slate-700 hover:bg-white"
          }`}
        >
          <Settings className="h-4 w-4" />
        </Button>

        <Button
          onClick={() => setIsDarkMode(!isDarkMode)}
          variant="outline"
          size="sm"
          className={`h-9 w-9 p-0 rounded-full backdrop-blur-sm ${
            isDarkMode
              ? "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700"
              : "bg-white/80 border-slate-300 text-slate-700 hover:bg-white"
          }`}
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        <Button
          onClick={toggleFullScreen}
          variant="outline"
          size="sm"
          className={`h-9 w-9 p-0 rounded-full backdrop-blur-sm ${
            isDarkMode
              ? "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700"
              : "bg-white/80 border-slate-300 text-slate-700 hover:bg-white"
          }`}
        >
          {isFullScreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      {showSettings && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
            isDarkMode ? "bg-slate-950/90" : "bg-black/50"
          }`}
        >
          <div
            className={`relative w-full max-w-md rounded-2xl p-6 shadow-2xl ${
              isDarkMode ? "bg-slate-900 border border-slate-800" : "bg-white"
            }`}
          >
            <Button
              onClick={() => setShowSettings(false)}
              variant="ghost"
              size="sm"
              className="absolute right-4 top-4 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>

            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              Calculator Settings
            </h3>

            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="darkModeToggle" className={labelDarkClasses}>
                    Dark Mode
                  </Label>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isDarkMode ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isDarkMode ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="benefitsToggle" className={labelDarkClasses}>
                    Ignore benefits up to KES 5,000
                  </Label>
                  <button
                    onClick={() =>
                      setIgnoreBenefitsUpTo5000(!ignoreBenefitsUpTo5000)
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      ignoreBenefitsUpTo5000 ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        ignoreBenefitsUpTo5000
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="nssfToggle" className={labelDarkClasses}>
                    Use 2025 NSSF Tiers
                  </Label>
                  <button
                    onClick={() => setUse2025NSSFTiers(!use2025NSSFTiers)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      use2025NSSFTiers ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        use2025NSSFTiers ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="tierIIToggle" className={labelDarkClasses}>
                    Deduct Tier II NSSF
                  </Label>
                  <button
                    onClick={() => setDeductTierIINSSF(!deductTierIINSSF)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      deductTierIINSSF ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        deductTierIINSSF ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="housingLevyToggle"
                    className={labelDarkClasses}
                  >
                    Deduct Housing Levy
                  </Label>
                  <button
                    onClick={() => setDeductHousingLevy(!deductHousingLevy)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      deductHousingLevy ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        deductHousingLevy ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button
                  onClick={() => setShowSettings(false)}
                  className="w-full"
                >
                  Close Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={`w-full ${
          isFullScreen ? "max-w-7xl mx-auto py-8" : "max-w-7xl"
        }`}
      >
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div
              className={`w-8 h-8 ${
                isDarkMode ? "bg-blue-700" : "bg-blue-600"
              } rounded-lg flex items-center justify-center`}
            >
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <h1
              className={`text-xl font-bold ${
                isDarkMode ? "text-white" : "text-white"
              }`}
            >
              Net Pay Calculator
            </h1>
          </div>
          <p
            className={`text-sm ${
              isDarkMode ? "text-slate-400" : "text-slate-300"
            }`}
          >
            Calculate your monthly take-home pay after taxes and deductions
          </p>
        </div>

        <Card
          className={`shadow-2xl ${cardDarkClasses} overflow-hidden backdrop-blur-xl`}
        >
          <div className="grid lg:grid-cols-12 gap-0">
            <div className={`lg:col-span-5 p-6 border-r ${sectionDarkClasses}`}>
              <div className="flex items-center justify-between mb-5">
                <h2
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-slate-200" : "text-slate-900"
                  }`}
                >
                  Income & Deductions
                </h2>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs ${
                      isDarkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {isFullScreen ? "Full Screen" : "Normal View"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="gross"
                    className={`${labelDarkClasses} font-semibold text-xs mb-1.5 block`}
                  >
                    Gross Monthly Pay
                  </Label>
                  <div className="relative">
                    <span
                      className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      } font-bold text-sm`}
                    >
                      KES
                    </span>
                    <Input
                      id="gross"
                      type="number"
                      placeholder="0.00"
                      value={grossSalary}
                      onChange={(e) => setGrossSalary(e.target.value)}
                      className={`pl-14 h-11 ${inputDarkClasses} focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label
                      htmlFor="benefits"
                      className={`${labelDarkClasses} font-semibold text-xs mb-1.5 block`}
                    >
                      Non-Cash Benefits
                    </Label>
                    <div className="relative">
                      <span
                        className={`absolute left-2 top-1/2 -translate-y-1/2 ${
                          isDarkMode ? "text-slate-400" : "text-slate-500"
                        } text-xs`}
                      >
                        KES
                      </span>
                      <Input
                        id="benefits"
                        type="number"
                        placeholder="0"
                        value={nonCashBenefits}
                        onChange={(e) => setNonCashBenefits(e.target.value)}
                        className={`pl-10 h-10 text-sm ${inputDarkClasses} transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="pension"
                      className={`${labelDarkClasses} font-semibold text-xs mb-1.5 block`}
                    >
                      Pension (Max 30K)
                    </Label>
                    <div className="relative">
                      <span
                        className={`absolute left-2 top-1/2 -translate-y-1/2 ${
                          isDarkMode ? "text-slate-400" : "text-slate-500"
                        } text-xs`}
                      >
                        KES
                      </span>
                      <Input
                        id="pension"
                        type="number"
                        placeholder="0"
                        value={pensionContribution}
                        onChange={(e) => setPensionContribution(e.target.value)}
                        className={`pl-10 h-10 text-sm ${inputDarkClasses} transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="otherDeductions"
                    className={`${labelDarkClasses} font-semibold text-xs mb-1.5 block`}
                  >
                    Other Allowable Deductions
                  </Label>
                  <div className="relative">
                    <span
                      className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      } text-xs`}
                    >
                      KES
                    </span>
                    <Input
                      id="otherDeductions"
                      type="number"
                      placeholder="0"
                      value={otherDeductions}
                      onChange={(e) => setOtherDeductions(e.target.value)}
                      className={`pl-10 h-10 text-sm ${inputDarkClasses} transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
                    />
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="ignoreBenefits"
                      checked={ignoreBenefitsUpTo5000}
                      onChange={(e) =>
                        setIgnoreBenefitsUpTo5000(e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    />
                    <Label
                      htmlFor="ignoreBenefits"
                      className={`${labelDarkClasses} text-xs font-medium cursor-pointer`}
                    >
                      Ignore benefits up to KES 5,000
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="nssfTiers"
                      checked={use2025NSSFTiers}
                      onChange={(e) => setUse2025NSSFTiers(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    />
                    <Label
                      htmlFor="nssfTiers"
                      className={`${labelDarkClasses} text-xs font-medium cursor-pointer`}
                    >
                      Use 2025 NSSF Tiers (≤8K/≤72K)
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="deductNSSF"
                      checked={deductTierIINSSF}
                      onChange={(e) => setDeductTierIINSSF(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    />
                    <Label
                      htmlFor="deductNSSF"
                      className={`${labelDarkClasses} text-xs font-medium cursor-pointer`}
                    >
                      Deduct Tier II NSSF
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="deductHousing"
                      checked={deductHousingLevy}
                      onChange={(e) => setDeductHousingLevy(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    />
                    <Label
                      htmlFor="deductHousing"
                      className={`${labelDarkClasses} text-xs font-medium cursor-pointer`}
                    >
                      Deduct Housing Levy (1.5%)
                    </Label>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="housedByEmployer"
                        checked={isHousedByEmployer}
                        onChange={(e) =>
                          setIsHousedByEmployer(e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                      />
                      <Label
                        htmlFor="housedByEmployer"
                        className={`${labelDarkClasses} text-xs font-medium cursor-pointer flex items-center gap-1.5`}
                      >
                        Housed by Employer
                      </Label>
                    </div>

                    {isHousedByEmployer && (
                      <div className="ml-6">
                        <Select
                          value={housingType}
                          onValueChange={setHousingType}
                        >
                          <SelectTrigger
                            className={`h-9 text-xs ${inputDarkClasses}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent
                            className={
                              isDarkMode ? "bg-slate-800 border-slate-700" : ""
                            }
                          >
                            <SelectItem
                              value="ordinary"
                              className={isDarkMode ? "focus:bg-slate-700" : ""}
                            >
                              Ordinary (15%)
                            </SelectItem>
                            <SelectItem
                              value="farm"
                              className={isDarkMode ? "focus:bg-slate-700" : ""}
                            >
                              Farm (10%)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`lg:col-span-7 p-6 ${
                isDarkMode ? "bg-slate-900" : "bg-white"
              }`}
            >
              {!hasInput ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div
                    className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-4 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-blue-900/50 to-indigo-900/50"
                        : "bg-gradient-to-br from-blue-100 to-indigo-100"
                    }`}
                  >
                    <Calculator
                      className={`w-10 h-10 ${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      isDarkMode ? "text-slate-200" : "text-slate-900"
                    }`}
                  >
                    Ready to Calculate
                  </h3>
                  <p
                    className={`text-sm max-w-xs ${
                      isDarkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Enter your gross monthly pay on the left to see your
                    detailed tax breakdown and net salary
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div
                      className={`${statCardDarkClasses} p-3 rounded-xl border ${
                        isDarkMode
                          ? "bg-blue-900/30 border-blue-800"
                          : "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
                      } transition-all duration-500 ${
                        statsVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      }`}
                      style={{ transitionDelay: "0ms" }}
                    >
                      <div
                        className={`text-xs font-semibold mb-1 ${
                          isDarkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      >
                        Gross Pay
                      </div>
                      <div
                        className={`font-black text-base ${
                          isDarkMode ? "text-blue-300" : "text-blue-900"
                        }`}
                      >
                        {formatCurrency(results.gross)}
                      </div>
                    </div>
                    <div
                      className={`${statCardDarkClasses} p-3 rounded-xl border ${
                        isDarkMode
                          ? "bg-red-900/30 border-red-800"
                          : "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
                      } transition-all duration-500 ${
                        statsVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      }`}
                      style={{ transitionDelay: "100ms" }}
                    >
                      <div
                        className={`text-xs font-semibold mb-1 ${
                          isDarkMode ? "text-red-400" : "text-red-600"
                        }`}
                      >
                        Tax (PAYE)
                      </div>
                      <div
                        className={`font-black text-base ${
                          isDarkMode ? "text-red-300" : "text-red-900"
                        }`}
                      >
                        {formatCurrency(results.paye)}
                      </div>
                    </div>
                    <div
                      className={`${statCardDarkClasses} p-3 rounded-xl border ${
                        isDarkMode
                          ? "bg-green-900/30 border-green-800"
                          : "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200"
                      } transition-all duration-500 ${
                        statsVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      }`}
                      style={{ transitionDelay: "200ms" }}
                    >
                      <div
                        className={`text-xs font-semibold mb-1 ${
                          isDarkMode ? "text-green-400" : "text-green-600"
                        }`}
                      >
                        Net Pay
                      </div>
                      <div
                        className={`font-black text-base ${
                          isDarkMode ? "text-green-300" : "text-green-900"
                        }`}
                      >
                        {formatCurrency(results.netSalary)}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`${resultSectionDarkClasses} p-4 rounded-xl border`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <h3
                        className={`text-xs font-bold uppercase tracking-wide ${
                          isDarkMode ? "text-slate-300" : "text-slate-900"
                        }`}
                      >
                        Taxable Income
                      </h3>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span
                          className={
                            isDarkMode ? "text-slate-400" : "text-slate-600"
                          }
                        >
                          Gross + Benefits
                        </span>
                        <span
                          className={`font-semibold ${
                            isDarkMode ? "text-slate-300" : ""
                          }`}
                        >
                          {formatCurrency(
                            results.gross + results.taxableBenefits
                          )}
                        </span>
                      </div>
                      {results.totalDeductibles > 0 && (
                        <div className="flex justify-between text-green-600 dark:text-green-400">
                          <span>Deductibles</span>
                          <span className="font-semibold">
                            -{formatCurrency(results.totalDeductibles)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between pt-1.5 border-t border-slate-300 dark:border-slate-700 font-bold text-sm">
                        <span
                          className={
                            isDarkMode ? "text-slate-300" : "text-slate-900"
                          }
                        >
                          Taxable
                        </span>
                        <span
                          className={
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          }
                        >
                          {formatCurrency(results.taxableIncome)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3
                        className={`text-xs font-bold uppercase tracking-wide ${
                          isDarkMode ? "text-slate-300" : "text-slate-900"
                        }`}
                      >
                        Statutory Deductions
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className={`${statCardDarkClasses} p-3 rounded-lg border ${
                          isDarkMode
                            ? "bg-red-900/20 border-red-800/50"
                            : "bg-red-50 border-red-100"
                        }`}
                      >
                        <div
                          className={`font-bold text-xs mb-0.5 ${
                            isDarkMode ? "text-red-300" : "text-red-900"
                          }`}
                        >
                          PAYE
                        </div>
                        <div
                          className={`font-black text-lg ${
                            isDarkMode ? "text-red-400" : "text-red-700"
                          }`}
                        >
                          -{formatCurrency(results.paye)}
                        </div>
                        <div
                          className={`text-xs mt-0.5 ${
                            isDarkMode ? "text-red-400/80" : "text-red-600"
                          }`}
                        >
                          After KES 2,400 relief
                        </div>
                      </div>
                      <div
                        className={`${statCardDarkClasses} p-3 rounded-lg border ${
                          isDarkMode
                            ? "bg-blue-900/20 border-blue-800/50"
                            : "bg-blue-50 border-blue-100"
                        }`}
                      >
                        <div
                          className={`font-bold text-xs mb-0.5 ${
                            isDarkMode ? "text-blue-300" : "text-blue-900"
                          }`}
                        >
                          SHIF
                        </div>
                        <div
                          className={`font-black text-lg ${
                            isDarkMode ? "text-blue-400" : "text-blue-700"
                          }`}
                        >
                          -{formatCurrency(results.shif)}
                        </div>
                        <div
                          className={`text-xs mt-0.5 ${
                            isDarkMode ? "text-blue-400/80" : "text-blue-600"
                          }`}
                        >
                          2.75% of gross
                        </div>
                      </div>
                      {deductTierIINSSF && (
                        <div
                          className={`${statCardDarkClasses} p-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-orange-900/20 border-orange-800/50"
                              : "bg-orange-50 border-orange-100"
                          }`}
                        >
                          <div
                            className={`font-bold text-xs mb-0.5 ${
                              isDarkMode ? "text-orange-300" : "text-orange-900"
                            }`}
                          >
                            NSSF
                          </div>
                          <div
                            className={`font-black text-lg ${
                              isDarkMode ? "text-orange-400" : "text-orange-700"
                            }`}
                          >
                            -{formatCurrency(results.nssf)}
                          </div>
                          <div
                            className={`text-xs mt-0.5 ${
                              isDarkMode
                                ? "text-orange-400/80"
                                : "text-orange-600"
                            }`}
                          >
                            6% contribution
                          </div>
                        </div>
                      )}
                      {deductHousingLevy && (
                        <div
                          className={`${statCardDarkClasses} p-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-yellow-900/20 border-yellow-800/50"
                              : "bg-yellow-50 border-yellow-100"
                          }`}
                        >
                          <div
                            className={`font-bold text-xs mb-0.5 ${
                              isDarkMode ? "text-yellow-300" : "text-yellow-900"
                            }`}
                          >
                            Housing Levy
                          </div>
                          <div
                            className={`font-black text-lg ${
                              isDarkMode ? "text-yellow-400" : "text-yellow-700"
                            }`}
                          >
                            -{formatCurrency(results.housingLevy)}
                          </div>
                          <div
                            className={`text-xs mt-0.5 ${
                              isDarkMode
                                ? "text-yellow-400/80"
                                : "text-yellow-600"
                            }`}
                          >
                            1.5% of gross
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`bg-gradient-to-br ${
                      isDarkMode
                        ? "from-green-900 via-emerald-900 to-teal-900"
                        : "from-green-500 via-emerald-500 to-teal-600"
                    } p-5 rounded-2xl shadow-xl relative overflow-hidden animate-pulse-slow`}
                  >
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 ${
                        isDarkMode ? "bg-white/5" : "bg-white/10"
                      } rounded-full -mr-16 -mt-16 animate-float-1`}
                    ></div>
                    <div
                      className={`absolute bottom-0 left-0 w-24 h-24 ${
                        isDarkMode ? "bg-white/5" : "bg-white/10"
                      } rounded-full -ml-12 -mb-12 animate-float-2`}
                    ></div>
                    <div className="relative">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-green-100 text-xs font-bold mb-1 uppercase tracking-wider">
                            Your Net Salary
                          </div>
                          <div className="text-white text-3xl font-black tracking-tight">
                            {formatCurrency(results.netSalary)}
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <Wallet className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-green-100 mt-3 pt-3 border-t border-white/20">
                        <span>Total Deductions</span>
                        <span className="font-bold">
                          -{formatCurrency(results.totalDeductions)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handlePrint}
                      className={`h-11 font-bold shadow-lg ${
                        isDarkMode
                          ? "bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      }`}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Save Report
                    </Button>

                    <Button
                      onClick={() => window.print()}
                      variant={isDarkMode ? "secondary" : "outline"}
                      className="h-11 font-bold"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                  </div>
                  <div
                    className={`pt-4 mt-4 border-t text-center ${
                      isDarkMode
                        ? "border-slate-800 text-slate-500"
                        : "border-slate-200 text-slate-400"
                    } text-xs`}
                  >
                    <p>
                      Made with ❤️ by{" "}
                      <a
                        href="https://github.com/nyvnge"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-medium hover:underline ${
                          isDarkMode
                            ? "text-blue-400 hover:text-blue-300"
                            : "text-blue-600 hover:text-blue-700"
                        }`}
                      >
                        nyvnge
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        <div
          className={`mt-4 text-center ${
            isDarkMode ? "text-slate-500" : "text-slate-400"
          } text-xs`}
        >
          <p>
            This calculator is for informational purposes only. Always consult
            with a tax professional for official advice.
          </p>
          <p className="mt-1">
            Data based on Kenya Revenue Authority tax rates and regulations.
          </p>
        </div>

        <div ref={printRef} style={{ display: "none" }}></div>
      </div>
    </div>
  );
};

<style jsx>{`
  @keyframes float {
    0%,
    100% {
      transform: translate(0, 0) rotate(0deg);
    }
    33% {
      transform: translate(10px, -10px) rotate(120deg);
    }
    66% {
      transform: translate(-5px, 5px) rotate(240deg);
    }
  }

  .animate-float-1 {
    animation: float 8s ease-in-out infinite;
  }

  .animate-float-2 {
    animation: float 10s ease-in-out infinite reverse;
  }
  @keyframes pulse-slow {
    0%,
    100% {
      box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3);
    }
    50% {
      box-shadow: 0 15px 60px rgba(16, 185, 129, 0.5);
    }
  }
  .animate-pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
  }
`}</style>;

export default KenyanTaxCalculator;

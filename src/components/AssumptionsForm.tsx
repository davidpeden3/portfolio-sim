import { useState } from "react";
import { Assumptions } from "../models/Assumptions";

interface AssumptionsFormProps {
    onCalculate: (assumptions: Assumptions) => void;
}

const AssumptionsForm = ({ onCalculate }: AssumptionsFormProps) => {
    const [form, setForm] = useState<Assumptions>({
        initialInvestment: 200000,
        initialSharePrice: 22.5,
        dividendYieldPer4wPercent: 5,
        monthlyAppreciationPercent: -1,
        loanAmount: 200000,
        annualInterestRatePercent: 7.5,
        amortizationMonths: 240,
        baseIncome: 100000,
        surplusForDripToPrincipalPercent: 75,
        withholdTaxes: true
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : Number(value)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCalculate(form);
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <label>
                    Initial Investment:
                    <input
                        type="number"
                        name="initialInvestment"
                        value={form.initialInvestment}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Initial Share Price:
                    <input
                        type="number"
                        name="initialSharePrice"
                        value={form.initialSharePrice}
                        step="0.01"
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Dividend Yield per 4w (%):
                    <input
                        type="number"
                        name="dividendYieldPer4wPercent"
                        value={form.dividendYieldPer4wPercent}
                        step="0.01"
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Monthly Appreciation (%):
                    <input
                        type="number"
                        name="monthlyAppreciationPercent"
                        value={form.monthlyAppreciationPercent}
                        step="0.01"
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Loan Amount:
                    <input
                        type="number"
                        name="loanAmount"
                        value={form.loanAmount}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Annual Interest Rate (%):
                    <input
                        type="number"
                        name="annualInterestRatePercent"
                        value={form.annualInterestRatePercent}
                        step="0.01"
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Amortization Months:
                    <input
                        type="number"
                        name="amortizationMonths"
                        value={form.amortizationMonths}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Base Income:
                    <input
                        type="number"
                        name="baseIncome"
                        value={form.baseIncome}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Surplus for DRIP to Principal (%):
                    <input
                        type="number"
                        name="surplusForDripToPrincipalPercent"
                        value={form.surplusForDripToPrincipalPercent}
                        step="0.01"
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Withhold Taxes:
                    <input
                        type="checkbox"
                        name="withholdTaxes"
                        checked={form.withholdTaxes}
                        onChange={handleChange}
                    />
                </label>
            </div>

            <button type="submit" style={{ marginTop: "1rem" }}>
                Calculate
            </button>
        </form>
    );
};

export default AssumptionsForm;
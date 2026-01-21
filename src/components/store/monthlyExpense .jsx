import { create } from "zustand";

const useBudgetStore = create((set) => ({
  monthlyExpense: 0,
  setMonthlyExpense: (expense) => set({ monthlyExpense: expense })
}));
export default useBudgetStore
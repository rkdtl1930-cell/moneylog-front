import { create } from "zustand";

const useBudgetStore = create((set) => ({
  monthlyExpense: 0,
  currentBudget: null,
  setMonthlyExpense: (expense) => set({ monthlyExpense: expense }),
  setCurrentBudget: (budget) => set({ currentBudget: budget }),
}));

export default useBudgetStore;
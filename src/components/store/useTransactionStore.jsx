// store/useTransactionRefresh.js
import { create } from 'zustand';

const useTransactionStore = create((set) => ({
  refreshKey: 0,
  triggerRefresh: () =>
    set((state) => ({ refreshKey: state.refreshKey + 1 })),
}));

export default useTransactionStore;

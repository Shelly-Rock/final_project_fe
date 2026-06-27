export {
  useAuthStore,
  DEMO_USERS,
  DEMO_TEACHERS,
  DEMO_COUNCIL_MEMBERS,
  type AuthUser,
} from "./useAuthStore";
export { useAppConfigStore, type DeadlineConfig, type QuotaConfig } from "./useAppConfigStore";
export {
  createMockDataStore,
  type PersistedState,
  type MockDataStoreOptions,
} from "./createMockDataStore";

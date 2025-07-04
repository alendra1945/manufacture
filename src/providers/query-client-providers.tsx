import { QueryClientProvider as BaseQueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/hooks/base-fetch";
export const QueryClientProvider = (props: { children: React.ReactNode }) => {
  return (
    <BaseQueryClientProvider client={queryClient}>
      {props.children}
    </BaseQueryClientProvider>
  );
};

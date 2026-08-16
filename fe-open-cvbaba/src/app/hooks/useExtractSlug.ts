import { usePathname } from "next/navigation";

export const useExtractSlug = (): string | null => {
  const pathname = usePathname();
  const match = pathname.match(/\/activity\/([a-f0-9\-]+)/);
  return match ? match[1] : null;
};
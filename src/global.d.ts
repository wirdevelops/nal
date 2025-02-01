type GTagArgument = string | number | boolean | Record<string, unknown>;
interface Window {
    gtag: (...args: GTagArgument[]) => void; // Type definition for gtag
  }
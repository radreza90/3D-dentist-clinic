type OtpEntry = {
  phone: string;
  codeHash: string;
  purpose: string;
  expiresAt: Date;
  usedAt: Date | null;
  attempts: number;
};

declare global {
  var inMemoryOtpStore: Map<string, OtpEntry> | undefined;
}

export const inMemoryOtp = globalThis.inMemoryOtpStore ?? new Map<string, OtpEntry>();
if (!globalThis.inMemoryOtpStore) {
  globalThis.inMemoryOtpStore = inMemoryOtp;
}

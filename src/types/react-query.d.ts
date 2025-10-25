// src/types/react-query.d.ts
import '@tanstack/react-query';

declare module '@tanstack/react-query' {
    interface QueryClientConfig {
        logger?: {
            log: (...args: unknown[]) => void;
            warn: (...args: unknown[]) => void;
            error: (err: unknown) => void;
        };
    }
}

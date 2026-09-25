import { ProviderHub } from '../providers/ProviderHub';
import { MangaDexProvider } from '../providers/MangaDexProvider';
import { ConsumetProvider } from '../providers/ConsumetProvider';
import { MangaFireProvider } from '../providers/MangaFireProvider';

export const hub = new ProviderHub();

// Initialize providers
hub.registerProvider(new MangaDexProvider({ id: 'mangadex', enabled: true, priority: 100, rateLimit: { requestsPerSecond: 5, timeout: 5000, maxRetries: 3 }}));
hub.registerProvider(new ConsumetProvider({ id: 'consumet', enabled: true, priority: 60, rateLimit: { requestsPerSecond: 2, timeout: 5000, maxRetries: 2 }}));
hub.registerProvider(new MangaFireProvider({ id: 'mangafire', enabled: false, priority: 80, rateLimit: { requestsPerSecond: 1, timeout: 5000, maxRetries: 1 }}));

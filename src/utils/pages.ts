import type { PageURLs } from '@/types/enums';

export async function redirectTo(url: PageURLs) {
    return await uni.redirectTo({ url });
}

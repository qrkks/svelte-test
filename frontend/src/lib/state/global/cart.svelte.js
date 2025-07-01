import { createLocalState } from '$lib/state/persisted.svelte.js';

// 购物车状态
export const cartState = createLocalState('shopping-cart', {
    items: [],
    total: 0,
    couponCode: '',
    shippingAddress: null
}); 
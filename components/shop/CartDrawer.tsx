'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from './CartContext';
import { formatPrice } from '@/lib/utils';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } =
    useCart();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      aria-labelledby="cart-drawer-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="flex w-screen max-w-md flex-col border-l border-line bg-paper shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-sage" />
              <h2
                id="cart-drawer-title"
                className="font-heading text-2xl font-normal text-ink"
              >
                Your Selection ({totalItems})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="rounded-full p-2 text-muted transition-colors hover:text-ink"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Shipping notice */}
          <div className="flex items-center justify-between border-b border-line bg-mist/40 px-6 py-2.5 text-xs text-muted">
            <span>Insured fine-art packaging included</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-sage">
              Worldwide
            </span>
          </div>

          {/* Items List */}
          <div className="flex-1 divide-y divide-line overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="space-y-4 py-20 text-center">
                <ShoppingBag className="mx-auto h-12 w-12 text-line" strokeWidth={1} />
                <p className="font-heading text-2xl text-ink">
                  Your cart is currently empty
                </p>
                <p className="mx-auto max-w-xs text-xs text-muted">
                  Original paintings and limited edition pigment prints are available in
                  the gallery.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-4 inline-block border border-ink px-6 py-2.5 text-xs uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  Browse Available Works
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-start gap-4 py-4">
                  <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden border border-line bg-mist/30">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className="truncate font-heading text-lg font-medium leading-snug text-ink">
                        {item.title}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-2 p-1 text-muted transition-colors hover:text-ink"
                        title="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="inline-block rounded-sm bg-mist/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                      {item.type === 'original'
                        ? 'Original Artwork'
                        : item.variant || 'Fine Art Print'}
                    </div>

                    <div className="text-xs font-light text-muted">{item.medium}</div>

                    <div className="flex items-center justify-between pt-2">
                      {item.type === 'original' ? (
                        <span className="text-[11px] italic text-muted">
                          Unique Piece (1 of 1)
                        </span>
                      ) : (
                        <div className="flex items-center border border-line bg-paper">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-muted hover:text-ink"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 font-mono text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 text-muted hover:text-ink"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      <span className="text-sm font-medium text-ink">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Subtotal */}
          {items.length > 0 && (
            <div className="space-y-4 border-t border-line bg-paper p-6">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="text-sm font-medium text-ink">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Insured Fine Art Courier</span>
                  <span className="text-[10px] font-medium uppercase text-sage">
                    Complimentary
                  </span>
                </div>
                <div className="flex justify-between border-t border-line pt-2 text-sm font-medium text-ink text-muted">
                  <span>Estimated Total</span>
                  <span className="font-heading text-xl">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    alert(
                      'Checkout simulation: Orders are securely processed with Stripe or direct bank transfer for high-value originals.'
                    );
                  }}
                  className="flex w-full items-center justify-center gap-2 bg-ink px-4 py-3.5 text-xs font-medium uppercase tracking-widest text-paper transition-colors duration-300 hover:bg-sage"
                >
                  Proceed to Secure Checkout
                  <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  href="/contact"
                  onClick={closeCart}
                  className="block w-full pt-1 text-center text-[11px] uppercase tracking-widest text-muted underline hover:text-ink"
                >
                  Request Certificate of Authenticity or Framing Inquiries
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartDrawer;

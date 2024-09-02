'use client';

import { Dialog, Transition } from '@headlessui/react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import Price from '@/components/price';
import {
  cartItemCount,
  createUrl,
  formatNb,
  getItemPrice,
  productVariantTitle,
  getCartTotal
} from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment,useState } from 'react';
import CloseCart from './close-cart';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';
import OpenCart from './open-cart';
import {useCart} from "@/hooks";
import {Button} from "@/components/ui/button";
import {Dialog as ShadCnDialog, DialogContent, DialogTrigger} from "@/components/ui/dialog"
import CheckoutModelContent from "@/components/cart/checkout-model";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const {cart} = useCart()
  const [isOpen, setIsOpen] = useState(false);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cartItemCount(cart)} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl md:w-[390px] dark:border-neutral-700 dark:bg-black/80 dark:text-white">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">My Cart</p>

                <button aria-label="Close cart" onClick={closeCart}>
                  <CloseCart />
                </button>
              </div>

              {!cart || cart.items.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                  <ShoppingCartIcon className="h-16" />
                  <p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                  <ul className="flex-grow overflow-auto py-4">
                    {cart.items.map((item, i) => {
                      const merchandiseSearchParams = {} as MerchandiseSearchParams;

                      item.product.variant.selectedOptions.forEach(({ name, value }) => {
                        merchandiseSearchParams[name.toLowerCase()] = value;
                      });

                      const merchandiseUrl = createUrl(
                        `/product/${item.product.id}`,
                        new URLSearchParams(merchandiseSearchParams)
                      );

                      return (
                        <li
                          key={i}
                          className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                        >
                          <div className="relative flex w-full flex-row justify-between px-1 py-4">
                            <div className="absolute z-40 -mt-2 ml-[55px]">
                              <DeleteItemButton item={item} />
                            </div>
                            <Link
                              href={merchandiseUrl}
                              onClick={closeCart}
                              className="z-30 flex flex-row space-x-4"
                            >
                              <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                <Image
                                  className="h-full w-full object-cover"
                                  width={64}
                                  height={64}
                                  alt={item.product.title}
                                  src={item.product.images[0]}
                                />
                              </div>

                              <div className="flex flex-1 flex-col text-base">
                                <span className="leading-tight">
                                  {item.product.title}
                                </span>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                  {productVariantTitle(item.product.variant)}
                                </p>
                              </div>
                            </Link>
                            <div className="flex h-16 flex-col justify-between">
                              <div className="flex justify-end">
                                <Price amount={formatNb(getItemPrice(item))} />
                              </div>
                              <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                                <EditItemQuantityButton item={item} type="minus" />
                                <p className="w-6 text-center">
                                  <span className="w-full text-sm">{item.quantity}</span>
                                </p>
                                <EditItemQuantityButton item={item} type="plus" />
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                      <p>Shipping</p>
                      <p className="text-right">Calculated at checkout</p>
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                      <p>Total</p>
                      <Price amount={formatNb(getCartTotal(cart))}/>
                    </div>
                  </div>
                  <ShadCnDialog open={modalOpen} onOpenChange={(open) => setModalOpen(open)}>
                    <DialogTrigger asChild>
                      <Button>Proceed to Checkout</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[450px]">
                      <CheckoutModelContent setModalOpen={setModalOpen} closeCart={closeCart}/>
                    </DialogContent>
                  </ShadCnDialog>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

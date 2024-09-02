import clsx from 'clsx';
import Image from 'next/image';
import {ComponentProps} from "react";
import {ArrowTrendingUpIcon} from "@heroicons/react/24/solid";
import Label from "@/components/label";

interface Props {
    isInteractive?: boolean;
    active?: boolean;
    label?: {
        title: string;
        amount?: number;
        position?: 'bottom' | 'center';
    };
    score?: number;
}

export function GridTileImage({
                                  isInteractive = true,
                                  active,
                                  label,
                                  score,
                                  ...props
                              }: Props & ComponentProps<typeof Image>) {
    return (
        <div
            className={clsx(
                'group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-black dark:bg-black',
                {
                    relative: label,
                    'border-2 border-black': active,
                    'border-neutral-200 dark:border-neutral-800': !active
                }
            )}
        >
            {props.src ? (
                // eslint-disable-next-line jsx-a11y/alt-text -- `alt` is inherited from `props`, which is being enforced with TypeScript
                <Image
                    className={clsx('relative h-full w-full object-cover', {
                        'transition duration-300 ease-in-out group-hover:scale-105': isInteractive
                    })}
                    {...props}
                />
            ) : null}
            {label ? (
                <Label
                    title={label.title}
                    position={label.position}
                    amount={label.amount}
                />
            ) : null}
            {score !== undefined ? (
                <div
                    className="absolute top-2 right-2 flex items-center bg-lime-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    <ArrowTrendingUpIcon className="w-4 h-4 mr-1"/>
                    {score}
                </div>
            ) : null}
        </div>
    );
}

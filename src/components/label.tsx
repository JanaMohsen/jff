import clsx from 'clsx';
import Price from "@/components/price";

interface Props {
    title: string;
    amount?: number;
    position?: 'bottom' | 'center';
}

const Label = ({title, amount, position = 'bottom'}: Props) => {
    return (
        <div
            className={clsx('absolute bottom-0 left-0 flex w-full px-4 pb-4 @container/label', {
                'lg:px-20 lg:pb-[35%]': position === 'center'
            })}
        >
            <div
                className="flex items-center rounded-full border bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
                <h3 className="mr-4 line-clamp-2 flex-grow pl-2 leading-none tracking-tight">{title}</h3>
                {amount !== undefined && <Price amount={amount}/>}
            </div>
        </div>
    );
};

export default Label;

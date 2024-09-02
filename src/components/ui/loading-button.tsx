import * as React from "react"
import {Button, ButtonProps} from "@/components/ui/button";
import {Loader2} from "lucide-react";

export interface LoadingButtonProps extends ButtonProps {
    loading?: boolean;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
    ({loading = false, children, ...props}, ref) => (
        <Button
            ref={ref}
            disabled={loading}
            {...props}
        >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
            {children}
        </Button>
    )
);
LoadingButton.displayName = "LoadingButton";

export {LoadingButton};
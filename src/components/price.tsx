import {Badge} from "@/components/ui/badge"

const Price = ({amount}: { amount: number }) => (
    <Badge>${amount}</Badge>
)

export default Price
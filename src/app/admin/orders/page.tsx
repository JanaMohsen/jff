import {getOrders} from "@/firebase/admin/firestore/orders";
import OrdersDataTable from "@/components/admin/orders/table";

const Orders = async () => {
    const orders = await getOrders()
    return <OrdersDataTable orders={orders}/>
}

export default Orders
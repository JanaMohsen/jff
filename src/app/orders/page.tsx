import {getUserOrders} from "@/firebase/admin/firestore/orders";

const Orders = async () => {
    const orders = await getUserOrders()
    return <>{orders.map((order, index) => {
        return <p key={index}>{order.id}</p>
    })}</>
}

export default Orders
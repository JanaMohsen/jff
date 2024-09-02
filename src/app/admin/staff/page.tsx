import StaffDataTable from "@/components/admin/staff/table";
import {getStaff} from "@/firebase/admin/auth";

const Staff = async () => {
    const users = await getStaff()
    return <StaffDataTable staff={users}/>
}

export default Staff
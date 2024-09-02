import {ReactNode} from "react";

const Container = ({children}: { children: ReactNode }) => {
    return <section className="mx-4">{children}</section>
}

export default Container

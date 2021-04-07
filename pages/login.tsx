import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import OcLoginForm from "../components/OcLoginForm";

const LoginPage:FunctionComponent = () => {
    const {push} = useRouter();

    const handleOnLoggedIn = () => {
        push('/products')
    }

    return <div>
        <OcLoginForm onLoggedIn={handleOnLoggedIn}/>
    </div>
}

export default LoginPage;
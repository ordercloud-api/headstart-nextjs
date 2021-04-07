import { ChangeEvent, FormEvent, FunctionComponent, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductListPage from "../pages/products";
import login, { LoginActionRequest } from "../redux/ocAuth/login";
import { OcDispatch, OcRootState } from "../redux/ocStore";

interface OcLoginFormProps {
    title?: string;
    onLoggedIn: () => void;
}

const OcLoginForm:FunctionComponent<OcLoginFormProps> = ({title = "Sign into your account", onLoggedIn}) => {
    const dispatch = useDispatch<OcDispatch>();
    const { loading, error, isAnonymous } = useSelector((state:OcRootState) => ({
        isAnonymous: state.ocAuth.isAnonymous,
        error: state.ocAuth.error,
        loading: state.ocAuth.loading,
    }))

    const [formValues, setFormValues] = useState({
        identifier: '',
        password: ''
    })

    const handleInputChange = (fieldKey:string) => (e:ChangeEvent<HTMLInputElement>) => {
        setFormValues(v => ({...v, [fieldKey]: e.target.value}))
    }

    const handleSubmit = useCallback((e:FormEvent) => {
        e.preventDefault();
        dispatch(login({
            username: formValues.identifier,
            password: formValues.password
        }))
    }, [formValues])

    useEffect(() => {
        if (!isAnonymous) {
            onLoggedIn()
        }
    }, [isAnonymous, onLoggedIn])

    return <form name="ocLoginForm" onSubmit={handleSubmit}>
        <h1>{title}</h1>
        {error && <p>{error.message}</p>}
        <label htmlFor="identifier">Username</label>
        <input 
            type="text" 
            id="identifier" 
            name="identifier" 
            placeholder="Enter username" 
            value={formValues.identifier} 
            onChange={handleInputChange('identifier')} 
            required 
        />
        <label htmlFor="password">Password</label>
        <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="Enter password" 
            value={formValues.password} 
            onChange={handleInputChange('password')} 
            required 
        />
        <button disabled={loading} type="submit">Submit</button>
    </form>
}

export default OcLoginForm;
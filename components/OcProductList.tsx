import { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useOcProductList from "../lib/useOcProductList";
import { OcProductListOptions, setListOptions } from "../redux/ocProductList"
import { OcDispatch, OcRootState } from "../redux/ocStore";
import OcProductCard from "./OcProductCard";

interface OcProductListProps {
    options?: OcProductListOptions
}

const OcProductList:FunctionComponent<OcProductListProps> = ({options}) => {

    const products = useOcProductList(options);
    
    return <ol>{products && products.map((p, i) => (
        <li key={i}>
            <OcProductCard product={p}/>
        </li>
    ))}</ol>

}

export default OcProductList;
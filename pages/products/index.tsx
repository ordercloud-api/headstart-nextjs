import { FunctionComponent } from "react";
import OcProductList from "../../components/OcProductList";

const ProductListPage:FunctionComponent = () => {

    //This would normally be tied into the NextJS router to update OcProductList options

    return <div>
        <h1>Products</h1>
        <OcProductList />
    </div>
}

export default ProductListPage;

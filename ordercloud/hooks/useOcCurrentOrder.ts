import { OcCurrentOrderState } from '../redux/ocCurrentOrder'
import { useOcSelector } from '../redux/ocStore'

const useOcCurrentOrder = (): OcCurrentOrderState => useOcSelector((s) => s.ocCurrentOrder)

export default useOcCurrentOrder

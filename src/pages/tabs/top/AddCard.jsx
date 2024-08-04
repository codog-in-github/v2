import { namespaceClass } from "@/helpers/style";
import classNames from "classnames";

const c = namespaceClass('top-card-add');

function AddCard({ onClick = () => {} }){
  return (
    <div
      onClick={onClick}
      className={classNames(
        c('card'),
        'bg-white p-4 shadow rounded flex-shrink-0 flex flex-col items-center justify-center cursor-pointer')
      }>
      <div 
        className="w-12 h-12 flex items-center justify-center text-lg border-dashed border rounded border-black"
      >+</div>
      <div className="mt-2">新規案件</div>
    </div>
  )
}

export default AddCard;
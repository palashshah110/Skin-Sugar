import { baskets } from "../data/baskets";
import { Gift } from "lucide-react";
import BasketCard from "../common/BasketCard";

export default function BasketList() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Gift className="text-green-600 w-8 h-8" />
        Choose Your Basket
      </h1>

      <p className="text-gray-600 mb-8 text-lg">
        Select a basket that fits your hamper size. You can add up to the specified number of products.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {baskets.map((basket) => (
          <BasketCard
          
  item={basket}
  // onIncrease={(id) => handleIncrease(id)}
  // onDecrease={(id) => handleDecrease(id)}
  // onRemove={(id) => handleRemove(id)}
/>

        ))}
      </div>
    </div>
  );
}

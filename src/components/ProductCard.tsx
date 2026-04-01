import { ShoppingCart, Package } from "lucide-react";
import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
}

// Formats a number to USD currency string
function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function ProductCard({ product }: ProductCardProps) {
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <article className="glass-card flex flex-col overflow-hidden rounded-md">
      {/* image */}
      <div
        className="relative overflow-hidden h-50 w-50"
        style={{ aspectRatio: "4/4" }}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 rounded-lg"
        />
        {/* out of stock filter */}
        {isOutOfStock && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(2px)",
            }}
          >
            <span className="text-white font-semibold text-sm tracking-wider uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Product name */}
        <h3
          className="font-semibold text-base leading-snug line-clamp-2"
          style={{ color: "var(--text-main)" }}
        >
          {product.name}
        </h3>

        {/* description */}
        <p
          className="text-sm line-clamp-2 flex-1"
          style={{ color: "var(--text-muted)" }}
        >
          {product.description}
        </p>

        {/* Stock  */}
        <div
          className="flex items-center gap-1.5 text-xs"
          style={{ color: isLowStock ? "#f59e0b" : "var(--text-muted)" }}
        >
          <Package size={13} />
          <span>
            {isOutOfStock
              ? "Out of stock"
              : isLowStock
                ? `Only ${product.stock} left!`
                : `${product.stock} in stock`}
          </span>
        </div>

        {/* price + add cart */}
        <div
          className="flex items-center justify-between pt-2"
          style={{ borderColor: "var(--border)" }}
        >
          <span
            className="font-bold text-lg"
            style={{ color: "var(--primary)" }}
          >
            {formatPrice(product.price)}
          </span>
          <button
            className="btn-primary flex items-center gap-1.5 text-sm"
            disabled={isOutOfStock}
            style={{
              opacity: isOutOfStock ? 0.4 : 1,
              cursor: isOutOfStock ? "not-allowed" : "pointer",
            }}
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

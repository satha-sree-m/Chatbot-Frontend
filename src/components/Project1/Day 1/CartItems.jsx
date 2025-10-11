import React, { useEffect, useState } from "react";
import TaskLayout from "./layouts";

const products = [
  { id: 1, name: "T-Shirt", price: 500 },
  { id: 2, name: "Shoes", price: 1200 },
  { id: 3, name: "Laptop", price: 55000 },
  { id: 4, name: "Headphones", price: 2000 },
  { id: 5, name: "Coffee Pack", price: 350 },
  { id: 6, name: "Notebook", price: 80 },
];

export default function ShoppingCartApp() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const decrement = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const increment = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const sortedCart = [...cart].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "price") return a.price - b.price;
    return 0;
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <TaskLayout>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f9f9f9",
          padding: 20,
        }}
      >
        <div
          style={{
            background: "white",
            padding: 20,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            width: "80%",
          }}
        >
          <h2>Shopping Cart</h2>

          <h3>Products</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {products.map((p) => (
              <li key={p.id} style={{ marginBottom: 5 }}>
                {p.name} (₹{p.price.toFixed(2)})
                <button
                  onClick={() => addToCart(p)}
                  style={{ marginLeft: 10 }}
                >
                  Add to Cart
                </button>
              </li>
            ))}
          </ul>

          <h3>
            Cart{" "}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ marginLeft: 10 }}
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
            </select>
          </h3>

          {cart.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: 10,
              }}
            >
              <thead>
                <tr style={{ background: "#f2f2f2" }}>
                  <th style={{ border: "1px solid #ddd", padding: 8 }}>Name</th>
                  <th style={{ border: "1px solid #ddd", padding: 8 }}>Price</th>
                  <th style={{ border: "1px solid #ddd", padding: 8 }}>Qty</th>
                  <th style={{ border: "1px solid #ddd", padding: 8 }}>
                    Subtotal
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: 8 }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedCart.map((item) => (
                  <tr key={item.id}>
                    <td style={{ border: "1px solid #ddd", padding: 8 }}>
                      {item.name}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: 8 }}>
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: 8 }}>
                      {item.qty}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: 8 }}>
                      ₹{(item.price * item.qty).toFixed(2)}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: 8 }}>
                      <button onClick={() => decrement(item.id)}>-</button>
                      <button
                        onClick={() => increment(item.id)}
                        style={{ marginLeft: 5 }}
                      >
                        +
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div style={{ marginTop: 15 }}>
            <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p>Tax (10%): ₹{tax.toFixed(2)}</p>
            <p>
              <strong>Total: ₹{total.toFixed(2)}</strong>
            </p>
          </div>
        </div>
      </div>
    </TaskLayout>
  );
}

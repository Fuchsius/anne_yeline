// This mock data simulates what would come from your database in the future
export const productData = {
  // Featured products data
  getFeaturedProducts: () => {
    return [
      {
        id: 1,
        name: "Anti-Aging Serum",
        category: "Skincare",
        price: 8500,
        originalPrice: 10000,
        discount: 15,
        image: "/images/products/anti-aging-serum.jpg",
        tags: ["bestseller", "new"],
        description: "Advanced formula that reduces fine lines and wrinkles."
      },
      {
        id: 2,
        name: "Volumizing Mascara",
        category: "Makeup",
        price: 3200,
        originalPrice: 3200,
        discount: 0,
        image: "/images/products/volumizing-mascara.jpg",
        tags: ["popular"],
        description: "Intense volume and length for dramatic lashes."
      },
      {
        id: 3,
        name: "Hydrating Face Mist",
        category: "Skincare",
        price: 2520,
        originalPrice: 2800,
        discount: 10,
        image: "/images/products/hydrating-face-mist.jpg",
        tags: [],
        description: "Refreshing mist that hydrates and revitalizes skin."
      },
      {
        id: 4,
        name: "Matte Lipstick Collection",
        category: "Makeup",
        price: 4500,
        originalPrice: 4500,
        discount: 0,
        image: "/images/products/matte-lipstick.jpg",
        tags: ["bestseller", "limited"],
        description: "Long-lasting matte lipstick in stunning French-inspired shades."
      }
    ];
  },
  
  getProductImageUrl: (imagePath) => {
    const fallbackImages = {
      "/images/products/anti-aging-serum.jpg": "https://images.unsplash.com/photo-1570194065650-d99fb4d8a609?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "/images/products/volumizing-mascara.jpg": "https://images.unsplash.com/photo-1631214524020-3c8be9ac3f6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      "/images/products/hydrating-face-mist.jpg": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "/images/products/matte-lipstick.jpg": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=830&q=80",
      "default": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80"
    };

    return fallbackImages[imagePath] || fallbackImages.default;
  }
}; 
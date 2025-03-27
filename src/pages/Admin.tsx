import React, { useState } from 'react';

export const Admin = () => {
  const [nthOrder, setNthOrder] = useState(5);

  const handleSetThreshold = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate POST /api/admin/set-discount-threshold
    console.log(`Threshold set to ${nthOrder}`);
    alert(`Discount threshold set to every ${nthOrder}th order`);
  };

  // Simulated data for GET /api/admin/sales-stats
  const salesStats = {
    itemsCount: 150,
    totalAmount: 7500.45,
    discountCodes: ['AURORA10', 'POLAR5', 'MIDNIGHT20'],
    totalDiscount: 675.89,
  };

  const handleGenerateDiscount = () => {
    // Simulate POST /api/admin/generate-discount
    const code = `ADMIN-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    alert(`Generated discount code: ${code}`);
  };

  return (
    <div className="pt-20 pb-12">
      <h1 className="text-4xl font-bold text-center my-8 text-white animate-fade-in">
        Admin Dashboard
      </h1>
      <div className="px-4 max-w-4xl mx-auto space-y-12">
        {/* Sales Statistics */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Sales Statistics
          </h2>
          <div className="bg-gray-900/80 p-6 rounded-lg shadow-xl hover:shadow-purple-500/50 transition-shadow duration-300">
            <p className="text-white">Items Purchased: {salesStats.itemsCount}</p>
            <p className="text-white mt-2">
              Total Purchase Amount: ${salesStats.totalAmount.toFixed(2)}
            </p>
            <p className="text-white mt-2">
              Discount Codes Generated: {salesStats.discountCodes.length}
            </p>
            <p className="text-white mt-2">
              Total Discount Given: ${salesStats.totalDiscount.toFixed(2)}
            </p>
          </div>
        </section>

        {/* Configure Discount Threshold */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Configure Discount Threshold
          </h2>
          <form
            onSubmit={handleSetThreshold}
            className="bg-gray-900/80 p-6 rounded-lg shadow-xl"
          >
            <label htmlFor="nthOrder" className="block mb-2 text-white">
              Generate discount every nth order:
            </label>
            <input
              type="number"
              id="nthOrder"
              value={nthOrder}
              onChange={(e) => setNthOrder(parseInt(e.target.value) || 1)}
              min="1"
              className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 outline-none mb-4"
            />
            <button
              type="submit"
              className="w-full bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-all duration-300 hover:shadow-lg"
            >
              Set Threshold
            </button>
          </form>
        </section>

        {/* Generate Discount Code */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Generate Discount Code
          </h2>
          <button
            onClick={handleGenerateDiscount}
            className="w-full bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-all duration-300 hover:shadow-lg"
          >
            Generate Manual Discount Code
          </button>
        </section>
      </div>
    </div>
  );
};